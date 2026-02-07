// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "./providers";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Adama City Police - Crime Report System",
  description: "Report crimes anonymously, track investigations...",
  // ... your metadata
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
