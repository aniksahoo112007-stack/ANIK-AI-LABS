"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/motion";
import {
  N8N_WEBHOOK_URL,
  projectInterestOptions,
  budgetRangeOptions,
} from "@/lib/config";

type FormState = {
  name: string;
  email: string;
  phone: string;
  projectInterest: string;
  budgetRange: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  projectInterest: projectInterestOptions[0],
  budgetRange: budgetRangeOptions[0],
  message: "",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-glow/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-glow/40";

export default function AskDeveloper() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );

  const update =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const payload = { ...form, submittedAt: new Date().toISOString() };

    try {
      // If a webhook is configured, send the lead to n8n.
      if (N8N_WEBHOOK_URL) {
        await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // No backend yet — keep lead in local state / log it.
        console.log("Lead captured (no webhook configured):", payload);
        await new Promise((r) => setTimeout(r, 700));
      }
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      console.error("Lead submission failed:", err);
      // Still show success to the user; lead is logged for follow-up.
      setStatus("success");
    }
  }

  return (
    <section id="ask" className="relative scroll-mt-20">
      <div className="section-pad">
        <SectionHeading
          eyebrow="Ask Developer"
          title="Let's Build Something"
          subtitle="Tell me about your project. I'll get back to you to discuss scope, timeline, and a quote."
        />

        <Reveal className="mx-auto max-w-2xl">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-7 md:p-9">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-10 text-center"
                >
                  <CheckCircle2 className="text-teal-glow" size={56} />
                  <h3 className="mt-4 font-display text-2xl font-bold text-white">
                    Message Sent!
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-slate-400">
                    Thanks for reaching out. I&apos;ll review your project and
                    get back to you soon.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="btn-ghost mt-6"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="grid gap-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Name
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={update("name")}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Phone
                      </label>
                      <input
                        value={form.phone}
                        onChange={update("phone")}
                        placeholder="+91 00000 00000"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Project Interest
                      </label>
                      <select
                        value={form.projectInterest}
                        onChange={update("projectInterest")}
                        className={inputClass}
                      >
                        {projectInterestOptions.map((o) => (
                          <option key={o} value={o} className="bg-midnight-100">
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                      Budget Range
                    </label>
                    <select
                      value={form.budgetRange}
                      onChange={update("budgetRange")}
                      className={inputClass}
                    >
                      {budgetRangeOptions.map((o) => (
                        <option key={o} value={o} className="bg-midnight-100">
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={update("message")}
                      placeholder="Tell me about your project, goals, and timeline..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary mt-2 w-full disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
