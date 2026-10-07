import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Globe,
  Target,
  BookOpen,
  Phone,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Shield,
  Rocket,
  Compass,
  Building2,
  Plane,
  Home,
  ClipboardCheck,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import TestimonialSection from "@/app/(public)/about-us/TestimonialSection";
import { getHomepageStats } from "@/lib/public-page-content";

export const metadata: Promise<Metadata> = buildMetadata({
  title: "About Us — Global MBBS in Qatar Consultants | mbbsinqatar.com",
  description:
    "We are Qatar's top medical education consultancy helping students from around the world secure admissions in recognized medical universities since 2015.",
  path: "/about-us",
  entitySeo: {
    metaKeyword:
      "about mbbs Qatar, global medical consultancy, mbbs admission support, study mbbs Qatar team",
  },
  pageKey: "about-us",
});

const services = [
  {
    icon: Compass,
    title: "Career Counseling (MBBS Focused)",
    desc: "Personalized guidance for NEET-qualified students, budget planning, and career goals (India/US/UK practice).",
  },
  {
    icon: GraduationCap,
    title: "University Selection",
    desc: "Selection based on NMC/WHO recognition, clinical exposure, infrastructure, and campus safety.",
  },
  {
    icon: ClipboardCheck,
    title: "Admission Assistance",
    desc: "Application processing, documentation verification, and official offer letter support.",
  },
  {
    icon: Plane,
    title: "Visa & Travel Guidance",
    desc: "Complete visa filing support, pre-departure briefings, and travel coordination.",
  },
  {
    icon: Home,
    title: "On-Arrival Support",
    desc: "Airport pickup, hostel/accommodation setup, and local student assistance in Qatar.",
  },
];

