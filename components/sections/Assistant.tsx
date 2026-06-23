"use client";

import { motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp, stagger } from "@/components/motion";
import { useSiteContent } from "@/lib/useSiteContent";
import {
  isTelegramActive,
  openTelegram,
  resolveTelegramUsername,
} from "@/lib/telegram";

export default function Assistant() {
  const { assistant } = useSiteContent();
  const botReady = isTelegramActive(assistant);
  const tgUser = resolveTelegramUsername(assistant);

  return (
    <section id="assistant" className="relative">
      <div className="section-pad">
        <SectionHeading
          eyebrow="AI Assistant"
          title={assistant.title}
          subtitle={assistant.description}
        />

        <p className="mx-auto -mt-6 mb-12 max-w-2xl text-center text-sm text-slate-400">
          The assistant can guide you through projects, services, pricing,
          requirements, and developer hiring.
        </p>

        <div className="mx-auto grid max-w-4xl items-start gap-8 md:grid-cols-2">
          {/* Bot flow card */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="glass rounded-3xl p-6"
          >
            <h3 className="mb-5 flex items-center gap-2 font-display text-base font-semibold text-white">
              <Bot size={18} className="text-teal-glow" />
              How the assistant works
            </h3>
            <div className="space-y-3">
              {assistant.flowSteps.map((step, i) => (
                <motion.div
                  key={`${step}-${i}`}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-glow to-cyan-glow text-xs font-bold text-midnight">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed text-slate-300">
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-strong flex h-full flex-col items-center justify-center gap-4 rounded-3xl p-8 text-center"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-glow to-cyan-glow text-midnight shadow-glow">
              <Bot size={26} />
            </span>

            <span
              className={`chip ${
                botReady
                  ? "border-teal-glow/40 text-teal-glow"
                  : "border-amber-400/40 text-amber-300"
              }`}
            >
              {botReady ? "Assistant Active" : "Coming Soon"}
            </span>

            <p className="max-w-xs text-sm text-slate-400">
              {botReady
                ? "Start a conversation with the AI Assistant on Telegram."
                : "The Telegram assistant is being set up — check back soon."}
            </p>

            {botReady ? (
              <button
                type="button"
                onClick={() => openTelegram(assistant)}
                className="btn-primary"
              >
                <Send size={16} />
                {assistant.ctaText &&
                assistant.ctaText !== "Chat with AI Assistant"
                  ? assistant.ctaText
                  : "Open in Telegram"}
              </button>
            ) : (
              <button
                type="button"
                disabled
                title="Telegram assistant coming soon"
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-500"
              >
                <Send size={16} />
                Telegram assistant coming soon
              </button>
            )}

            {botReady && (
              <p className="max-w-xs text-[11px] leading-relaxed text-slate-500">
                If the Telegram app does not open, tap{" "}
                <span className="text-slate-400">Open in Telegram</span> again or
                copy the bot username:{" "}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard
                      ?.writeText(`@${tgUser}`)
                      .catch(() => {});
                  }}
                  className="font-semibold text-teal-glow hover:underline"
                >
                  @{tgUser}
                </button>
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
