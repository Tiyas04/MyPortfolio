"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function KaiBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Base background image — G-Revolution arena */}
      <div className="absolute inset-0">
        <Image
          src="/beyblade-g-revolution-background-image.webp"
          alt=""
          fill
          className="object-cover object-center opacity-15"
          priority
          aria-hidden
        />
      </div>

      {/* 2. Deep obsidian overlay — Black Dranzer dark flame base */}
      <div className="absolute inset-0 bg-[#07050a]/85" />

      {/* 3. Kai Beystadium arena rings — Crimson & Gold concentric spinning rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-red-500/10 pointer-events-none"
        style={{ borderStyle: "dashed" }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-amber-400/8 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-red-400/12 pointer-events-none"
        style={{
          borderTopColor: "rgba(239,68,68,0.28)",
          borderRightColor: "rgba(251,191,36,0.12)",
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-amber-400/15 pointer-events-none"
        style={{ borderStyle: "dashed" }}
      />

      {/* 4. Dark flame conic sweep */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full pointer-events-none blur-2xl"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(239,68,68,0.07) 30%, rgba(251,191,36,0.035) 50%, transparent 70%)",
        }}
      />

      {/* 5. Orbiting ember particles */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(239,68,68,1) 0%, rgba(239,68,68,0) 70%)",
              boxShadow: "0 0 12px 4px rgba(239,68,68,0.65)",
            }}
          />
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-[480px] h-[480px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(251,191,36,1) 0%, rgba(251,191,36,0) 70%)",
              boxShadow: "0 0 10px 3px rgba(251,191,36,0.55)",
            }}
          />
        </motion.div>
      </div>

      {/* 6. Central Black Dranzer energy core glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.32, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(239,68,68,0.2) 0%, rgba(251,191,36,0.05) 50%, transparent 70%)",
        }}
      />

      {/* 7. Soft radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 0%, rgba(7,5,10,0.45) 55%, rgba(7,5,10,0.94) 100%)",
        }}
      />

      {/* 8. Ambient ember glow at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