export default async function AboutUsPage() {
  const [testimonials, dynamicStats] = await Promise.all([
    prisma.testimonial.findMany({
      where: { status: true },
      orderBy: { position: "asc" },
    }),
    getHomepageStats(),
  ]);

  const stats = [
    { val: dynamicStats.students, label: "Students Placed" },
    { val: dynamicStats.universities, label: "Partner Universities" },
    { val: dynamicStats.experienceYears, label: "Years Experience" },
    { val: dynamicStats.visaSuccess, label: "Visa Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F7]">
      {/* Hero Section */}
      <div className="relative bg-white text-[#1F2937] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 animate-pulse" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block bg-white/20 text-[#1F2937] text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-[#E5E7EB]">
            🌎 Trusted Global MBBS Consultancy
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Empowering Future Doctors <br />
            <span className="text-[#8A1538]">
              from Every Corner of the World
            </span>
          </h1>
          <p className="text-xl text-[#4B5563] max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            mbbsinqatar.com is dedicated to bridging the gap between aspiring
            medical students and world-class quality education in Qatar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/universities"
              className="bg-yellow-500 text-black hover:bg-[#F9FAFB] font-bold px-10 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Explore Universities
            </Link>
            <Link
              href="/contact-us"
              className="bg-[#8A1538] text-white hover:bg-[#5B0F26] font-bold px-10 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Get Free Counseling
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b py-12 relative z-10 -mt-10 mx-4 max-w-6xl lg:mx-auto rounded-2xl shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, idx) => (
            <div
              key={s.label}
              className={`group relative overflow-hidden rounded-2xl px-4 py-3 text-center transition-all duration-500 hover:-translate-y-1 hover:bg-white/60 ${idx < stats.length - 1 ? "lg:border-r border-[#E5E7EB]" : ""}`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[#F9FAFB]/10 via-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-1 text-4xl font-extrabold text-[#8A1538] transition-transform duration-300 group-hover:scale-105">
                  {s.val}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#6B7280] transition-colors duration-300 group-hover:text-[#5B0F26]">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision Section (Extracted from Old React) */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#8A1538] font-bold text-sm tracking-widest uppercase mb-4">
              <span className="h-0.5 w-8 bg-[#8A1538]"></span>
              <span>Our Purpose</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1F2937] mb-8 leading-tight">
              Committed to Your <br />
              Medical Excellence
            </h2>

            <div className="space-y-10">
              <div className="group rounded-[2rem] border border-transparent bg-white/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#E5E7EB] hover:bg-white/60 hover:shadow-xl">
                <div className="flex items-start space-x-6">
                  <div className="rounded-2xl bg-white p-4 transition-all duration-300 group-hover:bg-[#8A1538] group-hover:text-[#1F2937]">
                    <Target className="h-8 w-8 text-current" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-2xl font-bold text-[#1F2937] transition-colors duration-300 group-hover:text-[#5B0F26]">
                      Mission
                    </h3>
                    <div className="space-y-3 text-lg leading-relaxed text-[#4B5563] transition-colors duration-300 group-hover:text-[#4B5563]">
                      <p className="flex items-start gap-2">
                        <span>👉</span>
                        <span>
                          To provide transparent, reliable, and student-focused
                          guidance for MBBS aspirants
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span>👉</span>
                        <span>
                          To connect students with globally recognized medical
                          universities in Qatar
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span>👉</span>
                        <span>
                          To ensure a smooth, stress-free admission journey
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group rounded-[2rem] border border-transparent bg-white/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#E5E7EB] hover:bg-white/60 hover:shadow-xl">
                <div className="flex items-start space-x-6">
                  <div className="rounded-2xl bg-white p-4 transition-all duration-300 group-hover:bg-[#8A1538] group-hover:text-[#1F2937]">
                    <Rocket className="h-8 w-8 text-current" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-2xl font-bold text-[#1F2937] transition-colors duration-300 group-hover:text-[#5B0F26]">
                      Vision
                    </h3>
                    <p className="text-lg leading-relaxed text-[#4B5563] transition-colors duration-300 group-hover:text-[#4B5563]">
                      To become the most trusted and comprehensive platform for
                      MBBS admissions in Qatar, empowering students from every
                      country to achieve their dreams of becoming medical
                      professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-[#5B0F26] p-10 text-white shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="pointer-events-none absolute inset-0 bg-[#F9FAFB]/15 via-transparent to-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <GraduationCap className="w-32 h-32" />
            </div>
            <h3 className="relative mb-2 flex items-center gap-3 text-3xl font-bold text-white">
              What Makes Us Different ?
            </h3>
            <p className="relative mb-8 text-slate-300 text-lg">
              Unlike general study abroad consultants, we are 100% focused on
              Qatar medical education.
            </p>

            <div className="relative grid gap-6">
              {[
                {
                  title: "Qatar-Focused Expertise",
                  points: [
                    "Deep knowledge of medical universities, curriculum, and clinical exposure",
                    "Updated information on NMC, WHO, ECFMG eligibility",
                  ],
                },
                {
                  title: "Verified Universities Only",
                  points: [
                    "We work with approved and recognized medical colleges",
                    "Focus on institutions offering strong hospital training",
                  ],
                },
                {
                  title: "Transparent Process",
                  points: [
                    "No hidden charges",
                    "Clear fee breakdown",
                    "Honest university comparison",
                  ],
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start space-x-4 rounded-2xl border border-[#E5E7EB] bg-[#FAF8F7] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#F9FAFB] hover:shadow-xl hover:shadow-black/20"
                >
                  <CheckCircle className="h-6 w-6 shrink-0 text-green-400 mt-1" />
                  <div>
                    <h4 className="text-xl font-bold text-[#1F2937] mb-3">
                      {item.title}
                    </h4>
                    <ul className="space-y-2">
                      {item.points.map((p, i) => (
                        <li
                          key={i}
                          className="text-[#4B5563] text-[15px] leading-relaxed opacity-90 flex items-start gap-2"
                        >
                          <span className="text-green-400/60 mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#8A1538] font-bold text-sm uppercase tracking-widest bg-white px-4 py-1.2 rounded-full mb-4 inline-block">
              Support Services
            </span>
            <h2 className="text-4xl font-black text-[#1F2937] mt-4">
              We Guide You at Every Step
            </h2>
            <p className="text-[#6B7280] mt-4 max-w-2xl mx-auto text-lg">
              From initial university selection to your graduation day, our
              dedicated team provides continuous support across borders.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#E5E7EB] hover:shadow-2xl"
              >
                <div className="pointer-events-none absolute inset-0 bg-[#F9FAFB]/10 via-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white transition-colors duration-500 group-hover:bg-[#8A1538]">
                      <service.icon className="h-7 w-7 text-[#8A1538] transition-colors duration-500 group-hover:text-[#1F2937]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1F2937] transition-colors duration-300 group-hover:text-[#5B0F26] leading-tight">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#4B5563] transition-colors duration-300 group-hover:text-[#4B5563]">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialSection testimonials={testimonials} />

      {/* Why Qatar - Generic */}
      <div className="bg-[#FAF8F7] py-16 border-y border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-8">
            <span className="text-4xl text-[#8A1538] font-bold">
              {dynamicStats.experienceYears}
            </span>
          </div>
          <h2 className="text-4xl font-black text-[#1F2937] mb-6 underline decoration-blue-600/20 underline-offset-8">
            {dynamicStats.experienceYears.replace("+", "")} Years of Excellence
            in Education Consulting
          </h2>
          <p className="text-xl text-[#4B5563] leading-relaxed mb-10">
            mbbsinqatar.com is a specialized education consultancy focused
            exclusively on medical admissions in Qatar. We were the first to
            establish <strong>direct official partnerships</strong> with top
            Qatar medical universities for international students.
          </p>
          <p className="text-lg text-[#6B7280] italic max-w-3xl mx-auto">
            &quot;Our mission has always been to simplify the complex world of
            international medical admissions, making premium education
            accessible to students of all backgrounds globally.&quot;
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white text-[#1F2937] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black mb-6  text-[#1F2937]">
            Ready to Start Your MBBS Journey?
          </h2>
          <p className="text-[#4B5563] text-xl mb-12 font-light">
            Join the global community of students pursuing their medical careers
            in Qatar. Get personalized guidance from our experts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact-us"
              className="bg-[#5B0F26] text-white hover:bg-[#5B0F26] font-bold px-12 py-5 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" /> Call Us
            </Link>
            <Link
              href="/universities"
              className="border border-[#8A1538] text-[#8A1538] hover:bg-[#8A1538] hover:text-white font-bold px-12 py-5 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Explore Universities <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
