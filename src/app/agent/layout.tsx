import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  DollarSign,
  LogOut,
  GraduationCap,
} from "lucide-react";

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "agent") redirect("/agent/login");

  const navLinks = [
    { label: "Dashboard", href: "/agent", icon: LayoutDashboard },
    { label: "My Leads", href: "/agent/leads", icon: Users },
    { label: "Add Lead", href: "/agent/add-lead", icon: PlusCircle },
    { label: "Commission", href: "/agent/commission", icon: DollarSign },
  ];

  return (
    <div className="flex min-h-screen bg-[#FFFDF9]">
      {/* Sidebar */}
      <aside className="w-60 bg-white flex flex-col text-[#17202A] shrink-0">
        <div className="p-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#BC002D] rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-[#17202A]" />
            </div>
            <div>
              <p className="text-sm font-bold">Agent Portal</p>
              <p className="text-xs text-[#6B7280]">MBBS Japan</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4B5563] hover:bg-slate-800 hover:text-[#17202A] transition-colors text-sm font-medium"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#E5E7EB]">
          <div className="text-xs text-[#6B7280] mb-3 px-1">
            {session.user?.name}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/agent/login" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#17202A] text-sm px-3 py-2 rounded-lg hover:bg-slate-800 w-full transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
