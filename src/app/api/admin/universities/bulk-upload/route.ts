import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import * as XLSX from "xlsx";
import AdmZip from "adm-zip";
import path from "path";
import { mkdir, rename, rm, readdir, stat } from "fs/promises";
import { existsSync } from "fs";
import os from "os";

async function findFileRecursively(
  dir: string,
  filename: string,
): Promise<string | null> {
  const entries = await readdir(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const s = await stat(fullPath);
    if (s.isDirectory()) {
      const found = await findFileRecursively(fullPath, filename);
      if (found) return found;
    } else if (entry.toLowerCase() === filename.toLowerCase()) {
      return fullPath;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const tmpDir = path.join(process.cwd(), "tmp", `bulk-upload-${Date.now()}`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);

    // Extract to temporary directory
    await mkdir(tmpDir, { recursive: true });
    zip.extractAllTo(tmpDir, true);

    // Find the excel file
    const excelFile = zip
      .getEntries()
      .find((e) => e.entryName.toLowerCase().endsWith(".xlsx"));
    if (!excelFile) throw new Error("Excel file not found in ZIP");

    const workbook = XLSX.read(excelFile.getData());
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet) as any[];

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    console.log(`[BulkUpload] Extracted to: ${tmpDir}`);
    const entries = zip.getEntries().map((e) => e.entryName);
    console.log(`[BulkUpload] ZIP Entries: ${JSON.stringify(entries)}`);

    // Pre-fetch all universities to map Unique IDs (Workaround for runtime sync issues)
    const allUnivs = await prisma.university.findMany();

    for (let rIndex = 0; rIndex < data.length; rIndex++) {
      const row = data[rIndex];
      const rowIndex = rIndex + 1; // 1-indexed row id
      try {
        const uniqueId = row["Unique ID"]?.toString().trim();
        const name = row["Name"]?.toString().trim();

        if (!uniqueId || !name) {
          results.failed++;
          results.errors.push(
            `Missing Unique ID or Name for record: ${JSON.stringify(row)}`,
          );
          continue;
        }

        // Generate a name-based slug
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        // Boolean helper
        const toBool = (val: any) => {
          if (typeof val === "boolean") return val;
          const s = val?.toString().trim().toUpperCase();
          return s === "TRUE" || s === "1" || s === "YES";
        };

        // Map basic fields
        const universityData = {
          name,
          uniqueId,
          slug,
          city: row["City"]?.toString(),
          state: row["State"]?.toString(),
          aboutNote: row["About Note"]?.toString(),
          establishedYear: row["Established Year"]
            ? parseInt(row["Established Year"].toString())
            : null,
          students: row["Students"]?.toString(),
          tuitionFee: row["Tuition Fee"]
            ? row["Tuition Fee"].toString().trim()
            : null,
          seatsAvailable: row["Seats Available"]
            ? parseInt(row["Seats Available"].toString())
            : null,
          fmgePassRate: row["FMGE Pass Rate"]
            ? parseFloat(row["FMGE Pass Rate"].toString())
            : null,
          courseDuration: row["Course Duration"]?.toString(),
          mediumOfInstruction: row["Medium of Instruction"]?.toString(),
          eligibility: row["Eligibility"]?.toString(),
          neetRequirement: row["NEET Requirement"]?.toString(),
          embassyVerified: toBool(row["Embassy Verified"]),
          whoListed: toBool(row["WHO Listed"]),
          nmcApproved: toBool(row["NMC Approved"]),
          ministryLicensed: toBool(row["Ministry Licensed"]),
          faimerListed: toBool(row["FAIMER Listed"]),
          mciRecognition: toBool(row["MCI Recognition"]),
          ecfmgEligible: toBool(row["ECFMG Eligible"]),
          countriesRepresented: row["Total International Students"]
            ? parseInt(row["Total International Students"].toString())
            : null,
          section2Text: row["Why Choose this University"]?.toString(),
          globalRanking: row["Global Ranking"]?.toString(),
          nationalRanking: row["National Ranking"]?.toString(),
          labs: row["Number of Labs"]
            ? parseInt(row["Number of Labs"].toString())
            : null,
          lectureHall: row["Number of Lecture Halls"]
            ? parseInt(row["Number of Lecture Halls"].toString())
            : null,
          yearOfExcellence: row["Years of Excellence"]
            ? parseInt(row["Years of Excellence"].toString())
            : null,
          latitude: row["Latitude"]
            ? parseFloat(row["Latitude"].toString())
            : null,
          longitude: row["Longitude"]
            ? parseFloat(row["Longitude"].toString())
            : null,
        };

        // Find existing by uniqueId
        const existing = allUnivs.find((u: any) => u.uniqueId === uniqueId);

        let university;
        if (existing) {
          university = await prisma.university.update({
            where: { id: existing.id },
            data: universityData,
          });
        } else {
          university = await prisma.university.create({
            data: universityData,
          });
        }

        // Clear and recreate simpler relations (Rankings, Links, Intakes)
        // We use deleteMany because these don't have other upstream references typically.
        await Promise.all([
          prisma.universityRanking.deleteMany({
            where: { universityId: university.id },
          }),
          prisma.universityLink.deleteMany({
            where: { universityId: university.id },
          }),
          prisma.universityIntake.deleteMany({
            where: { universityId: university.id },
          }),
        ]);

        // 1. Create Rankings
        const rankingCols = [
          {
            body: "QS World University Rankings",
            val: row["QS World University Rankings"],
          },
          {
            body: "Times Higher Education (THE)",
            val: row["Times Higher Education (THE)"],
          },
          { body: "Webometrics Ranking", val: row["Webometrics Ranking"] },
          {
            body: "SCImago Institutions Rankings",
            val: row["SCImago Institutions Rankings"],
          },
          { body: "URAP World Ranking", val: row["URAP World Ranking"] },
          { body: "National Ranking", val: row["National Ranking"] },
        ];
        for (const r of rankingCols) {
          if (r.val) {
            await prisma.universityRanking.create({
              data: {
                universityId: university.id,
                rankingBody: r.body,
                rank: r.val.toString(),
              },
            });
          }
        }

        // 2. Create Links
        const linkCols = [
          {
            title: "WHO Listed Link",
            url: row["WHO Listed Link"],
            type: "who",
          },
          {
            title: "WFME Recognized",
            url: row["WFME Recognized"],
            type: "wfme",
          },
          {
            title: "Globally Accredited",
            url: row["Globally Accredited"],
            type: "accreditation",
          },
        ];
        for (const l of linkCols) {
          if (l.url) {
            await prisma.universityLink.create({
              data: {
                universityId: university.id,
                title: l.title,
                url: l.url.toString(),
                type: l.type,
              },
            });
          }
        }

        // 3. Create Intakes
        if (row["Intake"]) {
          const intakes = row["Intake"]
            .toString()
            .split(",")
            .map((s: string) => s.trim());
          for (const intake of intakes) {
            await prisma.universityIntake.create({
              data: {
                universityId: university.id,
                intakeMonth: intake,
                intakeYear: new Date().getFullYear(),
              },
            });
          }
        }

        // 4. Create/Update Programs
        if (row["Available Courses"]) {
          const courses = row["Available Courses"]
            .toString()
            .split(",")
            .map((s: string) => s.trim());
          for (const courseName of courses) {
            const courseSlug = courseName
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "-")
              .replace(/-+/g, "-");

            // Use upsert-like logic manually as there's no native composite unique on universityId + programSlug in schema
            const existing = await prisma.universityProgram.findFirst({
              where: {
                universityId: university.id,
                OR: [{ programName: courseName }, { programSlug: courseSlug }],
              },
            });

            const programData = {
              programName: courseName,
              programSlug: courseSlug,
              annualTuitionFee: row["Tuition Fee"]
                ? row["Tuition Fee"].toString().trim()
                : null,
              currency: "USD",
              duration: row["Course Duration"]?.toString(),
              intake: row["Intake"]?.toString(),
              eligibility: row["Eligibility"]?.toString(),
              mediumOfInstruction: row["Medium of Instruction"]?.toString(),
              overview: row["Program Overview"]?.toString(),
              year1Syllabus: row["Year 1 Syllabus"]?.toString(),
              year2Syllabus: row["Year 2 Syllabus"]?.toString(),
              year3Syllabus: row["Year 3 Syllabus"]?.toString(),
              year4Syllabus: row["Year 4 Syllabus"]?.toString(),
              year5Syllabus: row["Year 5 Syllabus"]?.toString(),
              year6Syllabus: row["Year 6 Syllabus"]?.toString(),
            };

            if (existing) {
              await prisma.universityProgram.update({
                where: { id: existing.id },
                data: programData,
              });
            } else {
              await prisma.universityProgram.create({
                data: { ...programData, universityId: university.id },
              });
            }
          }
        }

        const docs = [
          { col: "University Brochure Filename", type: "brochure" },
          { col: "University License Filename", type: "university_license" },
          { col: "Aggregation Letter Filename", type: "aggregation_letter" },
        ];

        for (const doc of docs) {
          const filename = row[doc.col]?.toString().trim();
          if (filename) {
            const sourcePath = path.join(
              tmpDir,
              "assets",
              rowIndex.toString(),
              filename,
            );
            const fileExists = existsSync(sourcePath);
            console.log(
              `[BulkUpload] Document: ${filename} -> Exists at ${sourcePath}: ${fileExists}`,
            );

            if (fileExists) {
              const destDir = path.join(
                process.cwd(),
                "public",
                "uploads",
                "universities",
                uniqueId,
                "docs",
              );
              await mkdir(destDir, { recursive: true });
              const destPath = path.join(destDir, filename);
              await rename(sourcePath, destPath);

              const allowedTypes = [
                "brochure",
                "university_license",
                "aggregation_letter",
              ];
              const finalType = allowedTypes.includes(doc.type)
                ? doc.type
                : "brochure";

              await prisma.universityDocument.create({
                data: {
                  universityId: university.id,
                  type: finalType as any,
                  title: doc.col.replace(" Filename", ""),
                  fileName: filename,
                  filePath: `/uploads/universities/${uniqueId}/docs/${filename}`,
                },
              });
            }
          }
        }

        // 6. Process Core Images (Thumbnail)
        const coreImages = [
          {
            col: "Thumbnail Filename",
            nameField: "thumbnailName",
            pathField: "thumbnailPath",
          },
          {
            col: "Banner Filename",
            nameField: "bannerName",
            pathField: "bannerPath",
          },
        ];

        const imageUpdateData: any = {};
        for (const img of coreImages) {
          const filename = row[img.col]?.toString().trim();
          if (filename) {
            const sourcePath = path.join(
              tmpDir,
              "assets",
              rowIndex.toString(),
              filename,
            );
            const fileExists = existsSync(sourcePath);
            console.log(
              `[BulkUpload] Core Image: ${filename} -> Exists at ${sourcePath}: ${fileExists}`,
            );

            if (fileExists) {
              const destDir = path.join(
                process.cwd(),
                "public",
                "uploads",
                "universities",
                uniqueId,
              );
              await mkdir(destDir, { recursive: true });
              const destPath = path.join(destDir, filename);
              await rename(sourcePath, destPath);

              imageUpdateData[img.nameField] = filename;
              imageUpdateData[img.pathField] =
                `/uploads/universities/${uniqueId}/${filename}`;
            }
          }
        }

        if (Object.keys(imageUpdateData).length > 0) {
          await prisma.university.update({
            where: { id: university.id },
            data: imageUpdateData,
          });
        }

        // 7. Process Gallery Images
        const galleryCols = [
          "Gallery Image 1 Filename",
          "Gallery Image 2 Filename",
          "Gallery Image 3 Filename",
        ];
        await prisma.universityPhoto.deleteMany({
          where: { universityId: university.id },
        });
        for (let i = 0; i < galleryCols.length; i++) {
          const filename = row[galleryCols[i]]?.toString().trim();
          if (filename) {
            const sourcePath = path.join(
              tmpDir,
              "assets",
              rowIndex.toString(),
              filename,
            );
            const fileExists = existsSync(sourcePath);
            console.log(
              `[BulkUpload] Gallery Image: ${filename} -> Exists at ${sourcePath}: ${fileExists}`,
            );

            if (fileExists) {
              const destDir = path.join(
                process.cwd(),
                "public",
                "uploads",
                "universities",
                uniqueId,
                "gallery",
              );
              await mkdir(destDir, { recursive: true });
              const destPath = path.join(destDir, filename);
              await rename(sourcePath, destPath);

              await prisma.universityPhoto.create({
                data: {
                  universityId: university.id,
                  title: `Gallery Image ${i + 1}`,
                  imageName: filename,
                  imagePath: `/uploads/universities/${uniqueId}/gallery/${filename}`,
                  position: i + 1,
                },
              });
            }
          }
        }

        results.success++;
      } catch (err: any) {
        console.error(`Error with university row: ${row["Name"]}`, err);
        results.failed++;
        results.errors.push(
          `Error with university "${row["Name"] || "Unknown"}": ${err.message}`,
        );
      }
    }

    return NextResponse.json(results);
  } catch (err: any) {
    console.error("Bulk upload master error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (existsSync(tmpDir)) {
      await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
