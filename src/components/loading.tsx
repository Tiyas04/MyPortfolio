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
                {/* Outer electric blue glowing ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-400 border-r-amber-400/50 rounded-full absolute"
                />

                {/* Inner reverse spinning ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-2 border-blue-500/20 border-b-blue-300 rounded-full absolute"
                />

                {/* Center glowing energy core */}
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                />
            </div>

            {/* Loading text */}
            <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mt-6 font-russo text-xs text-blue-400 tracking-[0.3em]"
            >
                {text}
            </motion.p>
        </div>
    );
}
