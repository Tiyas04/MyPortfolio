"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import NavBar from "@/components/navbar"
import Hero from "@/components/hero"
import About from "@/components/about"
import Skills from "@/components/skills"
import Experience from "@/components/experience"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import LoadingPage from "@/components/loadingpage"
import CyberBackground from "@/components/cyber-background"

export default function Home() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // The loading screen will display for exactly 5 seconds
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen bg-black">
      <AnimatePresence mode="wait">
        {showLoading ? (
          <LoadingPage key="loading-page" />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full relative z-10"
          >
            <CyberBackground />
            <NavBar />
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
