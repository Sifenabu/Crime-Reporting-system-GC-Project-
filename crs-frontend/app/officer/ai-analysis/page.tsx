"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrainCircuit, Send, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminAIAnalysis() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Intelligence System Online. I can analyze internal crime reports and statistics. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom ONLY when a NEW message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const syncData = async () => {
    setIsSyncing(true);
    try {
      const token = localStorage.getItem("officerToken");
      const res = await fetch("http://localhost:4000/api/ai/index-private", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) toast.success("Private Data Synced Successfully!");
      else throw new Error("Sync failed");
    } catch (err) {
      toast.error("Failed to sync database.");
    } finally {
      setIsSyncing(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. How else can I help you with the data?",
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input;
    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("officerToken");
      const res = await fetch("http://localhost:4000/api/ai/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: userQuery }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response || data.error || "I couldn't process that analysis.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection Error." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-6xl mx-auto p-4 md:p-6 space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-blue-600" />
            AI Intelligence Analysis
          </h1>
          <p className="text-sm text-muted-foreground">
            Internal Police Data RAG System
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-muted-foreground hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={syncData}
            disabled={isSyncing}
            className="rounded-xl border-blue-200"
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync DB
          </Button>
        </div>
      </div>

      {/* Main Chat Card */}
      <Card className="flex-1 flex flex-col min-h-0 shadow-2xl border-none rounded-[2rem] overflow-hidden bg-white">
        {/* SCROLLABLE AREA: This part allows you to see all previous chats */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-5 rounded-[1.5rem] shadow-sm whitespace-pre-wrap break-words ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none"
                  }`}
                >
                  <div className="text-sm leading-relaxed font-medium">
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] rounded-tl-none shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
            {/* This invisible div stays at the bottom to guide the auto-scroll */}
            <div ref={scrollRef} className="h-2" />
          </div>
        </ScrollArea>

        {/* STICKY INPUT AREA: This stays at the bottom while you scroll the chat */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">
          <div className="flex gap-3">
            <Input
              placeholder="Type your follow-up query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="h-12 md:h-14 rounded-2xl border-slate-200 px-6 focus-visible:ring-blue-600 bg-slate-50/50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-blue-900 hover:bg-blue-800 shrink-0 transition-transform active:scale-95 shadow-lg shadow-blue-900/20"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-3">
            AI can make mistakes. Please verify critical case data with the
            official records.
          </p>
        </div>
      </Card>
    </div>
  );
}
