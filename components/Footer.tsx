"use client";

import { Sparkles } from "lucide-react";
import { useSiteContent } from "@/lib/useSiteContent";

export default function Footer() {
  const { hero, about } = useSiteContent();
  const brandParts = hero.brand.trim().split(" ");
  const brandFirst = brandParts[0];
  const brandRest = brandParts.slice(1).join(" ");

  return (
    <footer className="relative border-t border-white/10 bg-midnight/60">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-glow to-cyan-glow text-midnight shadow-glow">
              <Sparkles size={18} />
            </span>
            <span className="font-display text-lg font-bold tracking-wide text-white">
              {brandFirst} <span className="gradient-text">{brandRest}</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            AI Solutions, Automation and Software Development
          </p>
          <div className="glow-divider my-8 w-full max-w-md" />
          <p className="text-xs text-slate-500">
            Built by{" "}
            <span className="font-semibold text-slate-300">
              {about.founderName}
            </span>{" "}
            &middot; &copy; {new Date().getFullYear()} {hero.brand}. All rights
            reserved.
          </p>
        </div>

        {/* discreet admin access */}
        <div className="mt-6 flex justify-center sm:justify-end">
          <a
            href="/admin"
            className="text-[11px] font-normal text-slate-600 transition-colors duration-200 hover:text-slate-300"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
