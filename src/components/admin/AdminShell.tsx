"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminTopBar } from "@/components/admin/TopBar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    // Login page — render with no sidebar/topbar
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#FFFDF9] font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
