"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [matrixText, setMatrixText] = useState("");

  useEffect(() => {
    // 5000ms / 100 = 50ms per tick
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });

      // Update background data stream text
      setMatrixText(
        Math.random().toString(36).substring(2, 10).toUpperCase() + 
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );
    }, 45); 

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#050505] overflow-hidden selection:bg-none"
    >
      {/* 1. Subtle Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.05)_1px,transparent_1px)] bg-size-[50px_50px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      {/* 2. Radar/Data Sweep Glow */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(20,184,166,0.07)_40%,transparent_100%)] pointer-events-none blur-xl"
      />

      {/* 3. Corner Targeting HUD */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-teal-500/40 pointer-events-none" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-teal-500/40 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-teal-500/40 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-teal-500/40 pointer-events-none" />

      {/* 4. Random Data Streams on Sides */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 font-mono text-[10px] text-teal-500/30 tracking-widest hidden md:flex pointer-events-none">
        <span className="animate-pulse">SYS.MEM: {progress * 128}MB</span>
        <span>NET.UPLINK: <span className="text-teal-400">ACTIVE</span></span>
        <span>HASH: {matrixText.substring(0, 8)}</span>
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 font-mono text-[10px] text-teal-500/30 tracking-widest hidden md:flex text-right pointer-events-none">
        <span>SEQ: {progress.toString().padStart(3, '0')}</span>
        <span>LAT: 12ms</span>
        <span>SYNC: {matrixText.substring(8, 16)}</span>
      </div>

      {/* Main Center UI */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl px-8">
        
        {/* The 'T' Core Engine */}
        <div className="relative flex justify-center items-center w-72 h-72 mb-16">
          
          {/* Expanding Shockwaves */}
          <motion.div
            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-32 h-32 rounded-full border border-teal-400/40 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 3], opacity: [0.4, 0] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-32 h-32 rounded-full border border-teal-400/20 pointer-events-none"
          />

          {/* Intricate Orbital Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-full h-full rounded-full border-[1px] border-teal-500/10 border-t-teal-400/60 border-b-teal-400/60 absolute pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-60 h-60 rounded-full border-2 border-dashed border-teal-500/20 absolute pointer-events-none"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 rounded-full border border-teal-400/30 absolute shadow-[inset_0_0_30px_rgba(20,184,166,0.15)] pointer-events-none"
          />

          {/* The Glitching 'T' */}
          <div className="relative z-20 flex justify-center items-center">
            {/* Base T */}
            <span className="font-audiowide text-[120px] font-bold text-teal-300 drop-shadow-[0_0_40px_rgba(20,184,166,1)] leading-none select-none">
              T
            </span>
            
            {/* Chromatic Aberration / Glitch layers */}
            <motion.span 
              animate={{ x: [-3, 3, -3], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 0.1, repeat: Infinity, repeatType: "mirror" }}
              className="absolute font-audiowide text-[120px] font-bold text-cyan-400 opacity-50 mix-blend-screen pointer-events-none leading-none select-none ml-2"
            >
              T
            </motion.span>
            <motion.span 
              animate={{ x: [3, -3, 3], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror" }}
              className="absolute font-audiowide text-[120px] font-bold text-teal-600 opacity-50 mix-blend-screen pointer-events-none leading-none select-none -ml-2"
            >
              T
            </motion.span>

            {/* Intense Core Flare */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-20 h-20 bg-teal-300/30 rounded-full blur-xl pointer-events-none mix-blend-screen"
            />
          </div>
        </div>

        {/* Progress Display */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col">
              <span className="font-mono text-teal-500/50 text-[10px] md:text-xs uppercase tracking-[0.3em] mb-1">
                System Status
              </span>
              <motion.span 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="font-audiowide text-teal-400 tracking-[0.4em] text-sm md:text-base uppercase drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]"
              >
                {progress < 100 ? "Initializing..." : "System Ready."}
              </motion.span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono text-teal-500/50 text-[10px] md:text-xs uppercase tracking-widest mb-1">
                Load
              </span>
              <span className="font-audiowide text-teal-300 text-3xl md:text-4xl font-bold leading-none drop-shadow-[0_0_15px_rgba(20,184,166,0.8)]">
                {progress.toString().padStart(2, '0')}<span className="text-teal-500/60 text-xl md:text-2xl ml-1">%</span>
              </span>
            </div>
          </div>

          {/* Segmented Tech Progress Bar */}
          <div className="w-full flex gap-1 h-2 md:h-2.5 bg-gray-900/50 p-1 rounded-sm border border-gray-800">
            {[...Array(20)].map((_, i) => {
              const threshold = (i + 1) * 5;
              const isActive = progress >= threshold;
              return (
                <div 
                  key={i} 
                  className={`flex-1 h-full rounded-[1px] transition-all duration-75 ${
                    isActive 
                      ? 'bg-teal-400 shadow-[0_0_12px_rgba(20,184,166,1)]' 
                      : 'bg-gray-800/50'
                  }`} 
                />
              );
            })}
          </div>

          {/* Data log terminal output */}
          <div className="mt-4 font-mono text-[10px] md:text-xs text-teal-500/70 h-16 w-full flex flex-col justify-end overflow-hidden relative border-l-2 border-teal-500/30 pl-3">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={Math.floor(progress / 20)} 
              className="tracking-wider flex flex-col gap-1"
            >
              {progress < 20 && <p>&gt; BOOT_SEQ_INIT... <span className="text-teal-300">OK</span></p>}
              {progress >= 20 && progress < 40 && (
                <>
                  <p className="opacity-50">&gt; BOOT_SEQ_INIT... OK</p>
                  <p>&gt; MOUNTING_VFS... <span className="text-teal-300">OK</span></p>
                </>
              )}
              {progress >= 40 && progress < 60 && (
                <>
                  <p className="opacity-50">&gt; MOUNTING_VFS... OK</p>
                  <p>&gt; RESOLVING_DEPENDENCIES... <span className="text-teal-300">OK</span></p>
                </>
              )}
              {progress >= 60 && progress < 80 && (
                <>
                  <p className="opacity-50">&gt; RESOLVING_DEPENDENCIES... OK</p>
                  <p>&gt; ESTABLISHING_UPLINK... <span className="text-yellow-400">ENCRYPTED</span></p>
                </>
              )}
              {progress >= 80 && progress < 100 && (
                <>
                  <p className="opacity-50">&gt; ESTABLISHING_UPLINK... ENCRYPTED</p>
                  <p>&gt; BYPASSING_FIREWALL... <span className="animate-pulse text-teal-300">IN PROGRESS</span></p>
                </>
              )}
              {progress === 100 && (
                <>
                  <p className="opacity-50">&gt; BYPASSING_FIREWALL... DONE</p>
                  <p className="text-teal-300 font-bold drop-shadow-[0_0_5px_rgba(20,184,166,0.8)]">&gt; SYSTEM_ONLINE. WELCOME.</p>
                </>
              )}
            </motion.div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
