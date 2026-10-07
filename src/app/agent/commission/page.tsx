import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { CURRENCY_SYMBOL, formatCurrencyNumber } from "@/lib/currency";

export default async function AgentCommissionPage() {
  const session = await auth();
  const agentId = Number(session?.user?.id);

  const [enrolled, total] = await Promise.all([
    prisma.leadInquiry.count({ where: { agentId, status: "enrolled" } }),
    prisma.leadInquiry.count({ where: { agentId } }),
  ]);

  // Commission calculation: currency-configured amount per enrolled student (configurable in future)
  const COMMISSION_PER_STUDENT = 500;
  const totalEarned = enrolled * COMMISSION_PER_STUDENT;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Commission</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Track your earnings from enrolled students
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#F7E9EE] flex items-center justify-center">
              <DollarSign size={18} className="text-[#5B0F26]" />
            </div>
            <p className="text-[#6B7280] text-sm">Total Earned</p>
          </div>
          <p className="text-3xl font-bold text-[#1F2937]">
            {formatCurrencyNumber(totalEarned)}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">{`${CURRENCY_SYMBOL}${COMMISSION_PER_STUDENT} per enrolled student`}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#F9FAFB] flex items-center justify-center">
              <TrendingUp size={18} className="text-[#8A1538]" />
            </div>
            <p className="text-[#6B7280] text-sm">Conversion Rate</p>
          </div>
          <p className="text-3xl font-bold text-[#1F2937]">
            {total ? Math.round((enrolled / total) * 100) : 0}%
          </p>
          <p className="text-xs text-[#6B7280] mt-1">
            {enrolled} of {total} leads enrolled
          </p>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
        <h2 className="font-semibold text-[#1F2937]">Referral Breakdown</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2 text-[#4B5563]">
              <CheckCircle size={16} className="text-[#8A1538]" />
              <span className="text-sm">Enrolled Students</span>
            </div>
            <span className="font-semibold text-[#5B0F26]">{enrolled}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2 text-[#4B5563]">
              <Clock size={16} className="text-[#8A1538]" />
              <span className="text-sm">Total Referrals</span>
            </div>
            <span className="font-semibold">{total}</span>
          </div>
        </div>
        <div className="bg-[#8A1538] border border-[#E5E7EB] rounded-xl p-4 text-sm text-[#8A1538] mt-4">
          <strong>Note:</strong> Commission is counted when a student&apos;s
          status is marked as &quot;Enrolled&quot; by the admin team. Contact us
          at support@mbbsinqatar.com for payout requests.
        </div>
      </div>
    </div>
  );
}
