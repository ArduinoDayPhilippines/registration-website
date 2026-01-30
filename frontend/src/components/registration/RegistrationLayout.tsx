import React from 'react';
import Image from 'next/image';
import { Facebook, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RegistrationStepper } from './RegistrationStepper';

interface RegistrationLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
  date?: string;
  location?: string;
  description?: string;
  logoSrc?: string;
  brandName?: string;
  isTransitioning?: boolean;
}

export function RegistrationLayout({
  children,
  currentStep,
  totalSteps = 3,
  date = "MARCH 21, 2026",
  location = "Insert University",
  description,
  logoSrc = "/images/logos/adph-logo.png",
  brandName = "Arduino Day Philippines",
  isTransitioning = false,
}: RegistrationLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a1016] text-white overflow-hidden relative font-sans selection:bg-primary/30">
        {/* Background Gradients/Glows to simulate the premium dark feel */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full opacity-20 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[150px] rounded-full opacity-10 pointer-events-none" />

        {/* Top Header */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a1016]/80 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 md:w-10 md:h-10 mr-4">
                   <Image src={logoSrc} alt="Logo" fill className="object-contain" />
                </div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                    {brandName} Registration
                </h1>
            </div>
            <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(238,116,2,0.4)] transition-all text-sm md:text-base">
                Registration Finder
            </button>
        </header>

        <div className="container mx-auto px-4 h-full min-h-screen flex flex-col md:flex-row relative z-10 justify-center">
            {/* Left Sidebar / Info Section - Only visible on Step 1 */}
            {currentStep === 1 && (
                <div className={cn(
                    "w-full md:w-5/12 lg:w-4/12 flex flex-col justify-center py-12 md:pr-12",
                    isTransitioning 
                        ? "animate-out slide-out-to-left-10 fade-out duration-500 fill-mode-forwards" 
                        : "animate-in slide-in-from-left-4 duration-500"
                )}>
                    
                    {/* Main Content */}
                    <div className="flex flex-col gap-8">
                         {/* Hero Image / Branding */}
                        <div className="relative w-full aspect-video md:aspect-[4/3] mb-4">
                             <Image 
                                src={logoSrc} 
                                alt="Event Branding" 
                                fill 
                                className="object-contain drop-shadow-[0_0_25px_rgba(0,128,128,0.4)]"
                             />
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-primary font-bold uppercase tracking-wider text-sm">Date:</span>
                                <span className="font-semibold text-lg text-primary">{date}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-white font-bold uppercase tracking-wider text-sm">Location:</span>
                                <span className="font-semibold text-lg text-white">{location}</span>
                            </div>
                        </div>

                        <p className="text-white/70 leading-relaxed text-sm md:text-base">
                            {description || (
                                <>
                                Join us for the annual <span className="text-primary font-bold">Arduino Day Philippines</span>. 
                                Be part of the nationwide community of creators, students, and pros to share knowledge and showcase groundbreaking projects.
                                </>
                            )}
                        </p>
                    </div>

                    {/* Footer / Socials */}
                    <div className="flex items-center gap-4 mt-12 md:mt-12">
                        <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-primary transition-colors">
                            <Facebook size={36} />
                        </a>
                        <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-primary transition-colors">
                            <Linkedin size={36} />
                        </a>
                        <div className="ml-auto md:ml-0 md:hidden text-xs text-white/30">
                            © 2026 {brandName}
                        </div>
                    </div>
                </div>
            )}

            {/* Right Side / Form Container */}
            <div className={cn(
                "flex flex-col justify-center py-8 md:py-12 transition-all duration-500",
                currentStep === 1 ? "w-full md:w-7/12 lg:w-8/12 pl-0 md:pl-8" : "w-full max-w-2xl"
            )}>
                {/* Stepper Header */}
                 <div className="mb-8 pl-4">
                    <RegistrationStepper currentStep={currentStep} totalSteps={totalSteps} />
                 </div>

                {/* Glassmorphism Card */}
                <div className="relative flex-1 bg-[#1E1E1E80] backdrop-blur-xl border border-white/10 rounded-[45px] p-6 md:p-10 shadow-2xl flex flex-col">
                    {children}
                </div>
                 <div className="text-center mt-6 text-xs text-white/30 hidden md:block">
                    © 2026 {brandName}. All rights reserved.
                </div>
            </div>
        </div>
    </div>
  );
}
