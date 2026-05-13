"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";


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

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/#about" },
        { name: "Skills", href: "/#skills" },
        { name: "Experience", href: "/#experience" },
        { name: "Projects", href: "/#projects" },
    ];

    return (
        <div className={`sticky top-0 w-full z-50 transition-all duration-300 ${
            isScrolled 
                ? "backdrop-blur-xl bg-black/90 border-b border-gray-800/50" 
                : "backdrop-blur-xl bg-black/80 border-b border-gray-800/50"
        }`}>
            <nav className="mx-auto w-full px-6 md:px-12 py-5 flex items-center justify-between transition-all duration-300">

                {/* Logo Section - Left */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="text-2xl lg:text-2xl font-audiowide text-white hover:text-teal-400 transition-colors tracking-tight">
                        Tiyas
                    </div>
                </Link>

                {/* Desktop Navigation - Center */}
                <div className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 relative group"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </Link>
                    ))}
                </div>

                {/* Call to Action - Right */}
                <div className="hidden lg:flex items-center gap-6 ml-auto">
                    <Link
                        href="/contact"
                        className={`px-7 py-2.5 text-sm font-semibold border-2 border-teal-500 rounded-lg transition-all duration-200 ${
                            isScrolled
                                ? "bg-teal-500 text-white hover:bg-teal-600 hover:border-teal-600"
                                : "text-teal-500 bg-transparent hover:bg-teal-500 hover:text-white"
                        }`}
                    >
                        Contact
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden ml-auto p-2 text-gray-300 hover:text-white transition-colors"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Mobile Navigation Overlay */}
            <div
                className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-all duration-300 lg:hidden flex flex-col items-center justify-center gap-8 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                style={{ top: "65px" }}
            >
                <div className="flex flex-col items-center gap-6 w-full px-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-semibold text-gray-400 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className={`mt-4 px-8 py-2.5 text-sm font-semibold border-2 border-teal-500 rounded-lg transition-all duration-200 ${
                            isScrolled
                                ? "bg-teal-500 text-white hover:bg-teal-600 hover:border-teal-600"
                                : "text-teal-500 bg-transparent hover:bg-teal-500 hover:text-white"
                        }`}
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </div>
    );
}