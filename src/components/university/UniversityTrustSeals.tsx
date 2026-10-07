import { Shield, Globe, Award, CheckCircle } from "lucide-react";

interface Props {
  university: {
    embassyVerified: boolean | null;
    whoListed: boolean | null;
    nmcApproved: boolean | null;
    ministryLicensed: boolean | null;
    faimerListed: boolean | null;
    mciRecognition: boolean | null;
    ecfmgEligible: boolean | null;
  };
}

export default function UniversityTrustSeals({ university }: Props) {
  const seals = [
    {
      icon: Shield,
      title: "Embassy Verified",
      subtitle: "Internationally Verified",
      desc: "Verified by diplomatic missions and recognized for international student admissions.",
      badge: "VERIFIED",
      grad: " ",
      badgeCls: "bg-[#F7E9EE] text-green-800",
      active: university.embassyVerified,
    },
    {
      icon: Globe,
      title: "WHO Listed",
      titleHref: "https://www.who.int/",
      subtitle: "World Health Organization",
      desc: "Listed in the WHO World Directory of Medical Schools.",
      badge: "LISTED",
      grad: " ",
      badgeCls: "bg-[#F9FAFB] text-[#5B0F26]",
      active: university.whoListed,
    },
    {
      icon: Award,
      title: "Globally Accredited",
      subtitle: "International Medical Council",
      desc: "Accredited for international students to practice medicine worldwide.",
      badge: "APPROVED",
      grad: " ",
      badgeCls: "bg-purple-100 text-purple-800",
      active: university.nmcApproved,
    },
    {
      icon: CheckCircle,
      title: "Ministry Licensed",
      subtitle: "Government of Qatar",
      desc: "Licensed by the Ministry of Education & Science, Qatar.",
      badge: "LICENSED",
      grad: " ",
      badgeCls: "bg-orange-100 text-orange-800",
      active: university.ministryLicensed,
    },
  ];
  const additional = [
    {
      abbr: "FAIMER",
      label: "FAIMER Listed",
      desc: "Foundation for Advancement of International Medical Education — global directory of medical schools.",
      grad: " ",
      border: "border-t-red-500",
      active: university.faimerListed,
    },
    {
      abbr: "WFME",
      label: "WFME Recognized",
      desc: "World Federation for Medical Education — standards-compliant institution for quality assurance.",
      grad: " ",
      border: "border-t-red-500",
      active: university.mciRecognition,
    },
    {
      abbr: "ECFMG",
      label: "ECFMG Eligible",
      desc: "Educational Commission for Foreign Medical Graduates — US clinical practice pathway eligible.",
      grad: " ",
      border: "border-t-purple-500",
      active: university.ecfmgEligible,
    },
  ];

  const activeSeals = seals.filter((s) => s.active);
  const activeAdditional = additional.filter((r) => r.active);

  if (activeSeals.length === 0 && activeAdditional.length === 0) return null;

  return (
    <section className="py-16 bg-[#FAF8F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
            Trust &amp; Recognition
          </h2>
          <p className="text-xl text-[#4B5563] max-w-3xl mx-auto">
            Our university holds prestigious accreditations ensuring your degree
            is globally accepted.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-7">
          {seals
            .filter((s) => s.active)
            .map((seal) => (
              <div
                key={seal.title}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#E5E7EB]"
              >
                <div className="text-center">
                  <div
                    className={`w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br ${seal.grad} flex items-center justify-center shadow-lg`}
                  >
                    <seal.icon className="h-10 w-10 text-[#1F2937]" />
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${seal.badgeCls}`}
                  >
                    {seal.badge}
                  </span>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-1">
                    {seal.titleHref ? (
                      <a
                        href={seal.titleHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#5B0F26] hover:underline transition-colors"
                      >
                        {seal.title}
                      </a>
                    ) : (
                      seal.title
                    )}
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-2">{seal.subtitle}</p>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {seal.desc}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {additional.some((r) => r.active) && (
          <div className="mt-10">
            <div className="text-center mb-8">
              <span className="inline-block bg-[#F9FAFB] text-[#5B0F26] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
                Global Standards
              </span>
              <h3 className="text-2xl font-bold text-[#1F2937]">
                Additional Recognitions
              </h3>
              <p className="text-[#6B7280] text-sm mt-1">
                Our university maintains high standards recognized globally
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {additional
                .filter((r) => r.active)
                .map((r) => (
                  <div
                    key={r.label}
                    className={`bg-white rounded-2xl border border-[#E5E7EB] border-t-4 ${r.border} shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col gap-4`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`bg-gradient-to-br ${r.grad} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0`}
                      >
                        <span className="text-[#1F2937] font-black text-xs tracking-tight text-center leading-tight px-1">
                          {r.abbr}
                        </span>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F7E9EE] text-[#5B0F26]">
                        ✓ Recognized
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F2937] text-base">
                        {r.label}
                      </h4>
                      <p className="text-[#6B7280] text-sm mt-1 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
