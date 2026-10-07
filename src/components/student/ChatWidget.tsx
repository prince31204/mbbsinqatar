"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Minimize2,
  Phone,
} from "lucide-react";
import { replaceCurrencySymbol } from "@/lib/currency";

interface ChatMessage {
  id: string;
  message: string;
  isFromSupport: boolean;
  timestamp: string;
}

const getAutoResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();
  if (msg.includes("application") || msg.includes("apply")) {
    return "I can help with your application! You can track your inquiry status in the 'Applied Colleges' section. What specific help do you need?";
  }
  if (msg.includes("document") || msg.includes("upload")) {
    return "Ensure all documents are in PDF format and clearly legible. Required documents typically include 10+2 marksheet, NEET scorecard, and passport. Need help with a specific document?";
  }
  if (msg.includes("visa")) {
    return "Once you get an admission offer, our team will guide you through the Qatar student visa process. It typically takes 4–6 weeks. Want to know more?";
  }
  if (msg.includes("fee") || msg.includes("cost") || msg.includes("tuition")) {
    return replaceCurrencySymbol(
      "Tuition fees in Qatar are very affordable — typically $3,000–$5,000/year. Total cost of MBBS including accommodation is usually $25,000–$35,000. Want details for a specific university?",
    );
  }
  if (msg.includes("neet") || msg.includes("eligibility")) {
    return "For MBBS in Qatar, you need NEET qualification (minimum qualifying percentile) and 50% in PCB (Physics, Chemistry, Biology) in 10+2. Specific cutoffs vary by university.";
  }
  if (
    msg.includes("contact") ||
    msg.includes("counsellor") ||
    msg.includes("call")
  ) {
    return "Our counsellors are available Mon–Sat, 9am–7pm IST. You can reach us at our Contact page or we'll call you after you submit an inquiry!";
  }
  if (msg.includes("status")) {
    return "Check your inquiry status anytime in the 'Applied Colleges' section of your dashboard. Our team typically responds within 24 hours.";
  }
  return "Thanks for your message! I'm here to help with questions about MBBS in Qatar — fees, eligibility, universities, visa, or the application process. How can I assist you today?";
};

export default function StudentChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message:
        "Hello! 👋 I'm here to help with your MBBS Qatar journey. Ask me anything about fees, eligibility, universities, or the admission process!",
      isFromSupport: true,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      message: text,
      isFromSupport: false,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const supportMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: getAutoResponse(text),
        isFromSupport: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, supportMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Floating button
  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#8A1538] hover:bg-[#5B0F26] text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 z-40"
        aria-label="Open support chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  // Minimized bar
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-[#8A1538] text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-2 z-40 hover:bg-[#5B0F26] transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Support Chat</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[480px] bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] flex flex-col z-40 overflow-hidden">
      {/* Header */}
      <div className="bg-[#8A1538] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#5B0F26] rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-none">
              MBBS Qatar Support
            </p>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Typically replies instantly
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-[#5B0F26] rounded transition-colors"
            aria-label="minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-[#5B0F26] rounded transition-colors"
            aria-label="close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="px-3 py-2 border-b border-[#E5E7EB] flex gap-1.5 overflow-x-auto scrollbar-none">
        {["Fees", "Eligibility", "Visa", "NEET"].map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="shrink-0 text-xs bg-[#F9FAFB] hover:bg-white hover:text-[#5B0F26] text-[#4B5563] rounded-full px-3 py-1 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.isFromSupport ? "justify-start" : "justify-end"}`}
          >
            {msg.isFromSupport && (
              <div className="w-7 h-7 bg-[#F9FAFB] rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-[#8A1538]" />
              </div>
            )}
            <div className={`max-w-[78%]`}>
              <div
                className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.isFromSupport ? "bg-[#F9FAFB] text-[#1F2937] rounded-tl-none" : "bg-[#8A1538] text-white rounded-tr-none"}`}
              >
                {msg.message}
              </div>
              <p className="text-[10px] text-[#6B7280] mt-1 px-1">
                {formatTime(msg.timestamp)}
              </p>
            </div>
            {!msg.isFromSupport && (
              <div className="w-7 h-7 bg-[#F9FAFB] rounded-full flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-[#4B5563]" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 bg-[#F9FAFB] rounded-full flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-[#8A1538]" />
            </div>
            <div className="bg-[#F9FAFB] px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#E5E7EB]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type your question..."
            className="flex-1 text-sm border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-9 h-9 bg-[#8A1538] hover:bg-[#5B0F26] disabled:opacity-40 text-[#1F2937] rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
