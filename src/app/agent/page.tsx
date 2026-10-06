import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AgentDashboardPage() {
  const session = await auth();
  const agentId = Number(session?.user?.id);

  const [totalLeads, pendingLeads, processedLeads, recentLeads] =
    await Promise.all([
      prisma.leadInquiry.count({ where: { agentId } }),
      prisma.leadInquiry.count({ where: { agentId, status: "pending" } }),
      prisma.leadInquiry.count({
        where: { agentId, status: { not: "pending" } },
      }),
      prisma.leadInquiry.findMany({
        where: { agentId },
        include: { lead: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  const stats = [
    { label: "Total Referrals", value: totalLeads, icon: Users, color: "blue" },
    { label: "Pending", value: pendingLeads, icon: Clock, color: "orange" },
    {
      label: "Processed",
      value: processedLeads,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Conversion",
      value: totalLeads
        ? `${Math.round((processedLeads / totalLeads) * 100)}%`
        : "0%",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-red-400 text-[#BC002D]",
      contacted: "bg-[#F9FAFB] text-[#102A43]",
      enrolled: "bg-red-100 text-[#8F0023]",
      rejected: "bg-[#F9FAFB] text-[#102A43]",
    };
    return map[status] ?? "bg-[#F9FAFB] text-[#4B5563]";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#17202A]">
          Welcome, {session?.user?.name} 👋
        </h1>
        <p className="text-[#6B7280] mt-1">
          Here's a summary of your referral activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-[#E5E7EB] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#6B7280] font-medium">{label}</p>
              <div
                className={`w-9 h-9 rounded-xl bg-${color}-100 flex items-center justify-center`}
              >
                <Icon size={16} className={`text-${color}-600`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#17202A]">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/agent/add-lead"
          className="bg-[#BC002D] hover:bg-[#8F0023] text-white rounded-xl p-5 flex items-center gap-4 transition-colors"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="font-semibold">Add New Lead</p>
            <p className="text-[#4B5563] text-sm">Refer a new student</p>
          </div>
        </Link>
        <Link
          href="/agent/leads"
          className="bg-white hover:bg-[#FFFDF9] border border-[#E5E7EB] text-[#17202A] rounded-xl p-5 flex items-center gap-4 transition-colors"
        >
          <div className="w-10 h-10 bg-[#F9FAFB] rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-[#4B5563]" />
          </div>
          <div>
            <p className="font-semibold">View All Leads</p>
            <p className="text-[#6B7280] text-sm">
              {totalLeads} total referrals
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB]">
          <h3 className="font-semibold text-[#17202A]">Recent Referrals</h3>
        </div>
        {recentLeads.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280]">
            <Users size={32} className="mx-auto mb-3 opacity-40" />
            <p>
              No leads yet.{" "}
              <Link href="/agent/add-lead" className="text-[#BC002D] underline">
                Add your first lead →
              </Link>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentLeads.map((inq) => (
              <div
                key={inq.id}
                className="px-5 py-3.5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#17202A] text-sm">
                    {inq.lead.name}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {inq.lead.email}{" "}
                    {inq.universityName ? `· ${inq.universityName}` : ""}
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(inq.status ?? "pending")}`}
                >
                  {inq.status ?? "pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
