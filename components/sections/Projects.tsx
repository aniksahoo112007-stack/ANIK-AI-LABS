"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  MessageSquareCode,
  X,
  ImageIcon,
  ExternalLink,
  Github,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp, stagger } from "@/components/motion";
import { useSiteContent } from "@/lib/useSiteContent";
import type { ProjectContent } from "@/lib/types";
import { toEmbedUrl } from "@/lib/media";

function ProjectImage({ project }: { project: ProjectContent }) {
  const [error, setError] = useState(false);
  if (!project.image || error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
        <ImageIcon size={28} />
        <span className="px-3 text-center text-xs">
          {project.image ? "Image could not load" : "No image set"}
        </span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={project.image}
      alt={project.name}
      onError={() => setError(true)}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

function ProjectCard({
  project,
  onView,
}: {
  project: ProjectContent;
  onView: () => void;
}) {
  return (
    <motion.article
      variants={fadeUp}
      className="group glass relative flex flex-col overflow-hidden rounded-3xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-midnight-100">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-10`}
        />
        <ProjectImage project={project} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold text-white">
          {project.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-teal-glow">
          {project.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.features.slice(0, 3).map((f) => (
            <span key={f} className="chip">
              {f}
            </span>
          ))}
          {project.features.length > 3 && (
            <span className="chip border-teal-glow/30 text-teal-glow">
              +{project.features.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="text-[11px] text-slate-500">
              #{s.replace(/\s+/g, "")}
            </span>
          ))}
        </div>

        <div className="mt-6 flex gap-3 pt-2">
          <button onClick={onView} className="btn-primary flex-1 !px-4 !py-2.5">
            View Details
            <ArrowUpRight size={15} />
          </button>
          <a href="#ask" className="btn-ghost !px-4 !py-2.5">
            <MessageSquareCode size={15} />
            {project.askCta || "Ask"}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectContent | null;
  onClose: () => void;
}) {
  const embed = project ? toEmbedUrl(project.video) : null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-midnight/80 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-7"
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <span
              className={`inline-block rounded-full bg-gradient-to-r ${project.accent} px-3 py-1 text-xs font-semibold text-midnight`}
            >
              {project.tagline}
            </span>
            <h3 className="mt-4 font-display text-3xl font-bold text-white">
              {project.name}
            </h3>
            <p className="mt-3 leading-relaxed text-slate-300">
              {project.description}
            </p>

            {embed && (
              <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  src={embed}
                  title={`${project.name} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <h4 className="mt-6 text-sm font-semibold text-teal-glow">
              Key Features
            </h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {project.features.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-sm text-slate-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-glow" />
                  {f}
                </div>
              ))}
            </div>

            <h4 className="mt-6 text-sm font-semibold text-teal-glow">
              Tech Stack
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>

            {(project.liveUrl || project.githubUrl) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost !px-4 !py-2.5"
                  >
                    <ExternalLink size={15} />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost !px-4 !py-2.5"
                  >
                    <Github size={15} />
                    GitHub
                  </a>
                )}
              </div>
            )}

            <a href="#ask" onClick={onClose} className="btn-primary mt-6 w-full">
              <MessageSquareCode size={16} />
              {project.askCta && project.askCta !== "Ask"
                ? project.askCta
                : `Ask Developer about ${project.name}`}
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Projects() {
  const { projects } = useSiteContent();
  const [active, setActive] = useState<ProjectContent | null>(null);

  return (
    <section id="projects" className="relative">
      <div className="section-pad">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Things I've Built"
          subtitle="Real products solving real problems — from desktop AI to retail systems and analytics."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {projects.map((p) => (
            <ProjectCard
              key={p.slug}
              project={p}
              onView={() => setActive(p)}
            />
          ))}
        </motion.div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
