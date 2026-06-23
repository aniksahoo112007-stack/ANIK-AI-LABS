"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Search,
  FileText,
  Tag,
  AlignLeft,
  Instagram,
  Linkedin,
  CalendarDays,
  LayoutGrid,
  ChevronDown,
  Copy,
  Check,
  BarChart3,
  RefreshCw,
  Workflow as WorkflowIcon,
  Server,
  Cpu,
  Send,
  Globe,
  WifiOff,
  Bug,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp, stagger, Reveal } from "@/components/motion";
import { useSiteContent } from "@/lib/useSiteContent";
import { getCmoStats, loadCmoData, AI_CMO_ENDPOINT } from "@/lib/cmo";
import { telegramStatusLabel } from "@/lib/telegram";
import type { CmoContentItem } from "@/lib/types";

type Phase = "idle" | "loading" | "live" | "offline";
const IS_DEV = process.env.NODE_ENV !== "production";

function useCountUp(target: number, run: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return val;
}

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setRun(true),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const display = useCountUp(value, run);
  return <span ref={ref}>{display}</span>;
}

const STATUS_STYLE: Record<string, string> = {
  active: "border-teal-glow/40 text-teal-glow",
  paused: "border-amber-400/40 text-amber-300",
  offline: "border-slate-500/40 text-slate-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        STATUS_STYLE[status] ?? STATUS_STYLE.offline
      }`}
    >
      <span className="relative flex h-2 w-2">
        {status === "active" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-glow opacity-70" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            status === "active"
              ? "bg-teal-glow"
              : status === "paused"
              ? "bg-amber-300"
              : "bg-slate-500"
          }`}
        />
      </span>
      {status}
    </span>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  clamp = 2,
}: {
  icon: typeof Search;
  label: string;
  value: string;
  clamp?: number;
}) {
  return (
    <motion.div variants={fadeUp} className="glass rounded-2xl p-5">
      <div className="mb-2 flex items-center gap-2 text-teal-glow">
        <Icon size={15} />
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>
      <p
        className="text-sm font-medium text-white"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: clamp,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {value || "—"}
      </p>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass animate-pulse rounded-2xl p-5">
      <div className="mb-3 h-3 w-24 rounded bg-white/10" />
      <div className="h-4 w-full rounded bg-white/10" />
      <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
    </div>
  );
}

const INFRA_TONE: Record<string, string> = {
  Connected: "text-teal-glow",
  Ready: "text-teal-glow",
  Active: "text-teal-glow",
  Connecting: "text-amber-300",
  Standby: "text-amber-300",
  "Coming Soon": "text-amber-300",
  Offline: "text-red-300",
};

function InfraRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Server;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5">
      <span className="inline-flex items-center gap-2 text-sm text-slate-300">
        <Icon size={15} className="text-teal-glow" />
        {label}
      </span>
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
          INFRA_TONE[value] ?? "text-slate-400"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            value === "Offline"
              ? "bg-red-400"
              : INFRA_TONE[value] === "text-teal-glow"
              ? "bg-teal-glow"
              : "bg-amber-300"
          }`}
        />
        {value}
      </span>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
      <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-0.5 text-xs text-slate-200">{value || "—"}</div>
    </div>
  );
}

function FeedItem({
  item,
  onCopy,
}: {
  item: CmoContentItem;
  onCopy: (text: string, label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const fullContent = `Keyword: ${item.keyword}
Blog Title: ${item.blog_title}
Meta Title: ${item.meta_title}
Meta Description: ${item.meta_description}

${item.blog}

Instagram: ${item.instagram_caption}

