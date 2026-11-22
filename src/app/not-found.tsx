import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FFF7F9] to-[#FCF8FA] dark:from-[#0F0D15] dark:to-[#0D0B12] text-center">
      <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-950/60 flex items-center justify-center text-[#8B1E3F] mb-6 shadow-inner">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-[#8B1E3F] hover:bg-[#7A1A37] transition-all shadow-md shadow-[#8B1E3F]/25"
      >
        <Home className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
}
