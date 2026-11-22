"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FFF7F9] to-[#FCF8FA] dark:from-[#0F0D15] dark:to-[#0D0B12] text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 mb-6 shadow-inner">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight mb-2">
        Something went wrong
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-6">
        An unexpected error occurred. Please try again or return to the main dashboard.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-[#8B1E3F] hover:bg-[#7A1A37] transition-all shadow-md shadow-[#8B1E3F]/25"
      >
        <RotateCcw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}
