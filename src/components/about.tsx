"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, GraduationCap, Code2, User } from "lucide-react";
import Loading from "./loading";

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Interfaces
interface Academic {
  _id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate?: string;
  grade: string;
}

interface GithubStats {
  followers: number;
  public_repos: number;
  languages: { name: string; value: number }[];
  totalContributions?: number;
  activeDays?: number;
}

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  activeDays?: number;
}

const FAQs = [
  {
    question: "Are you open to freelance opportunities?",
    answer:
      "Yes, I am always open to discussing new projects, creative ideas or opportunities to be part of your visions.",
  },
  {
    question: "What is your preferred tech stack?",
    answer:
      "My primary stack includes React/Next.js for the frontend, Node.js/Express for the backend, and MongoDB or PostgreSQL for the database. I also heavily use Tailwind CSS and Framer Motion for styling and animations.",
  },
  {
    question: "What are you currently learning?",
    answer:
      "I am constantly exploring new technologies. Currently, I am diving deeper into system design and advanced cloud architecture with AWS.",
  },
  {
    question: "How do you approach problem-solving?",
    answer:
      "I break down complex problems into smaller, manageable pieces. I prioritize understanding the core issue before writing any code, and I strongly believe in writing clean, maintainable, and testable code.",
  },
];

const COLORS = ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#ccfbf1"];
const LC_COLORS = ["#00b8a3", "#ffc01e", "#ff375f"];

