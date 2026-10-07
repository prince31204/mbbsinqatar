import { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  GraduationCap,
  Globe,
  Clock,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { buildMetadata, APP_YEAR } from "@/lib/seo";

interface PageProps {
  params: Promise<{ citySlug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  return buildMetadata({
    title: `MBBS in Qatar Counselling in ${city} | Admission Help ${APP_YEAR}`,
    description: `Looking for MBBS in Qatar admission from ${city}? Get expert counselling, university selection, and visa assistance for Indian students in ${city}.`,
    path: `/counselling/${citySlug}`,
  });
}

export default async function CityCounsellingPage({ params }: PageProps) {
  const { citySlug } = await params;
  const city = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-white text-[#1F2937] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#F9FAFB] px-4 py-2 rounded-full text-[#4B5563] text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" /> Leading MBBS Consultants in {city}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              MBBS in Qatar Admission Support for Students in {city}
            </h1>
            <p className="text-xl text-[#4B5563] mb-10 leading-relaxed">
              Join 200+ students from {city} who have successfully secured
              admission in top NMC-approved medical universities in Qatar. Get
              end-to-end support from documentation to arrival.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact-us"
                className="bg-white text-[#1F2937] px-8 py-4 rounded-xl font-bold hover:bg-white transition-all shadow-xl"
              >
                Book Free Appointment in {city}
              </Link>
              <Link
                href="/universities"
                className="bg-[#8A1538]/30 border border-[#E5E7EB] px-8 py-4 rounded-xl font-bold hover:bg-[#F9FAFB] transition-all"
              >
                View Universities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1F2937] mb-8">
                Why Choose Our {city} Counselling Center?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Direct University Tie-ups",
                    desc: "We represent Qatar's top government medical colleges directly.",
                  },
                  {
                    title: "Personalized Roadmap",
                    desc: "Guidance based on your NEET score, budget, and career preferences.",
                  },
                  {
                    title: "Full Documentation Support",
                    desc: "Apostille, translation, and visa invitation handling from {city}.",
                  },
                  {
                    title: "Education Loan Guidance",
                    desc: "Assistance with bank documentation for medical education loans.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle className="text-[#8A1538] w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1F2937] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[#4B5563] text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#FAF8F7] p-8 rounded-3xl border border-[#E5E7EB]">
                <div className="text-4xl font-bold text-[#8A1538] mb-2">10+</div>
                <div className="text-[#4B5563] font-medium">Years in {city}</div>
              </div>
              <div className="bg-[#FAF8F7] p-8 rounded-3xl border border-[#E5E7EB]">
                <div className="text-4xl font-bold text-[#8A1538] mb-2">
                  500+
                </div>
                <div className="text-[#4B5563] font-medium">{city} Students</div>
              </div>
              <div className="col-span-2 bg-white p-8 rounded-3xl border border-[#E5E7EB]">
                <h3 className="font-bold text-[#1F2937] mb-2 italic">
                  "The process from {city} was seamless. They handled everything
                  from my NEET check to my visa."
                </h3>
                <p className="text-[#5B0F26] text-sm">
                  — Current 3rd Year Student from {city}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Steps */}
      <section className="py-20 bg-[#FAF8F7]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">
            3 Simple Steps to Start from {city}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#8A1538] border border-[#E5E7EB] italic">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Initial Consultation</h3>
              <p className="text-[#4B5563] text-sm">
                Visit our locally or join a Zoom call for 1-on-1 guidance.
              </p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#8A1538] border border-[#E5E7EB] italic">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Document Submission</h3>
              <p className="text-[#4B5563] text-sm">
                Send your marks & NEET results for university pre-vetting.
              </p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#8A1538] border border-[#E5E7EB] italic">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Fly to Qatar</h3>
              <p className="text-[#4B5563] text-sm">
                Group departures from airports near {city} with our
                representatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-[3rem] p-12 text-[#1F2937] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8A1538]/20 rounded-full hidden -mr-32 -mt-32" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
              Start Your Admission from {city} Today
            </h2>
            <p className="text-[#6B7280] mb-10 text-lg relative z-10">
              Limited intakes for {APP_YEAR} session. Secure your MBBS seat at
              the lowest fee package now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                href="/contact-us"
                className="bg-[#8A1538] text-white px-10 py-5 rounded-2xl font-bold hover:bg-[#5B0F26] transition-all shadow-lg"
              >
                Get Call Back
              </Link>
              <Link
                href="tel:+919876543210"
                className="border-2 border-[#E5E7EB] text-[#1F2937] px-10 py-5 rounded-2xl font-bold hover:bg-[#F9FAFB] transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" /> Speak to Counselor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
