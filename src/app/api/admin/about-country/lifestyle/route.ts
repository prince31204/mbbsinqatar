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
  const items = await prisma.countryLifestyleCulture.findMany({
    where: { pageId: PAGE_ID },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, iconClass, image } = await req.json();
    if (!title?.trim())
      return NextResponse.json({ error: "Title required" }, { status: 422 });
    const imagePath = normalizeLocalUpload(image) ?? image ?? null;
    let item = await prisma.countryLifestyleCulture.create({
      data: {
        pageId: PAGE_ID,
        title: title.trim(),
        description: description ?? "",
        iconClass: iconClass || null,
        image: imagePath,
      },
    });
    const promotedImage = await promoteTmpUpload(item.image, item.id);
    if (promotedImage !== item.image) {
      item = await prisma.countryLifestyleCulture.update({
        where: { id: item.id },
        data: { image: promotedImage },
      });
    }
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
