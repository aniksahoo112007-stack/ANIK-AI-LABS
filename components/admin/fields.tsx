"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ImageOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toEmbedUrl } from "@/lib/media";

const baseInput =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-glow/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-glow/40";

const IMAGE_HELP =
  "Use a direct image URL ending in .jpg, .jpeg, .png, .webp, or a publicly accessible image link.";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={baseInput}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${baseInput} resize-none`}
      />
    </label>
  );
}

export function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  };

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] py-1 pl-3 pr-1.5 text-xs text-slate-200"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="grid h-5 w-5 place-items-center rounded-full text-slate-400 hover:bg-red-500/20 hover:text-red-300"
              aria-label={`Remove ${item}`}
            >
              <Trash2 size={12} />
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <span className="text-xs text-slate-600">No items yet</span>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder ?? "Add item and press Enter"}
          className={baseInput}
        />
        <button
          type="button"
          onClick={add}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-teal-glow/40 bg-teal-glow/10 text-teal-glow hover:bg-teal-glow/20"
          aria-label="Add"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

// Robust image preview: shows a loading state, the image, or a clear fallback.
export function ImagePreview({ url }: { url: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );

  useEffect(() => {
    setStatus(url ? "loading" : "error");
  }, [url]);

  if (!url) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-slate-600">
        <ImageOff size={20} />
        <span className="text-[11px]">No image URL — placeholder</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      {status !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="preview"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className="h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: status === "loaded" ? 1 : 0 }}
        />
      )}
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <Loader2 className="animate-spin" size={16} />
          Loading…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center text-red-300/80">
          <ImageOff size={20} />
          <span className="text-[11px]">
            Image could not load. Try another public direct image URL.
          </span>
        </div>
      )}
    </div>
  );
}

// Image URL input with a "Test Image" button, helper text and live preview.
export function ImageUrlField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [test, setTest] = useState<"idle" | "loading" | "ok" | "fail">("idle");

  function runTest() {
    const src = value.trim();
    if (!src) {
      setTest("fail");
      return;
    }
    setTest("loading");
    const img = new window.Image();
    img.onload = () => setTest("ok");
    img.onerror = () => setTest("fail");
    img.src = src;
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </span>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setTest("idle");
          }}
          placeholder={placeholder}
          className={`${baseInput} flex-1`}
        />
        <button
          type="button"
          onClick={runTest}
          className="shrink-0 rounded-xl border border-teal-glow/40 bg-teal-glow/10 px-3 py-2.5 text-xs font-medium text-teal-glow transition hover:bg-teal-glow/20"
        >
          Test Image
        </button>
      </div>

      <p className="mt-1.5 text-[11px] text-slate-500">{IMAGE_HELP}</p>

      {test === "loading" && (
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Loader2 className="animate-spin" size={12} />
          Testing image…
        </p>
      )}
      {test === "ok" && (
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-teal-glow">
          <CheckCircle2 size={12} />
          Image loaded successfully.
        </p>
      )}
      {test === "fail" && (
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-red-300">
          <XCircle size={12} />
          Image could not load. Try another public direct image URL.
        </p>
      )}

      <div className="mt-2">
        <ImagePreview url={value} />
      </div>
    </div>
  );
}

export function VideoPreview({ url }: { url: string }) {
  const embed = toEmbedUrl(url);
  if (!embed) return null;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10">
      <iframe
        src={embed}
        title="video preview"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass rounded-2xl p-5 ${className}`}>{children}</div>
  );
}
