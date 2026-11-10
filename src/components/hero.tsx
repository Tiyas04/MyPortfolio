"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative z-20 w-full bg-transparent text-white pt-10 md:pt-32 pb-8 px-6 md:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center min-h-[540px]">

                    {/* Left Section - Heading */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                        className="lg:col-span-1 relative z-20"
                    >
                        <h1 className="font-russo text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 text-left drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                            >
                                Hi
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-4xl md:text-5xl my-1 flex flex-wrap items-baseline gap-2"
                            >
                                <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">This is</span>
                                <span
                                    className="text-transparent bg-clip-text font-extrabold"
                                    style={{
                                        backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #fbbf24 100%)",
                                        filter: "drop-shadow(0 0 20px rgba(96,165,250,0.5))",
                                    }}
                                >
                                    Tiyas
                                </span>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="text-blue-400 text-2xl sm:text-3xl font-semibold tracking-wider"
                                style={{ textShadow: "0 0 20px rgba(96,165,250,0.5)" }}
                            >
                                Code. Spin. Win.
                            </motion.div>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-gray-300 text-sm leading-relaxed border-l-2 border-blue-500 pl-4 bg-[#060a14]/60 backdrop-blur-sm py-2 rounded-r-lg shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                        >
                            Love to turn the ideas into reality. Crafting high-performance websites and applications tailored to your business needs.
                        </motion.p>
                    </motion.div>

                    {/* Center Section - Dragoon G Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                        className="lg:col-span-1 flex justify-center relative z-20"
                    >
                        <div className="relative w-full max-w-sm flex flex-col items-center">
                            {/* Bit-beast aura glow */}
                            <motion.div
                                animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.65, 0.3] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
                                style={{
                                    background: "radial-gradient(circle at 50% 50%, rgba(96,165,250,0.35) 0%, rgba(96,165,250,0.08) 50%, transparent 70%)"
                                }}
                            />

                            {/* Orbital ring behind Dragoon */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full pointer-events-none"
                                style={{
                                    transform: "translate(-50%, -50%)",
                                    border: "1.5px solid transparent",
                                    borderTopColor: "rgba(96,165,250,0.5)",
                                    borderRightColor: "rgba(96,165,250,0.15)",
                                    borderBottomColor: "rgba(251,191,36,0.3)",
                                    borderLeftColor: "rgba(96,165,250,0.15)",
                                }}
                            />

                            {/* Dragoon G character */}
                            <motion.div
                                animate={{ y: [-8, 8, -8] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <Image
                                    src="/Dragoon-image.webp"
                                    alt="Dragoon G"
                                    width={380}
                                    height={480}
                                    className="relative w-full h-auto object-contain z-10 drop-shadow-[0_0_30px_rgba(96,165,250,0.6)]"
                                    priority
                                />
                            </motion.div>

                            {/* Spinning blade below Dragoon */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="relative -mt-8 w-24 h-24 z-20"
                            >
                                <Image
                                    src="/Dragoon-blade-image.webp"
                                    alt="Dragoon Blade"
                                    fill
                                    className="object-contain drop-shadow-[0_0_16px_rgba(96,165,250,0.8)]"
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Section - CTA and Description */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                        className="lg:col-span-1 relative z-20"
                    >
                        <div
                            className="space-y-6 p-6 rounded-2xl"
                            style={{
                                background: "rgba(6,10,20,0.6)",
                                backdropFilter: "blur(12px)",
                                border: "1px solid rgba(96,165,250,0.15)",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(96,165,250,0.1)"
                            }}
                        >
                            <h2 className="font-russo text-2xl md:text-3xl font-bold leading-tight">
                                Spinning beyond limits —
                                <br />
                                <span
                                    className="text-transparent bg-clip-text"
                                    style={{
                                        backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #fbbf24 100%)",
                                        textShadow: "none",
                                        filter: "drop-shadow(0 0 20px rgba(96,165,250,0.4))",
                                    }}
                                >
                                    Code that hits like a bit-beast
                                </span>
                            </h2>

                            <p className="text-gray-300 text-sm leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                I am a passionate web developer with expertise in crafting high-performance websites and applications. I specialize in turning ideas into reality, delivering tailored solutions that meet your business needs.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="/#contact"
                                    className="relative px-7 py-3 rounded-lg font-medium text-center text-white group transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_28px_rgba(96,165,250,0.65)]"
                                    style={{
                                        background: "rgba(96,165,250,0.12)",
                                        border: "1px solid rgba(96,165,250,0.45)",
                                    }}
                                >
                                    {/* Energy blast on hover */}
                                    <span
                                        className="absolute inset-0 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    >
                                        <span
                                            className="absolute inset-0"
                                            style={{
                                                background: "radial-gradient(circle at 50% 50%, rgba(96,165,250,0.38) 0%, rgba(251,191,36,0.12) 55%, transparent 80%)",
                                            }}
                                        />
                                    </span>
                                    {/* <Image
                                        src="/Dragoon-blade-image.webp"
                                        alt=""
                                        width={18}
                                        height={18}
                                        className="relative z-10 w-4 h-4 object-contain transition-transform duration-500 group-hover:animate-[beyblade-spin_0.55s_linear_infinite]"
                                    /> */}
                                    <span className="relative z-10">Get in Touch</span>
                                    {/* LET IT RIP tooltip on hover */}
                                    {/* <span
                                        className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-amber-400 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 whitespace-nowrap tracking-widest pointer-events-none"
                                        style={{ textShadow: "0 0 8px rgba(251,191,36,0.9)" }}
                                    >
                                        ⚡ LET IT RIP!
                                    </span> */}
                                </Link>
                                <Link
                                    target="_blank"
                                    href="https://drive.google.com/file/d/1S5FwEwwHDRZMTIl_r276fvCGbsukRLem/view?usp=sharing"
                                    className="relative px-7 py-3 rounded-lg font-bold text-center group transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_28px_rgba(251,191,36,0.6)]"
                                    style={{
                                        border: "2px solid rgba(251,191,36,0.7)",
                                        color: "#fbbf24",
                                        background: "transparent",
                                    }}
                                >
                                    <span
                                        className="absolute inset-0 rounded-[6px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        style={{ background: "rgba(251,191,36,1)" }}
                                    />
                                    {/* <Image
                                        src="/Dragoon-blade-image.webp"
                                        alt=""
                                        width={18}
                                        height={18}
                                        className="relative z-10 w-4 h-4 object-contain transition-transform duration-500 group-hover:animate-[beyblade-spin_0.55s_linear_infinite]"
                                    /> */}
                                    <span className="relative z-10 group-hover:text-gray-950 transition-colors duration-300">Get Resume</span>
                                    {/* LET IT RIP tooltip on hover */}
                                    {/* <span
                                        className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-blue-400 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 whitespace-nowrap tracking-widest pointer-events-none"
                                        style={{ textShadow: "0 0 8px rgba(96,165,250,0.9)" }}
                                    >
                                        ⚡ LET IT RIP!
                                    </span> */}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
