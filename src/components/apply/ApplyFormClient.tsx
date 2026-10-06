"use client";

import dynamic from "next/dynamic";

const ApplyForm = dynamic(() => import("./ApplyForm"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-[#F9FAFB] rounded-xl" />
      ))}
    </div>
  ),
});

export default function ApplyFormClient() {
  return <ApplyForm />;
}
