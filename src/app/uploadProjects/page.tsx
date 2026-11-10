"use client";

import { useState, FormEvent } from "react";
import { KaiUploadShell, KaiLaunchButton } from "@/components/kai-upload-shell";

interface ProjectFormData {
    id: number;
    name: string;
    description: string;
    githubUrl: string;
    liveUrl: string;
    techstack: string;
    image: File | null;
}

export default function UploadProject() {
    const [projects, setProjects] = useState<ProjectFormData[]>([
        {
            id: Date.now(),
            name: "",
            description: "",
            githubUrl: "",
            liveUrl: "",
            techstack: "",
            image: null,
        },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleInputChange = (
        id: number,
        field: keyof Omit<ProjectFormData, "id" | "image">,
        value: string
    ) => {
        setProjects((prev) =>
            prev.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj))
        );
    };

    const handleFileChange = (id: number, file: File | null) => {
        setProjects((prev) =>
            prev.map((proj) => (proj.id === id ? { ...proj, image: file } : proj))
        );
    };

    const addProject = () => {
        setProjects((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: "",
                description: "",
                githubUrl: "",
                liveUrl: "",
                techstack: "",
                image: null,
            },
        ]);
    };

    const removeProject = (id: number) => {
        if (projects.length === 1) return;
        setProjects((prev) => prev.filter((proj) => proj.id !== id));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const formData = new FormData();
            projects.forEach((proj, index) => {
                formData.append(`projects[${index}][name]`, proj.name);
                formData.append(`projects[${index}][description]`, proj.description);
                formData.append(`projects[${index}][githubUrl]`, proj.githubUrl);
                formData.append(`projects[${index}][liveUrl]`, proj.liveUrl);
                formData.append(`projects[${index}][techstack]`, proj.techstack);
                if (proj.image) {
                    formData.append(`projects[${index}][image]`, proj.image);
                }
            });

            const response = await fetch("/api/project", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to upload projects");
            }

            setMessage({ type: "success", text: data.message });
            // Reset form
            setProjects([
                {
                    id: Date.now(),
                    name: "",
                    description: "",
                    githubUrl: "",
                    liveUrl: "",
                    techstack: "",
                    image: null,
                },
            ]);
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KaiUploadShell title="Upload Projects" subtitle="Deploy new builds into the arena showcase.">
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg border font-mono text-sm ${message.type === "success"
                            ? "bg-amber-950/30 border-amber-400/50 text-amber-200"
                            : "bg-red-950/30 border-red-500/50 text-red-200"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-between items-center bg-[#0b0710]/85 p-4 rounded-xl border border-red-500/25 backdrop-blur-sm sticky top-4 z-10 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        <h2 className="text-xl font-semibold text-red-400 font-russo">
                            Project List ({projects.length})
                        </h2>
                        <button
                            type="button"
                            onClick={addProject}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/35 text-amber-300 rounded-lg transition-all duration-200 flex items-center gap-2 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] text-sm font-mono"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Add Another Project
                        </button>
                    </div>

                    <div className="grid gap-8">
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className="bg-[#0b0710]/75 border border-red-900/40 backdrop-blur-sm p-6 rounded-2xl relative group hover:border-red-500/50 transition-colors duration-300 shadow-xl"
                            >
                                <div className="absolute top-4 right-4">
                                    {projects.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProject(project.id)}
                                            className="text-gray-500 hover:text-red-400 transition-colors p-2"
                                            title="Remove Project"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <div className="mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/15 text-amber-300 font-bold border border-red-500/35">
                                        {index + 1}
                                    </span>
                                    <h3 className="text-lg font-medium text-gray-200 font-russo">Project Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Project Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={project.name}
                                            onChange={(e) =>
                                                handleInputChange(project.id, "name", e.target.value)
                                            }
                                            className="w-full bg-[#07050a]/70 border border-red-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600"
                                            placeholder="My Awesome App"
                                        />
                                    </div>

                                    {/* Tech Stack */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Tech Stack <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={project.techstack}
                                            onChange={(e) =>
                                                handleInputChange(project.id, "techstack", e.target.value)
                                            }
                                            className="w-full bg-[#07050a]/70 border border-red-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600"
                                            placeholder="React, Next.js, Node.js"
                                        />
                                    </div>

                                    {/* Github URL */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            GitHub URL <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            required
                                            value={project.githubUrl}
                                            onChange={(e) =>
                                                handleInputChange(project.id, "githubUrl", e.target.value)
                                            }
                                            className="w-full bg-[#07050a]/70 border border-red-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>

                                    {/* Live URL */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Live URL
                                        </label>
                                        <input
                                            type="url"
                                            value={project.liveUrl}
                                            onChange={(e) =>
                                                handleInputChange(project.id, "liveUrl", e.target.value)
                                            }
                                            className="w-full bg-[#07050a]/70 border border-red-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    {/* Image */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Project Banner
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        project.id,
                                                        e.target.files ? e.target.files[0] : null
                                                    )
                                                }
                                                className="block w-full text-sm text-gray-400
                          file:mr-4 file:py-3 file:px-4
                          file:rounded-l-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-red-500/15 file:text-red-300 border-red-500/30
                          hover:file:bg-red-500/25
                          cursor-pointer bg-[#07050a]/70 border rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Description <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={project.description}
                                            onChange={(e) =>
                                                handleInputChange(project.id, "description", e.target.value)
                                            }
                                            className="w-full bg-[#07050a]/70 border border-red-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600 resize-none"
                                            placeholder="Describe the project..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-6 border-t border-red-950/60">
                        <KaiLaunchButton type="submit" loading={isSubmitting} loadingText="Uploading...">
                            Submit All Projects
                        </KaiLaunchButton>
                    </div>
                </form>
        </KaiUploadShell>
    );
}
