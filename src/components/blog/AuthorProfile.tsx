import React from "react";
import Image from "next/image";
import { Linkedin, Twitter, Award, ExternalLink } from "lucide-react";
import { ExpertProfile } from "@/data/experts";

interface AuthorProfileProps {
  profile: ExpertProfile;
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({ profile }) => {
  return (
    <section className="mt-16 border-t border-[#E5E7EB] pt-12 pb-8">
      <div className="bg-[#FAF8F7] to-white rounded-3xl p-8 border border-[#E5E7EB] shadow-sm relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9FAFB]/5 rounded-full hidden -mr-16 -mt-16" />

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          {/* Photo Container */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 border-2 border-[#E5E7EB] shadow-md">
              <Image
                src={
                  profile.photoPath ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=ef4444&color=fff&size=200`
                }
                alt={profile.name}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#8A1538] text-white p-1.5 rounded-lg shadow-sm border border-[#E5E7EB]">
              <Award className="w-4 h-4" />
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div>
                <h4 className="text-xl font-bold text-[#1F2937]">
                  {profile.name}
                </h4>
                <p className="text-[#8A1538] font-semibold text-sm uppercase tracking-wider">
                  {profile.designation}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white border border-[#E5E7EB] rounded-xl text-[#8A1538] hover:bg-white transition-colors shadow-sm"
                    title="View LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {profile.twitterUrl && (
                  <a
                    href={profile.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white border border-[#E5E7EB] rounded-xl text-sky-500 hover:bg-sky-50 transition-colors shadow-sm"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            <p className="text-[#4B5563] leading-relaxed max-w-3xl mb-6">
              {profile.bio}
            </p>

            {/* Expertise Chips */}
            <div className="flex flex-wrap gap-2">
              {profile.expertise.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-white border border-[#E5E7EB] text-[#6B7280] text-xs font-medium rounded-full shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Proof Panel */}
        <div className="mt-8 pt-6 border-t border-[#E5E7EB] bg-white/50 -mx-8 -mb-8 px-8 flex items-center justify-between text-xs text-[#6B7280]">
          <span>Verified Expert Contributor</span>
          <span className="flex items-center gap-1">
            MBBS in Qatar Authority Certification{" "}
            <Award className="w-3 h-3 text-[#8A1538]" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default AuthorProfile;
