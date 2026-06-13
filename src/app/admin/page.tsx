"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Cpu, Edit3, Trash2, ExternalLink, Plus, Folder, BookOpen,
    Briefcase, Award, Sliders, X, FileText, ImageIcon as ImageLucide,
    AlertTriangle, Terminal, Activity, LayoutDashboard,
    LogOut, ChevronRight, Database, Shield
} from "lucide-react";
import CyberBackground from "@/components/cyber-background";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDateForInput(dateStr: any) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: any) {
    if (!dateStr) return "Present";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Present";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

type TabId = "overview" | "projects" | "skills" | "experiences" | "academics" | "extracurriculars";

// ─── Field helper ────────────────────────────────────────────────────────────

function Field({
    label, children
}: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}

const inputCls =
    "w-full bg-black/70 border border-gray-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all font-mono placeholder-gray-700";

// ─── Main component ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>("overview");

    const [projects, setProjects] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [experiences, setExperiences] = useState<any[]>([]);
    const [academics, setAcademics] = useState<any[]>([]);
    const [extracurriculars, setExtracurriculars] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string; title: string } | null>(null);
    const [itemToEdit, setItemToEdit] = useState<{ item: any; type: string } | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [newImage, setNewImage] = useState<File | null>(null);
    const [ongoing, setOngoing] = useState(false);

    const [systemLogs, setSystemLogs] = useState<string[]>([
        "SECURE_SHELL_INIT: AUTHENTICATION VERIFIED.",
        "DB_LINK: MONGOOSE SCHEMAS INDEXED.",
        "READY: AWAITING ADMIN INSTRUCTIONS."
    ]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString("en-US", { hour12: false });
        setSystemLogs((prev) => [...prev.slice(-8), `[${time}] ${msg}`]);
    };

    const fetchData = async (targetTab: TabId) => {
        setIsLoading(true);
        const endpoints: Record<TabId, string> = {
            overview: "/api/project",
            projects: "/api/project",
            skills: "/api/skill",
            experiences: "/api/experience",
            academics: "/api/academics",
            extracurriculars: "/api/extracurricular"
        };
        try {
            addLog(`GET ${endpoints[targetTab].toUpperCase()} → PENDING`);
            const res = await fetch(endpoints[targetTab]);
            const json = await res.json();
            if (json.success) {
                addLog(`RESPONSE 200: ${json.data.length} RECORDS LOADED.`);
                if (targetTab === "projects" || targetTab === "overview") setProjects(json.data);
                if (targetTab === "skills") setSkills(json.data);
                if (targetTab === "experiences") setExperiences(json.data);
                if (targetTab === "academics") setAcademics(json.data);
                if (targetTab === "extracurriculars") setExtracurriculars(json.data);
            } else {
                addLog(`RESPONSE FAIL: ${json.message}`);
                setMessage({ type: "error", text: json.message || "Failed to fetch data" });
            }
        } catch {
            addLog("NETWORK ERROR: REQUEST TIMEOUT.");
            setMessage({ type: "error", text: `Connection error fetching ${targetTab}` });
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const [p, s, e, a, ex] = await Promise.all([
                fetch("/api/project").then(r => r.json()),
                fetch("/api/skill").then(r => r.json()),
                fetch("/api/experience").then(r => r.json()),
                fetch("/api/academics").then(r => r.json()),
                fetch("/api/extracurricular").then(r => r.json()),
            ]);
            if (p.success) setProjects(p.data);
            if (s.success) setSkills(s.data);
            if (e.success) setExperiences(e.data);
            if (a.success) setAcademics(a.data);
            if (ex.success) setExtracurriculars(ex.data);
            addLog("TELEMETRY: ALL COLLECTION STATS INDEXED.");
        } catch {
            addLog("STATS LOAD: PARTIAL FAILURE.");
        }
    };

    useEffect(() => {
        if (activeTab === "overview") {
            loadStats().then(() => setIsLoading(false));
        } else {
            fetchData(activeTab);
        }
    }, [activeTab]);

    const handleLogout = async () => {
        addLog("SESSION KILL: DESTROYING AUTH TOKEN...");
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/");
            router.refresh();
        } catch {
            console.error("Logout failed");
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsSaving(true);
        setMessage(null);
        addLog(`DELETE ${itemToDelete.id.slice(0, 10)}... → PENDING`);

        const endpointMap: Record<string, string> = {
            projects: "/api/project",
            skills: "/api/skill",
            experiences: "/api/experience",
            academics: "/api/academics",
            extracurriculars: "/api/extracurricular"
        };
        const endpoint = endpointMap[itemToDelete.type];

        try {
            const res = await fetch(`${endpoint}?id=${itemToDelete.id}`, { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                addLog("DELETE 200: RECORD ERASED FROM DB.");
                setMessage({ type: "success", text: json.message || "Deleted successfully" });
                fetchData(activeTab);
            } else {
                addLog(`DELETE FAIL: ${json.message}`);
                setMessage({ type: "error", text: json.message || "Failed to delete" });
            }
        } catch {
            addLog("DELETE ERROR: WRITE STACK TIMEOUT.");
            setMessage({ type: "error", text: "Error sending delete request" });
        } finally {
            setIsSaving(false);
            setItemToDelete(null);
        }
    };

    const handleEditInit = (item: any, type: string) => {
        addLog(`EDIT INIT: RECORD [${item._id.slice(0, 8)}] LOADED INTO BUFFER.`);
        setItemToEdit({ item, type });
        setNewImage(null);
        setEditForm({ ...item });
        if (type === "experiences" || type === "academics" || type === "extracurriculars") {
            setOngoing(!item.endDate);
        }
    };

    const handleEditSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!itemToEdit) return;
        setIsSaving(true);
        setMessage(null);
        addLog(`PATCH ${itemToEdit.item._id.slice(0, 8)}... → PENDING`);

        const endpointMap: Record<string, string> = {
            projects: "/api/project",
            skills: "/api/skill",
            experiences: "/api/experience",
            academics: "/api/academics",
            extracurriculars: "/api/extracurricular"
        };
        const endpoint = endpointMap[itemToEdit.type];

        try {
            let res;
            if (newImage) {
                const formData = new FormData();
                Object.keys(editForm).forEach(key => {
                    if (key !== "imageUrl" && key !== "__v" && key !== "createdAt" && key !== "updatedAt") {
                        formData.append(key, editForm[key]);
                    }
                });
                if (ongoing) formData.delete("endDate");
                formData.append("image", newImage);
                res = await fetch(`${endpoint}?id=${itemToEdit.item._id}`, { method: "PATCH", body: formData });
            } else {
                const payload = { ...editForm };
                if (ongoing) { delete payload.endDate; payload.endDate = null; }
                res = await fetch(`${endpoint}?id=${itemToEdit.item._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            const json = await res.json();
            if (json.success) {
                addLog("PATCH 200: RECORD COMMITTED TO DB.");
                setMessage({ type: "success", text: json.message || "Updated successfully" });
                setItemToEdit(null);
                fetchData(activeTab);
            } else {
                addLog(`PATCH FAIL: ${json.message}`);
                setMessage({ type: "error", text: json.message || "Failed to save updates" });
            }
        } catch {
            addLog("PATCH ERROR: WRITE STACK EXPIRED.");
            setMessage({ type: "error", text: "Connection error submitting updates" });
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: "overview" as TabId, label: "Overview", icon: LayoutDashboard },
        { id: "projects" as TabId, label: "Projects", icon: Folder },
        { id: "skills" as TabId, label: "Skills", icon: Sliders },
        { id: "experiences" as TabId, label: "Experience", icon: Briefcase },
        { id: "academics" as TabId, label: "Academics", icon: BookOpen },
        { id: "extracurriculars" as TabId, label: "Activities", icon: Award },
    ];

    const uploadRoutes: Record<string, string> = {
        projects: "/uploadProjects",
        skills: "/uploadSkills",
        experiences: "/uploadExperiences",
        academics: "/uploadAcademics",
        extracurriculars: "/uploadExtracurricular"
    };

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 selection:text-white overflow-x-hidden">
            <CyberBackground />

            {/* Ambient glow blobs */}
            <div className="fixed top-[-10%] left-1/4 w-[600px] h-[600px] bg-teal-500/6 rounded-full blur-[160px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-teal-300/4 rounded-full blur-[140px] pointer-events-none z-0" />

            {/* ── TOP NAVIGATION BAR ── */}
            <header className="sticky top-0 z-40 w-full border-b border-gray-900 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-4">
                    {/* Brand */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-8 h-8 bg-teal-500/10 border border-teal-500/30 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(20,184,166,0.2)]">
                            <Shield className="w-4 h-4 text-teal-400" />
                        </div>
                        <div>
                            <span className="font-audiowide text-sm font-bold text-white tracking-wider uppercase">
                                Admin.<span className="text-teal-400">Deck</span>
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Session Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Tab Pills (desktop) */}
                    <nav className="hidden md:flex items-center gap-1 bg-gray-950/60 border border-gray-800 rounded-xl px-2 py-1.5">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { setMessage(null); setActiveTab(tab.id); addLog(`FOCUS: ${tab.label.toUpperCase()}`); }}
                                    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${isActive
                                        ? "bg-teal-500/15 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.15)]"
                                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-900/60"
                                        }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-400" : ""}`} />
                                    {tab.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-teal-500" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right controls */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={() => router.push("/")}
                            className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-teal-400 transition-colors"
                        >
                            <Terminal className="w-3.5 h-3.5" />
                            Public Site
                        </button>
                        <div className="w-px h-5 bg-gray-800 hidden sm:block" />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold border border-red-500/40 text-red-400 bg-red-950/10 hover:bg-red-500 hover:text-black hover:border-red-400 rounded-lg transition-all duration-200 hover:shadow-[0_0_16px_rgba(239,68,68,0.4)]"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:block">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Mobile tab scroll */}
                <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-none">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => { setMessage(null); setActiveTab(tab.id); }}
                                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all ${isActive
                                    ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                                    : "text-gray-500 hover:text-gray-300 border border-transparent"
                                    }`}
                            >
                                <Icon className="w-3 h-3" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* ── PAGE BODY ── */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-10">

                {/* Page heading */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-teal-400 font-mono text-xs uppercase tracking-widest mb-2">
                        <Cpu className="w-3.5 h-3.5 animate-pulse" />
                        [CONTROL_PANEL // AUTHENTICATED]
                    </div>
                    <h1 className="font-audiowide text-3xl md:text-4xl font-bold uppercase tracking-wide">
                        Admin{" "}
                        <span className="text-teal-400">Control</span>{" "}
                        <span className="text-transparent" style={{ WebkitTextStroke: "1px #14b8a6" }}>Deck</span>
                    </h1>
                    <p className="text-gray-500 text-xs mt-2 font-mono border-l-2 border-teal-500/40 pl-3 max-w-md">
                        Manage database records, edit values, delete items and direct uploads across all dynamic sections.
                    </p>
                </div>

                {/* ── Toast notification ── */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mb-6 p-4 rounded-xl border backdrop-blur-md flex items-center justify-between text-xs font-mono ${message.type === "success"
                                ? "bg-green-950/20 border-green-500/30 text-green-300"
                                : "bg-red-950/20 border-red-500/30 text-red-300"
                                }`}
                        >
                            <span>{message.text}</span>
                            <button onClick={() => setMessage(null)} className="text-gray-500 hover:text-white p-1 ml-4">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── CONTENT AREA ── */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">

                    {/* Main content panel */}
                    <div className="xl:col-span-3">
                        <div className="relative bg-gray-950/50 border border-gray-800 rounded-2xl backdrop-blur-sm overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                            {/* Corner brackets */}
                            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-teal-500 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-teal-500 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-teal-500 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-teal-500 rounded-br-lg" />

                            <div className="p-6 md:p-8">
                                {isLoading ? (
                                    <div className="py-32 flex flex-col items-center justify-center gap-4">
                                        <Cpu className="w-10 h-10 text-teal-500 animate-spin" />
                                        <p className="font-mono text-xs text-teal-400 uppercase tracking-widest animate-pulse">
                                            Loading datastream...
                                        </p>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            {activeTab === "overview" ? <OverviewPanel /> : <ListPanel />}
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="xl:col-span-1 space-y-4">
                        {/* Quick Upload Links */}
                        <div className="relative bg-gray-950/50 border border-gray-800 rounded-xl p-5 backdrop-blur-sm overflow-hidden">
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-teal-500" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-teal-500" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-teal-500" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-teal-500" />

                            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Plus className="w-3.5 h-3.5 text-teal-500" />
                                Upload Routes
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: "New Project", href: "/uploadProjects", icon: Folder },
                                    { label: "New Skill", href: "/uploadSkills", icon: Sliders },
                                    { label: "New Experience", href: "/uploadExperiences", icon: Briefcase },
                                    { label: "New Academic", href: "/uploadAcademics", icon: BookOpen },
                                    { label: "New Activity", href: "/uploadExtracurricular", icon: Award },
                                    { label: "Assets Space", href: "/uploadAssets", icon: ImageLucide },
                                ].map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <button
                                            key={link.label}
                                            onClick={() => router.push(link.href)}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-800 bg-gray-900/30 hover:bg-teal-500/5 hover:border-teal-500/30 text-gray-400 hover:text-teal-300 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center gap-2.5 text-xs font-mono">
                                                <Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-teal-500 transition-colors" />
                                                {link.label}
                                            </div>
                                            <ChevronRight className="w-3 h-3 text-gray-700 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* System Console */}
                        <div className="relative bg-gray-950/50 border border-gray-800 rounded-xl p-5 backdrop-blur-sm overflow-hidden">
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-teal-500" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-teal-500" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-teal-500" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-teal-500" />

                            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-teal-500" />
                                    Sys Diagnostics
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            </h3>
                            <div className="bg-black/60 rounded-lg p-3 border border-gray-900 space-y-1.5 max-h-44 overflow-y-auto scrollbar-none">
                                {systemLogs.map((log, i) => (
                                    <div key={i} className="flex items-start gap-1.5 font-mono text-[9px] leading-relaxed">
                                        <span className="text-teal-600 shrink-0 select-none mt-0.5">›</span>
                                        <span className={i === systemLogs.length - 1 ? "text-teal-400" : "text-gray-600"}>{log}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-900 text-[9px] font-mono text-gray-700">
                                DB: SYNC_OK · CORS: ACTIVE · CLOUDINARY: READY
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── EDIT MODAL ── */}
            <AnimatePresence>
                {itemToEdit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="relative bg-gray-950 border border-teal-500/30 rounded-2xl p-6 md:p-8 max-w-2xl w-full my-8 shadow-[0_0_60px_rgba(20,184,166,0.12)] overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-500" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-teal-500" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-teal-500" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-500" />

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 text-teal-400 font-mono text-[10px] uppercase tracking-widest mb-1">
                                        <Edit3 className="w-3.5 h-3.5" />
                                        Amend Record
                                    </div>
                                    <h2 className="font-audiowide text-xl font-bold text-white uppercase tracking-wide">
                                        Modify {activeTab.slice(0, -1)}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setItemToEdit(null)}
                                    className="text-gray-600 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSave} className="space-y-5">
                                {renderFormFields()}
                                <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-gray-900">
                                    <button
                                        type="button"
                                        onClick={() => setItemToEdit(null)}
                                        disabled={isSaving}
                                        className="flex-1 py-3 bg-transparent border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 font-mono font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 py-3 bg-teal-500/10 border border-teal-500/40 hover:bg-teal-500/20 hover:border-teal-400 text-teal-300 font-mono font-bold rounded-xl text-xs uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.25)] disabled:opacity-40 flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <><Cpu className="w-4 h-4 animate-spin" /> Writing...</>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── DELETE MODAL ── */}
            <AnimatePresence>
                {itemToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="relative bg-gray-950 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(220,38,38,0.1)] overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-red-500" />
                            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-red-500" />
                            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-red-500" />
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-red-500" />

                            <div className="flex items-center gap-2.5 text-red-400 mb-4">
                                <div className="w-9 h-9 rounded-xl border border-red-500/30 bg-red-950/20 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-mono text-[9px] uppercase tracking-widest text-red-600 font-bold">Destructive Action</p>
                                    <p className="font-audiowide text-sm font-bold text-white uppercase">Erase Record?</p>
                                </div>
                            </div>

                            <p className="text-gray-500 text-xs font-mono leading-relaxed mb-6">
                                You are about to permanently delete{" "}
                                <span className="text-red-400 font-bold">"{itemToDelete.title}"</span>.
                                This database transaction cannot be reversed.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setItemToDelete(null)}
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 text-xs font-mono font-bold border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 text-xs font-mono font-bold border-2 border-red-500/60 text-red-400 bg-red-950/10 hover:bg-red-500 hover:text-black hover:border-red-400 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                >
                                    {isSaving ? "Erasing..." : "Confirm Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );

    // ─── Overview Panel ─────────────────────────────────────────────────────

    function OverviewPanel() {
        const stats = [
            { label: "Projects", count: projects.length, icon: Folder },
            { label: "Skills", count: skills.length, icon: Sliders },
            { label: "Experiences", count: experiences.length, icon: Briefcase },
            { label: "Academics", count: academics.length, icon: BookOpen },
            { label: "Activities", count: extracurriculars.length, icon: Award },
        ];

        return (
            <div className="space-y-8">
                <div>
                    <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mb-4">
                        Collection Stats
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {stats.map((s) => {
                            const Icon = s.icon;
                            return (
                                <div
                                    key={s.label}
                                    className="relative group p-4 rounded-xl bg-gray-900/30 border border-gray-800 hover:border-teal-500/40 hover:shadow-[0_0_20px_rgba(20,184,166,0.08)] transition-all duration-300 overflow-hidden cursor-pointer"
                                    onClick={() => { setMessage(null); setActiveTab(tabs.find(t => t.label === s.label || t.id === s.label.toLowerCase())?.id || "overview"); }}
                                >
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-teal-500/30" />
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-teal-500/30" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-teal-500/30" />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-teal-500/30" />

                                    <Icon className="w-4 h-4 text-teal-500/60 group-hover:text-teal-400 mb-3 transition-colors" />
                                    <p className="font-audiowide text-2xl font-bold text-teal-400">{s.count}</p>
                                    <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest mt-1">{s.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* System status */}
                <div className="bg-gray-900/20 border border-gray-900 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-900 pb-3">
                        <span className="font-mono text-[10px] text-teal-400 flex items-center gap-1.5 uppercase tracking-widest">
                            <Database className="w-3.5 h-3.5" />
                            Core Status Monitor
                        </span>
                        <span className="font-mono text-[9px] text-green-500/80">● OPERATIONAL</span>
                    </div>
                    <div className="space-y-2 font-mono text-[10px] text-gray-500">
                        <p><span className="text-teal-600 mr-2">&gt;&gt;</span> HOST NODE: CONNECTED — NEXT.JS 16 EDGE RUNTIME</p>
                        <p><span className="text-teal-600 mr-2">&gt;&gt;</span> MONGOOSE SCHEMAS: INDEXED AND CACHED</p>
                        <p><span className="text-teal-600 mr-2">&gt;&gt;</span> CORS POLICY / EDGE INTERCEPTORS: ACTIVE</p>
                        <p><span className="text-teal-600 mr-2">&gt;&gt;</span> ASSET CDN: CLOUDINARY ATTACHMENT READY</p>
                        <p><span className="text-teal-600 mr-2">&gt;&gt;</span> AUTH SESSION KEY: ACTIVE AND VALID</p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── List Panel (for non-overview tabs) ─────────────────────────────────

    function ListPanel() {
        const currentData =
            activeTab === "projects" ? projects :
                activeTab === "skills" ? skills :
                    activeTab === "experiences" ? experiences :
                        activeTab === "academics" ? academics :
                            extracurriculars;

        return (
            <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-900">
                    <div>
                        <span className="font-audiowide text-base font-bold text-white uppercase tracking-wide">
                            {activeTab}
                        </span>
                        <span className="ml-3 text-[10px] font-mono text-teal-500/70 bg-teal-500/5 border border-teal-500/20 rounded px-2 py-0.5">
                            {currentData.length} records
                        </span>
                    </div>
                    {activeTab in uploadRoutes && (
                        <button
                            onClick={() => router.push(uploadRoutes[activeTab])}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 hover:border-teal-400 text-teal-300 font-mono font-bold text-xs rounded-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                        >
                            <Plus className="w-4 h-4" />
                            Upload New
                        </button>
                    )}
                </div>

                {currentData.length === 0 ? <EmptyState /> : renderTabItems(currentData)}
            </div>
        );
    }

    function renderTabItems(data: any[]) {
        if (activeTab === "projects") {
            return (
                <div className="space-y-4">
                    {data.map((proj, i) => (
                        <div key={proj._id} className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-900/20 border border-gray-800/80 hover:border-teal-500/30 hover:shadow-[0_0_20px_rgba(20,184,166,0.07)] transition-all duration-300">
                            {proj.imageUrl && (
                                <div className="w-full sm:w-36 h-20 rounded-lg overflow-hidden border border-gray-800 shrink-0 bg-black">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={proj.imageUrl} alt={proj.name} className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all" />
                                </div>
                            )}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-1.5">
                                        <div className="flex items-center gap-2.5">
                                            <span className="font-audiowide text-teal-500 text-base font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
                                            <h4 className="text-sm font-bold text-white font-audiowide truncate group-hover:text-teal-300 transition-colors">{proj.name}</h4>
                                        </div>
                                        {proj.githubUrl && (
                                            <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-teal-400 p-1 transition-colors shrink-0">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-2">{proj.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {proj.techstack?.map((t: string) => (
                                            <span key={t} className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-teal-500/5 border border-teal-500/10 text-teal-500/80">{t}</span>
                                        ))}
                                    </div>
                                </div>
                                <ActionRow onEdit={() => handleEditInit(proj, "projects")} onDelete={() => setItemToDelete({ id: proj._id, type: "projects", title: proj.name })} />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === "skills") {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.map((skill, i) => (
                        <div key={skill._id} className="group flex gap-3.5 p-4 rounded-xl bg-gray-900/20 border border-gray-800/80 hover:border-teal-500/30 hover:shadow-[0_0_15px_rgba(20,184,166,0.07)] transition-all duration-300">
                            {skill.imageUrl && (
                                <div className="w-10 h-10 rounded-lg bg-teal-500/5 border border-teal-500/10 flex items-center justify-center overflow-hidden p-1.5 shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={skill.imageUrl} alt={skill.name} className="w-full h-full object-contain" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-audiowide text-teal-500 text-xs font-bold">{String(i + 1).padStart(2, "0")}</span>
                                        <h4 className="text-xs font-bold text-white font-audiowide truncate">{skill.name}</h4>
                                    </div>
                                    <p className="text-gray-500 text-[10px] line-clamp-2 leading-relaxed">{skill.description}</p>
                                </div>
                                <ActionRow onEdit={() => handleEditInit(skill, "skills")} onDelete={() => setItemToDelete({ id: skill._id, type: "skills", title: skill.name })} />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === "experiences") {
            return (
                <div className="space-y-3">
                    {data.map((exp, i) => (
                        <div key={exp._id} className="group p-4 rounded-xl bg-gray-900/20 border border-gray-800/80 hover:border-teal-500/30 hover:shadow-[0_0_15px_rgba(20,184,166,0.07)] transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-audiowide text-teal-500 text-base font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-white font-audiowide">{exp.jobtitle}</h4>
                                        <div className="text-[10px] font-mono text-teal-400/70 mt-0.5">{exp.company} <span className="text-gray-700 mx-1">//</span> {exp.role}</div>
                                    </div>
                                </div>
                                <div className="text-[9px] font-mono text-gray-600">{formatDisplayDate(exp.startDate)} — {formatDisplayDate(exp.endDate)}</div>
                            </div>
                            <p className="text-gray-500 text-xs leading-relaxed mb-3">{exp.description}</p>
                            <ActionRow onEdit={() => handleEditInit(exp, "experiences")} onDelete={() => setItemToDelete({ id: exp._id, type: "experiences", title: `${exp.jobtitle} at ${exp.company}` })} />
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === "academics") {
            return (
                <div className="space-y-3">
                    {data.map((acad, i) => (
                        <div key={acad._id} className="group p-4 rounded-xl bg-gray-900/20 border border-gray-800/80 hover:border-teal-500/30 hover:shadow-[0_0_15px_rgba(20,184,166,0.07)] transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-audiowide text-teal-500 text-base font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-white font-audiowide">{acad.degree}</h4>
                                        <div className="text-[10px] font-mono text-teal-400/70 mt-0.5">{acad.school} {acad.grade && <span className="text-gray-600 ml-1">// {acad.grade}</span>}</div>
                                    </div>
                                </div>
                                <div className="text-[9px] font-mono text-gray-600">{formatDisplayDate(acad.startDate)} — {formatDisplayDate(acad.endDate)}</div>
                            </div>
                            <ActionRow onEdit={() => handleEditInit(acad, "academics")} onDelete={() => setItemToDelete({ id: acad._id, type: "academics", title: acad.degree })} />
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === "extracurriculars") {
            return (
                <div className="space-y-3">
                    {data.map((act, i) => (
                        <div key={act._id} className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-900/20 border border-gray-800/80 hover:border-teal-500/30 hover:shadow-[0_0_15px_rgba(20,184,166,0.07)] transition-all duration-300">
                            {act.imageUrl && (
                                <div className="w-full sm:w-28 h-16 rounded-lg overflow-hidden border border-gray-800 shrink-0 bg-black">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={act.imageUrl} alt={act.role} className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                        <div className="flex items-center gap-2.5">
                                            <span className="font-audiowide text-teal-500 text-base font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
                                            <h4 className="text-sm font-bold text-white font-audiowide truncate">{act.role}</h4>
                                        </div>
                                        <div className="text-[9px] font-mono text-gray-600">{formatDisplayDate(act.startDate)} — {formatDisplayDate(act.endDate)}</div>
                                    </div>
                                    <div className="text-[10px] font-mono text-teal-400/70 mb-1.5 ml-8">{act.organization}</div>
                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 ml-8">{act.description}</p>
                                </div>
                                <ActionRow onEdit={() => handleEditInit(act, "extracurriculars")} onDelete={() => setItemToDelete({ id: act._id, type: "extracurriculars", title: `${act.role} at ${act.organization}` })} />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    }

    function EmptyState() {
        return (
            <div className="py-24 flex flex-col items-center justify-center font-mono">
                <div className="w-16 h-16 rounded-2xl border border-gray-800 bg-gray-900/40 flex items-center justify-center mb-4">
                    <FileText className="w-7 h-7 text-gray-700" />
                </div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">No Records Found</p>
                <p className="text-gray-700 text-[10px] text-center max-w-xs leading-relaxed">
                    This collection is empty. Use the Upload New button to add the first record.
                </p>
            </div>
        );
    }

    function ActionRow({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
        return (
            <div className="flex gap-2 justify-end mt-3 pt-2.5 border-t border-gray-900/60">
                <button
                    onClick={onEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold text-teal-400/80 border border-teal-500/20 rounded-lg hover:bg-teal-500/10 hover:text-teal-300 hover:border-teal-500/40 transition-all"
                >
                    <Edit3 className="w-3 h-3" />
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold text-red-400/70 border border-red-500/20 rounded-lg hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40 transition-all"
                >
                    <Trash2 className="w-3 h-3" />
                    Delete
                </button>
            </div>
        );
    }

    // ─── Form Fields ─────────────────────────────────────────────────────────

    function renderFormFields() {
        if (!itemToEdit) return null;

        if (itemToEdit.type === "projects") {
            return (
                <div className="space-y-4">
                    <Field label="Project Name">
                        <input type="text" required value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Description">
                        <textarea required rows={3} value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className={`${inputCls} resize-none`} />
                    </Field>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="GitHub Repository URL">
                            <input type="text" required value={editForm.githubUrl || ""} onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })} className={inputCls} />
                        </Field>
                        <Field label="Live Demo URL (Optional)">
                            <input type="text" value={editForm.liveUrl || ""} onChange={(e) => setEditForm({ ...editForm, liveUrl: e.target.value })} className={inputCls} />
                        </Field>
                    </div>
                    <Field label="Tech Stack (comma-separated)">
                        <input type="text" required value={Array.isArray(editForm.techstack) ? editForm.techstack.join(", ") : editForm.techstack || ""} onChange={(e) => setEditForm({ ...editForm, techstack: e.target.value })} className={inputCls} placeholder="React, TypeScript, Node.js" />
                    </Field>
                    <div className="border-t border-gray-900 pt-4">
                        <Field label="Project Image">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                {editForm.imageUrl && !newImage && (
                                    <div className="w-28 h-16 border border-gray-800 rounded-lg overflow-hidden shrink-0 relative bg-black">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={editForm.imageUrl} alt="Current" className="w-full h-full object-cover" />
                                        <span className="absolute top-1 left-1 bg-teal-500 text-[7px] font-mono text-black font-bold px-1 rounded">ACTIVE</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files?.[0] || null)} className={`${inputCls} text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20`} />
                            </div>
                        </Field>
                    </div>
                </div>
            );
        }

        if (itemToEdit.type === "skills") {
            return (
                <div className="space-y-4">
                    <Field label="Skill Name">
                        <input type="text" required value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Description">
                        <textarea required rows={3} value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className={`${inputCls} resize-none`} />
                    </Field>
                    <div className="border-t border-gray-900 pt-4">
                        <Field label="Skill Icon / Image">
                            <div className="flex items-center gap-4">
                                {editForm.imageUrl && !newImage && (
                                    <div className="w-10 h-10 bg-teal-500/5 border border-teal-500/15 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={editForm.imageUrl} alt="Current" className="w-full h-full object-contain" />
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files?.[0] || null)} className={`${inputCls} text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20`} />
                            </div>
                        </Field>
                    </div>
                </div>
            );
        }

        if (itemToEdit.type === "experiences") {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Job Title">
                            <input type="text" required value={editForm.jobtitle || ""} onChange={(e) => setEditForm({ ...editForm, jobtitle: e.target.value })} className={inputCls} />
                        </Field>
                        <Field label="Company">
                            <input type="text" required value={editForm.company || ""} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} className={inputCls} />
                        </Field>
                    </div>
                    <Field label="Employment Type">
                        <select value={editForm.role || "Full-time"} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className={inputCls}>
                            {["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </Field>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Start Date">
                            <input type="date" required value={formatDateForInput(editForm.startDate)} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} className={inputCls} />
                        </Field>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">End Date</label>
                                <label className="flex items-center gap-1.5 text-xs text-teal-400 cursor-pointer select-none font-mono">
                                    <input type="checkbox" checked={ongoing} onChange={(e) => { setOngoing(e.target.checked); if (e.target.checked) setEditForm({ ...editForm, endDate: "" }); }} className="accent-teal-500" />
                                    Ongoing
                                </label>
                            </div>
                            <input type="date" disabled={ongoing} value={ongoing ? "" : formatDateForInput(editForm.endDate)} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} className={`${inputCls} disabled:opacity-20 disabled:cursor-not-allowed`} />
                        </div>
                    </div>
                    <Field label="Description / Achievements">
                        <textarea required rows={4} value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className={`${inputCls} resize-none`} />
                    </Field>
                </div>
            );
        }

        if (itemToEdit.type === "academics") {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="School / Institution">
                            <input type="text" required value={editForm.school || ""} onChange={(e) => setEditForm({ ...editForm, school: e.target.value })} className={inputCls} />
                        </Field>
                        <Field label="Degree / Course">
                            <input type="text" required value={editForm.degree || ""} onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })} className={inputCls} />
                        </Field>
                    </div>
                    <Field label="Grade / Score / CGPA">
                        <input type="text" required value={editForm.grade || ""} onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })} className={inputCls} placeholder="e.g., 9.8 CGPA, 95%" />
                    </Field>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Start Date">
                            <input type="date" required value={formatDateForInput(editForm.startDate)} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} className={inputCls} />
                        </Field>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">End Date</label>
                                <label className="flex items-center gap-1.5 text-xs text-teal-400 cursor-pointer select-none font-mono">
                                    <input type="checkbox" checked={ongoing} onChange={(e) => { setOngoing(e.target.checked); if (e.target.checked) setEditForm({ ...editForm, endDate: "" }); }} className="accent-teal-500" />
                                    Ongoing
                                </label>
                            </div>
                            <input type="date" disabled={ongoing} value={ongoing ? "" : formatDateForInput(editForm.endDate)} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} className={`${inputCls} disabled:opacity-20 disabled:cursor-not-allowed`} />
                        </div>
                    </div>
                </div>
            );
        }

        if (itemToEdit.type === "extracurriculars") {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Role / Position">
                            <input type="text" required value={editForm.role || ""} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className={inputCls} />
                        </Field>
                        <Field label="Organization">
                            <input type="text" required value={editForm.organization || ""} onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })} className={inputCls} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Start Date">
                            <input type="date" required value={formatDateForInput(editForm.startDate)} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} className={inputCls} />
                        </Field>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">End Date</label>
                                <label className="flex items-center gap-1.5 text-xs text-teal-400 cursor-pointer select-none font-mono">
                                    <input type="checkbox" checked={ongoing} onChange={(e) => { setOngoing(e.target.checked); if (e.target.checked) setEditForm({ ...editForm, endDate: "" }); }} className="accent-teal-500" />
                                    Ongoing
                                </label>
                            </div>
                            <input type="date" disabled={ongoing} value={ongoing ? "" : formatDateForInput(editForm.endDate)} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} className={`${inputCls} disabled:opacity-20 disabled:cursor-not-allowed`} />
                        </div>
                    </div>
                    <Field label="Description">
                        <textarea required rows={3} value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className={`${inputCls} resize-none`} />
                    </Field>
                    <div className="border-t border-gray-900 pt-4">
                        <Field label="Display Image">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                {editForm.imageUrl && !newImage && (
                                    <div className="w-28 h-16 border border-gray-800 rounded-lg overflow-hidden shrink-0 relative bg-black">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={editForm.imageUrl} alt="Current" className="w-full h-full object-cover" />
                                        <span className="absolute top-1 left-1 bg-teal-500 text-[7px] font-mono text-black font-bold px-1 rounded">ACTIVE</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files?.[0] || null)} className={`${inputCls} text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20`} />
                            </div>
                        </Field>
                    </div>
                </div>
            );
        }

        return null;
    }
}
