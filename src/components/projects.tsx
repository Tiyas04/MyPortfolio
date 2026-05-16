"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ExternalLink, ArrowRight } from "lucide-react";
import Loading from "./loading";

/*
const DUMMY_PROJECTS = [
  {
    _id: "1",
    name: "E-Commerce Platform",
    tagline: "Full-stack retail, reimagined.",
    description: "A full-stack e-commerce solution with real-time inventory management, Stripe payment integration, and an intuitive admin dashboard. Built to scale for thousands of concurrent users.",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1000&q=80",
    techstack: ["Next.js", "Tailwind CSS", "Node.js", "MongoDB", "Stripe"]
  },
  {
    _id: "2",
    name: "AI Content Generator",
    tagline: "Write smarter, not harder.",
    description: "An AI-powered application generating high-quality marketing copy and blog posts using GPT-4. Features a rich text editor, contextual prompts, and a robust save/export system.",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&q=80",
    techstack: ["React", "TypeScript", "OpenAI API", "Firebase"]
  },
  {
    _id: "3",
    name: "Real Estate Dashboard",
    tagline: "Property management, simplified.",
    description: "A comprehensive analytics dashboard for real estate agents to manage listings, track leads, and view property insights with interactive maps and live charts.",
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1000&q=80",
    techstack: ["Vue.js", "Nuxt", "PostgreSQL", "Tailwind CSS", "Chart.js"]
  },
  {
    _id: "4",
    name: "Job Portal",
    tagline: "Connecting talent to opportunity.",
    description: "A modern job marketplace with advanced role-based filtering, applicant tracking, and employer dashboards. Provides a seamless experience for both recruiters and job seekers.",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&q=80",
    techstack: ["Next.js", "Prisma", "PostgreSQL", "NextAuth", "Tailwind CSS"]
  },
  {
    _id: "5",
    name: "Dev Collaboration Hub",
    tagline: "Code together, ship faster.",
    description: "A real-time collaboration platform for developers featuring live code editing, chat rooms, PR review boards, and integrated CI/CD pipeline monitoring.",
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80",
    techstack: ["React", "Socket.io", "Node.js", "Redis", "Docker"]
  }
];
*/

interface ProjectData {
  _id: string;
  name: string;
  description: string;
  githubUrl: string;
  liveUrl?: string;
  imageUrl: string;
  techstack: string[];
}

const INTERVAL_MS = 5000;

export default function Projects() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [featuredId, setFeaturedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch projects from backend
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/project");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setProjects(json.data);
          setFeaturedId(json.data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const featured = projects.find(p => p._id === featuredId);
  const sideList = projects;

  const startCycle = (currentId: string) => {
    // Clear any existing timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    setProgress(0);

    // Progress bar: tick every 50ms → 100 ticks = 5000ms
    let ticks = 0;
    progressRef.current = setInterval(() => {
      ticks++;
      setProgress(ticks);
    }, INTERVAL_MS / 100);

    // Switch to next project after INTERVAL_MS
    intervalRef.current = setInterval(() => {
      setFeaturedId(prev => {
        const idx = projects.findIndex(p => p._id === prev);
        const next = projects[(idx + 1) % projects.length];
        return next._id;
      });
      setProgress(0);
      ticks = 0;
    }, INTERVAL_MS);
  };

  useEffect(() => {
    if (!featuredId || projects.length === 0) return;
    startCycle(featuredId);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [featuredId]);

  const handleSelect = (id: string) => {
    setFeaturedId(id);
    // useEffect will restart the cycle because featuredId changed
  };

  return (
    <section id="projects" className="w-full py-24 bg-transparent text-white overflow-hidden relative">
      {/* Ambient glows matching Hero */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-300/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header — mirrors Hero heading style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 md:mb-20"
        >
          <h2 className="font-audiowide text-4xl md:text-5xl font-bold leading-tight mb-4">
            <span className="text-white">Think.</span>{" "}
            <span className="text-white">Build.</span>
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1px #14b8a6" }}
            >
              Ship.
            </span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-teal-500 pl-4 max-w-sm">
            A curated collection of projects that reflect my passion for clean code and elegant design.
          </p>
        </motion.div>

        {/* Main Grid — loading / empty / content states */}
        {loading ? (
          <Loading className="py-32" />
        ) : sideList.length === 0 ? (
          <div className="text-center text-gray-500 py-24">No projects found.</div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">

          {/* Left: Numbered project list */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-1 flex flex-col gap-2"
          >
            {sideList.map((project, index) => {
              const isActive = featuredId === project._id;
              return (
                <motion.button
                  key={project._id}
                  onClick={() => handleSelect(project._id)}
                  onHoverStart={() => setHoveredId(project._id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className={`group w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center gap-5 border relative overflow-hidden ${
                    isActive
                      ? "bg-gray-900/70 border-teal-500 shadow-[0_0_25px_rgba(20,184,166,0.25)]"
                      : "bg-gray-900/30 border-gray-800 hover:border-teal-500/50 hover:shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:bg-gray-900/60"
                  }`}
                  whileHover={{ x: 4, scale: 1.015 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Auto-cycle progress bar — slides across the bottom of the active card */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 h-[2px] bg-teal-400 rounded-full transition-none"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  {/* Index Number */}
                  <span
                    className={`font-audiowide text-2xl font-bold transition-colors duration-300 ${
                      isActive ? "text-teal-400" : "text-gray-700 group-hover:text-gray-500"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Title + tagline */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-audiowide text-sm font-bold truncate transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                      {project.name}
                    </p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors truncate mt-0.5">
                      {project.description.slice(0, 48)}…
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                      isActive ? "text-teal-400 translate-x-0" : "text-gray-700 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  />
                </motion.button>
              );
            })}
          </motion.div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {featured && (
              <motion.div
                key={featuredId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/40 backdrop-blur-sm shadow-2xl hover:border-teal-500/40 hover:shadow-[0_0_40px_rgba(20,184,166,0.12)] transition-all duration-500"
              >
                {/* Image */}
                <div className="relative w-full h-[260px] md:h-[340px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent z-10 transition-opacity duration-500" />
                  <motion.img
                    key={featured.imageUrl}
                    src={featured.imageUrl}
                    alt={featured.name}
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                  />
                  {/* Floating tech tags over image */}
                  <div className="absolute bottom-4 left-5 right-5 flex flex-wrap gap-2 z-20">
                    {featured.techstack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-[10px] uppercase tracking-wider font-medium text-teal-300 bg-black/60 backdrop-blur-md rounded-full border border-teal-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="font-audiowide text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {featured.name}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-teal-500 pl-4 mb-8">
                    {featured.description}
                  </p>

                  {/* Action Buttons — matching Hero style */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={featured.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 hover:border-teal-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] text-white rounded-lg font-medium transition-all duration-300"
                    >
                      <Code className="w-5 h-5" />
                      Source Code
                    </a>
                    {featured.liveUrl && (
                      <a
                        href={featured.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-gray-950 rounded-lg font-bold transition-all duration-300 hover:shadow-[0_0_25px_rgba(20,184,166,0.6)]"
                      >
                        Live Demo
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
        )}
      </div>
    </section>
  );
}