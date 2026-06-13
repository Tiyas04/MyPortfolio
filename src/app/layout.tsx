import type { Metadata } from "next";
import { Geist, Geist_Mono, Audiowide } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/custom-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const audiowide = Audiowide({
  weight: "400",
  variable: "--font-audiowide",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Portfolio | Tiyas",
  description:"Portfolio of Tiyas, a MERN Stack Developer and B.Tech student at NIT Rourkela. Explore projects, technical skills, achievements, and experience in web development, software engineering, and competitive programming.",
   icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  keywords: [
    "Tiyas",
    "MERN Stack Developer",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "MongoDB",
    "Express.js",
    "JavaScript",
    "TypeScript",
    "Web Developer",
    "Software Engineer",
    "NIT Rourkela",
    "Portfolio",
    "Competitive Programming",
    "Data Structures and Algorithms",
    "Frontend Developer",
    "Backend Developer",
  ],

  authors: [{ name: "Tiyas" }],
  creator: "Tiyas",
  publisher: "Tiyas",

  openGraph: {
    title: "Portfolio | Tiyas",
    description:
      "Explore the portfolio of Tiyas showcasing full-stack web development projects, technical expertise, achievements, and professional experience.",
    url: "tiyasm.vercel.app",
    siteName: "Portfolio | Tiyas",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://res.cloudinary.com/dajgjkv5h/image/upload/v1776277120/xftrdfkra4uxpf2t0u9h.png",
        width: 1200,
        height: 630,
        alt: "Portfolio | Tiyas",
      },
    ],
  },

  metadataBase: new URL("https://tiyasm.vercel.app"),

  alternates: {
    canonical: "https://tiyasm.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${audiowide.variable} antialiased`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
