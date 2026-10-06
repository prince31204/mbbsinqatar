import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

/**
 * Normalise a header string for case-insensitive, whitespace-insensitive matching.
 */
function normalise(s: string): string {
  return s.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

/**
 * Given a raw row object (keys = original Excel headers) and a Map of
 * normalised→original header names, return the cell value for the requested
 * header label, or undefined.
 */
function cell(
  row: Record<string, unknown>,
  headerMap: Map<string, string>,
  label: string,
): string | undefined {
  const key = headerMap.get(normalise(label));
  if (!key) return undefined;
  const v = row[key];
  if (v === null || v === undefined || v === "") return undefined;
  return v.toString().trim();
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, {
      raw: false,
      defval: "",
    }) as Record<string, unknown>[];

    if (data.length === 0)
      return NextResponse.json(
        { error: "The uploaded file has no data rows" },
        { status: 400 },
      );

    // Build header normalisation map from the first row's keys
    const rawHeaders = Object.keys(data[0]);
    const headerMap = new Map<string, string>();
    for (const h of rawHeaders) {
      headerMap.set(normalise(h), h);
    }

    // Pre-fetch all universities for matching
    const allUnivs = await prisma.university.findMany({
      select: { id: true, uniqueId: true, name: true },
    });

    // Build lookup maps
    const univByUniqueId = new Map(
      allUnivs.map((u) => [u.uniqueId.toLowerCase(), u]),
    );
    const univByName = new Map(
      allUnivs.map((u) => [u.name.toLowerCase().trim(), u]),
    );
    const univById = new Map(allUnivs.map((u) => [u.id.toString(), u]));

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Excel row (1-indexed header + 1-indexed data)

      try {
        // ── Identify university ──
        const uniName = cell(row, headerMap, "University Name");
        const uniUniqueId = cell(row, headerMap, "University Unique ID");
        const uniDbId =
          cell(row, headerMap, "University ID") ??
          cell(row, headerMap, "Database ID");

        let university: { id: number; name: string } | undefined;

        if (uniDbId) {
          university = univById.get(uniDbId);
        }
        if (!university && uniUniqueId) {
          university = univByUniqueId.get(uniUniqueId.toLowerCase());
        }
        if (!university && uniName) {
          university = univByName.get(uniName.toLowerCase().trim());
        }

        if (!university) {
          results.failed++;
          results.errors.push(
            `Row ${rowNum}: Could not match university "${uniName || uniUniqueId || uniDbId || "(empty)"}"`,
          );
          continue;
        }

        // ── Parse year ──
        const yearStr = cell(row, headerMap, "Year");
        if (!yearStr) {
          results.failed++;
          results.errors.push(`Row ${rowNum}: Missing Year`);
          continue;
        }
        const year = parseInt(yearStr);
        if (isNaN(year) || year < 1900 || year > 2200) {
          results.failed++;
          results.errors.push(`Row ${rowNum}: Invalid year "${yearStr}"`);
          continue;
        }

        // ── Parse numeric fields ──
        const parseNum = (label: string): number | null => {
          const v = cell(row, headerMap, label);
          if (!v) return null;
          // Strip percentage signs and commas
          const cleaned = v.replace(/[%,]/g, "").trim();
          const n = parseFloat(cleaned);
          return isNaN(n) ? null : n;
        };

        const appeared = parseNum("Appeared");
        const passed = parseNum("Passed");
        const rank = parseNum("Rank");

        // Pass percentage: use explicit value, or compute from appeared/passed
        let passPercentage = parseNum("Pass Percentage");
        if (passPercentage === null && appeared && passed && appeared > 0) {
          passPercentage = parseFloat(((passed / appeared) * 100).toFixed(2));
        }

        const firstAttemptPassRate = parseNum("First Attempt Pass Rate");
        const acceptanceRate = parseNum("Acceptance Rate");
        const yoyChange =
          cell(row, headerMap, "YoY Change") ??
          cell(row, headerMap, "YoY") ??
          null;
        const notes = cell(row, headerMap, "Notes") ?? null;
        const source = cell(row, headerMap, "Source") ?? null;

        // ── Upsert: check if record with same university + year exists ──
        const existing = await prisma.universityFmgeRate.findFirst({
          where: {
            universityId: university.id,
            year,
          },
        });

        const rateData = {
          appeared: appeared ? Math.round(appeared) : null,
          passed: passed ? Math.round(passed) : null,
          passPercentage,
          firstAttemptPassRate,
          acceptanceRate,
          yoyChange,
          rank: rank ? Math.round(rank) : null,
          notes,
          source,
        };

        if (existing) {
          await prisma.universityFmgeRate.update({
            where: { id: existing.id },
            data: rateData,
          });
        } else {
          await prisma.universityFmgeRate.create({
            data: {
              universityId: university.id,
              year,
              ...rateData,
            },
          });
        }

        // ── Also update the parent university's fmgePassRate for the latest year ──
        if (passPercentage !== null) {
          const latestRate = await prisma.universityFmgeRate.findFirst({
            where: { universityId: university.id },
            orderBy: { year: "desc" },
            select: { passPercentage: true, year: true },
          });

          if (
            latestRate &&
            latestRate.year <= year &&
            latestRate.passPercentage !== null
          ) {
            await prisma.university.update({
              where: { id: university.id },
              data: { fmgePassRate: passPercentage },
            });
          }
        }

        results.success++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`Row ${rowNum}: ${err.message || "Unknown error"}`);
      }
    }

    return NextResponse.json(results);
  } catch (err: any) {
    console.error("FMGE bulk upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
