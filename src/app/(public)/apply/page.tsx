// Server Component — no "use client" needed here
import { GraduationCap, CheckCircle, FileText } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import ApplyFormClient from "@/components/apply/ApplyFormClient";

export const metadata = buildMetadata({
  title: "Apply for MBBS in Japan — Free Counselling",
  description:
    "Apply directly to top Japan medical universities. No agency fees, expert guidance, response within 24 hours. Fill in the form to start your MBBS journey.",
  path: "/apply",
  entitySeo: {
    metaKeyword:
      "apply MBBS Japan, Japan medical university application, MBBS admission Japan",
  },
});

const NEXT_STEPS = [
  "Counsellor reviews your application",
  "We call you within 24 hours",
  "Receive personalised university shortlist",
  "Document check & admission letter",
  "Visa process & travel onboarding",
];

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      {/* Hero — pure Server Component HTML, no JS */}
      <div className="bg-[#102A43] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5 text-[#FCE8ED]">
            <GraduationCap size={16} /> Free Counselling · No Agency Fees
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight text-white">
            Apply Directly to
            <br className="hidden sm:block" /> the University
          </h1>
          <p className="text-[#FCE8ED] text-lg max-w-2xl mx-auto leading-relaxed">
            Complete your application below. No agency fees, direct admission
            process.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-[#FCE8ED]">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-white" /> Free expert guidance
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-white" /> No hidden fees
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-white" /> Response within 24 hrs
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Form — loaded dynamically as Client Component */}
          <div className="lg:col-span-2">
            <ApplyFormClient />
          </div>

          {/* Sidebar — pure Server Component HTML */}
          <div className="space-y-5 lg:sticky lg:top-6">
            <div className="bg-sky-500 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-lg shrink-0">
                  <FileText size={18} className="text-white" />
                </div>
                <h3 className="font-bold text-white">NMC Guidelines</h3>
              </div>
              <p className="text-white/90 text-xs mb-4 leading-relaxed">
                Official NMC advisory for students pursuing MBBS abroad.
              </p>
              <a
                href="/brochures/nmc-advisory.pdf"
                download
                className="flex items-center justify-center gap-2 bg-white text-sky-500 font-semibold text-sm py-2.5 rounded-xl hover:bg-white/90 transition-colors"
              >
                <FileText size={15} /> Download PDF
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
              <h3 className="font-bold text-[#17202A] mb-4">
                What Happens Next?
              </h3>
              <ol className="space-y-3">
                {NEXT_STEPS.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[#4B5563]"
                  >
                    <span className="bg-[#BC002D] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
