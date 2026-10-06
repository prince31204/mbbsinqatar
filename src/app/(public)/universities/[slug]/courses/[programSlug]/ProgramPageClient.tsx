"use client";

import { Download } from "lucide-react";
import { useDownloadModal } from "@/lib/modalContext";

interface Props {
  brochureUrl?: string;
  universityName: string;
}

export default function ProgramPageClient({
  brochureUrl,
  universityName,
}: Props) {
  const { openModal } = useDownloadModal();

  return (
    <button
      onClick={() => openModal(universityName, brochureUrl)}
      className="border-2 border-white text-white hover:bg-[#102A43] hover:border-[#102A43] px-6 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Download Brochure
    </button>
  );
}
