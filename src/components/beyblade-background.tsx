"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function BeybladeBackground() {
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

      {/* 2. Deep navy overlay to darken and unify */}
      <div className="absolute inset-0 bg-[#060a14]/80" />

      {/* 3. Beystadium arena rings — multiple concentric spinning rings */}
      {/* Outer ring — slow clockwise */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-blue-500/8 pointer-events-none"
        style={{ borderStyle: "dashed" }}
      />
      {/* Second ring — counter-clockwise */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-amber-400/6 pointer-events-none"
      />
      {/* Third ring — clockwise, medium speed */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-blue-400/10 pointer-events-none"
        style={{ borderTopColor: "rgba(96,165,250,0.25)", borderRightColor: "rgba(96,165,250,0.05)" }}
      />
      {/* Inner core ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-blue-300/15 pointer-events-none"
        style={{ borderStyle: "dashed" }}
      />

      {/* 4. Conic radar sweep — electric blue energy, slow rotation */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full pointer-events-none blur-2xl"
        style={{
          background: "conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(96,165,250,0.06) 30%, rgba(251,191,36,0.03) 50%, transparent 70%)"
        }}
      />

      {/* 5. Orbiting energy particle — small glowing dot on circular path */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(96,165,250,1) 0%, rgba(96,165,250,0) 70%)",
              boxShadow: "0 0 12px 4px rgba(96,165,250,0.6)",
            }}
          />
        </motion.div>
      </div>

      {/* Second orbiting particle — amber/gold, opposite direction */}
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
              boxShadow: "0 0 10px 3px rgba(251,191,36,0.5)",
            }}
          />
        </motion.div>
      </div>

      {/* 6. Central energy core glow — the "bit-beast" heart */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(96,165,250,0.18) 0%, rgba(96,165,250,0.05) 50%, transparent 70%)",
        }}
      />

      {/* 7. Soft radial vignette — keep foreground readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 0%, rgba(6,10,20,0.4) 55%, rgba(6,10,20,0.92) 100%)"
        }}
      />

      {/* 8. Ambient golden glow on bottom — stadium lights effect */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(251,191,36,0.06) 0%, transparent 70%)"
        }}
      />
    </div>
  );
}

