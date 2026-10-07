"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, GraduationCap, User } from "lucide-react";

const resourcesMenu = [
  { name: "About Us", path: "/about-us" },
  { name: "Contact Us", path: "/contact-us" },
  { name: "About Qatar", path: "/about-qatar" },
  { name: "Education System", path: "/education-system" },
  { name: "View Our Partners", path: "/our-partners" },
  { name: "Blog & News", path: "/blog" },
];

function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}

export default function Header({
  showScholarship = true,
}: {
  showScholarship?: boolean;
}) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn =
    !!session?.user && (session.user as { role?: string }).role === "student";
  const userInitials = session?.user?.name
    ? getInitials(session.user.name)
    : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-shadow duration-200 border-b border-[#E6E8EB] ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 bg-[#8A1538] rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1F2937]">
                MBBS in Qatar
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[#5B0F26] hover:text-[#8A1538] font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/universities"
              className="text-[#5B0F26] hover:text-[#8A1538] font-medium transition-colors"
            >
              Universities
            </Link>
            <Link
              href="/compare"
              className="text-[#5B0F26] hover:text-[#8A1538] font-medium transition-colors"
            >
              Compare Universities
            </Link>
            {showScholarship && (
              <Link
                href="/scholarships"
                className="text-[#5B0F26] hover:text-[#8A1538] font-medium transition-colors"
              >
                Scholarships
              </Link>
            )}

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="flex items-center space-x-1 text-[#5B0F26] hover:text-[#8A1538] font-medium transition-colors"
                suppressHydrationWarning={true}
              >
                <span>Resources</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === "resources" && (
                <div className="absolute top-full left-0 w-60 bg-white shadow-xl rounded-lg mt-0 p-4 border border-[#E5E7EB]">
                  <ul className="space-y-2">
                    {resourcesMenu.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className="block text-[#4B5563] hover:text-[#5B0F26] text-sm transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="relative group">
                <Link
                  href="/student"
                  className="w-10 h-10 bg-[#8A1538] text-white rounded-full flex items-center justify-center font-semibold hover:bg-[#5B0F26] transition-colors"
                  aria-label="Go to dashboard"
                >
                  {userInitials || <User className="w-5 h-5" />}
                </Link>
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-white border shadow-xl rounded-lg p-3 min-w-[150px]">
                    <Link
                      href="/student"
                      className="block py-1.5 px-2 text-sm text-[#4B5563] hover:text-[#5B0F26] hover:bg-white rounded"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left py-1.5 px-2 text-sm text-[#4B5563] hover:text-[#5B0F26] hover:bg-white rounded"
                      suppressHydrationWarning={true}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/apply"
                  className="bg-[#8A1538] text-white px-5 py-2 rounded-full shadow-sm hover:bg-[#5B0F26] transition-colors text-sm font-medium"
                >
                  Apply Now
                </Link>
                <Link
                  href="/register"
                  className="border border-[#8A1538] text-[#8A1538] px-5 py-2 rounded-full hover:bg-[#8A1538] hover:text-white transition-colors text-sm font-medium"
                >
                  Sign-Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            suppressHydrationWarning={true}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="space-y-4">
              <Link
                href="/"
                onClick={closeMenu}
                className="block text-[#4B5563] hover:text-[#5B0F26] font-medium"
              >
                Home
              </Link>
              <Link
                href="/universities"
                onClick={closeMenu}
                className="block text-[#4B5563] hover:text-[#5B0F26] font-medium"
              >
                Universities
              </Link>
              <Link
                href="/compare"
                onClick={closeMenu}
                className="block text-[#4B5563] hover:text-[#5B0F26] font-medium"
              >
                Compare Universities
              </Link>
              {showScholarship && (
                <Link
                  href="/scholarships"
                  onClick={closeMenu}
                  className="block text-[#4B5563] hover:text-[#5B0F26] font-medium"
                >
                  Scholarships
                </Link>
              )}

              {/* Mobile Resources */}
              <div>
                <button
                  className="flex items-center justify-between w-full text-[#4B5563] hover:text-[#5B0F26] font-medium"
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "resources" ? null : "resources",
                    )
                  }
                  suppressHydrationWarning={true}
                >
                  <span>Resources</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === "resources" && (
                  <div className="mt-2 pl-4 space-y-2">
                    {resourcesMenu.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={closeMenu}
                        className="block text-[#4B5563] hover:text-[#5B0F26] text-sm transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {isLoggedIn ? (
                <>
                  <Link
                    href="/student"
                    onClick={closeMenu}
                    className="block bg-[#F9FAFB] text-[#4B5563] px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      closeMenu();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full block bg-white text-[#8A1538] px-4 py-2 rounded-lg text-center"
                    suppressHydrationWarning={true}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/apply"
                    onClick={closeMenu}
                    className="block bg-[#8A1538] text-white px-4 py-2 rounded-full shadow-sm text-center font-medium"
                  >
                    Apply Now
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="block border border-[#8A1538] text-[#8A1538] hover:bg-[#8A1538] hover:text-white px-4 py-2 rounded-full text-center"
                  >
                    Sign-Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
