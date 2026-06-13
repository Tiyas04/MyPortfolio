"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldAlert, Cpu, Terminal, ArrowRight } from "lucide-react";
import CyberBackground from "@/components/cyber-background";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authLogs, setAuthLogs] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(true);

    const redirectPath = searchParams.get("redirect") || "/admin";

    useEffect(() => {
        // Quick initial check to see if we are already logged in
        async function checkAuth() {
            try {
                const res = await fetch("/api/admin/check");
                const data = await res.json();
                if (data.authenticated) {
                    router.push(redirectPath);
                }
            } catch (err) {
                console.error("Failed to check auth status", err);
            } finally {
                setIsChecking(false);
            }
        }
        checkAuth();
    }, [router, redirectPath]);

    const addLog = (msg: string) => {
        setAuthLogs((prev) => [...prev.slice(-3), `> ${msg}`]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setAuthLogs([]);

        addLog("INITIALIZING SECURITY HANDSHAKE...");
        await new Promise((r) => setTimeout(r, 600));

        addLog("COMPARING PASSPHRASE SIGNATURES...");
        await new Promise((r) => setTimeout(r, 400));

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (!res.ok) {
                addLog("ACCESS DENIED: KEY MISMATCH");
                throw new Error(data.message || "Invalid credentials.");
            }

            addLog("ACCESS GRANTED. DECRYPTING DASHBOARD...");
            await new Promise((r) => setTimeout(r, 500));

            router.push(redirectPath);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "An authentication error occurred.");
            setIsLoading(false);
        }
    };

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-teal-400 font-mono">
                <div className="flex flex-col items-center gap-4">
                    <Cpu className="w-12 h-12 animate-spin" />
                    <p className="text-sm tracking-widest uppercase animate-pulse">Checking credentials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-10 overflow-hidden bg-black text-gray-100 selection:bg-teal-500/30 selection:text-white">
            <CyberBackground />

            {/* Glowing orb accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-gray-950/70 border border-gray-800 rounded-2xl backdrop-blur-md p-6 md:p-8 hover:border-teal-500/30 hover:shadow-[0_0_45px_rgba(20,184,166,0.12)] transition-all duration-500"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-center text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)] mb-4">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold font-audiowide text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-teal-300 text-center uppercase tracking-wider">
                        System Access
                    </h1>
                    <p className="text-gray-500 text-xs mt-1 font-mono uppercase tracking-widest">
                        Administrative authorization required
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-lg border bg-red-950/20 border-red-500/30 text-red-200 text-sm flex items-start gap-3"
                    >
                        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold font-mono text-xs uppercase text-red-400">Security Violation</p>
                            <p className="text-gray-400 text-xs mt-0.5">{error}</p>
                        </div>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono font-semibold text-gray-500 uppercase tracking-widest mb-2">
                            Enter Security Passphrase
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="w-full bg-black/60 border border-gray-800 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-mono placeholder-gray-700"
                                placeholder="••••••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-400 transition-colors p-1"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {authLogs.length > 0 && (
                        <div className="bg-black/80 rounded-lg p-3 border border-gray-800 font-mono text-[10px] text-teal-400/80 leading-relaxed shadow-inner">
                            {authLogs.map((log, i) => (
                                <p key={i} className="truncate">{log}</p>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isLoading ? "cursor-wait" : ""
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2 font-mono uppercase tracking-wider text-sm">
                                <Cpu className="w-4 h-4 animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 font-mono uppercase tracking-wider text-sm">
                                Authenticate
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-900 text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="text-xs text-gray-600 hover:text-teal-400 transition-colors font-mono flex items-center justify-center gap-1.5 mx-auto"
                    >
                        <Terminal className="w-3.5 h-3.5" />
                        Return to Public Terminal
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black text-teal-400 font-mono">
                <div className="flex flex-col items-center gap-4">
                    <Cpu className="w-12 h-12 animate-spin" />
                    <p className="text-sm tracking-widest uppercase animate-pulse">Loading auth terminal...</p>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
