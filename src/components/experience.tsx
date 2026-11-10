"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, MapPin, X, ChevronRight } from "lucide-react";
import Loading from "./loading";

/*
const EXPERIENCES = [
  {
    id: 1,
    role: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "San Francisco, CA (Remote)",
    date: "Jan 2022 - Present",
    description: [
      "Led the migration of a legacy monolithic application to a modern React/Next.js micro-frontend architecture.",
      "Mentored junior developers and established code review best practices.",
      "Improved performance scores by 40% using SSR and dynamic imports."
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "Nexus Creative",
    location: "New York, NY",
    date: "Mar 2020 - Dec 2021",
    description: [
      "Developed and maintained full-stack web applications for clients across various industries.",
      "Integrated third-party APIs including Stripe for payments and SendGrid for emails.",
      "Designed database schemas using MongoDB and PostgreSQL."
    ],
    skills: ["Node.js", "Express", "MongoDB", "React"],
  },
  {
    id: 3,
    role: "Junior Web Developer",
    company: "Startup Hub",
    location: "Austin, TX",
    date: "Jun 2018 - Feb 2020",
    description: [
      "Assisted in building responsive landing pages and user interfaces.",
      "Collaborated with designers to ensure high-quality implementation of UI/UX designs.",
      "Participated in agile sprints and daily stand-ups."
    ],
    skills: ["JavaScript", "HTML", "CSS", "Vue.js"],
  }
];
*/

interface ExperienceData {
  _id: string;
  role: string;
  jobtitle: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export default function Experience() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const res = await fetch("/api/experience");
        const json = await res.json();
        if (json.success) {
          setExperiences(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch experiences", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  const selectedExp = experiences.find(exp => exp._id === selectedId);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const getFormattedDateRange = (startDate: string, endDate?: string) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";
    return `${start} - ${end}`;
  };

  return (
    <section id="experience" className="w-full py-24 bg-transparent text-white overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/8 rounded-full blur-[128px] pointer-events-none" />

      {/* Strata Dragoon decoration — left side standing guard */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-32 md:w-44 opacity-20 pointer-events-none hidden lg:block z-10"
        style={{ filter: "drop-shadow(0 0 24px rgba(96,165,250,0.45))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Strata-Dragoon-image.webp" alt="" aria-hidden className="w-full h-auto object-contain" />
      </motion.div>

      <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-russo text-4xl md:text-5xl font-bold mb-6">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #fbbf24 100%)",
                WebkitTextStroke: "1px rgba(96,165,250,0.65)",
              }}
            >
              Work Experience
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto border-l-2 border-blue-500 pl-4 text-left md:text-center md:border-l-0 md:pl-0">
            A timeline of my professional journey, highlighting the roles and responsibilities that shaped my career.
          </p>
        </motion.div>

        {loading ? (
          <Loading className="py-20" />
        ) : experiences.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No experience records found.</div>
        ) : (
          <div className="relative">
            {/* Central Vertical Line (Animated) */}
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-6 md:left-1/2 top-0 w-0.5 bg-linear-to-b from-blue-500/60 via-amber-400/30 to-transparent transform md:-translate-x-1/2 origin-top" 
            />

            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              const dateRange = getFormattedDateRange(exp.startDate, exp.endDate);

              return (
                <div 
                  key={exp._id} 
                  className={`relative mb-16 md:mb-24 flex flex-col md:flex-row items-start w-full ${
                    isEven ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Timeline Dot (Animated) */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.5 }}
                    className="absolute left-6 md:left-1/2 w-10 h-10 bg-[#060a14] border-4 border-blue-500 rounded-full transform -translate-x-1/2 flex items-center justify-center z-20 shadow-[0_0_15px_rgba(96,165,250,0.45)]"
                  >
                    <div className="w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  </motion.div>

                  {/* Content Card (Shorter View) */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`w-full md:w-[45%] pl-16 md:pl-0 mt-1 md:mt-0 ${
                      isEven ? "md:pr-16" : "md:pl-16"
                    }`}
                  >
                    <div 
                      onClick={() => setSelectedId(exp._id)}
                      className="group relative p-6 md:p-8 rounded-xl bg-[#060a14]/70 border border-blue-900/40 hover:border-blue-500/60 hover:shadow-[0_0_25px_rgba(96,165,250,0.2)] transition-all duration-300 backdrop-blur-sm overflow-hidden cursor-pointer"
                    >
                      {/* Subtle hover gradient */}
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500/8 via-transparent to-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        <h3 className="font-russo text-xl md:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors">
                          {exp.jobtitle}
                        </h3>
                        
                        <div className="flex flex-col gap-2 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-400" />
                            <span className="font-medium text-gray-300">{exp.company}</span>
                            <span className="ml-1 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-blue-950/60 text-amber-300 rounded border border-blue-800/50">{exp.role}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-amber-400" />
                            {dateRange}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-sm font-medium text-blue-400 group-hover:text-amber-300 transition-colors mt-6">
                          View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal using AnimatePresence */}
      <AnimatePresence>
        {selectedId && selectedExp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060a14]/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl p-6 md:p-10 bg-[#0a0f1e] border border-blue-500/35 rounded-2xl shadow-[0_0_45px_rgba(96,165,250,0.2)] overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/12 rounded-full blur-[80px] pointer-events-none" />

              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-400 hover:text-amber-300 hover:bg-blue-500/10 rounded-full transition-colors z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10">
                <h3 className="font-russo text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                  {selectedExp.jobtitle}
                </h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-400 mb-8 border-l-2 border-blue-500/40 pl-3">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-gray-300">{selectedExp.company}</span>
                    <span className="ml-1 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-blue-950/60 text-amber-300 rounded border border-blue-800/50">{selectedExp.role}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    {getFormattedDateRange(selectedExp.startDate, selectedExp.endDate)}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  {selectedExp.description.split('\n').filter(line => line.trim().length > 0).map((item, i) => (
                    <p key={i} className="text-gray-300 leading-relaxed text-sm md:text-base flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                      {item.trim()}
                    </p>
                  ))}
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}