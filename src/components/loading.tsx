"use client";

import { motion } from "framer-motion";

interface LoadingProps {
    text?: string;
    className?: string;
}

export default function Loading({ text = "LOADING...", className = "py-24" }: LoadingProps) {
    return (
        <div className={`flex flex-col justify-center items-center w-full ${className}`}>
            <div className="relative flex justify-center items-center w-16 h-16">
                {/* Outer glowing ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-2 border-teal-500/20 border-t-teal-400 rounded-full absolute"
                />

                {/* Inner reverse spinning ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-2 border-teal-500/20 border-b-teal-300 rounded-full absolute"
                />

                {/* Center glowing dot */}
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.8)]"
                />
            </div>

            {/* Loading text */}
            <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mt-6 font-audiowide text-xs text-teal-400 tracking-[0.3em]"
            >
                {text}
            </motion.p>
        </div>
    );
}