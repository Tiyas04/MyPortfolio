"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STAGES = [
  { threshold: 0,  label: "DRAGOON G... AWAKENING",   sub: "> BIT-BEAST: DETECTED" },
  { threshold: 20, label: "SPIN POWER: CHARGING",      sub: "> ENERGY: RISING" },
  { threshold: 40, label: "BIT-BEAST: ONLINE",         sub: "> DRAGOON: RESPONDING" },
  { threshold: 60, label: "BLADE: LOCKED",             sub: "> ROTATION: MAXIMUM" },
  { threshold: 80, label: "LAUNCHING...",              sub: "> LET IT RIP: IMMINENT" },
  { threshold: 100, label: "SYSTEM READY.",            sub: "> LET IT RIP!" },
];

function getCurrentStage(progress: number) {
  let stage = STAGES[0];
  for (const s of STAGES) {
    if (progress >= s.threshold) stage = s;
  }
  return stage;
}

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [dragonVisible, setDragonVisible] = useState(false);

  useEffect(() => {
    // Dragon rises at 30%
    const dragonTimer = setTimeout(() => setDragonVisible(true), 1500);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 45);

    return () => {
      clearInterval(interval);
      clearTimeout(dragonTimer);
    };
  }, []);

  const stage = getCurrentStage(progress);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden selection:bg-none"
      style={{ background: "#060a14" }}
    >
      {/* 1. Stadium ring background — faint concentric rings */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 55%, rgba(96,165,250,0.06) 0%, rgba(96,165,250,0.03) 30%, transparent 65%)"
        }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full border border-blue-500/8 pointer-events-none"
        style={{ transform: "translate(-50%, -50%)", borderStyle: "dashed" }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 w-[580px] h-[580px] rounded-full border border-amber-400/6 pointer-events-none"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* 2. Corner blade motifs */}
      <div className="absolute top-6 left-6 w-14 h-14 border-t-2 border-l-2 border-blue-400/40 pointer-events-none rounded-tl-sm" />
      <div className="absolute top-6 right-6 w-14 h-14 border-t-2 border-r-2 border-blue-400/40 pointer-events-none rounded-tr-sm" />
      <div className="absolute bottom-6 left-6 w-14 h-14 border-b-2 border-l-2 border-amber-400/30 pointer-events-none rounded-bl-sm" />
      <div className="absolute bottom-6 right-6 w-14 h-14 border-b-2 border-r-2 border-amber-400/30 pointer-events-none rounded-br-sm" />

      {/* 3. Side stats — beyblade themed */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 font-mono text-[10px] text-blue-400/40 tracking-widest pointer-events-none hidden sm:flex">
        <span className="animate-pulse">RPM: {Math.round(progress * 120)}</span>
        <span>SPIN: <span className="text-blue-300/70">ACTIVE</span></span>
        <span>BLADE: DRAGOON-G</span>
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 font-mono text-[10px] text-amber-400/40 tracking-widest text-right pointer-events-none hidden sm:flex">
        <span>PWR: {progress.toString().padStart(3, "0")}%</span>
        <span>STAT: RISING</span>
        <span>BIT-BEAST: ON</span>
      </div>

      {/* 4. Main center content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6 sm:max-w-xl sm:px-8">

        {/* Blade + Dragon stack */}
        <div className="relative flex justify-center items-end w-72 h-72 mb-10">

          {/* Energy aura rings behind everything */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-blue-400/30 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.25, 0, 0.25] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-blue-300/15 pointer-events-none"
          />

          {/* Spinning outer orbital ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: "2px solid transparent",
              borderTopColor: "rgba(96,165,250,0.6)",
              borderRightColor: "rgba(96,165,250,0.2)",
              borderBottomColor: "rgba(251,191,36,0.4)",
              borderLeftColor: "rgba(96,165,250,0.2)",
            }}
          />
          {/* Inner spinning ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-52 h-52 rounded-full pointer-events-none"
            style={{
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              border: "1px dashed rgba(251,191,36,0.3)",
            }}
          />

          {/* Spinning Dragoon blade */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-28 z-20"
          >
            <Image
              src="/Dragoon-blade-image.webp"
              alt="Dragoon Blade spinning"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(96,165,250,0.9)]"
            />
          </motion.div>

          {/* Dragon rising from behind the blade */}
          {dragonVisible && (
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.75 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 w-44 h-44 z-10"
            >
              <Image
                src="/Dragoon-image.webp"
                alt="Dragoon G bit-beast awakening"
                fill
                className="object-contain drop-shadow-[0_0_30px_rgba(96,165,250,0.7)]"
              />
            </motion.div>
          )}

          {/* Core energy glow */}
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full pointer-events-none z-5"
            style={{
              background: "radial-gradient(circle, rgba(96,165,250,0.5) 0%, rgba(96,165,250,0) 70%)",
            }}
          />
        </div>

        {/* Progress display */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-end w-full">
            {/* Stage label */}
            <div className="flex flex-col">
              <span className="font-mono text-blue-400/50 text-[10px] uppercase tracking-[0.3em] mb-1">
                Battle Status
              </span>
              <motion.span
                key={stage.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="font-russo text-blue-300 tracking-[0.2em] text-sm md:text-base uppercase"
                style={{ textShadow: "0 0 12px rgba(96,165,250,0.8)" }}
              >
                {stage.label}
              </motion.span>
            </div>
            {/* Power percentage */}
            <div className="flex flex-col items-end">
              <span className="font-mono text-amber-400/50 text-[10px] uppercase tracking-widest mb-1">
                Power
              </span>
              <span className="font-russo text-amber-300 text-3xl md:text-4xl font-bold leading-none"
                style={{ textShadow: "0 0 15px rgba(251,191,36,0.8)" }}>
                {progress.toString().padStart(2, "0")}<span className="text-amber-500/60 text-xl ml-1">%</span>
              </span>
            </div>
          </div>

          {/* Stadium-style segmented progress bar */}
          <div className="w-full flex gap-1 h-2 md:h-2.5 bg-[#0a0f1e] p-0.5 rounded-sm border border-blue-900/50">
            {[...Array(20)].map((_, i) => {
              const threshold = (i + 1) * 5;
              const isActive = progress >= threshold;
              const isGold = i >= 16; // last 4 segments turn gold
              return (
                <div
                  key={i}
                  className={`flex-1 h-full rounded-[1px] transition-all duration-75 ${
                    isActive
                      ? isGold
                        ? "bg-amber-400"
                        : "bg-blue-400"
                      : "bg-blue-950/50"
                  }`}
                  style={isActive ? {
                    boxShadow: isGold
                      ? "0 0 10px rgba(251,191,36,0.9)"
                      : "0 0 10px rgba(96,165,250,0.8)"
                  } : {}}
                />
              );
            })}
          </div>

          {/* Bit-beast terminal log */}
          <div className="mt-2 font-mono text-[10px] md:text-xs text-blue-400/60 h-14 w-full flex flex-col justify-end overflow-hidden relative border-l-2 border-blue-500/30 pl-3">
            <motion.div
              key={Math.floor(progress / 20)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="tracking-wider flex flex-col gap-1"
            >
              {progress < 20 && <p>&gt; BIT-BEAST: <span className="text-blue-300">DETECTED</span></p>}
              {progress >= 20 && progress < 40 && (
                <>
                  <p className="opacity-40">&gt; BIT-BEAST: DETECTED</p>
                  <p>&gt; SPIN ENERGY: <span className="text-blue-300">RISING</span></p>
                </>
              )}
              {progress >= 40 && progress < 60 && (
                <>
                  <p className="opacity-40">&gt; SPIN ENERGY: RISING</p>
                  <p>&gt; DRAGOON: <span className="text-blue-300">AWAKENED</span></p>
                </>
              )}
              {progress >= 60 && progress < 80 && (
                <>
                  <p className="opacity-40">&gt; DRAGOON: AWAKENED</p>
                  <p>&gt; BLADE LOCKED: <span className="text-amber-400">LOADED</span></p>
                </>
              )}
              {progress >= 80 && progress < 100 && (
                <>
                  <p className="opacity-40">&gt; BLADE LOCKED: LOADED</p>
                  <p>&gt; LAUNCHING... <span className="animate-pulse text-blue-300">IN PROGRESS</span></p>
                </>
              )}
              {progress === 100 && (
                <>
                  <p className="opacity-40">&gt; LAUNCHING... DONE</p>
                  <p className="text-amber-300 font-bold" style={{ textShadow: "0 0 8px rgba(251,191,36,0.8)" }}>
                    &gt; ⚡ LET IT RIP! ⚡
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
