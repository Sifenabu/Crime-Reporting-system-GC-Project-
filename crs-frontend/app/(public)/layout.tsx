import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReactQueryProvider } from "../providers";
import AiChatButton from "@/components/AiChatButton";
import AiChatWidget from "@/components/ai-chat-widget";
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adama City Police - Crime Report System",
  description:
    "Report crimes anonymously, track investigations, and stay informed with real-time safety updates from the Adama City Police Department.",
  generator: "Adama City Police",
  icons: {
    icon: [
      {
        url: "/police-logo.jpeg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/police-logo.jpeg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/police-logo.ico",
        type: "image/svg+xml",
      },
    ],
    apple: "/police-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <SiteHeader />
      <main className="min-h-screen">{children}</main>
      {/* <AiChatButton /> */}
      <AiChatWidget />
      <SiteFooter />
      <Analytics />
    </ReactQueryProvider>
  );
}
