import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Toaster } from "sonner";

export const metadata = {
  title: { default: "Admin Panel | MBBS Qatar", template: "%s | Admin" },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <AdminShell>{children}</AdminShell>
      <Toaster richColors position="top-right" />
    </>
  );
}
