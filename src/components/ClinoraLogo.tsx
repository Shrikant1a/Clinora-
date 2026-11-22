"use client";

import React from "react";
import Link from "next/link";

interface ClinoraLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  showBadge?: boolean;
  href?: string;
}

export function ClinoraLogo({
  className = "",
  size = "md",
  showText = true,
  showTagline = true,
  showBadge = true,
  href = "/",
}: ClinoraLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
    xl: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const logoIcon = (
    <div
      className={`relative ${iconSizes[size]} rounded-2xl p-[1px] bg-gradient-to-tr from-[#8B1E3F] via-[#DE4E76] to-[#7C3AED] shadow-md shadow-[#8B1E3F]/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}
    >
      {/* Inner background with glass sheen */}
      <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#8B1E3F] to-[#591026] flex items-center justify-center relative overflow-hidden">
        {/* Subtle radial gloss overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_70%)]" />

        {/* SVG Mark: Intertwined Medical Cross & Fluid Pulse Curve (The "C" of Clinora) */}
        <svg
          viewBox="0 0 40 40"
          className="w-[72%] h-[72%] text-white drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized 'C' Aura Arc */}
          <path
            d="M 28 9 C 23 5 13 6 8 13 C 3 20 4 30 11 35 C 17 39 26 38 31 31"
            stroke="url(#clinora-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Central Healthcare Cross Fusion */}
          <path
            d="M 20 12 L 20 28"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 12 20 L 28 20"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Pulse Rhythm Segment */}
          <path
            d="M 14 20 L 17 20 L 19 16 L 21 24 L 23 20 L 26 20"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sparkle of Aura (✦) at Top Right */}
          <path
            d="M 30 7 Q 31 10 34 11 Q 31 12 30 15 Q 29 12 26 11 Q 29 10 30 7 Z"
            fill="#FEE2E2"
          />

          <defs>
            <linearGradient id="clinora-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F9A8D4" />
              <stop offset="100%" stopColor="#DE4E76" />
            </linearGradient>
          </defs>
        </svg>

        {/* Live Active Signal Dot */}
        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#8B1E3F] animate-pulse" />
      </div>
    </div>
  );

  const content = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {logoIcon}

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight ${textSizes[size]} text-[#1B1B1F] dark:text-white flex items-center`}
            >
              <span>Clin</span>
              <span className="bg-gradient-to-r from-[#8B1E3F] via-[#DE4E76] to-[#7C3AED] dark:from-[#EA96AC] dark:via-[#F472B6] dark:to-[#C084FC] bg-clip-text text-transparent">
                ora
              </span>
            </span>

            {showBadge && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                24x7
              </span>
            )}
          </div>

          {showTagline && (
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono tracking-tight mt-0.5">
              WhatsApp AI Clinic Automation
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
