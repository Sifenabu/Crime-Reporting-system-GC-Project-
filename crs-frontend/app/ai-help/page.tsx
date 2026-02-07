// app/ai-help/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIHelpPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant for the Adama City Police portal. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // const sendMessage = async () => {
  //   if (!input.trim() || loading) return;

  //   const userMessage = { role: "user" as const, content: input };
  //   setMessages((prev) => [...prev, userMessage]);
  //   setInput("");
  //   setLoading(true);

  //   try {
  //     const res = await fetch("http://localhost:4000/api/ai/public", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ query: input }),
  //     });

  //     const data = await res.json();
  //     const assistantMessage = {
  //       role: "assistant" as const,
  //       content: data.response || "Sorry, I couldn't process that.",
  //     };
  //     setMessages((prev) => [...prev, assistantMessage]);
  //   } catch (err) {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "assistant",
  //         content: "Error connecting to AI. Please try again later.",
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input; // Capture input before clearing
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/ai/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentInput }),
      });

      const data = await res.json();
      console.log("Debug - AI Response:", data);

      // Check if the backend returned an error object instead of a response
      if (data.error) {
        // If the model fails again, we see the error clearly
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ AI Service Note: ${data.error}`,
          },
        ]);
      } else {
        // Success!
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Network error: Could not reach the AI server. Please check your connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card className="h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-blue-600" />
            AI Assistant - Public Help
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ask about safety notices, reporting procedures, or general questions
          </p>
        </CardHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-4",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-lg px-4 py-3 rounded-lg",
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    You
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-lg">
                  <p>Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-4"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
