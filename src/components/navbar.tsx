"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/#about" },
        { name: "Skills", href: "/#skills" },
        { name: "Experience", href: "/#experience" },
        { name: "Projects", href: "/#projects" },
    ];

    return (
        <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled || isOpen
                ? "backdrop-blur-xl bg-gray-950/90 border-b border-gray-800" 
                : "bg-transparent border-b border-transparent"
        }`}>
            <nav className="max-w-7xl mx-auto w-full px-6 md:px-12 py-5 flex items-center justify-between">

                {/* Logo Section - Left */}
                <Link href="/" className="flex items-center gap-2 group shrink-0 relative z-50">
                    <div className="text-2xl font-audiowide text-white hover:text-teal-300 hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.8)] transition-all duration-300 tracking-tight">
                        Tiyas.
                    </div>
                </Link>

                {/* Desktop Navigation - Center */}
                <div className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-400 hover:text-teal-300 hover:drop-shadow-[0_0_5px_rgba(20,184,166,0.8)] transition-all duration-300 relative group"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </Link>
                    ))}
                </div>

                {/* Call to Action - Right */}
                <div className="hidden lg:flex items-center gap-6 ml-auto relative z-50">
                    <Link
                        href="/#contact"
                        className="px-6 py-2.5 text-sm font-bold border-2 border-teal-500 text-teal-400 bg-transparent hover:bg-teal-500 hover:text-gray-950 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_25px_rgba(20,184,166,0.3)]"
                    >
                        Contact Me
                    </Link>
                </div>

                {/* Mobile Menu Button — animated hamburger ↔ cross */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden ml-auto p-2 relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-0"
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    <span
                        style={{
                            display: "block",
                            width: "22px",
                            height: "2px",
                            borderRadius: "2px",
                            backgroundColor: isOpen ? "#2dd4bf" : "#d1d5db",
                            transformOrigin: "center",
                            transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.25s ease, background-color 0.25s ease",
                            transform: isOpen ? "translateY(8px) rotate(45deg)" : "translateY(0) rotate(0deg)",
                        }}
                    />
                    <span
                        style={{
                            display: "block",
                            width: "22px",
                            height: "2px",
                            borderRadius: "2px",
                            backgroundColor: isOpen ? "#2dd4bf" : "#d1d5db",
                            marginTop: "6px",
                            transition: "opacity 0.2s ease, transform 0.35s cubic-bezier(0.23,1,0.32,1), background-color 0.25s ease",
                            opacity: isOpen ? 0 : 1,
                            transform: isOpen ? "scaleX(0)" : "scaleX(1)",
                        }}
                    />
                    <span
                        style={{
                            display: "block",
                            width: "22px",
                            height: "2px",
                            borderRadius: "2px",
                            backgroundColor: isOpen ? "#2dd4bf" : "#d1d5db",
                            marginTop: "6px",
                            transformOrigin: "center",
                            transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.25s ease, background-color 0.25s ease",
                            transform: isOpen ? "translateY(-8px) rotate(-45deg)" : "translateY(0) rotate(0deg)",
                        }}
                    />
                </button>
            </nav>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 top-[76px] h-[calc(100vh-76px)] bg-gray-950/95 backdrop-blur-2xl z-40 lg:hidden flex flex-col items-center pt-12 px-6 overflow-y-auto border-t border-gray-800"
                    >
                        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 + 0.1 }}
                                    className="w-full text-center"
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block py-3 text-lg font-audiowide text-gray-400 hover:text-white hover:bg-gray-900/50 rounded-xl transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                                className="w-full mt-4 pt-8 border-t border-gray-800/50"
                            >
                                <Link
                                    href="/#contact"
                                    onClick={() => setIsOpen(false)}
                                    className="flex justify-center w-full px-8 py-4 text-base font-bold border-2 border-teal-500 text-teal-400 bg-transparent hover:bg-teal-500 hover:text-gray-950 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                                >
                                    Contact Me
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}