"use client";

import { useState, useRef } from "react";
import { KaiUploadShell, KaiLaunchButton } from "@/components/kai-upload-shell";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setUploadedUrl(null);
            setError(null);
            setCopySuccess(false);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            setUploadedUrl(data.url);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Something went wrong sending the file.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (uploadedUrl) {
            navigator.clipboard.writeText(uploadedUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setUploadedUrl(null);
        setError(null);
        setCopySuccess(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <KaiUploadShell title="Upload Asset" subtitle="Upload images and assets to the Dranzer CDN vault">
                {error && (
                    <div className="mb-6 p-4 rounded-lg border bg-red-950/30 border-red-500/50 text-red-200 font-mono text-sm">
                        {error}
                    </div>
                )}

                {/* Upload Area */}
                {!preview && !uploadedUrl && (
                    <div className="bg-[#0b0710]/75 backdrop-blur-sm border border-red-900/40 p-12 rounded-2xl hover:border-red-500/50 transition-colors duration-300 shadow-[0_0_20px_rgba(239,68,68,0.08)]">
                        <div
                            className="border-2 border-dashed border-red-900/50 hover:border-amber-400/60 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <svg
                                className="w-16 h-16 text-red-400/70 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <p className="text-gray-200 text-lg font-medium mb-2 font-russo">Click to select an image</p>
                            <p className="text-gray-500 text-sm">or drag and drop</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>
                )}

                {/* Preview Area */}
                {preview && !uploadedUrl && (
                    <div className="bg-[#0b0710]/75 backdrop-blur-sm border border-red-900/40 p-6 rounded-2xl hover:border-red-500/50 transition-colors duration-300 shadow-[0_0_20px_rgba(239,68,68,0.08)]">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/15 text-amber-300 font-bold border border-red-500/35">
                                1
                            </span>
                            <h3 className="text-lg font-medium text-gray-200 font-russo">Preview</h3>
                        </div>

                        <div className="relative w-full bg-[#07050a]/80 rounded-lg overflow-hidden mb-6 border border-red-950/60 shadow-lg">
                            <div className="aspect-video flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <button
                                onClick={resetForm}
                                className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors shadow-lg"
                                title="Remove file"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={resetForm}
                                className="px-4 py-3 bg-[#07050a] hover:bg-red-950/30 text-gray-300 rounded-xl transition-colors duration-200 flex-1 border border-red-950/70 hover:border-red-500/40 font-mono text-sm"
                            >
                                Cancel
                            </button>
                            <KaiLaunchButton
                                onClick={handleUpload}
                                loading={isLoading}
                                loadingText="Uploading..."
                                className="flex-1"
                            >
                                Upload to Cloud
                            </KaiLaunchButton>
                        </div>
                    </div>
                )}

                {/* Success/Result Area */}
                {uploadedUrl && (
                    <div className="bg-[#0b0710]/75 backdrop-blur-sm border border-red-900/40 p-6 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-400/15 rounded-full flex items-center justify-center border border-amber-400/50">
                                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white font-russo">Upload Complete!</h3>
                                <p className="text-gray-400 text-sm">Your asset has been uploaded successfully</p>
                            </div>
                        </div>

                        <div className="bg-[#07050a]/80 rounded-lg p-4 border border-red-950/60 flex items-center justify-between gap-3 mb-6">
                            <span className="text-gray-300 text-sm truncate select-all flex-1 font-mono">{uploadedUrl}</span>
                            <button
                                onClick={handleCopy}
                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors p-2 rounded shrink-0"
                                title="Copy to clipboard"
                            >
                                {copySuccess ? (
                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <KaiLaunchButton onClick={resetForm} className="w-full">
                            Upload Another Asset
                        </KaiLaunchButton>
                    </div>
                )}
        </KaiUploadShell>
    );
}