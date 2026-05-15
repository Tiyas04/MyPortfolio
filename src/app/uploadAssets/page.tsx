"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

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
        <div className="min-h-screen bg-black text-gray-100 p-6 md:p-12 selection:bg-teal-500/30 selection:text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-teal-300 mb-2 font-audiowide">
                        Upload Asset
                    </h1>
                    <p className="text-gray-400">Upload images and assets to your portfolio</p>
                </header>

                {error && (
                    <div className="mb-6 p-4 rounded-lg border bg-red-900/30 border-red-500/50 text-red-200">
                        {error}
                    </div>
                )}

                {/* Upload Area */}
                {!preview && !uploadedUrl && (
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-12 rounded-2xl hover:border-teal-500/40 transition-colors duration-300 shadow-[0_0_15px_rgba(20,184,166,0.05)]">
                        <div
                            className="border-2 border-dashed border-gray-700 hover:border-teal-500/50 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <svg
                                className="w-16 h-16 text-teal-500/60 mb-4"
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
                            <p className="text-gray-300 text-lg font-medium mb-2">Click to select an image</p>
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
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-2xl hover:border-teal-500/40 transition-colors duration-300 shadow-[0_0_15px_rgba(20,184,166,0.05)]">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/10 text-teal-400 font-bold border border-teal-500/30">
                                1
                            </span>
                            <h3 className="text-lg font-medium text-gray-200">Preview</h3>
                        </div>

                        <div className="relative w-full bg-black/50 rounded-lg overflow-hidden mb-6 border border-gray-800 shadow-lg">
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
                                className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex-1 border border-gray-700 hover:border-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isLoading}
                                className={`px-8 py-3 rounded-lg font-bold shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-200 flex-1 ${
                                    isLoading
                                        ? "bg-teal-600/50 text-gray-300 cursor-not-allowed"
                                        : "bg-teal-500 hover:bg-teal-400 text-black hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] transform hover:-translate-y-0.5"
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </span>
                                ) : (
                                    "Upload to Cloud"
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Success/Result Area */}
                {uploadedUrl && (
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-2xl shadow-[0_0_15px_rgba(20,184,166,0.05)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center border border-teal-500/50">
                                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white font-audiowide">Upload Complete!</h3>
                                <p className="text-gray-400 text-sm">Your asset has been uploaded successfully</p>
                            </div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-4 border border-gray-800 flex items-center justify-between gap-3 mb-6">
                            <span className="text-gray-300 text-sm truncate select-all flex-1">{uploadedUrl}</span>
                            <button
                                onClick={handleCopy}
                                className="text-teal-400 hover:text-teal-300 hover:bg-teal-400/10 transition-colors p-2 rounded shrink-0"
                                title="Copy to clipboard"
                            >
                                {copySuccess ? (
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <button
                            onClick={resetForm}
                            className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] transition-all duration-200"
                        >
                            Upload Another Asset
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}