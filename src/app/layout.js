import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import content from "@/data/content.json";

export async function generateMetadata() {
  return {
    title: `${content.hero.title} - Portfolio`,
    description: "Full Stack Developer & UI/UX Enthusiast",
    icons: {
      icon: content.hero.image,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
