"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp, stagger, Reveal } from "@/components/motion";
import { useSiteContent } from "@/lib/useSiteContent";

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${r} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < r ? "fill-teal-glow text-teal-glow" : "text-slate-600"
          }
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Reviews() {
  const { reviews } = useSiteContent();

  if (!reviews.length) return null;

  const avg =
    reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
    reviews.length;
  const avgLabel = avg.toFixed(1);

  return (
    <section id="reviews" className="relative">
      <div className="section-pad">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Clients Say"
          subtitle="Real feedback from people who shipped products with ANIK AI LABS."
        />

        {/* average rating */}
        <Reveal className="mx-auto mb-12 flex w-fit flex-col items-center gap-2">
          <div className="flex items-end gap-2">
            <span className="font-display text-5xl font-bold gradient-text">
              {avgLabel}
            </span>
            <span className="mb-1 text-sm text-slate-400">/ 5</span>
          </div>
          <Stars rating={avg} size={18} />
          <span className="text-xs text-slate-500">
            Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        </Reveal>

        {/* review cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reviews.map((r) => (
            <motion.figure
              key={r.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="glass relative flex flex-col rounded-3xl p-6"
            >
              <Quote
                size={28}
                className="absolute right-5 top-5 text-teal-glow/20"
              />
              <Stars rating={r.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-glow to-cyan-glow text-xs font-bold text-midnight">
                  {initials(r.clientName) || "AI"}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">
                    {r.clientName}
                  </span>
                  {r.projectName && (
                    <span className="block truncate text-xs text-teal-glow">
                      {r.projectName}
                    </span>
                  )}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
