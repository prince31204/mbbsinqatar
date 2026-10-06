"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Users,
  Star,
  ArrowRight,
  DollarSign,
  Globe,
  Search,
  Clock,
  BookOpen,
  TrendingUp,
  Award,
  CheckCircle,
  Filter,
} from "lucide-react";

interface Scholarship {
  title: string;
}

interface University {
  id: number;
  name: string;
  slug: string;
  thumbnailPath: string | null;
  rating: unknown;
  city: string | null;
  establishedYear: number | null;
  students: string | null;
  tuitionFee: unknown;
  approvedBy: unknown;
  courseDuration: string | null;
  fmgePassRate: unknown;
  neetRequirement: string | null;
  mediumOfInstruction: string | null;
  globalRanking: string | null;
  whoListed: boolean | null;
  nmcApproved: boolean | null;
  ministryLicensed: boolean | null;
  faimerListed: boolean | null;
  mciRecognition: boolean | null;
  instituteType: { name: string } | null;
  province: { name: string } | null;
  cityRelation: { name: string } | null;
  scholarships: Scholarship[];
}

interface Props {
  universities: University[];
}

function formatStudents(s: string | null): string {
  if (!s) return "N/A";
  return s; // Show exactly what admin entered
}

function getTypeColor(type: string | null): string {
  switch ((type || "").toLowerCase()) {
    case "medical":
      return "bg-red-100 text-green-800";
    case "private":
      return "bg-purple-100 text-purple-800";
    case "public":
      return "bg-[#F9FAFB] text-[#102A43]";
    default:
      return "bg-[#F9FAFB] text-[#17202A]";
  }
}

function getRecognitionBadges(u: University): string[] {
  const badges: string[] = [];
  if (u.whoListed) badges.push("WHO");
  if (u.nmcApproved) badges.push("NMC");
  if (u.ministryLicensed) badges.push("Ministry");
  if (u.faimerListed) badges.push("FAIMER");
  if (u.mciRecognition) badges.push("MCI");

  if (u.approvedBy) {
    const raw =
      typeof u.approvedBy === "string"
        ? u.approvedBy
        : JSON.stringify(u.approvedBy);
    const customBadges = raw
      .replace(/[\[\]"]/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    customBadges.forEach((b) => {
      // Avoid adding duplicates (case insensitive check optionally, but strict for now)
      if (
        !badges.some((existing) => existing.toLowerCase() === b.toLowerCase())
      ) {
        badges.push(b);
      }
    });
  }

  return badges;
}

