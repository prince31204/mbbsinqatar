import Link from "next/link";
import {
  FileText,
  Award,
  Globe,
  Shield,
  CheckCircle,
  Download,
} from "lucide-react";
import { cdn } from "@/lib/cdn";
import BrochureButton from "@/components/university/BrochureButton";

interface Props {
  university: {
    name: string;
    brochurePath: string | null;
    nmcGuidelinesPath: string | null;
    embassyLetterPath: string | null;
    universityLicensePath: string | null;
    aggregationLetterPath: string | null;
  };
}

export default function UniversityDocuments({ university }: Props) {
  const hasDocuments =
    university.brochurePath ||
    university.nmcGuidelinesPath ||
    university.embassyLetterPath ||
    university.universityLicensePath ||
    university.aggregationLetterPath;
  if (!hasDocuments) return null;

  return (
    <section className="py-14 bg-[#FFFDF9] border-y border-[#E5E7EB] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#F9FAFB] rounded-full -translate-y-1/2 translate-x-1/2 hidden md:block" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F9FAFB] rounded-full translate-y-1/2 -translate-x-1/2 hidden md:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block bg-[#F9FAFB] text-[#BC002D] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border border-[#E5E7EB]">
            Official Documents
          </span>
          <h2 className="text-3xl font-extrabold text-[#17202A] mb-1">
            Download Resources
          </h2>
          <p className="text-[#4B5563] text-sm">
            All documents verified &amp; official
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {university.brochurePath && (
            <div className="group flex items-center gap-4 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-5 py-4 transition-all duration-300 hover:shadow-md cursor-pointer">
              <div className="bg-[#FFFDF9] group-hover:bg-[#102A43] transition-colors p-3 rounded-xl shrink-0 border border-[#E5E7EB] group-hover:border-[#102A43]">
                <FileText className="w-6 h-6 text-[#BC002D] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#17202A] text-sm">
                  University Brochure
                </p>
                <p className="text-[#4B5563] text-xs mt-0.5">
                  Fees, syllabus &amp; admission details
                </p>
              </div>
              <BrochureButton
                universityName={university.name}
                brochureUrl={cdn(university.brochurePath) ?? undefined}
                variant="download"
              />
            </div>
          )}

          {university.nmcGuidelinesPath && (
            <div className="group flex items-center gap-4 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-5 py-4 transition-all duration-300 hover:shadow-md cursor-pointer">
              <div className="bg-[#FFFDF9] group-hover:bg-[#102A43] transition-colors p-3 rounded-xl shrink-0 border border-[#E5E7EB] group-hover:border-[#102A43]">
                <Award className="w-6 h-6 text-[#BC002D] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#17202A] text-sm">
                  NMC Guidelines
                </p>
                <p className="text-[#4B5563] text-xs mt-0.5">
                  Official NMC advisory for MBBS abroad
                </p>
              </div>
              <BrochureButton
                universityName={university.name}
                brochureUrl={cdn(university.nmcGuidelinesPath) ?? undefined}
                label="NMC Guidelines"
                modalTitle="Download NMC Guidelines"
                modalDescription="Official NMC advisory for Indian students pursuing MBBS abroad."
                modalButtonText="Download"
                variant="download"
              />
            </div>
          )}

          {university.embassyLetterPath && (
            <div className="group flex items-center gap-4 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-5 py-4 transition-all duration-300 hover:shadow-md cursor-pointer">
              <div className="bg-[#FFFDF9] group-hover:bg-[#102A43] transition-colors p-3 rounded-xl shrink-0 border border-[#E5E7EB] group-hover:border-[#102A43]">
                <Globe className="w-6 h-6 text-[#BC002D] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#17202A] text-sm">
                  Embassy Letter
                </p>
                <p className="text-[#4B5563] text-xs mt-0.5">
                  Official embassy verification
                </p>
              </div>
              <a
                href={cdn(university.embassyLetterPath) ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 border-2 border-[#E5E7EB] text-[#BC002D] hover:bg-[#8F0023] hover:text-[#17202A] text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            </div>
          )}

          {university.universityLicensePath && (
            <div className="group flex items-center gap-4 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-5 py-4 transition-all duration-300 hover:shadow-md cursor-pointer">
              <div className="bg-[#FFFDF9] group-hover:bg-[#102A43] transition-colors p-3 rounded-xl shrink-0 border border-[#E5E7EB] group-hover:border-[#102A43]">
                <Shield className="w-6 h-6 text-[#BC002D] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#17202A] text-sm">
                  University License
                </p>
                <p className="text-[#4B5563] text-xs mt-0.5">
                  Ministry approved license
                </p>
              </div>
              <a
                href={cdn(university.universityLicensePath) ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 border-2 border-[#E5E7EB] text-[#BC002D] hover:bg-[#8F0023] hover:text-[#17202A] text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            </div>
          )}

          {university.aggregationLetterPath && (
            <div className="group flex items-center gap-4 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-5 py-4 transition-all duration-300 hover:shadow-md cursor-pointer">
              <div className="bg-[#FFFDF9] group-hover:bg-[#102A43] transition-colors p-3 rounded-xl shrink-0 border border-[#E5E7EB] group-hover:border-[#102A43]">
                <CheckCircle className="w-6 h-6 text-[#BC002D] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#17202A] text-sm">
                  Aggregation Letter
                </p>
                <p className="text-[#4B5563] text-xs mt-0.5">
                  Official grade aggregation doc
                </p>
              </div>
              <a
                href={cdn(university.aggregationLetterPath) ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 border-2 border-[#E5E7EB] text-[#BC002D] hover:bg-[#8F0023] hover:text-[#17202A] text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
