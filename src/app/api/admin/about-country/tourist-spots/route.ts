import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeLocalUpload, promoteTmpUpload } from "@/lib/upload-paths";

const PAGE_ID = 1;

export async function GET() {
  await prisma.aboutCountryPage.upsert({
    where: { id: PAGE_ID },
    create: { id: PAGE_ID, name: "Japan" },
    update: {},
  });
  const items = await prisma.countryTouristAttraction.findMany({
    where: { pageId: PAGE_ID, isActive: true },
    orderBy: [{ ordering: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.attractionName?.trim())
      return NextResponse.json({ error: "Name required" }, { status: 422 });
    const imagePath = normalizeLocalUpload(body.image) ?? body.image ?? null;
    let item = await prisma.countryTouristAttraction.create({
      data: {
        pageId: PAGE_ID,
        attractionName: body.attractionName.trim(),
        description: body.description || null,
        ordering: body.ordering ?? 0,
        isActive: body.isActive ?? true,
        image: imagePath,
        iconClass: body.iconClass || null,
      },
    });
    const promotedImage = await promoteTmpUpload(item.image, item.id);
    if (promotedImage !== item.image) {
      item = await prisma.countryTouristAttraction.update({
        where: { id: item.id },
        data: { image: promotedImage },
      });
    }
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
