"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Bot, Check } from "lucide-react";
import { navLinks } from "@/lib/data";
import { useSiteContent } from "@/lib/useSiteContent";
import { isTelegramActive } from "@/lib/telegram";

export default function Navbar() {
  const { hero, assistant } = useSiteContent();
  const brandParts = hero.brand.trim().split(" ");
  const brandFirst = brandParts[0];
  const brandRest = brandParts.slice(1).join(" ");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  const tgActive = isTelegramActive(assistant);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Opens the Telegram bot if active, otherwise shows a "Coming Soon" toast.
  function openAssistant(closeMenu = false) {
    if (closeMenu) setOpen(false);
    if (tgActive) {
      window.open(assistant.telegramUrl, "_blank", "noopener,noreferrer");
    } else {
      setToast("AI Assistant — Coming Soon");
      window.setTimeout(() => setToast(""), 2200);
    }
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-midnight/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <a href="#home" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-glow to-cyan-glow text-midnight shadow-glow">
            <Sparkles size={18} />
          </span>
          <span className="font-display text-sm font-bold tracking-wide text-white">
            {brandFirst} <span className="gradient-text">{brandRest}</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-teal-glow"
            >
              {l.label}
            </a>
          ))}
          <a href="#ask" className="btn-ghost !px-5 !py-2">
            Ask Developer
          </a>
          <button
            onClick={() => openAssistant(false)}
            className="btn-primary group !px-5 !py-2"
            aria-label="Open AI Assistant on Telegram"
          >
            <Bot
              size={16}
              className="transition-transform group-hover:scale-110"
            />
            AI Assistant
          </button>
        </div>

        <button
          className="text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-midnight/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-teal-glow"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#ask"
                onClick={() => setOpen(false)}
                className="btn-ghost mt-2"
              >
                Ask Developer
              </a>
              <button
                onClick={() => openAssistant(true)}
                className="btn-primary mt-2"
              >
                <Bot size={16} />
                AI Assistant
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* coming soon toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-400/40 bg-midnight-100/95 px-5 py-2.5 text-sm font-medium text-amber-300 shadow-glow backdrop-blur-xl"
          >
            <Check size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
