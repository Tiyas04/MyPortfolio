"use client";

import { motion } from "framer-motion";

export default function StadiumDivider() {
  return (
    <div
      className="relative w-full py-10 flex items-center justify-center overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 relative flex items-center justify-center">
        {/* Horizontal battle line */}
        <div
          className="w-full h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.25) 20%, rgba(96,165,250,0.75) 45%, rgba(251,191,36,0.6) 50%, rgba(96,165,250,0.75) 55%, rgba(59,130,246,0.25) 80%, transparent 100%)",
            boxShadow: "0 0 14px rgba(96,165,250,0.45)",
          }}
        />

        {/* Center Beystadium Arena Ring Emblem */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {/* Ambient radial glow */}
          <div
            className="absolute w-24 h-24 rounded-full blur-xl"
            style={{
              background:
                "radial-gradient(circle, rgba(96,165,250,0.28) 0%, rgba(251,191,36,0.08) 55%, transparent 75%)",
            }}
          />

          {/* Outer Beystadium Ring Arcs (Clockwise slow spin) */}
          <motion.svg
            width="76"
            height="76"
            viewBox="0 0 76 76"
            fill="none"
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="drop-shadow-[0_0_8px_rgba(96,165,250,0.65)]"
          >
            {/* Outer broken stadium walls */}
            <circle
              cx="38"
              cy="38"
              r="34"
              stroke="rgba(96,165,250,0.55)"
              strokeWidth="1.5"
              strokeDasharray="36 16"
              strokeLinecap="round"
            />
            {/* Inner concentric arena ridge */}
            <circle
              cx="38"
              cy="38"
              r="24"
              stroke="rgba(251,191,36,0.45)"
              strokeWidth="1.25"
              strokeDasharray="22 14"
              strokeLinecap="round"
            />
          </motion.svg>

          {/* Counter-rotating inner ring + center clash spark */}
          <motion.svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute"
          >
            <circle
              cx="18"
              cy="18"
              r="14"
              stroke="rgba(147,197,253,0.75)"
              strokeWidth="1.5"
              strokeDasharray="10 8"
            />
            <circle cx="18" cy="4" r="1.8" fill="#fbbf24" />
            <circle cx="18" cy="32" r="1.8" fill="#60a5fa" />
          </motion.svg>

          {/* Center core */}
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-blue-300"
            style={{
              boxShadow:
                "0 0 10px 2px rgba(96,165,250,0.9), 0 0 18px 4px rgba(251,191,36,0.35)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

