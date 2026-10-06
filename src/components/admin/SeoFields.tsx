"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";
import { OgImagePicker } from "./OgImagePicker";

type SeoFieldsProps = {
  values: {
    metaTitle?: string;
    metaKeyword?: string;
    metaDescription?: string;
    ogImagePath?: string;
    schema?: string;
  };
  onChange: (field: string, value: string) => void;
  hideOgImage?: boolean;
};

export function SeoFields({ values, onChange, hideOgImage }: SeoFieldsProps) {
  const [open, setOpen] = useState(false);

  const titleLen = values.metaTitle?.length ?? 0;
  const descLen = values.metaDescription?.length ?? 0;

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-between px-4 py-3 h-auto text-left border-dashed"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-[#4B5563]">
          <Search size={15} className="text-red-500" />
          SEO Settings
          {!open && values.metaTitle && (
            <span className="text-xs text-[#6B7280] font-normal truncate max-w-[200px]">
              — {values.metaTitle}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={16} className="text-[#6B7280]" />
        ) : (
          <ChevronDown size={16} className="text-[#6B7280]" />
        )}
      </Button>
      {open && (
        <div className="mt-3 p-4 bg-white/40 border border-[#E5E7EB] rounded-xl space-y-4">
          {/* Meta Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-[#4B5563]">
                Meta Title
              </Label>
              <span
                className={`text-xs ${titleLen > 60 ? "text-[#BC002D]" : "text-[#6B7280]"}`}
              >
                {titleLen}/60
              </span>
            </div>
            <Input
              value={values.metaTitle ?? ""}
              onChange={(e) => onChange("metaTitle", e.target.value)}
              placeholder="Enter SEO title (50-60 chars recommended)"
              className="bg-white"
            />
          </div>

          {/* Meta Keywords */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#4B5563]">
              Meta Keywords
            </Label>
            <Input
              value={values.metaKeyword ?? ""}
              onChange={(e) => onChange("metaKeyword", e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
              className="bg-white"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-[#4B5563]">
                Meta Description
              </Label>
              <span
                className={`text-xs ${descLen > 160 ? "text-[#BC002D]" : "text-[#6B7280]"}`}
              >
                {descLen}/160
              </span>
            </div>
            <Textarea
              value={values.metaDescription ?? ""}
              onChange={(e) => onChange("metaDescription", e.target.value)}
              placeholder="Enter meta description (150-160 chars recommended)"
              className="bg-white resize-none"
              rows={3}
            />
          </div>

          {/* OG Image Picker */}
          {!hideOgImage && (
            <div className="pt-2 border-t border-[#E5E7EB]">
              <OgImagePicker
                value={values.ogImagePath ?? ""}
                onChange={(v) => onChange("ogImagePath", v)}
                label="Social / OG Image"
              />
            </div>
          )}

          {/* Schema (JSON-LD) */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#4B5563]">
              JSON-LD Schema
            </Label>
            <Textarea
              value={values.schema ?? ""}
              onChange={(e) => onChange("schema", e.target.value)}
              placeholder='{"@context":"https://schema.org","@type":"..."}'
              className="bg-white resize-none font-mono text-xs"
              rows={4}
            />
          </div>
        </div>
      )}
    </div>
  );
}
