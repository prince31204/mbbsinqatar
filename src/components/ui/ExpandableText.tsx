"use client";

import { useState } from "react";

interface Props {
  text: string;
  wordLimit?: number;
  className?: string;
}

export default function ExpandableText({
  text,
  wordLimit = 60,
  className = "",
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const words = text.trim().split(/\s+/);
  const shouldTruncate = words.length > wordLimit;
  const displayText =
    shouldTruncate && !expanded
      ? words.slice(0, wordLimit).join(" ") + "…"
      : text;

  return (
    <div className={className}>
      <p className="text-[#4B5563] leading-relaxed">{displayText}</p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-[#BC002D] hover:text-[#102A43] font-medium text-sm transition-colors"
        >
          {expanded ? "Show Less ↑" : "Show More ↓"}
        </button>
      )}
    </div>
  );
}
