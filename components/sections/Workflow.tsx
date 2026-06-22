"use client";

import { motion } from "framer-motion";
import {
  Globe,
  FileInput,
  Bot,
  Sheet,
  Send,
  MessageCircle,
  Handshake,
  ChevronRight,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { workflowSteps } from "@/lib/data";

const icons = [Globe, FileInput, Bot, Sheet, Send, MessageCircle, Handshake];

export default function Workflow() {
  return (
    <section id="workflow" className="relative">
      <div className="section-pad">
        <SectionHeading
          eyebrow="AI Automation Workflow"
          title="From Visitor to Project — Automated"
          subtitle="Every lead flows through an AI-powered pipeline, so nothing slips through the cracks."
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-7 md:gap-2">
            {workflowSteps.map((step, i) => {
              const Icon = icons[i];
              return (
                <div key={step.label} className="flex items-center md:flex-col">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="glass relative z-10 flex w-full flex-1 flex-col items-center gap-2 rounded-2xl p-4 text-center"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-teal-glow to-cyan-glow text-midnight shadow-glow">
                      <Icon size={20} />
                    </span>
                    <span className="text-[13px] font-semibold leading-tight text-white">
                      {step.label}
                    </span>
                    <span className="text-[11px] leading-tight text-slate-400">
                      {step.desc}
                    </span>
                  </motion.div>

                  {i < workflowSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.1 }}
                      className="flex items-center justify-center px-2 text-teal-glow md:px-0 md:py-1"
                    >
                      <ChevronRight className="hidden md:block" size={16} />
                      <ChevronRight
                        className="block rotate-90 md:hidden"
                        size={16}
                      />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
