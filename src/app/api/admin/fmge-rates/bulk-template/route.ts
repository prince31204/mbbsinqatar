import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    // Fetch all active universities for the reference sheet
    const universities = await prisma.university.findMany({
      where: { status: true },
      select: { id: true, uniqueId: true, name: true },
      orderBy: { name: "asc" },
    });

    // ── Main template sheet ──
    const columns = [
      "University Name",
      "University Unique ID",
      "Year",
      "Appeared",
      "Passed",
      "Pass Percentage",
      "First Attempt Pass Rate",
      "Acceptance Rate",
      "YoY Change",
      "Rank",
      "Notes",
      "Source",
    ];

    const sampleRow = [
      "Qatar National Medical University",
      "Qatar-national-medical-university",
      "2025",
      "120",
      "90",
      "75.00",
      "60.00",
      "85.50",
      "+5.2%",
      "5",
      "Strong performance this year",
      "NMC",
    ];

    const templateSheet = XLSX.utils.aoa_to_sheet([columns, sampleRow]);

    // Set column widths for readability
    templateSheet["!cols"] = columns.map((col) => ({
      wch: Math.max(col.length + 4, 18),
    }));

    // ── Universities reference sheet ──
    const uniHeaders = ["University Name", "Unique ID", "Database ID"];
    const uniRows = universities.map((u) => [u.name, u.uniqueId, u.id]);
    const uniSheet = XLSX.utils.aoa_to_sheet([uniHeaders, ...uniRows]);
    uniSheet["!cols"] = [{ wch: 45 }, { wch: 45 }, { wch: 12 }];

    // Build workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, templateSheet, "FMGE Rates");
    XLSX.utils.book_append_sheet(workbook, uniSheet, "Universities Reference");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="fmge-rates-template.xlsx"',
      },
    });
  } catch (err) {
    console.error("FMGE template generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 },
    );
  }
}
