import { GraduationCap } from "lucide-react";

interface FmgeRate {
  id: number;
  year: number;
  appeared: number | null;
  passed: number | null;
  acceptance_rate: string | null;
  passPercentage: unknown;
  yoy_change: string | null;
}
interface Props {
  fmgeRates: FmgeRate[];
  fmgePassRate: any;
}

export default function UniversityFMGE({ fmgeRates, fmgePassRate }: Props) {
  return (
    <section className="py-10 bg-[#FAF8F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
            FMGE Success Rate
          </h2>
          <p className="text-base text-[#6B7280]">
            Year-on-year performance of graduates in the Foreign Medical
            Graduates Examination
          </p>
        </div>
        {fmgeRates.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full text-base">
              <thead>
                <tr className="bg-[#8A1538] text-white">
                  <th className="text-left p-5 font-semibold">Year</th>
                  <th className="text-right p-5 font-semibold">Appeared</th>
                  <th className="text-right p-5 font-semibold">Passed</th>
                  <th className="text-right p-5 font-semibold">Pass Rate</th>
                  <th className="text-right p-5 font-semibold">YoY Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fmgeRates.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF8F7]">
                    <td className="p-5 font-bold text-base">{r.year}</td>
                    <td className="p-5 text-right text-[#4B5563]">
                      {r.appeared ?? "—"}
                    </td>
                    <td className="p-5 text-right text-[#4B5563]">
                      {r.passed ?? "—"}
                    </td>
                    <td className="p-5 text-right">
                      {r.acceptance_rate ? (
                        <span className="text-[#5B0F26] font-bold text-lg">
                          {r.acceptance_rate}%
                        </span>
                      ) : r.passPercentage != null ? (
                        <span className="text-[#5B0F26] font-bold text-lg">
                          {String(Number(r.passPercentage))}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-5 text-right">
                      {r.yoy_change ? (
                        <span
                          className={`font-semibold text-base ${r.yoy_change.startsWith("-") ? "text-[#8A1538]" : "text-[#8A1538]"}`}
                        >
                          {r.yoy_change.startsWith("-") ? "" : "+"}
                          {r.yoy_change}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {fmgePassRate != null && (
          <div className="mt-8 bg-[#F7E9EE] border border-[#F7E9EE] rounded-2xl p-6 text-center">
            <p className="text-5xl font-black text-[#5B0F26] mb-2">
              {Number(fmgePassRate)}%
            </p>
            <p className="text-lg font-semibold text-[#1F2937]">
              Average FMGE Success Rate
            </p>
            <p className="text-[#4B5563] text-sm mt-1">
              Based on historical data from our graduates
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
