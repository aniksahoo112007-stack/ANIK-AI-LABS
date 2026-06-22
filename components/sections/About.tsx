"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup, fadeUp } from "@/components/motion";
import { useSiteContent } from "@/lib/useSiteContent";

function Avatar({ photoUrl, name }: { photoUrl: string; name: string }) {
  const [error, setError] = useState(false);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photoUrl && !error) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={photoUrl}
        alt={name}
        onError={() => setError(true)}
        className="h-full w-full rounded-3xl object-cover"
      />
    );
  }
  return (
    <span className="font-display text-6xl font-bold gradient-text">
      {initials}
    </span>
  );
}

export default function About() {
  const { about } = useSiteContent();

  return (
    <section id="about" className="relative">
      <div className="section-pad">
        <SectionHeading
          eyebrow="About the Founder"
          title={`Meet ${about.founderName}`}
        />

        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-glow to-cyan-glow blur-2xl opacity-40" />
              <div className="glass-strong relative grid h-56 w-56 place-items-center overflow-hidden rounded-3xl">
                <Avatar photoUrl={about.photoUrl} name={about.founderName} />
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-slate-300">
                {about.aboutText}
              </p>
            </Reveal>

            <RevealGroup className="mt-8 flex flex-wrap gap-3">
              {about.skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={fadeUp}
                  className="glass rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-200"
                >
                  {skill}
                </motion.span>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
