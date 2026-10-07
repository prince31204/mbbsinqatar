import { Star, Quote } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  designation: string | null;
  description: string | null;
  rating: any; // Decimal
  imagePath: string | null;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({
  testimonials,
}: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="bg-white py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#8A1538] font-bold text-sm uppercase tracking-widest bg-white px-4 py-1.5 rounded-full mb-4 inline-block">
            Student Success Stories
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-[#1F2937] mt-4 leading-tight">
            What Our Students Say
          </h2>
          <p className="text-[#6B7280] mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover the experiences of students who have embarked on their
            medical journey in Qatar with our guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full opacity-50 hidden pointer-events-none" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-orange-50 rounded-full opacity-50 hidden pointer-events-none" />

          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative bg-white rounded-[2.5rem] p-8 border border-[#E5E7EB] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#E5E7EB]"
            >
              <div className="absolute top-8 right-8 text-[#F7E9EE] group-hover:text-[#4B5563] transition-colors duration-500">
                <Quote className="w-12 h-12 rotate-180" />
              </div>

              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (Number(testimonial.rating) || 5)
                          ? "text-[#8A1538] fill-yellow-400"
                          : "text-[#4B5563]"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[#4B5563] text-lg leading-relaxed mb-8 italic">
                  &quot;{testimonial.description}&quot;
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white border-2 border-[#E5E7EB] shadow-md">
                    {testimonial.imagePath ? (
                      <Image
                        src={testimonial.imagePath}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8A1538] font-bold text-xl">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1F2937] text-lg group-hover:text-[#5B0F26] transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    {testimonial.designation && (
                      <p className="text-[#8A1538] text-sm font-medium">
                        {testimonial.designation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