export default function About() {
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [githubStats, setGithubStats] = useState<GithubStats | null>(null);
  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [loadingAcademics, setLoadingAcademics] = useState(true);

  useEffect(() => {
    // Fetch Academics
    const fetchAcademics = async () => {
      try {
        const response = await fetch("/api/academics");
        const data = await response.json();
        if (data.success) {
          setAcademics(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch academics:", error);
      } finally {
        setLoadingAcademics(false);
      }
    };

    // Fetch GitHub Stats
    const fetchGithub = async () => {
      try {
        const userRes = await fetch("https://api.github.com/users/Tiyas04");
        const userData = await userRes.json();

        // Fetching some repo data to get languages (mocking language stats based on repos for visual chart)
        const reposRes = await fetch("https://api.github.com/users/Tiyas04/repos?per_page=100");
        const reposData = await reposRes.json();
        
        // Count language frequencies (simplified)
        const langCounts: Record<string, number> = {};
        if (Array.isArray(reposData)) {
            reposData.forEach((repo: any) => {
                if (repo.language) {
                    langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
                }
            });
        }
        
        const languages = Object.entries(langCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        const contribRes = await fetch("https://github-contributions-api.deno.dev/Tiyas04.json");
        const contribData = await contribRes.json();
        const totalContributions = contribData.totalContributions || 0;
        let activeDays = 0;
        if (contribData.contributions) {
            contribData.contributions.forEach((week: any[]) => {
                week.forEach((day: any) => {
                    if (day.contributionCount > 0) activeDays++;
                });
            });
        }

        setGithubStats({
          followers: userData.followers || 0,
          public_repos: userData.public_repos || 0,
          languages: languages.length > 0 ? languages : [{ name: "JavaScript", value: 1 }],
          totalContributions,
          activeDays,
        });
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
      }
    };

    // Fetch LeetCode Stats
    const fetchLeetcode = async () => {
      try {
        const response = await fetch("https://alfa-leetcode-api.onrender.com/Tiyas04/profile");
        if (!response.ok) throw new Error("Failed to fetch LeetCode stats");
        const data = await response.json();
        if (data && data.totalSolved !== undefined) {
          const activeDays = data.submissionCalendar ? Object.keys(data.submissionCalendar).length : 0;
          setLeetcodeStats({
            totalSolved: data.totalSolved,
            easySolved: data.easySolved,
            mediumSolved: data.mediumSolved,
            hardSolved: data.hardSolved,
            activeDays,
          });
        }
      } catch (error) {
        console.error("Failed to fetch LeetCode stats:", error);
      }
    };

    fetchAcademics();
    fetchGithub();
    fetchLeetcode();
  }, []);

  const leetcodeData = leetcodeStats
    ? [
        { name: "Easy", value: leetcodeStats.easySolved },
        { name: "Medium", value: leetcodeStats.mediumSolved },
        { name: "Hard", value: leetcodeStats.hardSolved },
      ]
    : [];

  return (
    <section id="about" className="w-full bg-transparent py-20 relative overflow-hidden text-white">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-audiowide text-4xl md:text-5xl font-bold mb-4"
          >
            About <span className="text-teal-400">Me</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-linear-to-r from-teal-400 to-transparent mx-auto rounded-full mb-6 origin-left"
          ></motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Self Description & Education */}
          <div className="space-y-12">
            {/* Self Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 p-8 rounded-2xl border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.05)] hover:border-teal-500/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <User className="text-teal-400" size={24} />
                <h3 className="text-2xl font-audiowide font-semibold">Who I Am</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                I am a passionate developer dedicated to creating efficient, scalable, and visually appealing web applications. I love diving deep into code, exploring new technologies, and turning complex problems into elegant solutions. With a strong foundation in modern web frameworks and a keen eye for design, I strive to deliver exceptional user experiences.
              </p>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="text-teal-400" size={28} />
                <h3 className="text-3xl font-audiowide font-semibold">Education</h3>
              </div>

              <div className="space-y-6 border-l-2 border-teal-500/30 ml-3 pl-8 relative">
                {loadingAcademics ? (
                  <Loading className="py-10" />
                ) : academics.length > 0 ? (
                  academics.map((academic, index) => (
                    <motion.div
                      key={academic._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative bg-gray-900/40 p-6 rounded-xl border border-gray-800 hover:border-teal-500/30 transition-all"
                    >
                      <div className="absolute w-4 h-4 bg-teal-400 rounded-full -left-[41px] top-8 border-4 border-black"></div>
                      <h4 className="text-xl font-semibold text-white mb-1">{academic.degree}</h4>
                      <p className="text-teal-400 mb-2 font-medium">{academic.school}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>
                          {new Date(academic.startDate).getFullYear()} -{" "}
                          {academic.endDate ? new Date(academic.endDate).getFullYear() : "Present"}
                        </span>
                        <span className="bg-gray-800 px-3 py-1 rounded-full text-teal-300">
                          Grade: {academic.grade}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No academic details available.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Stats */}
          <div className="space-y-8">
            {/* GitHub Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 p-8 rounded-2xl border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.05)] hover:border-teal-500/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <GithubIcon className="text-teal-400" size={24} />
                  <h3 className="text-2xl font-audiowide font-semibold">GitHub Stats</h3>
                </div>
                <a
                  href="https://github.com/Tiyas04"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-teal-400 hover:text-teal-300 underline underline-offset-4"
                >
                  @Tiyas04
                </a>
              </div>

              {githubStats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 bg-black/50 p-4 rounded-lg border border-gray-800 flex flex-col justify-center items-center text-center">
                      <p className="text-gray-400 text-xs sm:text-sm">Repos</p>
                      <p className="text-xl sm:text-2xl font-bold text-teal-400">{githubStats.public_repos}</p>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg border border-gray-800 flex flex-col justify-center items-center text-center">
                      <p className="text-gray-400 text-xs sm:text-sm">Contributions</p>
                      <p className="text-xl sm:text-2xl font-bold text-teal-400">{githubStats.totalContributions}</p>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg border border-gray-800 flex flex-col justify-center items-center text-center">
                      <p className="text-gray-400 text-xs sm:text-sm">Active Days</p>
                      <p className="text-xl sm:text-2xl font-bold text-teal-400">{githubStats.activeDays}</p>
                    </div>
                  </div>
                  <div className="h-[200px] w-full">
                    {githubStats.languages.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={githubStats.languages}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {githubStats.languages.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: "#111827", borderColor: "#14b8a6", borderRadius: "8px" }}
                            itemStyle={{ color: "#fff" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              ) : (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-800 rounded"></div>
                      <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* LeetCode Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 p-8 rounded-2xl border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.05)] hover:border-teal-500/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Code2 className="text-teal-400" size={24} />
                  <h3 className="text-2xl font-audiowide font-semibold">LeetCode Stats</h3>
                </div>
                <a
                  href="https://leetcode.com/Tiyas04"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-teal-400 hover:text-teal-300 underline underline-offset-4"
                >
                  @Tiyas04
                </a>
              </div>

              {leetcodeStats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="bg-black/50 p-4 rounded-lg border border-gray-800 text-center h-full flex flex-col justify-center">
                      <p className="text-gray-400 text-sm mb-1">Total Solved</p>
                      <p className="text-4xl font-bold text-white">
                        {leetcodeStats.totalSolved}
                      </p>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg border border-gray-800 text-center h-full flex flex-col justify-center">
                      <p className="text-gray-400 text-sm mb-1">Active Days</p>
                      <p className="text-4xl font-bold text-teal-400">
                        {leetcodeStats.activeDays}
                      </p>
                    </div>
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leetcodeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                        <Tooltip
                            cursor={{ fill: '#1f2937' }}
                            contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", borderRadius: "8px" }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {leetcodeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={LC_COLORS[index % LC_COLORS.length]} />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-800 rounded"></div>
                      <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-3xl font-audiowide font-bold mb-4">
              Frequently Asked <span className="text-teal-400">Questions</span>
            </h3>
            <p className="text-gray-400">A few things people often ask me.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/30"
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/50 transition-colors"
                >
                  <span className={`font-medium ${activeFAQ === index ? 'text-teal-400' : 'text-gray-300'}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className={activeFAQ === index ? 'text-teal-400' : 'text-gray-500'} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-gray-800/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}