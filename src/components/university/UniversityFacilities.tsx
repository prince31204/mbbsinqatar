import Image from "next/image";
import {
  Microscope,
  BookOpen,
  Home,
  Utensils,
  Wifi,
  Car,
  Building2,
} from "lucide-react";
import { cdn } from "@/lib/cdn";

interface Facility {
  id: number;
  facilityId: number;
  description: string | null;
  thumbnailPath: string | null;
  facility: { name: string } | null;
}

interface Props {
  facilities: Facility[];
}

const iconMap: Record<number, React.ElementType> = {
  1: Microscope,
  2: BookOpen,
  3: Home,
  4: Utensils,
  5: Wifi,
  6: Car,
};
const FALLBACK =
  "https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?auto=compress&w=600";

export default function UniversityFacilities({ facilities }: Props) {
  return (
    <section id="facilities" className="py-10 bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-[#17202A] mb-2">
            World-Class Facilities
          </h2>
          <p className="text-base text-[#6B7280] max-w-3xl mx-auto">
            Modern campus facilities designed to give medical students the best
            learning environment.
          </p>
        </div>

        {facilities.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {facilities.map((uf) => {
              const IconComponent = iconMap[uf.facilityId] || Microscope;
              return (
                <div
                  key={uf.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-[#F9FAFB] p-1.5 rounded-lg shrink-0">
                        <IconComponent className="h-4 w-4 text-[#BC002D]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#17202A] leading-tight">
                        {uf.facility?.name || "Facility"}
                      </h3>
                    </div>
                    {uf.description && (
                      <p className="text-[#6B7280] text-xs leading-relaxed line-clamp-2">
                        {uf.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
