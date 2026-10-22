"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

interface Slide {
  quote: string;
  subtitle: string;
  badge: string;
}

const SLIDES: Slide[] = [
  {
    quote: "Empowering Citizens, Fixing Infrastructure",
    subtitle: "Real-time AI-triaged civic action across your neighborhood.",
    badge: "Community First",
  },
  {
    quote: "Privacy-Compliant Hazard Reporting",
    subtitle: "Automated bystander and license plate blurring at the media edge.",
    badge: "DPDP & GDPR Compliant",
  },
  {
    quote: "Transparent Municipal Accountability",
    subtitle: "Interactive Before & After resolution proof verified on the live map.",
    badge: "100% Verified Proof",
  },
];

const DURATION_MS = 3000;

interface AuthHeroBannerProps {
  quote?: string;
  authorOrSubtitle?: string;
}

export function AuthHeroBanner(_props?: AuthHeroBannerProps) {
  void _props;
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [progress, setProgress] = React.useState(0); // 0 to 100

  // Smooth timestamp-based timer to animate progress and sequence 1 -> 2 -> 3 -> 1 cleanly
  React.useEffect(() => {
    let startTime = performance.now();
    let animationFrameId: number;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(pct);

      if (elapsed >= DURATION_MS) {
        setCurrentSlide((slide) => (slide + 1) % SLIDES.length);
        startTime = performance.now();
        setProgress(0);
      }

      animationFrameId = requestAnimationFrame(frame);
    };

    animationFrameId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(animationFrameId);
  }, [currentSlide]);

  const handleSelectSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  return (
    <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between overflow-hidden rounded-[20px] p-8 text-white select-none min-h-[580px] shadow-2xl transition-colors duration-200 bg-gradient-to-b from-primary via-chart-5 to-[#1A1E36] dark:from-[#2E2856] dark:via-[#1A1E36] dark:to-[#0D111E]">
      {/* Background Graphic: Responsive atmospheric smart-city backdrop in both Light and Dark mode */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Dynamic mesh glow effects using DashStack tokens */}
        <div className="absolute -top-16 -left-16 h-80 w-80 rounded-full bg-white/20 dark:bg-primary/30 blur-[100px]" />
        <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-chart-5/40 dark:bg-chart-5/25 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-primary/30 dark:bg-primary/20 blur-[90px]" />

        {/* Topographic landscape dunes matching the visual layout reference */}
        <svg
          className="absolute inset-0 h-full w-full opacity-65 dark:opacity-60 transition-opacity"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 500 700"
        >
          <defs>
            {/* Light mode gradients */}
            <linearGradient id="dune-light-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4880FF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6226EF" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="dune-light-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6226EF" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#202224" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="dune-light-front" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312E81" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1B2431" stopOpacity="1" />
            </linearGradient>

            {/* Dark mode gradients */}
            <linearGradient id="dune-dark-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4338CA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="dune-dark-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312E81" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="dune-dark-front" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#080C14" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Smooth layered dunes: Light mode layer */}
          <g className="dark:hidden">
            <path
              d="M0,280 C150,230 350,330 500,260 L500,700 L0,700 Z"
              fill="url(#dune-light-1)"
            />
            <path
              d="M0,360 C120,300 280,390 500,320 L500,700 L0,700 Z"
              fill="url(#dune-light-2)"
            />
            <path
              d="M0,450 C200,380 320,490 500,420 L500,700 L0,700 Z"
              fill="url(#dune-light-front)"
            />
          </g>

          {/* Smooth layered dunes: Dark mode layer */}
          <g className="hidden dark:block">
            <path
              d="M0,280 C150,230 350,330 500,260 L500,700 L0,700 Z"
              fill="url(#dune-dark-1)"
            />
            <path
              d="M0,360 C120,300 280,390 500,320 L500,700 L0,700 Z"
              fill="url(#dune-dark-2)"
            />
            <path
              d="M0,450 C200,380 320,490 500,420 L500,700 L0,700 Z"
              fill="url(#dune-dark-front)"
            />
          </g>
        </svg>

        {/* Subtle inner glass highlight */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-[20px]" />
      </div>

      {/* Top Bar: Brand Logo + 'Back to website' pill button */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-md shadow-inner">
            <span className="font-heading text-lg font-black tracking-wider text-white">
              CL
            </span>
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-white drop-shadow-sm">
            {siteConfig.name}
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md ring-1 ring-white/30 transition-all hover:bg-white/30 shadow-xs"
        >
          <span>Back to website</span>
          <ArrowLeft className="h-3 w-3 rotate-180 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Bottom Section: 3-Slide Animated Carousel */}
      <div className="relative z-10 mt-auto pt-16">
        <div className="relative min-h-[140px] flex flex-col justify-end">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.quote}
                className={`transition-all duration-700 ease-out transform ${
                  isActive
                    ? "opacity-100 translate-y-0 relative z-10 pointer-events-auto"
                    : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none z-0"
                }`}
              >
                <div className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-md mb-2.5 ring-1 ring-white/20">
                  {slide.badge}
                </div>
                <blockquote className="space-y-2">
                  <p className="font-heading text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl drop-shadow-md">
                    {slide.quote}
                  </p>
                  <p className="text-sm font-normal text-white/85 drop-shadow-xs">
                    {slide.subtitle}
                  </p>
                </blockquote>
              </div>
            );
          })}
        </div>

        {/* Carousel Indicators: 1 long animated progress bar + 2 small dots */}
        <div className="mt-8 flex items-center gap-2">
          {SLIDES.map((_, index) => {
            const isActive = index === currentSlide;

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`group relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
                  isActive
                    ? "w-8 bg-white/30 shadow-sm"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              >
                {/* Active animated progress fill */}
                {isActive && (
                  <span
                    className="absolute inset-y-0 left-0 bg-white rounded-full transition-[width] ease-linear duration-75"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AuthHeroBanner;
