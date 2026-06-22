"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock, Film } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/motion";
import { useSiteContent } from "@/lib/useSiteContent";
import { toEmbedUrl, isDirectVideo } from "@/lib/media";

function Thumbnail({ url, title }: { url: string; title: string }) {
  const [error, setError] = useState(false);
  if (!url || error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-midnight-100 via-midnight to-midnight-200">
        <Film size={48} className="text-white/10" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={url}
      alt={title}
      onError={() => setError(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

export default function VideoShowcase() {
  const { videoShowcase: v } = useSiteContent();
  const [playing, setPlaying] = useState(false);

  const ready = v.status === "active" && v.videoUrl.trim().length > 0;
  const embed = toEmbedUrl(v.videoUrl);
  const direct = isDirectVideo(v.videoUrl);

  return (
    <section id="video" className="relative">
      <div className="section-pad">
        <SectionHeading
          eyebrow="Promotional Video"
          title={v.sectionTitle}
          subtitle={v.sectionDescription}
        />

        <Reveal className="mx-auto max-w-4xl">
          <div className="glass-strong overflow-hidden rounded-3xl">
            {/* media area */}
            <div className="relative aspect-video w-full overflow-hidden bg-midnight-100">
              {ready && playing ? (
                direct ? (
                  <video
                    src={v.videoUrl}
                    controls
                    autoPlay
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <iframe
                    src={`${embed}${embed?.includes("?") ? "&" : "?"}autoplay=1`}
                    title={v.videoTitle}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <>
                  <Thumbnail url={v.thumbnailUrl} title={v.videoTitle} />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />

                  {/* tag + duration */}
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {v.projectTag && (
                      <span className="rounded-full bg-gradient-to-r from-teal-glow to-cyan-glow px-3 py-1 text-xs font-semibold text-midnight">
                        {v.projectTag}
                      </span>
                    )}
                    {v.duration && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
                        <Clock size={12} />
                        {v.duration}
                      </span>
                    )}
                  </div>

                  {/* play / coming soon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {ready ? (
                      <button
                        onClick={() => setPlaying(true)}
                        aria-label="Play promotional video"
                        className="group grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-teal-glow to-cyan-glow text-midnight shadow-glow transition-transform hover:scale-110 active:scale-95"
                      >
                        <Play size={32} className="ml-1 fill-midnight" />
                      </button>
                    ) : (
                      <span className="rounded-full border border-amber-400/40 bg-black/50 px-5 py-2.5 text-sm font-semibold text-amber-300 backdrop-blur">
                        Promotional video coming soon
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* caption */}
            <div className="flex flex-col gap-2 p-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  {v.videoTitle}
                </h3>
                {v.videoDescription && (
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
                    {v.videoDescription}
                  </p>
                )}
              </div>
              {ready && !playing && (
                <button
                  onClick={() => setPlaying(true)}
                  className="btn-primary shrink-0 !py-2.5"
                >
                  <Play size={15} className="fill-midnight" />
                  Play Video
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
