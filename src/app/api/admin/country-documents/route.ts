import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CountryDocType } from "@prisma/client";

const COUNTRY = "Qatar";

export async function GET() {
  const docs = await prisma.countryDocument.findMany({
    where: { country: COUNTRY, isActive: true },
    orderBy: { type: "asc" },
  });
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, filePath, fileName, title } = body;

    if (!type || !filePath) {
      return NextResponse.json(
        { error: "type and filePath are required" },
        { status: 422 },
      );
    }

    if (!Object.values(CountryDocType).includes(type as CountryDocType)) {
      return NextResponse.json(
        { error: "Invalid document type" },
        { status: 422 },
      );
    }

    // Upsert: one document per type per country
    const existing = await prisma.countryDocument.findFirst({
      where: { country: COUNTRY, type: type as CountryDocType },
    });

    let doc;
    if (existing) {
      doc = await prisma.countryDocument.update({
        where: { id: existing.id },
        data: {
          filePath,
          fileName: fileName ?? null,
          title: title ?? null,
          isActive: true,
        },
      });
    } else {
      doc = await prisma.countryDocument.create({
        data: {
          country: COUNTRY,
          type: type as CountryDocType,
          filePath,
          fileName: fileName ?? null,
          title: title ?? null,
        },
      });
    }

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("[country-documents POST]", err);
    return NextResponse.json(
      { error: "Failed to save document" },
      { status: 500 },
    );
  }
}
