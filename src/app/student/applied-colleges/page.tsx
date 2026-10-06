import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppliedCollegesPage() {
  const session = await auth();
  const userEmail = session?.user?.email;

  const lead = userEmail
    ? await prisma.lead
        .findUnique({
          where: { email: userEmail },
          include: {
            inquiries: {
              orderBy: { createdAt: "desc" },
            },
          },
        })
        .catch(() => null)
    : null;

  const inquiries = lead?.inquiries ?? [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "contacted":
        return <CheckCircle className="w-4 h-4 text-[#8F0023]" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-[#BC002D]" />;
      default:
        return <Clock className="w-4 h-4 text-[#BC002D]" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "contacted":
        return "bg-red-100 text-[#8F0023]";
      case "rejected":
        return "bg-[#F9FAFB] text-[#102A43]";
      default:
        return "bg-red-400 text-[#BC002D]";
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#17202A]">Applied Colleges</h1>
        <p className="text-[#6B7280] mt-1">
          Track all your university inquiries and application statuses.
        </p>
      </div>

      {inquiries.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-6">
            <BookOpen className="w-14 h-14 text-[#BC002D]" />
          </div>
          <h2 className="text-xl font-semibold text-[#17202A] mb-2">
            No Applications Yet
          </h2>
          <p className="text-[#6B7280] text-center max-w-sm mb-8">
            {`You haven't applied to any colleges yet. Browse our universities and find your ideal MBBS program in Japan.`}
          </p>
          <Link
            href="/universities"
            className="flex items-center gap-2 px-6 py-3 bg-[#BC002D] hover:bg-[#8F0023] text-white rounded-xl font-semibold transition-colors"
          >
            Browse Universities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: inquiries.length,
                color: "text-[#17202A]",
                bg: "bg-[#FFFDF9]",
              },
              {
                label: "Contacted",
                value: inquiries.filter((i) => i.status === "contacted").length,
                color: "text-[#8F0023]",
                bg: "bg-red-50",
              },
              {
                label: "Pending",
                value: inquiries.filter((i) => i.status === "pending").length,
                color: "text-[#BC002D]",
                bg: "bg-red-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.bg} rounded-2xl p-4 text-center`}
              >
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-[#6B7280] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Inquiry cards */}
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#BC002D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#17202A]">
                      {inq.universityName || "General Inquiry"}
                    </h3>
                    {inq.message && (
                      <p className="text-sm text-[#6B7280] mt-0.5 line-clamp-2">
                        {inq.message}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#6B7280]">
                      <span>
                        Submitted{" "}
                        {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {inq.source && (
                        <span className="capitalize">
                          via {inq.source.replace(/-/g, " ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${getStatusStyle(inq.status)}`}
                  >
                    {getStatusIcon(inq.status)}
                    {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Browse more CTA */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#17202A] mb-1">
                Looking for more options?
              </h3>
              <p className="text-sm text-[#4B5563]">
                Explore all universities and programs available in Japan.
              </p>
            </div>
            <Link
              href="/universities"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#BC002D] hover:bg-[#8F0023] text-white rounded-xl text-sm font-semibold transition-colors shrink-0 ml-4"
            >
              Browse <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
