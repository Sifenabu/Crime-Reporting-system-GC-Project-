import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReactQueryProvider } from "../providers";
import AiChatButton from "@/components/AiChatButton";
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adama City Police - Crime Report System",
  description:
    "Report crimes anonymously, track investigations, and stay informed with real-time safety updates from the Adama City Police Department.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ReactQueryProvider>
          <SiteHeader />
          <main className="min-h-screen">{children}</main>
          <AiChatButton />
          <SiteFooter />
          <Analytics />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
