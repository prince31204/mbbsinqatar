import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Star, ArrowRight, Award, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";

function getTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "medical":
      return "bg-red-100 text-green-800";
    case "technical":
      return "bg-[#F9FAFB] text-[#102A43]";
    case "private":
      return "bg-purple-100 text-purple-800";
    case "public":
      return "bg-[#F9FAFB] text-[#102A43]";
    default:
      return "bg-[#F9FAFB] text-[#17202A]";
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
    <section className="py-8 bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#17202A] mb-4">
            Top Medical Universities in Japan
          </h2>
          <p className="text-lg text-[#4B5563] max-w-5xl mx-auto">
            Practicing medicine in Japan is a structured and transparent
            process regulated by the Medical Council of Japan (MCM).
            International students who complete their MBBS in Japan or from a
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
                  className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-[#102A43] hover:shadow-2xl ${universities.length < 3 ? "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] max-w-md" : ""}`}
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
                          alt={`MBBS students campus at ${university.name}, Japan`}
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
                        <Star className="w-4 h-4 text-[#BC002D] fill-current" />
                        <span className="text-sm font-medium">
                          {Number(university.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative flex flex-grow flex-col p-6">
                    <div className="mb-4">
                      <h3 className="mb-2 text-xl font-bold text-[#17202A] transition-colors duration-300 group-hover:text-[#102A43]">
                        {university.name}
                      </h3>
                      <div className="mb-2 flex items-center text-sm text-[#4B5563] transition-colors duration-300 group-hover:text-[#4B5563]">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>
                          {university.cityRelation?.name ||
                            university.city ||
                            "Japan"}
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
                      <div className="rounded-lg bg-[#FFFDF9] p-3 text-center transition-all duration-300 group-hover:bg-white">
                        <Users className="mx-auto mb-1 h-5 w-5 text-[#BC002D] transition-transform duration-300 group-hover:scale-110" />
                        <div className="text-sm font-medium text-[#17202A]">
                          {formatStudents(university.students)}
                        </div>
                        <div className="text-xs text-[#4B5563]">Students</div>
                      </div>
                      <div className="rounded-lg bg-[#FFFDF9] p-3 text-center transition-all duration-300 group-hover:bg-white">
                        <Award className="mx-auto mb-1 h-5 w-5 text-[#BC002D] transition-transform duration-300 group-hover:scale-110" />
                        <div className="text-sm font-medium text-[#17202A]">
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
                        <span className="rounded-md bg-[#F8E9EB] border border-[#BC002D]/20 px-2 py-1 text-xs text-[#BC002D] font-medium transition-colors duration-300">
                          🎓 {university.scholarshipName}
                        </span>
                      )}
                      {university.instituteType && (
                        <span className="rounded-md bg-[#FCE8ED] border border-[#102A43]/20 px-2 py-1 text-xs text-[#102A43] font-medium transition-colors duration-300">
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
                      <div className="flex w-full items-center justify-center space-x-2 rounded-lg bg-[#BC002D] py-3 font-medium text-white shadow-sm transition-all duration-300 group-hover:shadow-md">
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
            className="bg-white text-[#BC002D] border-2 border-[#BC002D] px-8 py-4 rounded-lg font-semibold hover:bg-[#BC002D] hover:text-white transition-colors"
          >
            View All Universities
          </Link>
        </div>
      </div>
    </section>
  );
}
