"use client";

import { Download } from "lucide-react";
import { useDownloadModal } from "@/lib/modalContext";

interface Props {
  universityName: string;
  brochureUrl?: string;
  label?: string;
  modalTitle?: string;
  modalButtonText?: string;
  modalDescription?: string;
  /** "hero" = yellow outlined (hero section), "download" = yellow outlined compact (download cards), "card" = red compact (default) */
  variant?: "hero" | "download" | "card";
}

export default function BrochureButton({
  universityName,
  brochureUrl,
  label,
  modalTitle,
  modalButtonText,
  modalDescription,
  variant = "card",
}: Props) {
  const { openModal } = useDownloadModal();
  const effectiveBrochureUrl = brochureUrl;

  const btnCls =
    variant === "hero"
      ? "border-2 border-white text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-white hover:text-[#5B0F26] transition-all duration-200 text-sm"
      : variant === "download"
        ? "shrink-0 inline-flex items-center gap-1.5 border-2 border-[#5B0F26] text-[#5B0F26] hover:bg-[#5B0F26] hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 whitespace-nowrap"
        : "flex items-center gap-1.5 border-2 border-[#5B0F26] text-[#5B0F26] hover:bg-[#5B0F26] hover:text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition-all duration-200 whitespace-nowrap";

  const disabled = !effectiveBrochureUrl;

  return (
    <button
      id="download-brochure-btn"
      suppressHydrationWarning
      onClick={() => {
        if (!disabled)
          openModal(
            universityName,
            effectiveBrochureUrl,
            modalTitle,
            modalButtonText,
            modalDescription,
          );
      }}
      className={`${btnCls} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      disabled={disabled}
    >
      <Download className={variant === "hero" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      <span>
        {label ?? (variant === "hero" ? "Download Brochure" : "Download")}
      </span>
    </button>
  );
}