LinkedIn: ${item.linkedin_post}`;

  return (
    <motion.div variants={fadeUp} className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <CalendarDays size={12} />
              {item.generated_date || "—"}
            </span>
            {item.keyword && (
              <span className="chip border-teal-glow/30 text-teal-glow">
                {item.keyword}
              </span>
            )}
          </div>
          <h4 className="truncate text-sm font-semibold text-white">
            {item.blog_title || "Untitled"}
          </h4>
          <p className="mt-1 line-clamp-1 text-xs text-slate-400">
            {item.meta_description}
          </p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="btn-ghost shrink-0 !px-3 !py-2 text-xs"
        >
          {open ? "Hide" : "Expand"}
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Detail label="Keyword" value={item.keyword} />
                <Detail label="Blog Title" value={item.blog_title} />
                <Detail label="Meta Title" value={item.meta_title} />
                <Detail label="Meta Description" value={item.meta_description} />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-glow">
                    Full Blog Article
                  </span>
                  <button
                    onClick={() => onCopy(item.blog, "Blog")}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-teal-glow"
                  >
                    <Copy size={12} /> Copy Blog
                  </button>
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
                  {item.blog || "—"}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-glow">
                      <Instagram size={13} /> Instagram
                    </span>
                    <button
                      onClick={() =>
                        onCopy(item.instagram_caption, "Caption")
                      }
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-teal-glow"
                    >
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {item.instagram_caption || "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-glow">
                      <Linkedin size={13} /> LinkedIn
                    </span>
                    <button
                      onClick={() => onCopy(item.linkedin_post, "LinkedIn post")}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-teal-glow"
                    >
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {item.linkedin_post || "—"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onCopy(fullContent, "All content")}
                className="btn-ghost !py-2 text-xs"
              >
                <Copy size={14} /> Copy All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CmoDashboard() {
  const { cmo, assistant } = useSiteContent();
  const apiEnabled = cmo.apiEnabled !== false;
  const autoRefresh = cmo.enableAutoRefresh !== false;

  const [apiItems, setApiItems] = useState<CmoContentItem[] | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState("");

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2000);
  }, []);

  const load = useCallback(
    async (showLoading: boolean) => {
      if (showLoading) setPhase("loading");
      try {
        const res = await loadCmoData(cmo);
        setApiItems(res.items);
        setUpdatedAt(new Date().toLocaleTimeString());
        setPhase("live");
        setErrorMsg("");
      } catch (e) {
        setPhase("offline");
        setErrorMsg(
          e instanceof Error ? e.message : "Failed to reach /api/ai-cmo."
        );
      }
    },
    [cmo]
  );

  useEffect(() => {
    if (!apiEnabled) {
      setApiItems(null);
      setPhase("idle");
      return;
    }
    let active = true;
    load(true);
    if (!autoRefresh) return () => {};
    const sec = Math.max(10, cmo.refreshSeconds || 60);
    const timer = setInterval(() => {
      if (active) load(false);
    }, sec * 1000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [apiEnabled, autoRefresh, cmo.refreshSeconds, load]);

  if (!cmo.enablePublic) return null;

  // Source of truth = /api/ai-cmo. If API disabled in admin, fall back to demo.
  const displayItems: CmoContentItem[] = apiEnabled
    ? apiItems ?? []
    : cmo.items;
  const latest = displayItems[0];
  const stats = getCmoStats(displayItems);
  const firstLoad = apiEnabled && apiItems === null;
  const showSkeleton = firstLoad && phase !== "offline";
  const emptyLive = apiEnabled && apiItems !== null && apiItems.length === 0;

  const apiState =
    phase === "live" ? "Connected" : phase === "loading" ? "Connecting" : "Offline";
  const infra = {
    cmo: cmo.status === "active" ? "Active" : cmo.status === "paused" ? "Standby" : "Offline",
    n8n: apiState,
    api: apiState,
    telegram: telegramStatusLabel(assistant),
    publishing: "Ready",
  };

  function copy(text: string, label: string) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => flash(`${label} copied!`),
        () => flash("Copy failed")
      );
    } else {
      flash("Copy not supported");
    }
  }

  return (
    <section id="cmo" className="relative">
      <div className="section-pad">
        <SectionHeading
          eyebrow={cmo.subtitle}
          title={cmo.title}
          subtitle={cmo.description}
        />

        <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-center gap-3">
          <StatusBadge status={cmo.status} />
          {apiEnabled && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <RefreshCw
                size={12}
                className={phase === "loading" ? "animate-spin" : ""}
              />
              {phase === "live"
                ? `Live · Last Synced ${updatedAt}`
                : phase === "loading"
                ? "Syncing with API…"
                : updatedAt
                ? `Offline · Last Synced ${updatedAt}`
                : "Connecting to API…"}
            </span>
          )}
          <button
            onClick={() => load(true)}
            disabled={phase === "loading" || !apiEnabled}
            className="btn-ghost !px-3 !py-1.5 text-xs disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              className={phase === "loading" ? "animate-spin" : ""}
            />
            Refresh Now
          </button>
        </div>

        {/* dev debug panel */}
        {IS_DEV && apiEnabled && (
          <div className="mx-auto mb-6 max-w-5xl rounded-2xl border border-cyan-glow/20 bg-cyan-glow/5 p-4 text-[11px] text-slate-300">
            <div className="mb-2 flex items-center gap-2 font-semibold text-cyan-glow">
              <Bug size={13} /> Debug (development only)
            </div>
            <div className="grid gap-1 sm:grid-cols-2">
              <div className="truncate">
                <span className="text-slate-500">API endpoint: </span>
                {AI_CMO_ENDPOINT}
              </div>
              <div>
                <span className="text-slate-500">Items received: </span>
                {apiItems === null ? "—" : apiItems.length}
              </div>
              <div>
                <span className="text-slate-500">Latest keyword: </span>
                {latest?.keyword || "—"}
              </div>
              <div>
                <span className="text-slate-500">Last sync: </span>
                {updatedAt || "—"}
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500">Fetch error: </span>
                {errorMsg || "none"}
              </div>
            </div>
          </div>
        )}

        {/* offline banner */}
        {apiEnabled && phase === "offline" && (
          <div className="mx-auto mb-6 flex max-w-5xl items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs text-amber-200">
            <WifiOff size={15} className="shrink-0" />
            <span>
              {errorMsg || "Could not reach /api/ai-cmo."}{" "}
              {apiItems && apiItems.length > 0
                ? "Showing the last loaded content."
                : "No content loaded yet."}{" "}
              {autoRefresh
                ? `Auto-retrying every ${Math.max(10, cmo.refreshSeconds || 60)}s.`
                : ""}
            </span>
          </div>
        )}

        {/* info cards */}
        {showSkeleton ? (
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : emptyLive ? (
          <div className="mx-auto max-w-5xl">
            <div className="glass flex flex-col items-center gap-2 rounded-2xl p-10 text-center text-slate-500">
              <WifiOff size={24} />
              <span className="text-sm">
                No AI CMO content generated yet.
              </span>
            </div>
          </div>
        ) : (
          latest && (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <InfoCard icon={Search} label="Latest SEO Keyword" value={latest.keyword} />
              <InfoCard icon={FileText} label="Latest Blog Title" value={latest.blog_title} />
              <InfoCard icon={Tag} label="Latest Meta Title" value={latest.meta_title} />
              <InfoCard icon={AlignLeft} label="Latest Meta Description" value={latest.meta_description} />
              <InfoCard icon={Instagram} label="Latest Instagram Caption" value={latest.instagram_caption} />
              <InfoCard icon={Linkedin} label="Latest LinkedIn Post" value={latest.linkedin_post} />
              <InfoCard icon={CalendarDays} label="Last Generated Date" value={latest.generated_date} clamp={1} />
              <motion.div variants={fadeUp} className="glass rounded-2xl p-5">
                <div className="mb-2 flex items-center gap-2 text-teal-glow">
                  <LayoutGrid size={15} />
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Total Content Generated
                  </span>
                </div>
                <p className="font-display text-3xl font-bold gradient-text">
                  <Counter value={stats.totalContent} />
                </p>
              </motion.div>
            </motion.div>
          )
        )}

        {/* infrastructure */}
        <Reveal className="mx-auto mt-8 max-w-5xl">
          <div className="glass-strong rounded-3xl p-6">
            <h3 className="mb-5 flex items-center gap-2 font-display text-base font-semibold text-white">
              <Activity size={18} className="text-teal-glow" />
              AI CMO Infrastructure
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfraRow icon={Activity} label="AI CMO Status" value={infra.cmo} />
              <InfraRow icon={WorkflowIcon} label="n8n" value={infra.n8n} />
              <InfraRow icon={Server} label="Dashboard API" value={infra.api} />
              <InfraRow icon={Send} label="Telegram Bot" value={infra.telegram} />
              <InfraRow icon={Globe} label="Website Publishing" value={infra.publishing} />
              <InfraRow icon={Cpu} label="Gemini AI" value="Connected" />
            </div>
          </div>
        </Reveal>

        {/* statistics */}
        {cmo.enableStatistics && !showSkeleton && (
          <Reveal className="mx-auto mt-8 max-w-5xl">
            <div className="glass-strong rounded-3xl p-6">
              <h3 className="mb-5 flex items-center gap-2 font-display text-base font-semibold text-white">
                <BarChart3 size={18} className="text-teal-glow" />
                Statistics
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Blogs Generated", value: stats.totalBlogs },
                  { label: "Total Keywords Generated", value: stats.totalKeywords },
                  { label: "Total Social Posts Generated", value: stats.totalSocialPosts },
                ].map((srow) => (
                  <div key={srow.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center">
                    <div className="font-display text-3xl font-bold gradient-text">
                      <Counter value={srow.value} />
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">{srow.label}</div>
                  </div>
                ))}
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center">
                  <div className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-white">
                    <Activity size={15} className="text-teal-glow" />
                    {stats.latestDate || "—"}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">Latest Generation Date</div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* recent content feed */}
        {cmo.enableFeed && (
          <div className="mx-auto mt-8 max-w-5xl">
            <h3 className="mb-4 font-display text-base font-semibold text-white">
              Recent AI Generated Content
            </h3>
            {showSkeleton ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : displayItems.length > 0 ? (
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="max-h-[560px] space-y-3 overflow-y-auto pr-1"
              >
                {displayItems.map((item) => (
                  <FeedItem key={item.id} item={item} onCopy={copy} />
                ))}
              </motion.div>
            ) : (
              <div className="glass flex flex-col items-center gap-2 rounded-2xl p-10 text-center text-slate-500">
                <WifiOff size={24} />
                <span className="text-sm">No AI CMO content generated yet.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-teal-glow/40 bg-midnight-100/95 px-5 py-2.5 text-sm font-medium text-teal-glow shadow-glow backdrop-blur-xl"
          >
            <Check size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
