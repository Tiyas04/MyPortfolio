"use client"

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import images from "@/images/index";

export default function Hero() {
    return (
        <section className="w-full bg-transparent text-white pt-8 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center min-h-[600px]">
                    {/* Left Section - Heading */}
                    <div className="lg:col-span-1">
                        <h1 className="font-audiowide text-6xl md:text-7xl font-bold leading-tight mb-6 text-left">
                            <div className="text-white">Hi </div>
                            <div className="text-4xl md:text-5xl text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-teal-300" style={{
                                WebkitTextStroke: "1px #14b8a6",
                                color: "black"
                            }}>
                                This is <span className="text-teal-400">Tiyas</span>
                            </div>
                            <div className="text-white text-4xl">Web Developer </div>
                        </h1>
                        
                        <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-teal-500 pl-4">
                            Love to turn the ideas into reality. Crafting high-performance websites and applications tailored to your business needs.
                        </p>
                    </div>

                    {/* Center Section - Image */}
                    <div className="lg:col-span-1 flex justify-center">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute inset-0 bg-linear-to-br from-teal-500/20 to-transparent rounded-xl blur-2xl"></div>
                            <Image
                                src={images.TiyasImage}
                                alt="Tiyas - Founder & Lead Developer"
                                width={400}
                                height={500}
                                className="relative w-full h-auto rounded-lg object-cover brightness-75 contrast-110"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Section - CTA and Description */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            <h2 className="font-audiowide text-3xl md:text-4xl font-bold leading-tight">
                                Think. Design.
                                <br />
                                <span className="text-teal-400">Develop. Deploy.</span>
                            </h2>
                            
                            <p className="text-gray-400 text-sm leading-relaxed">
                                I am a passionate web developer with expertise in crafting high-performance websites and applications. I specialize in turning ideas into reality, delivering tailored solutions that meet your business needs.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="/#contact"
                                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 text-center"
                                >
                                    Get in Touch
                                </Link>
                                <Link
                                    href="/services"
                                    className="px-8 py-3 border-2 border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-white rounded-lg font-medium transition-all duration-200 text-center"
                                >
                                    Get Resume
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}