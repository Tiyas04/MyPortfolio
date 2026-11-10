"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import KaiBackground from "./kai-background";

interface KaiUploadShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function KaiUploadShell({ title, subtitle, children }: KaiUploadShellProps) {
  return (
    <div className="min-h-screen bg-[#07050a] text-gray-100 p-6 md:p-12 selection:bg-red-500/30 selection:text-white relative overflow-x-hidden">
      <KaiBackground />

      {/* Subtle Black Dranzer left-side floating guard */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed left-4 top-1/2 -translate-y-1/2 w-36 xl:w-44 opacity-15 pointer-events-none hidden lg:block z-0"
        style={{ filter: "drop-shadow(0 0 28px rgba(239,68,68,0.45))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/black-dronzer-image.webp" alt="" aria-hidden className="w-full h-auto object-contain" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Top bar — Back to Command Deck */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f0a12]/80 border border-red-500/25 hover:border-amber-400/60 text-xs font-mono font-bold text-gray-300 hover:text-amber-300 transition-all duration-200 hover:shadow-[0_0_16px_rgba(239,68,68,0.25)] group"
          >
            <ArrowLeft className="w-4 h-4 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
            Back to Command Deck
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/30 border border-red-500/25 text-[10px] font-mono text-red-400 uppercase tracking-widest">
            <Image
              src="/black-dronzer-blade-image.webp"
              alt=""
              width={14}
              height={14}
              className="w-3.5 h-3.5 object-contain animate-[beyblade-spin_6s_linear_infinite]"
            />
            Kai // Black Dranzer
          </div>
        </div>

        <header className="mb-10 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-2 font-russo tracking-wide"
            style={{
              backgroundImage: "linear-gradient(135deg, #f87171 0%, #ef4444 45%, #fbbf24 100%)",
              filter: "drop-shadow(0 0 18px rgba(239,68,68,0.35))",
            }}
          >
            {title}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">{subtitle}</p>
        </header>

        {children}
      </motion.div>
    </div>
  );
}

interface KaiLaunchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function KaiLaunchButton({
  loading = false,
  loadingText = "Launching...",
  children,
  className = "",
  disabled,
  ...props
}: KaiLaunchButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`relative px-8 py-3.5 rounded-xl font-bold text-gray-950 transition-all duration-300 flex items-center justify-center gap-2.5 group shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_32px_rgba(239,68,68,0.6),0_0_18px_rgba(251,191,36,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
        loading ? "cursor-wait" : ""
      } ${className}`}
      style={{
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 55%, #fbbf24 100%)",
      }}
      {...props}
    >
      <Image
        src="/black-dronzer-blade-image.webp"
        alt=""
        width={18}
        height={18}
        className={`w-4 h-4 object-contain transition-transform duration-500 ${
          loading
            ? "animate-[beyblade-spin_0.45s_linear_infinite]"
            : "group-hover:animate-[beyblade-spin_0.55s_linear_infinite]"
        }`}
      />
      <span>{loading ? loadingText : children}</span>

      <span
        className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-amber-400 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 whitespace-nowrap tracking-widest pointer-events-none"
        style={{ textShadow: "0 0 8px rgba(251,191,36,0.9)" }}
      >
        🔥 LET IT RIP!
      </span>
    </button>
  );
}

