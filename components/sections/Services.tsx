"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp, stagger } from "@/components/motion";
import { useSiteContent } from "@/lib/useSiteContent";
import DynamicIcon from "@/components/DynamicIcon";

export default function Services() {
  const { services } = useSiteContent();

  return (
    <section id="services" className="relative">
      <div className="section-pad">
        <SectionHeading
          eyebrow="Services"
          title="What I Can Build For You"
          subtitle="End-to-end software and AI services — from idea to shipped product."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => (
            <motion.div
              key={s.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="glass group relative overflow-hidden rounded-2xl p-6"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal-glow/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-teal-glow/20 to-cyan-glow/20 text-teal-glow">
                <DynamicIcon name={s.icon} size={22} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
