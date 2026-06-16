"use client";

import React, { useEffect, useState } from 'react';
import Loading from "./loading";

interface Skill {
    _id: string;
    name: string;
    imageUrl: string;
    description: string;
}

const SkillBadge = ({ skill }: { skill: Skill }) => (
    <div className="flex items-center justify-center gap-6 mx-2 px-12 py-4 bg-gray-900/50 border border-dashed border-teal-500/30 rounded-2xl text-gray-300 font-medium whitespace-nowrap shadow-[0_0_15px_rgba(20,184,166,0.05)] hover:border-teal-400 hover:text-teal-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all duration-300 cursor-default">
        {skill.imageUrl && (
            <img src={skill.imageUrl} alt={skill.name} className="w-6 h-6 object-contain" />
        )}
        {skill.name}
    </div>
);

const MarqueeRow = ({ skills, direction = "normal" }: { skills: Skill[], direction?: "normal" | "reverse" }) => {
    // Duplicate skills to ensure enough content for seamless scrolling
    const duplicatedSkills = [...skills, ...skills, ...skills, ...skills, ...skills, ...skills];
    if (skills.length === 0) return null;

    return (
        <div className="relative flex overflow-hidden w-full py-4">
            {/* Gradient overlays for smooth fade on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-linear-to-r from-black to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-linear-to-l from-black to-transparent pointer-events-none"></div>

            <div className={`flex gap-4 md:gap-6 w-max ${direction === "normal" ? "animate-marquee" : "animate-marquee-reverse"} pause-on-hover`}>
                {duplicatedSkills.map((skill, index) => (
                    <SkillBadge key={`${skill._id}-${index}`} skill={skill} />
                ))}
            </div>
        </div>
    );
};

export default function Skills() {
    const [skills, setSkills] = useState<Skill[]>([
        // { _id: '1', name: 'React.js', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', description: '' },
        // { _id: '2', name: 'Next.js', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', description: '' },
        // { _id: '3', name: 'TypeScript', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', description: '' },
        // { _id: '4', name: 'JavaScript', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', description: '' },
        // { _id: '5', name: 'HTML5', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', description: '' },
        // { _id: '6', name: 'CSS3', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', description: '' },
        // { _id: '7', name: 'Tailwind CSS', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', description: '' },
        // { _id: '8', name: 'Node.js', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', description: '' },
        // { _id: '9', name: 'Express.js', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', description: '' },
        // { _id: '10', name: 'MongoDB', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', description: '' },
        // { _id: '11', name: 'PostgreSQL', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', description: '' },
        // { _id: '12', name: 'Prisma', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', description: '' },
        // { _id: '13', name: 'GraphQL', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', description: '' },
        // { _id: '14', name: 'REST API', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg', description: '' },
        // { _id: '15', name: 'Git', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', description: '' },
        // { _id: '16', name: 'GitHub', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', description: '' },
        // { _id: '17', name: 'Docker', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', description: '' },
        // { _id: '18', name: 'AWS', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', description: '' },
        // { _id: '19', name: 'Vercel', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', description: '' },
        // { _id: '20', name: 'Figma', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', description: '' },
        // { _id: '21', name: 'Framer Motion', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg', description: '' },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchSkills = async () => {
            try {
                const response = await fetch('/api/skill');
                const data = await response.json();
                if (data.success) {
                    setSkills(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch skills", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    // Split skills into three rows
    const row1 = skills.filter((_, i) => i % 3 === 0);
    const row2 = skills.filter((_, i) => i % 3 === 1);
    const row3 = skills.filter((_, i) => i % 3 === 2);

    return (
        <section id="skills" className="w-full bg-transparent py-20 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 relative z-20">
                <h2 className="font-audiowide text-4xl md:text-5xl font-bold text-center text-white mb-4">
                    My <span className="text-teal-400">Skills</span>
                </h2>
                <div className="w-24 h-1 bg-linear-to-r from-teal-400 to-transparent mx-auto rounded-full mb-6"></div>
                <p className="text-gray-400 text-center max-w-2xl mx-auto text-sm md:text-base">
                    A collection of technologies and tools I use to build scalable, high-performance web applications.
                </p>
            </div>

            <div className="flex flex-col gap-2 relative z-20 min-h-[200px]">
                {loading ? (
                    <Loading className="py-10" />
                ) : skills.length > 0 ? (
                    <>
                        <MarqueeRow skills={row1} direction="normal" />
                        <MarqueeRow skills={row2} direction="reverse" />
                        <MarqueeRow skills={row3} direction="normal" />
                    </>
                ) : (
                    <div className="flex justify-center items-center h-full w-full py-10 text-gray-500">
                        No skills added yet.
                    </div>
                )}
            </div>

            {/* Decorative background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        </section>
    );
}