"use client";

import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";

export default function AiChatButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/ai-help")}
      className="
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-blue-600 hover:bg-blue-700
        text-white shadow-lg
        transition-all duration-200
      "
      aria-label="Open AI Assistant"
    >
      <Bot size={24} />
    </button>
  );
}
