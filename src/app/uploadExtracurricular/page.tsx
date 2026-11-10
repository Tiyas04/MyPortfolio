"use client";

import { useState, FormEvent } from "react";
import { KaiUploadShell, KaiLaunchButton } from "@/components/kai-upload-shell";

interface ExtracurricularFormData {
	id: number;
	role: string;
	organization: string;
	description: string;
	image: File | null;
	startDate: string;
	endDate?: string;
}

export default function UploadExtracurricular() {
	const [extracurriculars, setExtracurriculars] = useState<ExtracurricularFormData[]>([
		{
			id: Date.now(),
			role: "",
			organization: "",
			description: "",
			image: null,
			startDate: "",
			endDate: "",
		},
	]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	const handleInputChange = (
		id: number,
		field: keyof Omit<ExtracurricularFormData, "id" | "image">,
		value: string
	) => {
		setExtracurriculars((prev) =>
			prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
		);
	};

	const handleFileChange = (id: number, file: File | null) => {
		setExtracurriculars((prev) =>
			prev.map((item) => (item.id === id ? { ...item, image: file } : item))
		);
	};

	const addExtracurricular = () => {
		setExtracurriculars((prev) => [
			...prev,
			{
				id: Date.now(),
				role: "",
				organization: "",
				description: "",
				image: null,
				startDate: "",
				endDate: "",
			},
		]);
	};

	const removeExtracurricular = (id: number) => {
        if (extracurriculars.length === 1) return;
        setExtracurriculars((prev) => prev.filter((item) => item.id !== id));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        try {
            const formData = new FormData();
            extracurriculars.forEach((item, idx) => {
                formData.append(`extracurriculars[${idx}][role]`, item.role);
                formData.append(`extracurriculars[${idx}][organization]`, item.organization);
                formData.append(`extracurriculars[${idx}][description]`, item.description);
                formData.append(`extracurriculars[${idx}][startDate]`, item.startDate);
                formData.append(`extracurriculars[${idx}][endDate]`, item.endDate || "");
                if (item.image) {
                    formData.append(`extracurriculars[${idx}][image]`, item.image);
                }
            });
            const res = await fetch("/api/extracurricular", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to upload extracurriculars");
            }
            setMessage({ type: "success", text: data.message });
            setExtracurriculars([
                {
                    id: Date.now(),
                    role: "",
                    organization: "",
                    description: "",
                    image: null,
                    startDate: "",
                    endDate: "",
                },
            ]);
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KaiUploadShell title="Upload Extracurriculars" subtitle="Showcase leadership & arena activities">
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
                            Extracurriculars List ({extracurriculars.length})
                        </h2>
                        <button
                            type="button"
                            onClick={addExtracurricular}
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
                            Add Another Extracurricular
                        </button>
                    </div>

                    <div className="grid gap-8">
                        {extracurriculars.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-[#0b0710]/75 border border-red-900/40 backdrop-blur-sm p-6 rounded-2xl relative group hover:border-red-500/50 transition-colors duration-300 shadow-xl"
                            >
                                <div className="absolute top-4 right-4">
                                    {extracurriculars.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeExtracurricular(item.id)}
                                            className="text-gray-500 hover:text-red-400 transition-colors p-2"
                                            title="Remove Extracurricular"
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
                                    <h3 className="text-lg font-medium text-gray-200 font-russo">Extracurricular Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Role */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Role <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={item.role}
                                            onChange={(e) =>
                                                handleInputChange(item.id, "role", e.target.value)
                                            }
                                            className="w-full bg-[#07050a]/70 border border-red-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600"
                                            placeholder="Your Role"
                                        />
                                    </div>

                                    {/* Organization */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Organization <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={item.organization}
                                            onChange={(e) =>
                                                handleInputChange(item.id, "organization", e.target.value)
                                            }
                                            className="w-full bg-[#07050a]/70 border border-red-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600"
                                            placeholder="Organization Name"
                                        />
                                    </div>

                                    {/* Start Date */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Start Date <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={item.startDate}
                                            onChange={(e) =>
                                                handleInputChange(item.id, "startDate", e.target.value)
                                            }
                                            className="w-full bg-[#07050a]/70 border border-red-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600"
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
                                            value={item.endDate}
                                            onChange={(e) =>
                                                handleInputChange(item.id, "endDate", e.target.value)
                                            }
                                            className="w-full bg-[#07050a]/70 border border-red-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600"
                                            placeholder="End Date"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Description <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={item.description}
                                            onChange={(e) =>
                                                handleInputChange(item.id, "description", e.target.value)
                                            }
                                            className="w-full bg-[#07050a]/70 border border-red-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600 resize-none"
                                            placeholder="Describe your extracurricular activity..."
                                        />
                                    </div>

                                    {/* Image Upload */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Image <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                required
                                                onChange={(e) =>
                                                    handleFileChange(item.id, e.target.files?.[0] || null)
                                                }
                                                className="w-full bg-[#07050a]/70 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/40 transition-all placeholder-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-500/15 file:text-red-300 hover:file:bg-red-500/25"
                                            />
                                            {item.image && (
                                                <p className="text-sm text-amber-300 mt-2">
                                                    ✓ {item.image.name} ({(item.image.size / 1024).toFixed(2)} KB)
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-6 border-t border-red-950/60">
                        <KaiLaunchButton type="submit" loading={isSubmitting} loadingText="Uploading...">
                            Submit All Extracurriculars
                        </KaiLaunchButton>
                    </div>
                </form>
        </KaiUploadShell>
    );
}
