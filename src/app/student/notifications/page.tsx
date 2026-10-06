import { auth } from "@/lib/auth";
import { Bell } from "lucide-react";

export default async function NotificationsPage() {
  const session = await auth();
  const name = session?.user?.name || "Student";

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#17202A] flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#BC002D]" /> Notifications
        </h1>
        <p className="text-[#6B7280] mt-1">
          Stay updated on your application status and important messages.
        </p>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#E5E7EB]">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5">
          <Bell className="w-10 h-10 text-[#BC002D]" />
        </div>
        <h2 className="text-lg font-semibold text-[#17202A] mb-2">
          No Notifications Yet
        </h2>
        <p className="text-[#6B7280] text-sm text-center max-w-sm">
          Hi {name}! You&apos;ll be notified here when there are updates on your
          applications, messages from counsellors, or important announcements.
        </p>
      </div>
    </div>
  );
}
