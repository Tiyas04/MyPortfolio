"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, Briefcase, Camera } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0a0a] text-white pt-16 pb-8 relative overflow-hidden rounded-t-4xl border-t border-gray-900">
      {/* Subtle ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand/Logo Column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <h2 className="font-audiowide text-3xl font-bold">
                <span
                  className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-teal-300"
                  style={{ WebkitTextStroke: "1px #14b8a6", color: "transparent" }}
                >
                  Tiyas.
                </span>
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm border-l-2 border-teal-500 pl-4">
              Crafting high-performance websites and applications tailored to your business needs. Turning ideas into reality.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-audiowide text-lg mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#experience" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-audiowide text-lg mb-6 tracking-wide">Connect</h3>
            <div className="flex gap-4">
              <a 
                href="https://github.com/Tiyas04" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:border-teal-500 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <Terminal className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="https://linkedin.com/tiyas-mandal-a2a014343" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:border-teal-500 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <Briefcase className="w-4 h-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a 
                href="https://instagram.com/tiyas__004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:border-teal-500 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <Camera className="w-4 h-4" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} Tiyas. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Designed & Built with <span className="text-teal-500">♥</span>
          </p>
        </div>
        
      </div>
    </footer>
  );
}