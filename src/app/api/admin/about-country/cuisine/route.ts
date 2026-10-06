import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeLocalUpload, promoteTmpUpload } from "@/lib/upload-paths";

// Cuisine & Lifestyle items live under an AboutCountryPage record.
// We always work with page_id = 1 (the singleton Japan country page).

const PAGE_ID = 1;

export async function GET() {
  // Ensure page exists
  await prisma.aboutCountryPage.upsert({
    where: { id: PAGE_ID },
    create: { id: PAGE_ID, name: "Japan" },
    update: {},
  });
  const items = await prisma.countryCuisineLifestyle.findMany({
    where: { pageId: PAGE_ID },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // The instruction implies using new field names from the body directly
    // and updating the data object accordingly.
    // The original destructuring is no longer fully aligned with the new data structure.
    // We will use body.propertyName directly for clarity and to match the instruction's intent.
    if (!body.dishName?.trim())
      return NextResponse.json(
        { error: "Dish name required" },
        { status: 422 },
      );
    const dishImage =
      normalizeLocalUpload(body.dishImage) ?? body.dishImage ?? null;
    let item = await prisma.countryCuisineLifestyle.create({
      data: {
        pageId: PAGE_ID,
        dishName: body.dishName.trim(),
        dishDescription: body.dishDescription ?? "", // Changed from 'description'
        dishImage, // Combines 'imagePath' and 'imageName' into 'dishImage'
        iconClass: body.iconClass || null, // Changed from 'icon'
      },
    });
    const promotedImage = await promoteTmpUpload(item.dishImage, item.id);
    if (promotedImage !== item.dishImage) {
      item = await prisma.countryCuisineLifestyle.update({
        where: { id: item.id },
        data: { dishImage: promotedImage },
      });
    }
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
