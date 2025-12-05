import type { Metadata } from "next";
import "./globals.css";

import data from "@/data/portfolio.json";
import { resolveImagePath } from "@/utils/image";

export async function generateMetadata(): Promise<Metadata> {
  const { siteSettings } = data;
  return {
    title: siteSettings?.appName || "Portfolio",
    description: "Portfolio",
    icons: {
      icon: siteSettings?.favicon ? resolveImagePath(siteSettings.favicon) : "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
