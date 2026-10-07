import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const visibility = await prisma.websiteSetting
    .findUnique({
      where: { key: "scholarship_visibility" },
    })
    .catch(() => null);
  const showScholarship = visibility?.value !== "false"; // Default to true

  return (
    <>
      {/* Qatarn Flag Strip Removed */}
      <Header showScholarship={showScholarship} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
