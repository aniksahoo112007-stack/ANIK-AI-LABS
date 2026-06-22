"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquareCode, Sparkles } from "lucide-react";
import { useSiteContent } from "@/lib/useSiteContent";

const stats = [
  { value: "4+", label: "Shipped Projects" },
  { value: "7", label: "Service Areas" },
  { value: "AI", label: "First Mindset" },
];

function BrandTitle({ brand }: { brand: string }) {
  const parts = brand.trim().split(" ");
  if (parts.length < 2) return <span className="gradient-text">{brand}</span>;
  const first = parts[0];
  const rest = parts.slice(1).join(" ");
  return (
    <>
      {first} <span className="gradient-text">{rest}</span>
    </>
  );
}

export default function Hero() {
  const { hero } = useSiteContent();

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24"
    >
      <div className="section-pad text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-teal-glow/30 bg-teal-glow/5 px-4 py-1.5 text-xs font-medium text-teal-glow"
        >
          <Sparkles size={14} />
          Premium AI Software Studio
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          <BrandTitle brand={hero.brand} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl"
        >
          {hero.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mx-auto mt-3 max-w-xl text-sm text-slate-400"
        >
          {hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a href="#projects" className="btn-primary group">
            {hero.primaryCta}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <a href="#ask" className="btn-ghost">
            <MessageSquareCode size={16} />
            {hero.secondaryCta}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl px-4 py-5">
              <div className="font-display text-2xl font-bold gradient-text">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-teal-glow"
          />
        </div>
      </motion.div>
    </section>
  );
}
