import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  FileText,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  BookOpen,
  UserCog,
} from "lucide-react";
import ChatWidget from "@/components/student/ChatWidget";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as
    { name?: string; email?: string; role?: string } | undefined;

  if (!session || user?.role !== "student") {
    redirect("/login?redirect=/student");
  }

  const navItems = [
    {
      href: "/student",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/student/applications",
      icon: <FileText className="w-5 h-5" />,
      label: "My Applications",
    },
    {
      href: "/student/applied-colleges",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Applied Colleges",
    },
    {
      href: "/student/notifications",
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
    },
    {
      href: "/student/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Profile Settings",
    },
    {
      href: "/student/account-settings",
      icon: <UserCog className="w-5 h-5" />,
      label: "Account Settings",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E7EB] hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#8A1538] rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1F2937]">
                MBBS Qatar
              </div>
              <div className="text-xs text-[#6B7280]">Student Portal</div>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#F9FAFB] rounded-full flex items-center justify-center">
              <span className="text-[#8A1538] font-bold text-sm">
                {user?.name?.substring(0, 2).toUpperCase() || "ST"}
              </span>
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-[#1F2937] text-sm truncate">
                {user?.name || "Student"}
              </div>
              <div className="text-xs text-[#6B7280] truncate">
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[#4B5563] hover:bg-white hover:text-[#5B0F26] transition-colors group"
                >
                  <span className="group-hover:text-[#5B0F26]">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#E5E7EB]">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[#4B5563] hover:bg-white hover:text-[#5B0F26] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {children}
        <ChatWidget />
      </main>
    </div>
  );
}
