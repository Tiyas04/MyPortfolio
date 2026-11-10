"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ShieldAlert, Terminal, ArrowRight } from "lucide-react";
import KaiBackground from "@/components/kai-background";
import KaiLoadingPage from "@/components/kai-loading-page";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authLogs, setAuthLogs] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(true);
    const [showAwakening, setShowAwakening] = useState(true);

    const redirectPath = searchParams.get("redirect") || "/admin";

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAwakening(false);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
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

        addLog("INITIALIZING BLACK DRANZER HANDSHAKE...");
        await new Promise((r) => setTimeout(r, 600));

        addLog("VERIFYING BIT-BEAST SIGNATURE...");
        await new Promise((r) => setTimeout(r, 400));

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (!res.ok) {
                addLog("ACCESS DENIED: FLAME KEY MISMATCH");
                throw new Error(data.message || "Invalid credentials.");
            }

            addLog("DARK FLAME IGNITED. UNLOCKING DECK...");
            await new Promise((r) => setTimeout(r, 500));

            router.push(redirectPath);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "An authentication error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#07050a] text-gray-100 selection:bg-red-500/30 selection:text-white">
            <KaiBackground />

            <AnimatePresence mode="wait">
                {showAwakening || isChecking ? (
                    <KaiLoadingPage key="kai-login-awakening" label="Gate Security" />
                ) : (
                    <motion.div
                        key="kai-login-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative z-10"
                    >
                        {/* Ambient crimson & gold aura */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] bg-red-500/10 rounded-full blur-[110px] pointer-events-none" />

                        {/* Floating Black Dranzer centerpiece behind & above the login gate */}
                        <motion.div
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-44 h-44 -mb-14 z-10 pointer-events-none select-none"
                        >
                            <Image
                                src="/black-dronzer-image.webp"
                                alt="Kai Black Dranzer"
                                fill
                                className="object-contain drop-shadow-[0_0_28px_rgba(239,68,68,0.65)]"
                                priority
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative z-20 w-full max-w-md bg-[#0b0710]/85 border border-red-500/25 rounded-2xl backdrop-blur-xl p-6 md:p-8 hover:border-red-500/45 shadow-[0_0_50px_rgba(239,68,68,0.12)] transition-all duration-500"
                        >
                            {/* Corner brackets */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500/70 rounded-tl-lg pointer-events-none" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400/70 rounded-tr-lg pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400/70 rounded-bl-lg pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500/70 rounded-br-lg pointer-events-none" />

                            <div className="flex flex-col items-center mb-8 mt-4">
                                <div className="w-12 h-12 bg-red-500/10 border border-red-500/35 rounded-xl flex items-center justify-center shadow-[0_0_18px_rgba(239,68,68,0.28)] mb-4">
                                    <Image
                                        src="/black-dronzer-blade-image.webp"
                                        alt="Black Dranzer Blade"
                                        width={28}
                                        height={28}
                                        className="w-7 h-7 object-contain animate-[beyblade-spin_6s_linear_infinite]"
                                    />
                                </div>
                                <h1
                                    className="text-2xl md:text-3xl font-bold font-russo text-transparent bg-clip-text text-center uppercase tracking-wider"
                                    style={{
                                        backgroundImage: "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #fbbf24 100%)",
                                    }}
                                >
                                    Dranzer Gate
                                </h1>
                                <p className="text-gray-400 text-[11px] mt-1 font-mono uppercase tracking-widest text-center">
                                    Kai Command Authorization Required
                                </p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded-lg border bg-red-950/30 border-red-500/40 text-red-200 text-sm flex items-start gap-3"
                                >
                                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold font-mono text-xs uppercase text-red-400">
                                            Flame Seal Violation
                                        </p>
                                        <p className="text-gray-400 text-xs mt-0.5">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-mono font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                        Enter Command Passphrase
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="w-full bg-[#07050a]/80 border border-red-900/50 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-red-400/70 focus:ring-1 focus:ring-red-500/50 transition-all font-mono placeholder-gray-700"
                                            placeholder="••••••••••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-400 transition-colors p-1"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {authLogs.length > 0 && (
                                    <div className="bg-[#07050a]/90 rounded-lg p-3 border border-red-900/40 font-mono text-[10px] text-amber-300/90 leading-relaxed shadow-inner">
                                        {authLogs.map((log, i) => (
                                            <p key={i} className="truncate">{log}</p>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`relative w-full py-3.5 text-gray-950 font-bold rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_32px_rgba(239,68,68,0.65),0_0_18px_rgba(251,191,36,0.4)] transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group ${
                                        isLoading ? "cursor-wait" : ""
                                    }`}
                                    style={{
                                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 55%, #fbbf24 100%)",
                                    }}
                                >
                                    <Image
                                        src="/black-dronzer-blade-image.webp"
                                        alt=""
                                        width={18}
                                        height={18}
                                        className={`w-4 h-4 object-contain transition-transform duration-500 ${
                                            isLoading
                                                ? "animate-[beyblade-spin_0.45s_linear_infinite]"
                                                : "group-hover:animate-[beyblade-spin_0.55s_linear_infinite]"
                                        }`}
                                    />
                                    <span className="flex items-center gap-2 font-mono uppercase tracking-wider text-sm">
                                        {isLoading ? "Igniting..." : "Authenticate"}
                                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                                    </span>
                                    <span
                                        className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-amber-400 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 whitespace-nowrap tracking-widest pointer-events-none"
                                        style={{ textShadow: "0 0 8px rgba(251,191,36,0.9)" }}
                                    >
                                        🔥 LET IT RIP!
                                    </span>
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-red-950/60 text-center">
                                <button
                                    onClick={() => router.push("/")}
                                    className="text-xs text-gray-500 hover:text-amber-400 transition-colors font-mono flex items-center justify-center gap-1.5 mx-auto"
                                >
                                    <Terminal className="w-3.5 h-3.5" />
                                    Return to Dragoon Arena
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<KaiLoadingPage label="Gate Security" />}>
            <LoginForm />
        </Suspense>
    );
}
