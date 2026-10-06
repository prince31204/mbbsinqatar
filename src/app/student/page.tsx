import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Bell, CheckCircle, Clock, ArrowRight } from "lucide-react";

export default async function StudentDashboard() {
  const session = await auth();
  const userEmail = session?.user?.email;

  const lead = userEmail
    ? await prisma.lead
        .findUnique({
          where: { email: userEmail },
          include: { inquiries: { orderBy: { createdAt: "desc" }, take: 3 } },
        })
        .catch(() => null)
    : null;

  type Inquiry = NonNullable<typeof lead>["inquiries"][0];

  const stats = [
    {
      label: "Inquiries",
      value: lead?.inquiries?.length ?? 0,
      icon: <FileText className="w-6 h-6 text-[#BC002D]" />,
      color: "bg-white",
    },
    {
      label: "Pending",
      value:
        lead?.inquiries?.filter((a: Inquiry) => a.status === "pending")
          .length ?? 0,
      icon: <Clock className="w-6 h-6 text-[#BC002D]" />,
      color: "bg-red-400",
    },
    {
      label: "Contacted",
      value:
        lead?.inquiries?.filter((a: Inquiry) => a.status === "contacted")
          .length ?? 0,
      icon: <CheckCircle className="w-6 h-6 text-[#8F0023]" />,
      color: "bg-red-50",
    },
    {
      label: "Notifications",
      value: 0,
      icon: <Bell className="w-6 h-6 text-[#BC002D]" />,
      color: "bg-white",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#17202A]">
          Welcome back, {lead?.name || session?.user?.name || "Student"}! 👋
        </h1>
        <p className="text-[#6B7280] mt-1">
          Here&apos;s a summary of your inquiries and activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-5"
          >
            <div
              className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-3`}
            >
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-[#17202A]">{stat.value}</div>
            <div className="text-sm text-[#6B7280]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#17202A]">Recent Inquiries</h2>
          <Link
            href="/student/applications"
            className="text-[#BC002D] text-sm font-medium hover:text-[#102A43] flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {!lead?.inquiries?.length ? (
          <div className="text-center py-8 text-[#6B7280]">
            <FileText className="w-12 h-12 mx-auto mb-3 text-[#4B5563]" />
            <p className="mb-4">You haven&apos;t made any inquiries yet.</p>
            <Link
              href="/universities"
              className="bg-[#BC002D] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#8F0023] transition-colors"
            >
              Browse Universities
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {lead.inquiries.map((inq: Inquiry) => (
              <div
                key={inq.id}
                className="flex items-center justify-between p-4 bg-[#FFFDF9] rounded-xl"
              >
                <div>
                  <div className="font-medium text-[#17202A] text-sm">
                    {inq.universityName || "General Inquiry"}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-0.5">
                    Submitted {new Date(inq.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${inq.status === "contacted" ? "bg-red-100 text-[#8F0023]" : inq.status === "rejected" ? "bg-[#F9FAFB] text-[#102A43]" : "bg-red-400 text-[#BC002D]"}`}
                >
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/universities"
          className="bg-[#BC002D] text-white rounded-2xl p-6 hover:bg-[#8F0023] transition-colors group"
        >
          <div className="font-bold text-lg mb-1">Browse Universities</div>
          <div className="text-[#4B5563] text-sm">
            Find your ideal MBBS university in Japan
          </div>
          <ArrowRight className="w-5 h-5 mt-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/scholarships"
          className="bg-white border-2 border-[#E5E7EB] text-[#BC002D] rounded-2xl p-6 hover:bg-white transition-colors group"
        >
          <div className="font-bold text-lg mb-1">Find Scholarships</div>
          <div className="text-red-500 text-sm">
            Explore funding options for your education
          </div>
          <ArrowRight className="w-5 h-5 mt-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
