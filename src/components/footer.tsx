"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon, InstagramIcon, XIcon, LeetcodeIcon } from "./social-icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-transparent text-white pt-16 pb-8 relative overflow-hidden rounded-t-4xl border-t border-blue-500/20 shadow-[0_-10px_30px_rgba(96,165,250,0.08)]">
      {/* Subtle ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Small spinning Black Dronzer blade decoration */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute right-8 top-8 w-16 h-16 opacity-25 pointer-events-none hidden sm:block"
      >
        <Image
          src="/black-dronzer-blade-image.webp"
          alt=""
          fill
          className="object-contain drop-shadow-[0_0_12px_rgba(96,165,250,0.6)]"
          aria-hidden
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand/Logo Column */}
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-3 mb-6">
              <h2 className="font-russo text-3xl font-bold select-none">
                <Link
                  href="/"
                  className="text-transparent bg-clip-text hover:opacity-90 transition-opacity"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #fbbf24 100%)",
                    WebkitTextStroke: "1px rgba(96,165,250,0.7)",
                  }}
                >
                  Tiyas
                </Link>
                <span 
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/login";
                  }}
                  className="cursor-default text-amber-400 hover:text-amber-300 transition-colors duration-300"
                  title="Admin Portal"
                >
                  .
                </span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm border-l-2 border-blue-500 pl-4">
              Crafting high-performance websites and applications tailored to your business needs. Turning ideas into reality.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-russo text-lg mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#experience" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-russo text-lg mb-6 tracking-wide">Connect</h3>
            <div className="flex gap-4 flex-wrap">
              <a 
                href="https://github.com/Tiyas04" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0a0f1e]/80 border border-blue-900/50 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <GithubIcon className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="https://linkedin.com/in/tiyas04" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0a0f1e]/80 border border-blue-900/50 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a 
                href="https://instagram.com/tiyas__004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0a0f1e]/80 border border-blue-900/50 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <InstagramIcon className="w-4 h-4" />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href="https://x.com/Tiyas__004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0a0f1e]/80 border border-blue-900/50 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">X (Twitter)</span>
              </a>
              <a 
                href="https://leetcode.com/u/Tiyas04" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0a0f1e]/80 border border-blue-900/50 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <LeetcodeIcon className="w-4 h-4" />
                <span className="sr-only">LeetCode</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-900/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs select-none">
            © {currentYear} Developed by Tiyas
            <span 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/login";
              }}
              className="cursor-default text-gray-500 hover:text-amber-400 transition-colors duration-300"
              title="Admin Portal"
            >
              .
            </span>
          </p>
          <p className="text-gray-600 text-xs">
            Designed &amp; Built with <span className="text-blue-400">♥</span>
          </p>
        </div>
        
      </div>
    </footer>
  );
}
