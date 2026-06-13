"use client";

import { motion } from "framer-motion";

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 1. Subtle Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.05)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      {/* 2. Radar/Data Sweep Glow */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(20,184,166,0.05)_40%,transparent_100%)] pointer-events-none blur-2xl"
      />
    </div>
  );
}
