import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePath } from "next/cache";
import {
  filenameFromPath,
  normalizeLocalUpload,
  promoteTmpUpload,
} from "@/lib/upload-paths";

function mapPrismaError(err: unknown): { status: number; message: string } {
  const prismaErr = err as {
    code?: string;
    message?: string;
    meta?: { target?: string[] };
  };

  if (prismaErr?.code === "P2022") {
    return {
      status: 500,
      message:
        "Database schema is out of sync with Prisma schema. Run `npx prisma db push` and restart the dev server.",
    };
  }

  if (prismaErr?.code === "P2002") {
    const target = prismaErr.meta?.target?.join(", ") || "unique field";
    return {
      status: 409,
      message: `Duplicate value for ${target}. Please use a different value.`,
    };
  }

  return {
    status: 500,
    message:
      err instanceof Error
        ? err.message
        : "Failed to process university request",
  };
}

// GET /api/admin/universities
export async function GET(req: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "25");
    const search = searchParams.get("search") ?? "";
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const sortDir = (searchParams.get("sortDir") as "asc" | "desc") ?? "desc";

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [data, total] = await Promise.all([
      prisma.university.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortDir },
        include: {
          instituteType: { select: { name: true } },
          province: { select: { name: true } },
        },
      }),
      prisma.university.count({ where }),
    ]);

    return NextResponse.json({ data, total });
  } catch (err) {
    console.error("University list error:", err);
    const mapped = mapPrismaError(err);
    return NextResponse.json(
      { error: mapped.message },
      { status: mapped.status },
    );
  }
}

// POST /api/admin/universities
export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await req.json();

    // Only allow local uploads (stored under /uploads/). External/public URLs are rejected.
    const localUpload = (url: string | null | undefined) =>
      normalizeLocalUpload(url);

    const {
      name,
      slug,
      uniqueId,
      city,
      state,
      rating,
      establishedYear,
      students,
      tuitionFee,
      seatsAvailable,
      fmgePassRate,
      courseDuration,
      mediumOfInstruction,
      eligibility,
      neetRequirement,
      applyNowUrl,
      status,
      isFeatured,
      homeView,
      shortnote,
      aboutNote,
      internationalRecognition,
      englishMedium,
      diverseCommunity,
      section2Title,
      section2Text,
      yearOfExcellence,
      countriesRepresented,
      globalRanking,
      campusArea,
      labs,
      lectureHall,
      hostelBuilding,
      parentSatisfaction,
      totalReviews,
      recommendedRate,
      seoRating,
      reviewNumber,
      bestRating,
      thumbnail,
      banner,
      section2Image,
      brochure,
      embassyLetter,
      universityLicense,
      aggregationLetter,
      nmcGuidelines,
      metaTitle,
      metaKeyword,
      metaDescription,
      schema,
      approvedBy,
      instituteTypeId,
      provinceId,
      embassyVerified,
      whoListed,
      nmcApproved,
      ministryLicensed,
      faimerListed,
      mciRecognition,
      ecfmgEligible,
      latitude,
      longitude,
    } = body;

    const thumbnailPath = localUpload(thumbnail);
    const bannerPath = localUpload(banner);
    const section2ImagePath = localUpload(section2Image);

    // Prepare documents for nested create
    const documentSubmissions = [];
    const brochurePathToSave = localUpload(brochure);
    if (brochurePathToSave) {
      documentSubmissions.push({
        type: "brochure" as const,
        filePath: brochurePathToSave,
        fileName: filenameFromPath(brochurePathToSave),
      });
    }

    const licensePathToSave = localUpload(universityLicense);
    if (licensePathToSave) {
      documentSubmissions.push({
        type: "university_license" as const,
        filePath: licensePathToSave,
        fileName: filenameFromPath(licensePathToSave),
      });
    }

    const aggLetterPathToSave = localUpload(aggregationLetter);
    if (aggLetterPathToSave) {
      documentSubmissions.push({
        type: "aggregation_letter" as const,
        filePath: aggLetterPathToSave,
        fileName: filenameFromPath(aggLetterPathToSave),
      });
    }

    let university = await prisma.university.create({
      data: {
        name,
        uniqueId: (uniqueId || slug || name).toString().toUpperCase(),
        slug,
        city: city || null,
        ogImagePath: schema || null,
        state: state || null,
        rating: rating ?? null,
        establishedYear: establishedYear ?? null,
        students: students || null,
        tuitionFee: tuitionFee ?? null,
        seatsAvailable: seatsAvailable ?? null,
        fmgePassRate: fmgePassRate ?? null,
        courseDuration: courseDuration || null,
        mediumOfInstruction: mediumOfInstruction || null,
        eligibility: eligibility || null,
        neetRequirement: neetRequirement || null,
        shortnote: shortnote || null,
        aboutNote: aboutNote || null,
        isFeatured: isFeatured ?? false,
        homeView: homeView ?? false,
        status: status ?? true,
        embassyVerified: embassyVerified ?? false,
        whoListed: whoListed ?? false,
        nmcApproved: nmcApproved ?? false,
        ministryLicensed: ministryLicensed ?? false,
        faimerListed: faimerListed ?? false,
        mciRecognition: mciRecognition ?? false,
        ecfmgEligible: ecfmgEligible ?? false,
        applyNowUrl: applyNowUrl || null,
        thumbnailPath: thumbnailPath || null,
        thumbnailName: filenameFromPath(thumbnailPath),
        bannerPath: bannerPath || null,
        bannerName: filenameFromPath(bannerPath),
        section2Image: section2ImagePath || null,
        documents: {
          create: documentSubmissions,
        },
        metaTitle: metaTitle || null,
        metaKeyword: metaKeyword || null,
        metaDescription: metaDescription || null,
        globalRanking: body.globalRanking || null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        ...(instituteTypeId
          ? { instituteType: { connect: { id: Number(instituteTypeId) } } }
          : {}),
        ...(provinceId
          ? { province: { connect: { id: Number(provinceId) } } }
          : {}),
      },
    });

    const updates: Record<string, string | null> = {};
    const promotedThumbnail = await promoteTmpUpload(
      university.thumbnailPath,
      university.uniqueId,
    );
    const promotedBanner = await promoteTmpUpload(
      university.bannerPath,
      university.uniqueId,
    );
    const promotedSection2Image = await promoteTmpUpload(
      university.section2Image,
      university.uniqueId,
    );

    if (promotedThumbnail !== university.thumbnailPath)
      updates.thumbnailPath = promotedThumbnail;
    if (promotedBanner !== university.bannerPath)
      updates.bannerPath = promotedBanner;
    if (promotedSection2Image !== university.section2Image)
      updates.section2Image = promotedSection2Image;

    // Note: For simplicity in the create flow, we aren't promoting the document relations here.
    // It's generally better to promote them before saving, or use a cleanup script.

    if (Object.keys(updates).length > 0) {
      university = await prisma.university.update({
        where: { id: university.id },
        data: updates,
      });
    }

    try {
      revalidatePath("/universities");
    } catch (e) {
      console.error("Revalidation error:", e);
    }

    return NextResponse.json(university, { status: 201 });
  } catch (err) {
    console.error("University create error:", err);
    const mapped = mapPrismaError(err);
    return NextResponse.json(
      { error: mapped.message },
      { status: mapped.status },
    );
  }
}
