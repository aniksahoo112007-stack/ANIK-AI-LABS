"use client";

import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Github,
  Linkedin,
  Instagram,
  FileText,
  BookOpen,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp, stagger } from "@/components/motion";
import { useSiteContent } from "@/lib/useSiteContent";

function whatsappLink(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : value;
}

export default function Contact() {
  const { contact, media } = useSiteContent();

  const links = [
    contact.email && {
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    contact.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: contact.whatsapp,
      href: whatsappLink(contact.whatsapp),
    },
    contact.github && {
      icon: Github,
      label: "GitHub",
      value: "View my code",
      href: contact.github,
    },
    contact.linkedin && {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Connect with me",
      href: contact.linkedin,
    },
    contact.instagram && {
      icon: Instagram,
      label: "Instagram",
      value: "Follow me",
      href: contact.instagram,
    },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    value: string;
    href: string;
  }[];

  return (
    <section id="contact" className="relative">
      <div className="section-pad">
        <SectionHeading
          eyebrow="Contact"
          title="Get In Touch"
          subtitle="Prefer a direct line? Reach me on any of these."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {links.map((l) => (
            <motion.a
              key={l.label}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="glass group flex flex-col items-center gap-3 rounded-2xl p-6 text-center transition hover:border-teal-glow/40"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-teal-glow/20 to-cyan-glow/20 text-teal-glow transition group-hover:shadow-glow">
                <l.icon size={22} />
              </span>
              <div>
                <div className="text-sm font-semibold text-white">
                  {l.label}
                </div>
                <div className="mt-0.5 text-xs text-slate-400">{l.value}</div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {(media.resumePdf || media.brandBookPdf) && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {media.resumePdf && (
              <a
                href={media.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <FileText size={16} />
                Download Resume
              </a>
            )}
            {media.brandBookPdf && (
              <a
                href={media.brandBookPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <BookOpen size={16} />
                Brand Book
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
