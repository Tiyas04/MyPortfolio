"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STAGES = [
  { threshold: 0, label: "BLACK DRANZER... AWAKENING", sub: "> BIT-BEAST: DETECTED" },
  { threshold: 20, label: "DARK FLAME: IGNITING", sub: "> HEAT: RISING" },
  { threshold: 40, label: "BIT-BEAST: KAI ONLINE", sub: "> DRANZER: RESPONDING" },
  { threshold: 60, label: "BLADE: LOCKED", sub: "> ROTATION: MAXIMUM" },
  { threshold: 80, label: "LAUNCHING DECK...", sub: "> LET IT RIP: IMMINENT" },
  { threshold: 100, label: "COMMAND READY.", sub: "> 🔥 LET IT RIP!" },
];

function getCurrentStage(progress: number) {
  let stage = STAGES[0];
  for (const s of STAGES) {
    if (progress >= s.threshold) stage = s;
  }
  return stage;
}

export default function KaiLoadingPage({ label = "Command Status" }: { label?: string }) {
  const [progress, setProgress] = useState(0);
  const [dranzerVisible, setDranzerVisible] = useState(false);

  useEffect(() => {
    // Rise Black Dranzer at ~1s into the 3.5s awakening sequence
    const dranzerTimer = setTimeout(() => setDranzerVisible(true), 900);

    // 32ms * 100 ≈ 3200ms so progress reaches 100% smoothly within 3.5s
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 32);

    return () => {
      clearInterval(interval);
      clearTimeout(dranzerTimer);
    };
  }, []);

  const stage = getCurrentStage(progress);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden selection:bg-none"
      style={{ background: "#07050a" }}
    >
      {/* 1. Crimson/Gold Arena Ring Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 55%, rgba(239,68,68,0.08) 0%, rgba(251,191,36,0.03) 35%, transparent 65%)",
        }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full border border-red-500/10 pointer-events-none"
        style={{ transform: "translate(-50%, -50%)", borderStyle: "dashed" }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 w-[580px] h-[580px] rounded-full border border-amber-400/8 pointer-events-none"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* 2. Corner blade motifs */}
      <div className="absolute top-6 left-6 w-14 h-14 border-t-2 border-l-2 border-red-500/45 pointer-events-none rounded-tl-sm" />
      <div className="absolute top-6 right-6 w-14 h-14 border-t-2 border-r-2 border-red-500/45 pointer-events-none rounded-tr-sm" />
      <div className="absolute bottom-6 left-6 w-14 h-14 border-b-2 border-l-2 border-amber-400/35 pointer-events-none rounded-bl-sm" />
      <div className="absolute bottom-6 right-6 w-14 h-14 border-b-2 border-r-2 border-amber-400/35 pointer-events-none rounded-br-sm" />

      {/* 3. Side stats — Kai / Black Dranzer themed */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-3 font-mono text-[10px] text-red-400/45 tracking-widest pointer-events-none hidden sm:flex">
        <span className="animate-pulse">RPM: {Math.round(progress * 135)}</span>
        <span>
          FLAME: <span className="text-red-300/80">ACTIVE</span>
        </span>
        <span>BLADE: BLACK-DRANZER</span>
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3 font-mono text-[10px] text-amber-400/45 tracking-widest text-right pointer-events-none hidden sm:flex">
        <span>PWR: {progress.toString().padStart(3, "0")}%</span>
        <span>BLADER: KAI</span>
        <span>BIT-BEAST: ON</span>
      </div>

      {/* 4. Main center content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6 sm:max-w-xl sm:px-8">
        {/* Blade + Black Dranzer stack */}
        <div className="relative flex justify-center items-end w-72 h-72 mb-10">
          {/* Energy shockwaves */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.45, 0, 0.45] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-red-500/35 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.25, 0, 0.25] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-amber-400/20 pointer-events-none"
          />

          {/* Spinning outer orbital ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: "2px solid transparent",
              borderTopColor: "rgba(239,68,68,0.7)",
              borderRightColor: "rgba(239,68,68,0.2)",
              borderBottomColor: "rgba(251,191,36,0.5)",
              borderLeftColor: "rgba(239,68,68,0.2)",
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            className="absolute w-52 h-52 rounded-full pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              border: "1px dashed rgba(251,191,36,0.35)",
            }}
          />

          {/* Spinning Black Dranzer blade */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-28 z-20"
          >
            <Image
              src="/black-dronzer-blade-image.webp"
              alt="Black Dranzer Blade spinning"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]"
              priority
            />
          </motion.div>

          {/* Black Dranzer rising from behind the blade */}
          {dranzerVisible && (
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.75 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 z-10"
            >
              <Image
                src="/black-dronzer-image.webp"
                alt="Black Dranzer awakening"
                fill
                className="object-contain drop-shadow-[0_0_32px_rgba(251,191,36,0.65)]"
                priority
              />
            </motion.div>
          )}

          {/* Core energy glow */}
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.12, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full pointer-events-none z-5"
            style={{
              background:
                "radial-gradient(circle, rgba(239,68,68,0.5) 0%, rgba(251,191,36,0.18) 45%, rgba(239,68,68,0) 70%)",
            }}
          />
        </div>

        {/* Progress display */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col">
              <span className="font-mono text-red-400/55 text-[10px] uppercase tracking-[0.3em] mb-1">
                {label}
              </span>
              <motion.span
                key={stage.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="font-russo text-red-400 tracking-[0.18em] text-sm md:text-base uppercase"
                style={{ textShadow: "0 0 12px rgba(239,68,68,0.8)" }}
              >
                {stage.label}
              </motion.span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono text-amber-400/55 text-[10px] uppercase tracking-widest mb-1">
                Power
              </span>
              <span
                className="font-russo text-amber-300 text-3xl md:text-4xl font-bold leading-none"
                style={{ textShadow: "0 0 15px rgba(251,191,36,0.8)" }}
              >
                {progress.toString().padStart(2, "0")}
                <span className="text-amber-500/60 text-xl ml-1">%</span>
              </span>
            </div>
          </div>

          {/* Segmented progress bar */}
          <div className="w-full flex gap-1 h-2 md:h-2.5 bg-[#0f0a12] p-0.5 rounded-sm border border-red-900/50">
            {[...Array(20)].map((_, i) => {
              const threshold = (i + 1) * 5;
              const isActive = progress >= threshold;
              const isGold = i >= 16;
              return (
                <div
                  key={i}
                  className={`flex-1 h-full rounded-[1px] transition-all duration-75 ${
                    isActive
                      ? isGold
                        ? "bg-amber-400"
                        : "bg-red-500"
                      : "bg-red-950/50"
                  }`}
                  style={
                    isActive
                      ? {
                          boxShadow: isGold
                            ? "0 0 10px rgba(251,191,36,0.9)"
                            : "0 0 10px rgba(239,68,68,0.85)",
                        }
                      : {}
                  }
                />
              );
            })}
          </div>

          {/* Terminal log */}
          <div className="mt-2 font-mono text-[10px] md:text-xs text-red-400/65 h-14 w-full flex flex-col justify-end overflow-hidden relative border-l-2 border-red-500/35 pl-3">
            <motion.div
              key={Math.floor(progress / 20)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="tracking-wider flex flex-col gap-1"
            >
              {progress < 20 && (
                <p>
                  &gt; BIT-BEAST: <span className="text-red-300">BLACK DRANZER DETECTED</span>
                </p>
              )}
              {progress >= 20 && progress < 40 && (
                <>
                  <p className="opacity-40">&gt; BIT-BEAST: BLACK DRANZER DETECTED</p>
                  <p>
                    &gt; DARK FLAME: <span className="text-red-300">IGNITING</span>
                  </p>
                </>
              )}
              {progress >= 40 && progress < 60 && (
                <>
                  <p className="opacity-40">&gt; DARK FLAME: IGNITING</p>
                  <p>
                    &gt; KAI HIWATARI: <span className="text-amber-300">SYNCHRONIZED</span>
                  </p>
                </>
              )}
              {progress >= 60 && progress < 80 && (
                <>
                  <p className="opacity-40">&gt; KAI HIWATARI: SYNCHRONIZED</p>
                  <p>
                    &gt; BLADE LOCKED: <span className="text-amber-400">LOADED</span>
                  </p>
                </>
              )}
              {progress >= 80 && progress < 100 && (
                <>
                  <p className="opacity-40">&gt; BLADE LOCKED: LOADED</p>
                  <p>
                    &gt; OPENING COMMAND DECK...{" "}
                    <span className="animate-pulse text-red-300">IN PROGRESS</span>
                  </p>
                </>
              )}
              {progress === 100 && (
                <>
                  <p className="opacity-40">&gt; OPENING COMMAND DECK... DONE</p>
                  <p
                    className="text-amber-300 font-bold"
                    style={{ textShadow: "0 0 8px rgba(251,191,36,0.8)" }}
                  >
                    &gt; 🔥 LET IT RIP! 🔥
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

