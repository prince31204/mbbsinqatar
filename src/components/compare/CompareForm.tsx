"use client";

interface UniOption {
  id: number;
  name: string;
}

interface Props {
  all: UniOption[];
  selectedIds: number[];
}

export default function CompareForm({ all, selectedIds }: Props) {
  const handleCompare = () => {
    const ids = [0, 1, 2]
      .map(
        (i) => (document.getElementById(`u${i}`) as HTMLSelectElement)?.value,
      )
      .filter(Boolean);
    window.location.href = `/compare?ids=${ids.join(",")}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow border border-[#E5E7EB] p-6">
      <h2 className="font-semibold text-[#1F2937] mb-4 text-lg">
        Select Universities
      </h2>
      <div className="flex flex-wrap gap-4 items-end">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 min-w-[200px]">
            <label
              htmlFor={`u${i}`}
              className="block text-xs font-semibold text-[#4B5563] mb-1.5 uppercase tracking-wide"
            >
              University {i + 1}
            </label>
            <select
              id={`u${i}`}
              defaultValue={selectedIds[i] || ""}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500 bg-white"
            >
              <option value="">— Select University —</option>
              {all.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={handleCompare}
          className="bg-[#8A1538] hover:bg-[#5B0F26] text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
        >
          Compare Now →
        </button>
      </div>
    </div>
  );
}
