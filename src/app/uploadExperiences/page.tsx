"use client";

import { useState, FormEvent } from "react";

interface ExperienceFormData {
    id: number;
    role: string;
    jobtitle: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
}

export default function UploadExperience() {
    const [Experiences, setExperiences] = useState<ExperienceFormData[]>([
        {
            id: Date.now(),
            role: "",
            jobtitle: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
        },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleInputChange = (
        id: number,
        field: keyof Omit<ExperienceFormData, "id" | "image">,
        value: string
    ) => {
        setExperiences((prev) =>
            prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
        );
    };

    const handleFileChange = (id: number, file: File | null) => {
        setExperiences((prev) =>
            prev.map((exp) => (exp.id === id ? { ...exp, image: file } : exp))
        );
    };

    const addExperience = () => {
        setExperiences((prev) => [
            ...prev,
            {
                id: Date.now(),
                role: "",
                jobtitle: "",
                company: "",
                startDate: "",
                endDate: "",
                description: "",
            },
        ]);
    };

    const removeExperience = (id: number) => {
        if (Experiences.length === 1) return;
        setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const formData = new FormData();
            Experiences.forEach((exp, index) => {
                formData.append(`Experiences[${index}][role]`, exp.role);
                formData.append(`Experiences[${index}][jobtitle]`, exp.jobtitle);
                formData.append(`Experiences[${index}][company]`, exp.company);
                formData.append(`Experiences[${index}][startDate]`, exp.startDate);
                formData.append(`Experiences[${index}][endDate]`, exp.endDate || "Present");
                formData.append(`Experiences[${index}][description]`, exp.description);
            });

            const response = await fetch("/api/experience", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to upload projects");
            }

            setMessage({ type: "success", text: data.message });
            // Reset form
            setExperiences([
                {
                    id: Date.now(),
                    role: "",
                    jobtitle: "",
                    company: "",
                    startDate: "",
                    endDate: "",
                    description: "",
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
                        Upload Experiences
                    </h1>
                    <p className="text-gray-400">Showcase your professional journey</p>
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
                            Experience List ({Experiences.length})
                        </h2>
                        <button
                            type="button"
                            onClick={addExperience}
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
                            Add Another Experience
                        </button>
                    </div>

                    <div className="grid gap-8">
                        {Experiences.map((exp, index) => (
                            <div
                                key={exp.id}
                                className="bg-[#111] border border-gray-800 p-6 rounded-2xl relative group hover:border-blue-500/50 transition-colors duration-300 shadow-xl"
                            >
                                <div className="absolute top-4 right-4">
                                    {Experiences.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(exp.id)}
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
                                    <h3 className="text-lg font-medium text-gray-200">Experience Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Role */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Experience Name <span className="text-blue-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={exp.role}
                                            onChange={(e) =>
                                                handleInputChange(exp.id, "role", e.target.value)
                                            }
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                            placeholder="Your Job Role"
                                        />
                                    </div>

                                    {/* Job Title */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Job Title <span className="text-blue-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={exp.jobtitle}
                                            onChange={(e) =>
                                                handleInputChange(exp.id, "jobtitle", e.target.value)
                                            }
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                            placeholder="Your Job Title"
                                        />
                                    </div>

                                    {/* Company Name */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Company Name <span className="text-blue-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={exp.company}
                                            onChange={(e) =>
                                                handleInputChange(exp.id, "company", e.target.value)
                                            }
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                            placeholder="Your Company Name"
                                        />
                                    </div>

                                    {/* Start Date */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Start Date <span className="text-blue-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={exp.startDate}
                                            onChange={(e) =>
                                                handleInputChange(exp.id, "startDate", e.target.value)
                                            }
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                            placeholder="Start Date"
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={exp.endDate}
                                            onChange={(e) =>
                                                handleInputChange(exp.id, "endDate", e.target.value)
                                            }
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                            placeholder="End Date"
                                        />
                                    </div>
                                    {/* Description */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Description <span className="text-blue-500">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={exp.description}
                                            onChange={(e) =>
                                                handleInputChange(exp.id, "description", e.target.value)
                                            }
                                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600 resize-none"
                                            placeholder="Describe your experience..."
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
