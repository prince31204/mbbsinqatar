import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Star, ArrowRight, Award, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";

function getTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "medical":
      return "bg-[#F7E9EE] text-green-800";
    case "technical":
      return "bg-[#F9FAFB] text-[#5B0F26]";
    case "private":
      return "bg-purple-100 text-purple-800";
    case "public":
      return "bg-[#F9FAFB] text-[#5B0F26]";
    default:
      return "bg-[#F9FAFB] text-[#1F2937]";
  }
}

function formatStudents(students: string | null | undefined): string {
  if (!students) return "N/A";
  return students; // Show exactly what admin entered — no extra + appended
}

export default async function UniversityGrid() {
  let universities = await prisma.university
    .findMany({
      where: { status: true, homeView: true },
      select: {
        id: true,
        name: true,
        slug: true,
        thumbnailPath: true,
        rating: true,
        city: true,
        state: true,
        students: true,
        tuitionFee: true,
        establishedYear: true,
        approvedBy: true,
        scholarshipName: true,
        instituteType: { select: { name: true } },
        province: { select: { name: true } },
        cityRelation: { select: { name: true } },
      },
      orderBy: { id: "asc" },
      take: 6,
    })
    .catch(() => []);

  // Fallback un-curated universities if the admin hasn't enabled homeView yet
  if (universities.length === 0) {
    universities = await prisma.university
      .findMany({
        where: { status: true },
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnailPath: true,
          rating: true,
          city: true,
          state: true,
          students: true,
          tuitionFee: true,
          establishedYear: true,
          approvedBy: true,
          scholarshipName: true,
          instituteType: { select: { name: true } },
          province: { select: { name: true } },
          cityRelation: { select: { name: true } },
        },
        orderBy: [{ rating: "desc" }, { id: "asc" }],
        take: 6,
      })
      .catch(() => []);
  }

  return (
    <section className="py-8 bg-[#FAF8F7]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
            Top Medical Universities in Qatar
          </h2>
          <p className="text-lg text-[#4B5563] max-w-5xl mx-auto">
            Practicing medicine in Qatar is a structured and transparent
            process regulated by the Medical Council of Qatar (MCM).
            International students who complete their MBBS in Qatar or from a
            recognized university abroad can apply for registration and begin
            their medical career in the country.
          </p>
        </div>

        {universities.length === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-16 bg-gray-200 rounded" />
                    <div className="h-16 bg-gray-200 rounded" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`${universities.length < 3 ? "flex flex-wrap justify-center" : "grid md:grid-cols-2 lg:grid-cols-3"} gap-8`}
          >
            {universities.map((university, index) => {
              const approvedBy = Array.isArray(university.approvedBy)
                ? (university.approvedBy as string[])
                : ["WHO", "NMC"];

              return (
                <Link
                  key={university.id}
                  href={`/universities/${university.slug}`}
                  className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-[#5B0F26] hover:shadow-2xl ${universities.length < 3 ? "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] max-w-md" : ""}`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[#F9FAFB]/10 via-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {(() => {
                      return (
                        <Image
                          src={
                            cdn(university.thumbnailPath) ||
                            "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=600"
                          }
                          alt={`MBBS students campus at ${university.name}, Qatar`}
                          fill
                          priority={index < 3}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      );
                    })()}
                    <div className="absolute inset-0 bg-white/30 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                    {university.instituteType && (
                      <div className="absolute top-4 left-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium shadow-sm transition-transform duration-300 group-hover:scale-105 ${getTypeColor(university.instituteType.name)}`}
                        >
                          {university.instituteType.name}
                        </span>
                      </div>
                    )}
                    {university.rating && (
                      <div className="absolute top-4 right-4 flex items-center space-x-1 rounded-lg bg-white px-2 py-1 transition-transform duration-300 group-hover:scale-105">
                        <Star className="w-4 h-4 text-[#8A1538] fill-current" />
                        <span className="text-sm font-medium">
                          {Number(university.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative flex flex-grow flex-col p-6">
                    <div className="mb-4">
                      <h3 className="mb-2 text-xl font-bold text-[#1F2937] transition-colors duration-300 group-hover:text-[#5B0F26]">
                        {university.name}
                      </h3>
                      <div className="mb-2 flex items-center text-sm text-[#4B5563] transition-colors duration-300 group-hover:text-[#4B5563]">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>
                          {university.cityRelation?.name ||
                            university.city ||
                            "Qatar"}
                          {university.province?.name
                            ? `, ${university.province.name}`
                            : ""}
                        </span>
                        {university.establishedYear && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Est. {university.establishedYear}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="rounded-lg bg-[#FAF8F7] p-3 text-center transition-all duration-300 group-hover:bg-white">
                        <Users className="mx-auto mb-1 h-5 w-5 text-[#8A1538] transition-transform duration-300 group-hover:scale-110" />
                        <div className="text-sm font-medium text-[#1F2937]">
                          {formatStudents(university.students)}
                        </div>
                        <div className="text-xs text-[#4B5563]">Students</div>
                      </div>
                      <div className="rounded-lg bg-[#FAF8F7] p-3 text-center transition-all duration-300 group-hover:bg-white">
                        <Award className="mx-auto mb-1 h-5 w-5 text-[#8A1538] transition-transform duration-300 group-hover:scale-110" />
                        <div className="text-sm font-medium text-[#1F2937]">
                          {university.tuitionFee
                            ? /[a-zA-Z]/.test(String(university.tuitionFee))
                              ? String(university.tuitionFee)
                              : `${String(university.tuitionFee)} USD`
                            : "Contact for details"}
                        </div>
                        <div className="text-xs text-[#4B5563]">Annual Fees</div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {university.scholarshipName && (
                        <span className="rounded-md bg-[#F8E9EB] border border-[#8A1538]/20 px-2 py-1 text-xs text-[#8A1538] font-medium transition-colors duration-300">
                          🎓 {university.scholarshipName}
                        </span>
                      )}
                      {university.instituteType && (
                        <span className="rounded-md bg-[#F7E9EE] border border-[#5B0F26]/20 px-2 py-1 text-xs text-[#5B0F26] font-medium transition-colors duration-300">
                          {university.instituteType.name}
                        </span>
                      )}
                    </div>

                    {/* Recognition */}
                    <div className="mb-4 flex-grow">
                      <div className="flex items-center space-x-2 text-sm text-[#4B5563] transition-colors duration-300 group-hover:text-[#4B5563]">
                        <Globe className="w-4 h-4" />
                        <span>
                          Recognized by: {approvedBy.slice(0, 3).join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto">
                      <div className="flex w-full items-center justify-center space-x-2 rounded-lg bg-[#8A1538] py-3 font-medium text-white shadow-sm transition-all duration-300 group-hover:shadow-md">
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/universities"
            className="bg-white text-[#8A1538] border-2 border-[#8A1538] px-8 py-4 rounded-lg font-semibold hover:bg-[#8A1538] hover:text-white transition-colors"
          >
            View All Universities
          </Link>
        </div>
      </div>
    </section>
  );
}
