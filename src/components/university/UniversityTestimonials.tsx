import Image from "next/image";
import { Star, Quote, Users } from "lucide-react";
import { cdn } from "@/lib/cdn";

interface Testimonial {
  id: number;
  name: string | null;
  designation: string | null;
  course: string | null;
  imagePath: string | null;
  description: string | null;
  rating: unknown;
}
interface Props {
  testimonials: Testimonial[];
  universityName: string;
  rating: any;
  parentSatisfaction: any;
}

export default function UniversityTestimonials({
  testimonials,
  universityName,
  rating,
  parentSatisfaction,
}: Props) {
  if (testimonials.length === 0 && !rating && !parentSatisfaction) return null;
  return (
    <section className="py-10 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-2">
            What Parents Say About Us
          </h2>
          <p className="text-base text-[#6B7280]">
            Hear from parents of our international students about their
            experience.
          </p>
        </div>

        {testimonials.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-[#E5E7EB]"
              >
                <div className="flex items-center space-x-3 mb-3">
                  {t.imagePath ? (
                    <Image
                      src={cdn(t.imagePath) || ""}
                      alt={t.name || "Parent"}
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-10 h-10 border-2 border-[#E5E7EB] shadow"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center text-[#8A1538] font-bold text-base border-2 border-[#E5E7EB] shadow">
                      {(t.name || "P")[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#1F2937] text-sm">
                      {t.name || "Anonymous"}
                    </p>
                    {t.designation && (
                      <p className="text-xs text-[#8A1538] font-medium">
                        {t.designation}
                      </p>
                    )}
                    {t.course && (
                      <p className="text-xs text-[#6B7280]">{t.course}</p>
                    )}
                  </div>
                </div>
                <Quote className="w-5 h-5 text-[#8A1538] mb-2" />
                <p className="text-[#4B5563] leading-relaxed italic text-sm">
                  &ldquo;{t.description}&rdquo;
                </p>
                {t.rating != null && (
                  <div className="flex items-center gap-0.5 mt-3 pt-3 border-t border-[#E5E7EB]">
                    {[...Array(Math.round(Number(t.rating)))].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 text-[#8A1538] fill-current"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {(parentSatisfaction || rating) && (
          <div className="mt-12 bg-[#5B0F26] rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Join Our Family of Satisfied Parents
            </h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
              {parentSatisfaction && (
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded-full">
                    <Users className="h-5 w-5 text-[#8A1538]" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#1F2937]">Parent Satisfaction</p>
                    <p className="text-[#4B5563]">
                      {Number(parentSatisfaction)}% Positive Feedback
                    </p>
                  </div>
                </div>
              )}
              {rating && (
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded-full">
                    <Star className="h-5 w-5 text-[#8A1538]" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#1F2937]">Average Rating</p>
                    <p className="text-[#4B5563]">{Number(rating)}/5 Stars</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
