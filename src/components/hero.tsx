"use client";

import Link from "next/link";
import Image from "next/image";
import images from "@/images/index";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative z-20 w-full bg-transparent text-white pt-10 md:pt-32 pb-8 px-6 md:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center min-h-135">
                    {/* Left Section - Heading */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                        className="lg:col-span-1 relative z-20"
                    >
                        <h1 className="font-audiowide text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 text-left drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
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
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 via-teal-300 to-emerald-300 drop-shadow-[0_0_30px_rgba(20,184,166,0.65)] font-extrabold">
                                    Tiyas
                                </span>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="text-teal-400 text-3xl sm:text-4xl font-semibold drop-shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                            >
                                Web Developer
                            </motion.div>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-gray-300 text-sm leading-relaxed border-l-2 border-teal-500 pl-4 bg-black/40 backdrop-blur-sm py-2 rounded-r-lg shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                        >
                            Love to turn the ideas into reality. Crafting high-performance websites and applications tailored to your business needs.
                        </motion.p>
                    </motion.div>

                    {/* Center Section - Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                        className="lg:col-span-1 flex justify-center relative z-20"
                    >
                        <div className="relative w-full max-w-sm">
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-linear-to-br from-teal-500/25 to-transparent rounded-xl blur-2xl"
                            ></motion.div>
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Image
                                    src={images.TiyasImage}
                                    alt="Tiyas"
                                    width={400}
                                    height={500}
                                    className="relative w-full h-auto rounded-lg object-cover brightness-90 contrast-110 z-10 hover:brightness-100 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                                    priority
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
                        <div className="space-y-6 bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-teal-500/10 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                            <h2 className="font-audiowide text-3xl md:text-4xl font-bold leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                                Think. Design.
                                <br />
                                <span className="text-teal-400 drop-shadow-[0_0_25px_rgba(20,184,166,0.6)]">Develop. Deploy.</span>
                            </h2>

                            <p className="text-gray-300 text-sm leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                I am a passionate web developer with expertise in crafting high-performance websites and applications. I specialize in turning ideas into reality, delivering tailored solutions that meet your business needs.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link
                                    href="/#contact"
                                    className="px-8 py-3 bg-teal-500/15 border border-teal-500/40 hover:bg-teal-500/25 hover:border-teal-300 hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] text-white rounded-lg font-medium transition-all duration-300 text-center"
                                >
                                    Get in Touch
                                </Link>
                                <Link
                                    target="_blank"
                                    href="https://drive.google.com/file/d/1S5FwEwwHDRZMTIl_r276fvCGbsukRLem/view?usp=sharing"
                                    className="px-8 py-3 border-2 border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-gray-950 rounded-lg font-bold transition-all duration-300 text-center hover:shadow-[0_0_25px_rgba(20,184,166,0.6)]"
                                >
                                    Get Resume
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}