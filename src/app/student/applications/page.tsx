"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cdn } from "@/lib/cdn";

const statusConfig = {
  applied: {
    label: "Applied",
    icon: Clock,
    color: "text-[#8A1538] bg-white border-[#E5E7EB]",
  },
  shortlisted: {
    label: "Shortlisted",
    icon: AlertCircle,
    color: "text-[#8A1538] bg-[#8A1538] border-[#E5E7EB]",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle,
    color: "text-[#5B0F26] bg-[#F7E9EE] border-[#F7E9EE]",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-[#8A1538] bg-white border-[#E5E7EB]",
  },
} as const;

interface Application {
  id: number;
  status: keyof typeof statusConfig;
  appliedAt: string;
  notes?: string;
  program: {
    programName: string;
    programSlug: string;
    duration?: string;
    annualTuitionFee?: string;
    university: {
      name: string;
      slug: string;
      thumbnailPath?: string;
    };
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/applications")
      .then((r) => r.json())
      .then((data) => setApplications(data.applications || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-[#8A1538]" />
        <h1 className="text-2xl font-bold text-[#1F2937]">My Applications</h1>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-5 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48" />
                  <div className="h-3 bg-[#F9FAFB] rounded w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && applications.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
          <FileText className="w-12 h-12 text-[#4B5563] mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[#4B5563] mb-1">
            No Applications Yet
          </h2>
          <p className="text-[#6B7280] text-sm mb-6">
            Browse universities and apply to your preferred MBBS program.
          </p>
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 bg-[#8A1538] hover:bg-[#5B0F26] text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Browse Universities
          </Link>
        </div>
      )}

      {!loading && applications.length > 0 && (
        <div className="space-y-4">
          {applications.map((app) => {
            const cfg = statusConfig[app.status] || statusConfig.applied;
            const StatusIcon = cfg.icon;
            const uniImg = cdn(app.program.university.thumbnailPath);

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* University logo */}
                  <div className="w-14 h-14 bg-[#F9FAFB] rounded-xl overflow-hidden shrink-0">
                    {uniImg ? (
                      <Image
                        src={uniImg}
                        alt={app.program.university.name}
                        width={56}
                        height={56}
                        className="object-contain p-1 w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#4B5563] text-2xl font-bold">
                        {app.program.university.name[0]}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-[#1F2937]">
                          {app.program.programName}
                        </h3>
                        <p className="text-sm text-[#6B7280] mt-0.5">
                          {app.program.university.name}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#6B7280]">
                      {app.program.duration && (
                        <span>⏱ {app.program.duration}</span>
                      )}
                      {app.program.annualTuitionFee && (
                        <span>
                          💰 $
                          {Number(
                            app.program.annualTuitionFee,
                          ).toLocaleString()}
                          /yr
                        </span>
                      )}
                      <span>
                        📅 Applied{" "}
                        {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {app.notes && (
                      <p className="text-xs text-[#6B7280] mt-2 bg-[#FAF8F7] rounded-lg px-3 py-2">
                        {app.notes}
                      </p>
                    )}
                  </div>

                  {/* Link */}
                  <Link
                    href={`/universities/${app.program.university.slug}/courses/${app.program.programSlug}`}
                    className="text-[#6B7280] hover:text-[#5B0F26] transition-colors shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
