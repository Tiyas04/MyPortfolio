"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Mail, MessageSquare, CheckCircle2, AlertCircle, Terminal, Briefcase, MapPin, Camera } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const json = await res.json();

      if (json.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        // Reset success message after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setErrorMessage(json.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again later.");
    }
  };

  return (
    <section id="contact" className="w-full py-24 bg-transparent text-white overflow-hidden relative">
      {/* Ambient glows matching Hero */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none transform -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-300/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Text & Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="font-audiowide text-4xl md:text-5xl font-bold leading-tight mb-6">
              <span className="text-white">Let's</span>
              <br />
              <span
                className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-teal-300"
                style={{ WebkitTextStroke: "1px #14b8a6", color: "transparent" }}
              >
                Connect.
              </span>
            </h2>
            
            <p className="text-gray-400 text-md leading-relaxed border-l-2 border-teal-500 pl-4 mb-10 max-w-md">
              Have a project in mind, a question, or just want to say hi? I'm currently open to new opportunities and collaborations. Drop a message below!
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center gap-4 text-gray-300 group">
                <div className="w-12 h-12 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center group-hover:border-teal-500 group-hover:text-teal-400 transition-all duration-300 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Email</p>
                  <a href="mailto:mandaltiyas2410@gmail.com" className="hover:text-teal-400 transition-colors">mandaltiyas2410@gmail.com</a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 text-gray-300 group">
                <div className="w-12 h-12 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center group-hover:border-teal-500 group-hover:text-teal-400 transition-all duration-300 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Location</p>
                  <p className="hover:text-teal-400 transition-colors">Bankura, West Bengal, India</p>
                </div>
              </div>

              {/* Socials Grid */}
              <div className="pt-4 flex gap-4">
                <a 
                  href="https://github.com/Tiyas04" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-400 hover:border-teal-500 hover:text-teal-400 transition-all duration-300 hover:-translate-y-1"
                >
                  <Terminal className="w-5 h-5" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a 
                  href="https://linkedin.com/tiyas-mandal-a2a014343" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-400 hover:border-teal-500 hover:text-teal-400 transition-all duration-300 hover:-translate-y-1"
                >
                  <Briefcase className="w-5 h-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a 
                  href="https://instagram.com/tiyas__004" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-400 hover:border-teal-500 hover:text-teal-400 transition-all duration-300 hover:-translate-y-1"
                >
                  <Camera className="w-5 h-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="w-full"
          >
            <div className="p-8 md:p-10 rounded-3xl border border-gray-800 bg-gray-900/40 backdrop-blur-md shadow-2xl relative overflow-hidden">
              {/* Decorative corner glow inside the form card */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="font-audiowide text-2xl font-bold text-white mb-8">Send a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Name */}
                <div className="relative">
                  <label htmlFor="name" className="sr-only">Name</label>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-950/50 border border-gray-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white placeholder-gray-600 transition-all duration-300"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-950/50 border border-gray-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white placeholder-gray-600 transition-all duration-300"
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <label htmlFor="message" className="sr-only">Message</label>
                  <div className="absolute top-4 left-4 pointer-events-none text-gray-500">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Your Message..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-950/50 border border-gray-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white placeholder-gray-600 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-400/10 border border-red-400/20 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p>{errorMessage}</p>
                    </motion.div>
                  )}
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-teal-400 text-sm p-3 bg-teal-400/10 border border-teal-400/20 rounded-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <p>Message sent successfully! I'll get back to you soon.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-gray-950 rounded-xl font-bold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]"
                >
                  {status === "loading" ? (
                    <div className="w-6 h-6 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}