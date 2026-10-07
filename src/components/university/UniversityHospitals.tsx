import { Stethoscope, MapPin, Home, CheckCircle } from "lucide-react";

interface Hospital {
  id: number;
  hospital: {
    name: string;
    city: string | null;
    beds: number | null;
    accreditation: string | null;
  };
}
interface Props {
  hospitals: Hospital[];
}

export default function UniversityHospitals({ hospitals }: Props) {
  if (hospitals.length === 0) return null;

  return (
    <section className="py-10 bg-[#FAF8F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7">
          <span className="inline-block bg-[#F9FAFB] text-[#5B0F26] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
            Clinical Training
          </span>
          <h2 className="text-4xl font-bold text-[#1F2937]">
            Affiliated Hospitals
          </h2>
          <p className="text-base text-[#6B7280] mt-2">
            World-class clinical training at top hospitals
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hospitals.map((uh) => (
            <div
              key={uh.id}
              className="bg-white border border-[#E5E7EB] border-t-4 border-t-[#5B0F26] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-[#F9FAFB] p-2.5 rounded-xl shadow-sm shrink-0 border border-[#E5E7EB]">
                  <Stethoscope className="w-5 h-5 text-[#5B0F26]" />
                </div>
                <h3 className="font-bold text-[#1F2937] text-base leading-snug pt-0.5">
                  {uh.hospital.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                {uh.hospital.city && (
                  <span className="flex items-center gap-1 bg-[#FAF8F7] border border-[#E5E7EB] text-[#6B7280] rounded-lg px-2.5 py-1">
                    <MapPin className="w-3 h-3 text-[#8A1538]" />
                    {uh.hospital.city}
                  </span>
                )}
                {uh.hospital.beds && (
                  <span className="flex items-center gap-1 bg-[#FAF8F7] border border-[#E5E7EB] text-[#6B7280] rounded-lg px-2.5 py-1">
                    <Home className="w-3 h-3 text-[#8A1538]" />
                    {uh.hospital.beds} beds
                  </span>
                )}
                {uh.hospital.accreditation && (
                  <span className="flex items-center gap-1 bg-[#F7E9EE] border border-green-100 text-[#5B0F26] rounded-lg px-2.5 py-1 font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    {uh.hospital.accreditation}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
