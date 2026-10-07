import Image from "next/image";
import {
  CreditCard,
  Award,
  BookOpen,
  Shield,
  CheckCircle,
  Globe,
  Microscope,
  Home,
  MapPin,
} from "lucide-react";
import { cdn } from "@/lib/cdn";

interface Props {
  university: {
    name: string;
    aboutNote: string | null;
    shortnote: string | null;
    section2Image: string | null;
    thumbnailPath: string | null;
    section2Title: string | null;
    section2Text: string | null;
    labs: number | null;
    lectureHall: number | null;
    hostelBuilding: number | null;
    campusArea: string | null;
    internationalRecognition: string | null;
    englishMedium: string | null;
  };
}

export default function UniversityAbout({ university }: Props) {
  const whyCards = [
    {
      icon: <CreditCard className="h-5 w-5 text-[#5B0F26]" />,
      title: "Affordable Education",
      desc: "Low tuition fees with transparent structure — no hidden costs or donations required.",
      show: true,
    },
    {
      icon: <Award className="h-5 w-5 text-[#5B0F26]" />,
      title: "International Recognition",
      desc:
        university.internationalRecognition ||
        "Degree recognized by WHO, FAIMER, WFME and international medical councils worldwide.",
      show: !!university.internationalRecognition,
    },
    {
      icon: <BookOpen className="h-5 w-5 text-[#5B0F26]" />,
      title: "Quality Education",
      desc: "World-class curriculum with modern teaching methods and experienced faculty.",
      show: true,
    },
    {
      icon: <Shield className="h-5 w-5 text-[#5B0F26]" />,
      title: "Safe Environment",
      desc: "Peaceful country with excellent support for international students at every step.",
      show: true,
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-[#5B0F26]" />,
      title: "No Donation / Capitation",
      desc: "Fully transparent admission. No hidden fees, no donations, no capitation required.",
      show: true,
    },
    {
      icon: <Globe className="h-5 w-5 text-[#5B0F26]" />,
      title: "English Medium",
      desc:
        university.englishMedium ||
        "Complete MBBS curriculum delivered in English by qualified international faculty.",
      show: !!university.englishMedium,
    },
  ].filter((card) => card.show);

  const campusStats = [
    {
      label: "Labs",
      value: university.labs,
      icon: <Microscope className="w-4 h-4" />,
    },
    {
      label: "Lecture Halls",
      value: university.lectureHall,
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      label: "Hostel Buildings",
      value: university.hostelBuilding,
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: "Campus Area",
      value: university.campusArea,
      icon: <MapPin className="w-4 h-4" />,
    },
  ].filter((s) => s.value);

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#F9FAFB] text-[#5B0F26] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            About The University
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1F2937] mb-5 leading-tight">
            {university.name}
          </h2>
          {(university.aboutNote || university.shortnote) && (
            <div
              className="prose max-w-none mx-auto text-[#6B7280] leading-relaxed text-left"
              dangerouslySetInnerHTML={{
                __html: university.aboutNote || university.shortnote || "",
              }}
            />
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-4 items-start">
          {/* Why Choose */}
          <div>
            <div className="mb-6">
              <span className="inline-block bg-[#F9FAFB] text-[#5B0F26] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2">
                Why Choose Us
              </span>
              <h3 className="text-3xl font-bold text-[#1F2937] mb-1">
                Why International Students Choose Us?
              </h3>
              <p className="text-[#6B7280] text-sm">
                Everything you need for a successful MBBS journey abroad.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {whyCards.map((item, i) => (
                <div
                  key={item.title}
                  className="relative group bg-white border border-[#E5E7EB] border-l-4 border-l-[#5B0F26] rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B0F26] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F9FAFB] p-2.5 rounded-xl shrink-0 shadow-sm border border-[#E5E7EB]">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#1F2937] text-sm leading-tight mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[#6B7280] text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Highlights */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#E5E7EB] sticky top-20">
            {(university.section2Image || university.thumbnailPath) && (
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={
                    cdn(university.section2Image || university.thumbnailPath) ||
                    "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800"
                  }
                  alt={university.section2Title || university.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
                <div className="absolute bottom-3 left-4">
                  <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/50">
                    Campus Highlights
                  </span>
                </div>
              </div>
            )}
            <div className="bg-[#5B0F26] p-6 relative overflow-hidden">
              <h4 className="text-xl font-bold text-white mb-2 relative z-10">
                {university.section2Title || `Why Choose ${university.name}?`}
              </h4>
              <p className="text-[#F8E9EB] leading-relaxed text-sm mb-5 relative z-10 line-clamp-3">
                {university.section2Text ||
                  "State-of-the-art laboratories, libraries, hostels, and clinical training facilities ensure an excellent learning environment."}
              </p>
              {campusStats.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 relative z-10">
                  {campusStats.map((s) => (
                    <div
                      key={s.label}
                      className="bg-white/10 hover:bg-white/20 transition-colors rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/20"
                    >
                      <div className="text-[#F8E9EB] shrink-0">{s.icon}</div>
                      <div>
                        <p className="text-white font-black text-lg leading-none">
                          {s.value}
                        </p>
                        <p className="text-[#F8E9EB] text-[10px] font-medium mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