export default function UniversitySearch({ universities }: Props) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const types = useMemo(() => {
    const seen = new Set<string>();
    universities.forEach((u) => {
      if (u.instituteType?.name) seen.add(u.instituteType.name);
    });
    return [...seen];
  }, [universities]);

  const filtered = useMemo(
    () =>
      universities.filter((u) => {
        const matchQuery =
          !query ||
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          (u.cityRelation?.name || u.city || "")
            .toLowerCase()
            .includes(query.toLowerCase());
        const matchType =
          typeFilter === "all" || u.instituteType?.name === typeFilter;
        return matchQuery && matchType;
      }),
    [universities, query, typeFilter],
  );

  return (
    <>
      {/* Sticky Search Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              value={query}
              suppressHydrationWarning
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search universities by name or city..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#102A43]/500"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            <select
              value={typeFilter}
              suppressHydrationWarning
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A43]/500 bg-white"
            >
              <option value="all">All Types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <span className="text-sm text-[#6B7280] whitespace-nowrap font-medium">
              {filtered.length} found
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#6B7280]">
            <Search className="w-12 h-12 mx-auto mb-3 text-[#4B5563]" />
            <p className="text-lg font-medium">
              No universities found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm mt-1">Try a different name or city</p>
          </div>
        ) : (
          <div
            className={`${filtered.length < 3 ? "flex flex-wrap justify-center" : "grid md:grid-cols-2 lg:grid-cols-3"} gap-8`}
          >
            {filtered.map((u) => {
              const recognitionBadges = getRecognitionBadges(u);
              const fmgeRate = u.fmgePassRate ? Number(u.fmgePassRate) : null;
              const location = [
                u.cityRelation?.name || u.city,
                u.province?.name,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <Link
                  key={u.id}
                  href={`/universities/${u.slug}`}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col border border-[#E5E7EB] cursor-pointer ${filtered.length < 3 ? "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] max-w-md" : ""}`}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={
                        !u.thumbnailPath
                          ? "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800"
                          : u.thumbnailPath.startsWith("http://") ||
                              u.thumbnailPath.startsWith("https://") ||
                              u.thumbnailPath.startsWith("/")
                            ? u.thumbnailPath
                            : `/${u.thumbnailPath}`
                      }
                      alt={u.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {/* Type badge */}
                    {u.instituteType && (
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(u.instituteType.name)}`}
                        >
                          {u.instituteType.name}
                        </span>
                      </div>
                    )}

                    {/* Rating */}
                    {u.rating != null && (
                      <div className="absolute top-4 right-4 bg-white/95 rounded-lg px-2.5 py-1 flex items-center gap-1 shadow">
                        <Star className="w-3.5 h-3.5 text-[#BC002D] fill-current" />
                        <span className="text-sm font-bold text-[#17202A]">
                          {Number(u.rating).toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Global Ranking badge */}
                    {u.globalRanking && (
                      <div className="absolute bottom-3 left-4 bg-[#BC002D] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        Rank #{u.globalRanking}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Title + Location */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-[#17202A] mb-1.5 group-hover:text-[#102A43] transition-colors leading-tight">
                        {u.name}
                      </h3>
                      <div className="flex items-center text-[#6B7280] text-sm gap-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                        <span>{location || "Japan"}</span>
                        {u.establishedYear && (
                          <>
                            <span className="mx-1">•</span>
                            <span>Est. {u.establishedYear}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 4-stat grid */}
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      <div className="text-center p-3 bg-white rounded-xl">
                        <DollarSign className="w-4 h-4 text-[#BC002D] mx-auto mb-1" />
                        <div className="text-sm font-semibold text-[#17202A] leading-tight">
                          {u.tuitionFee
                            ? /[a-zA-Z]/.test(String(u.tuitionFee))
                              ? String(u.tuitionFee)
                              : `${String(u.tuitionFee)} USD`
                            : "Contact for fees"}
                        </div>
                        <div className="text-xs text-[#6B7280] mt-0.5">
                          Annual Fees
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-xl">
                        <Users className="w-4 h-4 text-[#BC002D] mx-auto mb-1" />
                        <div className="text-sm font-semibold text-[#17202A]">
                          {formatStudents(u.students)}
                        </div>
                        <div className="text-xs text-[#6B7280] mt-0.5">
                          Students
                        </div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-xl">
                        <Clock className="w-4 h-4 text-[#8F0023] mx-auto mb-1" />
                        <div className="text-sm font-semibold text-[#17202A]">
                          {u.courseDuration || "6 Years"}
                        </div>
                        <div className="text-xs text-[#6B7280] mt-0.5">
                          Duration
                        </div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-xl">
                        <TrendingUp className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-[#17202A]">
                          {fmgeRate != null ? `${fmgeRate}%` : "N/A"}
                        </div>
                        <div className="text-xs text-[#6B7280] mt-0.5">
                          FMGE Rate
                        </div>
                      </div>
                    </div>

                    {/* Medium + NEET */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {u.mediumOfInstruction && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-400 text-[#BC002D] text-xs rounded-lg font-medium">
                          <BookOpen className="w-3 h-3" />
                          {u.mediumOfInstruction}
                        </span>
                      )}
                      {u.neetRequirement && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F9FAFB] text-[#4B5563] text-xs rounded-lg font-medium">
                          <Award className="w-3 h-3" />
                          NEET Required
                        </span>
                      )}
                      {u.scholarships.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#BC002D] text-xs rounded-lg font-medium">
                          🎓 Scholarship Available
                        </span>
                      )}
                    </div>

                    {/* Recognition Badges */}
                    {recognitionBadges.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280] font-medium">
                            Recognized by:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {recognitionBadges.slice(0, 5).map((badge) => (
                            <span
                              key={badge}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-green-800 text-xs rounded-full font-medium"
                            >
                              <CheckCircle className="w-3 h-3" />
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-auto pt-2">
                      <div className="w-full bg-[#BC002D] text-white py-3 rounded-xl font-semibold hover:bg-[#8F0023] transition-colors flex items-center justify-center gap-2 text-sm group/btn">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
