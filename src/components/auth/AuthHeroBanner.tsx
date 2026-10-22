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
    <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between overflow-hidden rounded-[20px] p-8 text-white select-none min-h-[580px] bg-sidebar">
      {/* Background Graphic: Atmospheric smart-city & civic-tech visual layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Deep gradient matching reference aesthetic with theme variables */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-sidebar to-sidebar" />

        {/* Dynamic mesh glow effects using DashStack chart/primary tokens */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-chart-5/25 blur-3xl" />

        {/* Topographic and subtle geospatial grid contour illustration */}
        <svg
          className="absolute inset-0 h-full w-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="civic-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary-foreground/15"
              />
            </pattern>
            <linearGradient id="horizon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--chart-5)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#civic-grid)" />
          {/* Silhouettes reminiscent of landscape dunes / city horizons */}
          <path
            d="M0,320 Q200,240 400,310 T800,260 L800,600 L0,600 Z"
            fill="url(#horizon-gradient)"
          />
          <path
            d="M0,380 Q300,300 550,370 T900,340 L900,600 L0,600 Z"
            fill="var(--background)"
            opacity="0.85"
          />
        </svg>
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
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md ring-1 ring-white/20 transition-all hover:bg-white/20 hover:text-white"
        >
          <span>Back to website</span>
          <ArrowLeft className="h-3 w-3 rotate-180 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Bottom Section: Hero Tagline + Pagination Dots */}
      <div className="relative z-10 mt-auto pt-16">
        <blockquote className="space-y-2">
          <p className="font-heading text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl drop-shadow-sm">
            {quote}
          </p>
          <p className="text-sm font-normal text-white/70">
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
