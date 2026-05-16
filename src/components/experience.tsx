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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-audiowide text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-teal-300" style={{
              WebkitTextStroke: "1px #14b8a6",
              color: "transparent"
            }}>
              Work Experience
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto border-l-2 border-teal-500 pl-4 text-left md:text-center md:border-l-0 md:pl-0">
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
              className="absolute left-6 md:left-1/2 top-0 w-0.5 bg-linear-to-b from-teal-500/50 via-teal-400/30 to-transparent transform md:-translate-x-1/2 origin-top" 
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
                    className="absolute left-6 md:left-1/2 w-10 h-10 bg-gray-900 border-4 border-teal-500 rounded-full transform -translate-x-1/2 flex items-center justify-center z-20 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                  >
                    <div className="w-3 h-3 bg-teal-300 rounded-full" />
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
                      className="group relative p-6 md:p-8 rounded-xl bg-gray-900/40 border border-gray-800 hover:border-teal-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden cursor-pointer"
                    >
                      {/* Subtle hover gradient */}
                      <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        <h3 className="font-audiowide text-xl md:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-teal-400 transition-colors">
                          {exp.jobtitle}
                        </h3>
                        
                        <div className="flex flex-col gap-2 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-teal-400" />
                            <span className="font-medium text-gray-300">{exp.company}</span>
                            <span className="ml-1 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-gray-800 rounded border border-gray-700">{exp.role}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-teal-500" />
                            {dateRange}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-sm font-medium text-teal-400 group-hover:text-teal-300 transition-colors mt-6">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl p-6 md:p-10 bg-gray-900 border border-teal-500/30 rounded-2xl shadow-[0_0_40px_rgba(20,184,166,0.15)] overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10">
                <h3 className="font-audiowide text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                  {selectedExp.jobtitle}
                </h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-400 mb-8 border-l-2 border-teal-500/30 pl-3">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-teal-400" />
                    <span className="font-medium text-gray-300">{selectedExp.company}</span>
                    <span className="ml-1 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-gray-800 rounded border border-gray-700">{selectedExp.role}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-500" />
                    {getFormattedDateRange(selectedExp.startDate, selectedExp.endDate)}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  {selectedExp.description.split('\n').filter(line => line.trim().length > 0).map((item, i) => (
                    <p key={i} className="text-gray-300 leading-relaxed text-sm md:text-base flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
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