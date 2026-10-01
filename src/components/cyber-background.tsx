"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamic import with ssr: false for Three.js / WebGL canvas
const GridScan = dynamic(() => import("./GridScan"), {
  ssr: false,
});

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* 1. 3D React Bits GridScan Hologram in the portfolio's Teal Cyber Palette */}
      <div className="absolute inset-0 opacity-70">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#0d3833"
          gridScale={0.1}
          scanColor="#14b8a6"
          scanOpacity={0.4}
          enablePost={true}
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
          scanDirection="pingpong"
          scanDuration={3.0}
          scanDelay={1.5}
        />
      </div>

      {/* 2. Soft radial vignette mask to ensure all foreground typography and cards pop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_85%_at_50%_50%,transparent_0%,rgba(0,0,0,0.55)_60%,rgba(0,0,0,0.92)_100%)] pointer-events-none" />

      {/* 3. Subtle ambient rotating radar sweep glow */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(20,184,166,0.035)_35%,transparent_100%)] pointer-events-none blur-3xl"
      />
    </div>
  );
}
