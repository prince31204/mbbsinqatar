import { HelpCircle, ChevronRight } from "lucide-react";

interface Faq {
  id: number;
  question: string;
  answer: string;
}
interface Props {
  universityName: string;
  faqs: Faq[];
}

export default function UniversityFAQs({ universityName, faqs }: Props) {
  if (faqs.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-[#4B5563]">
            Everything you need to know about studying at {universityName}
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group border border-[#E5E7EB] rounded-2xl overflow-hidden"
            >
              <summary className="flex justify-between items-center p-5 cursor-pointer font-semibold text-[#1F2937] hover:bg-[#FAF8F7] transition-colors list-none">
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-[#8A1538] shrink-0" />
                  {faq.question}
                </span>
                <ChevronRight className="w-5 h-5 text-[#6B7280] group-open:rotate-90 transition-transform shrink-0 ml-3" />
              </summary>
              <div className="px-5 pb-5 pt-2 text-[#4B5563] leading-relaxed border-t border-[#E5E7EB] bg-[#FAF8F7]">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
