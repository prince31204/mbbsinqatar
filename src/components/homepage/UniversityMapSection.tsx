import { prisma } from "@/lib/prisma";
import UniversityMapWrapper from "./UniversityMapWrapper";

export default async function UniversityMapSection() {
  const universities = await prisma.university
    .findMany({
      where: {
        status: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        latitude: true,
        longitude: true,
        thumbnailPath: true,
      },
    })
    .catch(() => []);



  const mapData = universities.map((u) => ({
    ...u,
    latitude: u.latitude ? Number(u.latitude) : null,
    longitude: u.longitude ? Number(u.longitude) : null,
  }));

  return (
    <section
      className="bg-[#F9FAFB] overflow-hidden relative"
      id="university-map"
    >
      {/* Heading above the map */}
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
        <div className="text-center">
          <span className="inline-block bg-[#F9FAFB] text-[#5B0F26] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
            Interactive Map
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-3">
            Universities Across Qatar
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto text-base">
            Discover top MBBS universities across Qatar with our interactive
            map—compare locations, explore campuses, and choose the right
            medical college for your global career.
          </p>
        </div>
      </div>

      {/* Full-width map container */}
      <div className="w-full px-4 pb-14 max-w-7xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden shadow-2xl border border-[#E5E7EB]"
          style={{ zIndex: 0, position: "relative" }}
        >
          <UniversityMapWrapper universities={mapData} />
        </div>
      </div>
    </section>
  );
}
