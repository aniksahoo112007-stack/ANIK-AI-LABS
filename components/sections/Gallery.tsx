"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp, stagger } from "@/components/motion";
import { useSiteContent } from "@/lib/useSiteContent";

function GalleryImage({ src, title }: { src: string; title: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
        <ImageIcon size={30} />
        <span className="px-4 text-center text-xs">
          {src ? "Image could not load" : "No image set"}
        </span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={title}
      onError={() => setError(true)}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  );
}

export default function Gallery() {
  const { gallery } = useSiteContent();

  if (!gallery.length) return null;

  return (
    <section id="gallery" className="relative">
      <div className="section-pad">
        <SectionHeading
          eyebrow="Project Gallery"
          title="A Closer Look"
          subtitle="Visual previews of each build. Manage these images from the admin panel."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {gallery.map((item) => (
            <motion.figure
              key={item.id}
              variants={fadeUp}
              className="group glass relative aspect-square overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-glow to-cyan-glow opacity-10" />
              <GalleryImage src={item.url} title={item.title} />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight to-transparent p-4">
                <span className="block text-sm font-semibold text-white">
                  {item.title}
                </span>
                {item.description && (
                  <span className="mt-0.5 block text-[11px] text-slate-300">
                    {item.description}
                  </span>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
