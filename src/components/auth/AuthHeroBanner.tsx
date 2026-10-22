import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

interface AuthHeroBannerProps {
  quote?: string;
  authorOrSubtitle?: string;
}

export function AuthHeroBanner({
  quote = "Empowering Citizens, Fixing Infrastructure",
  authorOrSubtitle = "Real-time AI-triaged civic action across your neighborhood.",
}: AuthHeroBannerProps) {
  return (
    <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between overflow-hidden rounded-[20px] p-8 text-white select-none min-h-[580px] bg-[#121824] shadow-2xl">
      {/* Background Graphic: Rich atmospheric dusk gradient & smart-city aesthetic matching the reference image */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Rich atmospheric dusk-to-night gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2E2856] via-[#1A1E36] to-[#0D111E]" />

        {/* Ambient radial glows */}
        <div className="absolute -top-16 -left-16 h-80 w-80 rounded-full bg-[#4880FF]/30 blur-[100px]" />
        <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#6226EF]/25 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-[#3B82F6]/20 blur-[90px]" />

        {/* Topographic landscape layers and subtle star/grid points matching the photo */}
        <svg
          className="absolute inset-0 h-full w-full opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 500 700"
        >
          <defs>
            <linearGradient id="dune-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4338CA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="dune-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312E81" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="dune-front" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#080C14" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Smooth layered dunes reminiscent of visual reference */}
          <path
            d="M0,280 C150,230 350,330 500,260 L500,700 L0,700 Z"
            fill="url(#dune-1)"
          />
          <path
            d="M0,360 C120,300 280,390 500,320 L500,700 L0,700 Z"
            fill="url(#dune-2)"
          />
          <path
            d="M0,450 C200,380 320,490 500,420 L500,700 L0,700 Z"
            fill="url(#dune-front)"
          />
        </svg>

        {/* Subtle vignette border */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[20px]" />
      </div>

      {/* Top Bar: Brand Logo + 'Back to website' pill button */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md shadow-inner">
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
          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white/95 backdrop-blur-md ring-1 ring-white/20 transition-all hover:bg-white/25 hover:text-white shadow-xs"
        >
          <span>Back to website</span>
          <ArrowLeft className="h-3 w-3 rotate-180 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Bottom Section: Hero Tagline + Pagination Dots */}
      <div className="relative z-10 mt-auto pt-16">
        <blockquote className="space-y-2">
          <p className="font-heading text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl drop-shadow-md">
            {quote}
          </p>
          <p className="text-sm font-normal text-white/80 drop-shadow-xs">
            {authorOrSubtitle}
          </p>
        </blockquote>

        {/* Carousel indicators matching reference design */}
        <div className="mt-8 flex items-center gap-2">
          <span className="h-1.5 w-6 rounded-full bg-white transition-all shadow-sm" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}

export default AuthHeroBanner;
