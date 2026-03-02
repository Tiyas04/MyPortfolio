"use client";

import { useState, FormEvent } from "react";

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
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-6 md:p-12 selection:bg-blue-500 selection:text-white">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-blue-600 mb-2">
                        Upload Projects
                    </h1>
                    <p className="text-gray-400">Showcase your amazing work.</p>
                </header>

                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg border ${message.type === "success"
                            ? "bg-green-900/30 border-green-500/50 text-green-200"
                            : "bg-red-900/30 border-red-500/50 text-red-200"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-blue-900/30 backdrop-blur-sm sticky top-4 z-10 shadow-lg shadow-blue-900/10">
                        <h2 className="text-xl font-semibold text-blue-300">
                            Project List ({projects.length})
                        </h2>
                        <button
                            type="button"
                            onClick={addProject}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-[0_0_10px_rgba(147,51,234,0.3)] hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"
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
                                className="bg-[#111] border border-gray-800 p-6 rounded-2xl relative group hover:border-blue-500/50 transition-colors duration-300 shadow-xl"
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
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/50 text-blue-300 font-bold border border-blue-500/30">
                                        {index + 1}
                                    </span>
                                    <h3 className="text-lg font-medium text-gray-200">Project Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Project Name <span className="text-blue-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={project.name}
                                            onChange={(e) =>
                                                handleInputChange(project.id, "name", e.target.value)
                                            }
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                            placeholder="My Awesome App"
                                        />
                                    </div>

                                    {/* Tech Stack */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Tech Stack <span className="text-blue-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={project.techstack}
                                            onChange={(e) =>
                                                handleInputChange(project.id, "techstack", e.target.value)
                                            }
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                            placeholder="React, Next.js, Node.js"
                                        />
                                    </div>

                                    {/* Github URL */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            GitHub URL <span className="text-blue-500">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            required
                                            value={project.githubUrl}
                                            onChange={(e) =>
                                                handleInputChange(project.id, "githubUrl", e.target.value)
                                            }
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
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
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
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
                          file:bg-blue-900/30 file:text-blue-300
                          hover:file:bg-blue-900/50
                          cursor-pointer bg-[#1a1a1a] border border-gray-700 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Description <span className="text-blue-500">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={project.description}
                                            onChange={(e) =>
                                                handleInputChange(project.id, "description", e.target.value)
                                            }
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600 resize-none"
                                            placeholder="Describe the project..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-800">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitting ? "cursor-wait" : ""
                                }`}
                        >
                            {isSubmitting ? "Uploading..." : "Submit All Projects"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
