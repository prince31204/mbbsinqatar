"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { cdn } from "@/lib/cdn";

interface Uni {
  id: number;
  name: string;
  slug: string;
  thumbnailPath: string | null;
  rating: unknown;
  city: string | null;
  students: string | null;
  tuitionFee: unknown;
  establishedYear: number | null;
  courseDuration: string | null;
  mediumOfInstruction: string | null;
  whoListed: boolean | null;
  nmcApproved: boolean | null;
  ministryLicensed: boolean | null;
  faimerListed: boolean | null;
  mciRecognition: boolean | null;
  ecfmgEligible: boolean | null;
  fmgePassRate: unknown;
  neetRequirement: string | null;
  eligibility: string | null;
  globalRanking: string | null;
  campusArea: string | null;
  labs: number | null;
  lectureHall: number | null;
  hostelBuilding: number | null;
  countriesRepresented: number | null;
  instituteType: { name: string } | null;
  cityRelation: { name: string } | null;
}

const FEATURES = [
  { key: "location", label: "Location" },
  { key: "established", label: "Established" },
  { key: "rating", label: "Rating" },
  { key: "students", label: "Total Students" },
  { key: "fee", label: "Annual Fees" },
  { key: "duration", label: "Course Duration" },
  { key: "type", label: "Institute Type" },
  { key: "medium", label: "Medium of Instruction" },
  { key: "recognition", label: "Recognition" },
  { key: "neet", label: "NEET Requirement" },
  { key: "eligibility", label: "Eligibility" },
  { key: "globalRanking", label: "Global Ranking" },
  { key: "campusArea", label: "Campus Area" },
  { key: "labs", label: "Labs" },
  { key: "lectureHall", label: "Lecture Halls" },
  { key: "hostelBuilding", label: "Hostel Buildings" },
  { key: "countriesRepresented", label: "Countries Represented" },
];

function getValue(u: Uni, key: string): string {
  switch (key) {
    case "location":
      return u.cityRelation?.name || u.city || "N/A";
    case "established":
      return u.establishedYear?.toString() || "N/A";
    case "rating":
      return u.rating ? `★ ${Number(u.rating).toFixed(1)}` : "N/A";
    case "students":
      return u.students ? `${u.students}` : "N/A";
    case "fee":
      return u.tuitionFee ? String(u.tuitionFee) : "N/A";
    case "duration":
      return u.courseDuration || "N/A";
    case "type":
      return u.instituteType?.name || "N/A";
    case "medium":
      return u.mediumOfInstruction || "N/A";
    case "recognition": {
      const r = [];
      if (u.whoListed) r.push("WHO");
      if (u.nmcApproved) r.push("NMC");
      if (u.ministryLicensed) r.push("Ministry");
      if (u.faimerListed) r.push("FAIMER");
      if (u.mciRecognition) r.push("MCI");
      if (u.ecfmgEligible) r.push("ECFMG");
      return r.join(", ") || "N/A";
    }
    case "fmge":
      return u.fmgePassRate ? `${Number(u.fmgePassRate)}%` : "N/A";
    case "neet":
      return u.neetRequirement || "N/A";
    case "eligibility":
      return u.eligibility || "N/A";
    case "globalRanking":
      return u.globalRanking ? `#${u.globalRanking}` : "N/A";
    case "campusArea":
      return u.campusArea || "N/A";
    case "labs":
      return u.labs?.toString() || "N/A";
    case "lectureHall":
      return u.lectureHall?.toString() || "N/A";
    case "hostelBuilding":
      return u.hostelBuilding?.toString() || "N/A";
    case "countriesRepresented":
      return u.countriesRepresented?.toString() || "N/A";
    default:
      return "N/A";
  }
}

export default function CompareUniversitiesClient({
  allUniversities,
}: {
  allUniversities: Uni[];
}) {
  // Default: first 3 universities
  const [selectedIds, setSelectedIds] = useState<number[]>(
    allUniversities.slice(0, 3).map((u) => u.id),
  );

  const universities = useMemo(
    () =>
      selectedIds
        .map((id) => allUniversities.find((u) => u.id === id)!)
        .filter(Boolean),
    [selectedIds, allUniversities],
  );

  const visibleFeatures = useMemo(() => {
    return FEATURES.filter((feature) => {
      const values = universities.map((u) => getValue(u, feature.key));
      return values.some((v) => v !== "N/A");
    });
  }, [universities]);

  const handleSelect = (slot: number, id: number) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[slot] = id;
      return next;
    });
  };

  return (
    <section id="compare" className="py-16 bg-[#FAF8F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
            Compare Universities
          </h2>
          <p className="text-xl text-[#4B5563] max-w-3xl mx-auto">
            Compare top medical universities side-by-side to find the right fit
            for you.
          </p>
        </div>

        {/* University Selectors */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[0, 1, 2].map((slot) => (
            <div key={slot}>
              <label className="block text-sm font-medium text-[#4B5563] mb-1">
                University {slot + 1}
              </label>
              <select
                value={selectedIds[slot] ?? ""}
                onChange={(e) => handleSelect(slot, Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
                suppressHydrationWarning={true}
              >
                {allUniversities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-[#8A1538] text-white">
                  <th className="text-left p-4 font-semibold w-40">Features</th>
                  {universities.map((u, idx) => (
                    <th
                      key={`${u.id}-${idx}`}
                      className="text-center p-4 font-semibold min-w-48"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-[#E5E7EB]">
                          {u.thumbnailPath ? (
                            <Image
                              src={cdn(u.thumbnailPath)}
                              alt={u.name}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#2F8F83] flex items-center justify-center text-[#5B0F26] font-bold text-lg">
                              {u.name[0]}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium leading-tight">
                          {u.name}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleFeatures.map((feature, idx) => (
                  <tr
                    key={feature.key}
                    className={idx % 2 === 0 ? "bg-white" : "bg-[#FAF8F7]"}
                  >
                    <td className="p-3 font-medium text-[#1F2937] text-sm whitespace-nowrap">
                      {feature.label}
                    </td>
                    {universities.map((u, idx) => {
                      const val = getValue(u, feature.key);
                      const isGood = val !== "N/A";
                      const isRecognition = feature.key === "recognition";
                      return (
                        <td
                          key={`${u.id}-${idx}`}
                          className="p-3 text-center text-[#4B5563] text-sm"
                        >
                          {isRecognition && isGood ? (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {val.split(", ").map((r) => (
                                <span
                                  key={r}
                                  className="text-xs bg-[#F7E9EE] text-green-800 px-2 py-0.5 rounded-full"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span
                              className={
                                !isGood
                                  ? "text-[#6B7280]"
                                  : feature.key === "fee"
                                    ? "text-[#5B0F26] font-semibold"
                                    : ""
                              }
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* CTA row */}
                <tr className="bg-[#F9FAFB]">
                  <td className="p-3 font-medium text-[#1F2937] text-sm">
                    View Details
                  </td>
                  {universities.map((u, idx) => (
                    <td key={`${u.id}-${idx}`} className="p-3 text-center">
                      <Link
                        href={`/universities/${u.slug}`}
                        className="inline-block bg-[#8A1538] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#5B0F26] transition-colors font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/compare"
            className="inline-block bg-white text-[#8A1538] border-2 border-[#E5E7EB] px-8 py-3 rounded-lg font-semibold hover:bg-[#8A1538] hover:text-[#1F2937] transition-colors"
          >
            Compare All Universities →
          </Link>
        </div>
      </div>
    </section>
  );
}
