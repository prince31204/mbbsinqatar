"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile, Maximize2, Minimize2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Dynamically import CKEditor wrapper to avoid SSR issues
const CKEditorWrapper = dynamic(() => import("./CKEditorWrapper"), {
  ssr: false,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  toolbarSelector?: string; // Kept for backwards compatibility if passed, though we attached the toolbar in CKEditor
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  toolbarSelector,
}: RichTextEditorProps) {
  const [content, setContent] = useState(value);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [wordCount, setWordCount] = useState({ words: 0, characters: 0 });
  const editorInstance = useRef<any>(null);

  // Sync external value with internal state if it changes externally
  useEffect(() => {
    if (value !== content) {
      setContent(value);
    }
  }, [value]);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    if (editorInstance.current) {
      // In CKEditor 5, model is manipulated to insert content
      editorInstance.current.model.change((writer: any) => {
        const insertPosition =
          editorInstance.current.model.document.selection.getFirstPosition();
        writer.insertText(emojiData.emoji, insertPosition);
      });
    }
  };

  return (
    <div
      className={`rich-text-editor-wrapper bg-white rounded-md border border-[#E5E7EB] shadow-sm flex flex-col ${
        isFullScreen
          ? "fixed inset-0 z-[1000] !m-0 !rounded-none h-screen w-screen"
          : "relative"
      }`}
    >
      <div className="flex-grow overflow-hidden">
        <CKEditorWrapper
          value={content}
          placeholder={placeholder}
          toolbarSelector={toolbarSelector}
          fullScreen={isFullScreen}
          onWordCountUpdate={(stats) => setWordCount(stats)}
          onEditorReady={(editor) => {
            editorInstance.current = editor;
          }}
          onChange={(newContent) => {
            setContent(newContent);
            onChange(newContent);
          }}
        />
      </div>

      {/* Dedicated action bar below the editor to avoid obstructing the rich toolbar */}
      <div
        className={`flex justify-between items-center p-2 bg-[#FFFDF9] border-t border-[#E5E7EB] ${isFullScreen ? "h-[50px]" : ""}`}
      >
        <div className="flex items-center gap-4 pl-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280] font-medium">
              Rich Text Editor
            </span>
            {isFullScreen && (
              <span className="text-[10px] bg-[#F9FAFB] text-[#BC002D] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                Full Screen Mode
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#6B7280] font-medium border-l border-gray-300 pl-4">
            <span>{wordCount.words} Words</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{wordCount.characters} Characters</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="px-3 py-1.5 hover:bg-gray-200 rounded-md text-[#4B5563] transition-colors bg-white border border-gray-300 shadow-sm flex items-center gap-1.5 text-xs font-semibold"
          >
            {isFullScreen ? (
              <>
                <Minimize2 size={16} className="text-orange-500" /> Reduce
              </>
            ) : (
              <>
                <Maximize2 size={16} className="text-red-500" /> Full Screen
              </>
            )}
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="px-3 py-1.5 hover:bg-gray-200 rounded-md text-[#4B5563] transition-colors bg-white border border-gray-300 shadow-sm flex items-center gap-1.5 text-xs font-semibold"
              >
                <Smile size={16} className="text-red-500" /> Insert Emoji
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-none shadow-xl"
              align="end"
              sideOffset={8}
            >
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
