"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ExternalLink, ArrowRight } from "lucide-react";
import Loading from "./loading";

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

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
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [featuredId, setFeaturedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // States for 3D Tilt and Glow effect
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [lightPos, setLightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Resize listener to change Swiper direction dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        if (idx === -1) return prev;
        const next = projects[(idx + 1) % projects.length];
        return next._id;
      });
      setProgress(0);
      ticks = 0;
    }, INTERVAL_MS);
  };

  // Sync Swiper slide with featuredId
  useEffect(() => {
    if (!featuredId || projects.length === 0) return;

    const idx = projects.findIndex(p => p._id === featuredId);
    if (swiperInstance && swiperInstance.activeIndex !== idx && idx !== -1) {
      swiperInstance.slideTo(idx);
    }

    startCycle(featuredId);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [featuredId, swiperInstance, projects]);

  const handleSlideChange = (swiper: any) => {
    const activeProject = projects[swiper.activeIndex];
    if (activeProject && activeProject._id !== featuredId) {
      setFeaturedId(activeProject._id);
    }
  };

  const handleSelect = (id: string) => {
    setFeaturedId(id);
  };

  // Handle Mouse Move for 3D Tilt & Light Sheen
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (for 3D rotation)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Capped rotation (max 5 degrees)
    const rX = -(mouseY / height) * 5;
    const rY = (mouseX / width) * 5;

    // Mouse coordinates relative to card top-left (for glow)
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;

    setRotate({ x: rX, y: rY });
    setLightPos({ x: lx, y: ly });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <section id="projects" className="w-full py-24 bg-transparent text-white overflow-hidden relative">
      {/* Ambient glows matching Hero */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-300/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
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
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500 py-24">No projects found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">

            {/* Left: Swiper Index Menu */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-1 w-full"
            >
              <Swiper
                key={isDesktop ? "vertical" : "horizontal"}
                direction={isDesktop ? "vertical" : "horizontal"}
                modules={[Mousewheel]}
                mousewheel={{ forceToAxis: true }}
                slidesPerView={"auto"}
                spaceBetween={12}
                centeredSlides={true}
                slideToClickedSlide={true}
                onSwiper={setSwiperInstance}
                onSlideChange={handleSlideChange}
                className="projects-menu-swiper"
              >
                {projects.map((project, index) => {
                  const isActive = featuredId === project._id;
                  return (
                    <SwiperSlide
                      key={project._id}
                      className="shrink-0 w-[280px] sm:w-[320px] lg:w-full h-auto! pb-1"
                    >
                      <motion.div
                        onClick={() => handleSelect(project._id)}
                        className={`group w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center gap-5 border relative overflow-hidden cursor-pointer select-none ${
                          isActive
                            ? "bg-gray-900/70 border-teal-500 shadow-[0_0_25px_rgba(20,184,166,0.25)] scale-100 opacity-100"
                            : "bg-gray-900/30 border-gray-800 hover:border-teal-500/50 hover:shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:bg-gray-900/60 opacity-40 scale-95 hover:opacity-75 hover:scale-[0.98]"
                        }`}
                        whileHover={{ x: isDesktop ? 4 : 0, y: isDesktop ? 0 : -2 }}
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
                            isActive
                              ? "text-teal-400 translate-x-0"
                              : "text-gray-700 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                          }`}
                        />
                      </motion.div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </motion.div>

            {/* Right: Details preview with scroll entrance, 3D tilt, radial sheen & entrance stagger animations */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="lg:col-span-2 w-full"
            >
              <AnimatePresence mode="wait">
                {featured && (
                  <motion.div
                    key={featuredId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="w-full"
                  >
                    {/* Tilt container */}
                    <div
                      ref={cardRef}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        transform: isDesktop
                          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
                          : "none",
                        transition: "transform 0.15s ease-out, border-color 0.5s ease, box-shadow 0.5s ease",
                      }}
                      className="rounded-2xl overflow-hidden border bg-gray-900/40 backdrop-blur-sm shadow-2xl active-project-card relative transition-all duration-500 group"
                    >
                      {/* Interactive glow effect tracking mouse */}
                      {isDesktop && (
                        <div
                          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
                          style={{
                            background: `radial-gradient(circle 300px at ${lightPos.x}px ${lightPos.y}px, rgba(20, 184, 166, 0.15), transparent)`,
                            opacity: isHovered ? 1 : 0,
                          }}
                        />
                      )}

                      {/* Image container with scale entrance */}
                      <div className="relative w-full h-[260px] md:h-[340px] overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/50 to-transparent z-10 transition-opacity duration-500" />
                        <motion.img
                          key={featured.imageUrl}
                          src={featured.imageUrl}
                          alt={featured.name}
                          initial={{ scale: 1.08, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.65, ease: "easeOut" }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content with staggered entry */}
                      <div className="p-6 md:p-8 relative z-20">
                        {/* Title */}
                        <motion.h3
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="font-audiowide text-2xl md:text-3xl font-bold text-white mb-4 leading-tight"
                        >
                          {featured.name}
                        </motion.h3>

                        {/* Tech tags with sequential stagger */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {featured.techstack.map((tech, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}
                              className="px-3 py-1 text-[10px] uppercase tracking-wider font-medium text-teal-300 bg-black/60 backdrop-blur-md rounded-full border border-teal-500/30"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>

                        {/* Description */}
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="text-gray-400 text-sm leading-relaxed border-l-2 border-teal-500 pl-4 mb-8"
                        >
                          {featured.description}
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="flex flex-col sm:flex-row gap-4"
                        >
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
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        )}
      </div>
    </section>
  );
}