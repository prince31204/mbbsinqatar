import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePath } from "next/cache";
import { filenameFromPath, normalizeLocalUpload } from "@/lib/upload-paths";
import path from "path";
import { existsSync } from "fs";
import { rename } from "fs/promises";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const university = await prisma.university.findUnique({
    where: { id: parseInt(id) },
    include: { documents: true },
  });
  if (!university)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Map document relations back to flat paths for the UI
  const docMap = {
    brochurePath:
      university.documents.find((d) => d.type === "brochure")?.filePath || null,
    universityLicensePath:
      university.documents.find((d) => d.type === "university_license")
        ?.filePath || null,
    aggregationLetterPath:
      university.documents.find((d) => d.type === "aggregation_letter")
        ?.filePath || null,
  };

  return NextResponse.json({ ...university, ...docMap });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  try {
    const body = await req.json();

    const localUpload = (url: string | null | undefined) =>
      normalizeLocalUpload(url);

    // Strip read-only / relational fields that come back from GET
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id: _id,
      createdAt,
      updatedAt,
      instituteType,
      province,
      cityRelation,
      programs,
      photos,
      rankings,
      studentRecords,
      fmgeRates,
      intakes,
      testimonials,
      reviews,
      faqs,
      facilities,
      hospitals,
      links,
      scholarships,
      documents,
      // Remap image fields
      thumbnail,
      brochure,
      banner,
      universityLicense,
      aggregationLetter,
      // Strip raw path fields (already handled via the mapped variables above)
      brochurePath: _brochurePath,
      embassyLetterPath: _embassyLetterPath,
      universityLicensePath: _universityLicensePath,
      aggregationLetterPath: _aggregationLetterPath,
      nmcGuidelinesPath: _nmcGuidelinesPath,
      schema: schemaField,
      instituteTypeId,
      provinceId,
      cityId,
      ...rest
    } = body;

    void createdAt;
    void updatedAt;
    void _brochurePath;
    void _embassyLetterPath;
    void _universityLicensePath;
    void _aggregationLetterPath;
    void _nmcGuidelinesPath;

    const data: Record<string, unknown> = { ...rest };

    const existing = await prisma.university.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newUniqueId = body.uniqueId?.toString().trim().toUpperCase();
    if (newUniqueId && existing.uniqueId && newUniqueId !== existing.uniqueId) {
      // Rename directory and update paths
      const oldDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "universities",
        existing.uniqueId,
      );
      const newDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "universities",
        newUniqueId,
      );

      if (existsSync(oldDir)) {
        await rename(oldDir, newDir);
      }

      // Update data object for immediate fields
      const updatePaths = (pathStr: string | null) =>
        pathStr?.replace(
          `/uploads/universities/${existing.uniqueId}/`,
          `/uploads/universities/${newUniqueId}/`,
        ) || null;

      if (existing.thumbnailPath)
        data.thumbnailPath = updatePaths(existing.thumbnailPath);
      if (existing.bannerPath)
        data.bannerPath = updatePaths(existing.bannerPath);
      if (existing.section2Image)
        data.section2Image = updatePaths(existing.section2Image);
      if (existing.ogImagePath)
        data.ogImagePath = updatePaths(existing.ogImagePath);

      // Update relational records
      const photos = await prisma.universityPhoto.findMany({
        where: { universityId: existing.id },
      });
      for (const photo of photos) {
        if (
          photo.imagePath?.includes(
            `/uploads/universities/${existing.uniqueId}/` || "",
          )
        ) {
          await prisma.universityPhoto.update({
            where: { id: photo.id },
            data: {
              imagePath: photo.imagePath.replace(
                `/uploads/universities/${existing.uniqueId}/`,
                `/uploads/universities/${newUniqueId}/`,
              ),
            },
          });
        }
      }

      const docs = await prisma.universityDocument.findMany({
        where: { universityId: existing.id },
      });
      for (const doc of docs) {
        if (
          doc.filePath?.includes(
            `/uploads/universities/${existing.uniqueId}/` || "",
          )
        ) {
          await prisma.universityDocument.update({
            where: { id: doc.id },
            data: {
              filePath: doc.filePath.replace(
                `/uploads/universities/${existing.uniqueId}/`,
                `/uploads/universities/${newUniqueId}/`,
              ),
            },
          });
        }
      }
    }

    if (newUniqueId) {
      data.uniqueId = newUniqueId;
    }

    // Map thumbnail/brochure URL → path + name (only local uploads)
    if ("thumbnail" in body) {
      data.thumbnailPath = localUpload(thumbnail) || null;
      data.thumbnailName = filenameFromPath(localUpload(thumbnail));
    }
    if ("banner" in body) {
      data.bannerPath = localUpload(banner) || null;
      data.bannerName = filenameFromPath(localUpload(banner));
    }
    if ("section2Image" in body) {
      data.section2Image = localUpload(body.section2Image) || null;
    }

    const docDeleteTypes = [];
    const docCreates = [];

    if ("brochure" in body) {
      docDeleteTypes.push("brochure");
      const p = localUpload(brochure);
      if (p)
        docCreates.push({
          type: "brochure" as const,
          filePath: p,
          fileName: filenameFromPath(p),
        });
    }
    if ("universityLicense" in body) {
      docDeleteTypes.push("university_license");
      const p = localUpload(universityLicense);
      if (p)
        docCreates.push({
          type: "university_license" as const,
          filePath: p,
          fileName: filenameFromPath(p),
        });
    }
    if ("aggregationLetter" in body) {
      docDeleteTypes.push("aggregation_letter");
      const p = localUpload(aggregationLetter);
      if (p)
        docCreates.push({
          type: "aggregation_letter" as const,
          filePath: p,
          fileName: filenameFromPath(p),
        });
    }

    if (docDeleteTypes.length > 0 || docCreates.length > 0) {
      data.documents = {
        deleteMany:
          docDeleteTypes.length > 0
            ? { type: { in: docDeleteTypes } }
            : undefined,
        create: docCreates.length > 0 ? docCreates : undefined,
      };
    }

    if (schemaField !== undefined) data.schema = schemaField || null;
    if (instituteTypeId !== undefined) {
      data.instituteType = instituteTypeId
        ? { connect: { id: Number(instituteTypeId) } }
        : { disconnect: true };
    }
    if (provinceId !== undefined) {
      data.province = provinceId
        ? { connect: { id: Number(provinceId) } }
        : { disconnect: true };
    }
    if (cityId !== undefined) {
      data.cityRelation = cityId
        ? { connect: { id: Number(cityId) } }
        : { disconnect: true };
    }

    const university = await prisma.university.update({
      where: { id: parseInt(id) },
      data,
    });
    try {
      if (university.slug) {
        revalidatePath(`/universities/${university.slug}`);
      }
      revalidatePath("/universities");
    } catch (e) {
      console.error("Revalidation error:", e);
    }
    return NextResponse.json(university);
  } catch (err) {
    console.error("University update error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.university.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
