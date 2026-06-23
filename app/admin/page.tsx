"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  User,
  FolderKanban,
  Images,
  Wrench,
  Phone,
  Film,
  LogOut,
  RotateCcw,
  Trash2,
  ExternalLink,
  Save,
  Check,
  Lock,
  Plus,
  Database,
  Download,
  Upload,
  FileCode2,
  Copy,
  AlertTriangle,
  Bot,
  Video,
  Gauge,
  Star,
} from "lucide-react";
import {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  isLoggedIn,
  setLoggedIn,
  loadContent,
  saveContent,
  clearContent,
  cloneDefault,
} from "@/lib/content";
import type { SiteContent } from "@/lib/types";
import { ICON_NAMES } from "@/components/DynamicIcon";
import {
  Field,
  TextArea,
  ListEditor,
  ImagePreview,
  ImageUrlField,
  VideoPreview,
  Card,
} from "@/components/admin/fields";

type TabId =
  | "hero"
  | "about"
  | "projects"
  | "gallery"
  | "services"
  | "contact"
  | "media"
  | "video"
  | "cmo"
  | "assistant"
  | "reviews"
  | "data";

const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "hero", label: "Hero", icon: LayoutDashboard },
  { id: "about", label: "About Founder", icon: User },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "services", label: "Services", icon: Wrench },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "media", label: "Media", icon: Film },
  { id: "video", label: "Video Showcase", icon: Video },
  { id: "cmo", label: "AI CMO Dashboard", icon: Gauge },
  { id: "assistant", label: "AI Assistant", icon: Bot },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "data", label: "Data & Backup", icon: Database },
];

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------
function Login({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      onSuccess();
    } else {
      setError("Invalid username or password.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="glass-strong w-full max-w-sm rounded-3xl p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-glow to-cyan-glow text-midnight shadow-glow">
            <Lock size={22} />
          </span>
          <h1 className="mt-4 font-display text-xl font-bold text-white">
            Admin Login
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            ANIK AI LABS · Content Manager
          </p>
        </div>

        <div className="space-y-4">
          <Field
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="username"
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="password"
          />
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary mt-6 w-full">
          Login
        </button>
      </motion.form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION HEADER + SAVE
// ---------------------------------------------------------------------------
function SectionShell({
  title,
  description,
  onSave,
  children,
}: {
  title: string;
  description: string;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        <button onClick={onSave} className="btn-primary !py-2.5">
          <Save size={15} />
          Save {title}
        </button>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ADMIN PAGE
// ---------------------------------------------------------------------------
export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [content, setContent] = useState<SiteContent>(cloneDefault());
  const [tab, setTab] = useState<TabId>("hero");
  const [flash, setFlash] = useState("");
  const [codeText, setCodeText] = useState("");
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    setAuthed(isLoggedIn());
    setContent(loadContent());
    setMounted(true);
  }, []);

  function showFlash(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(""), 2200);
  }

  function persist(msg = "Saved!") {
    saveContent(content);
    showFlash(msg);
  }

  function resetDefaults() {
    if (!confirm("Reset ALL content back to the original defaults?")) return;
    const def = cloneDefault();
    setContent(def);
    saveContent(def);
    showFlash("Reset to defaults");
  }

  function clearAll() {
    if (!confirm("Clear all saved content from this browser?")) return;
    clearContent();
    setContent(cloneDefault());
    showFlash("Cleared saved content");
  }

  // Calls the protected clear endpoint to wipe AI CMO content from Redis.
  async function clearCmoRedis() {
    if (
      !confirm(
        "Clear ALL AI CMO content from Redis? This cannot be undone."
      )
    )
      return;
    try {
      const res = await fetch("/api/ai-cmo/clear", {
        method: "POST",
        headers: content.cmo.webhookSecret
          ? { "x-ai-cmo-secret": content.cmo.webhookSecret }
          : {},
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.status === "success") {
        showFlash("AI CMO Redis content cleared");
      } else {
        showFlash(data.message || "Clear failed");
      }
    } catch {
      showFlash("Clear failed — network error");
    }
  }

  function logout() {
    setLoggedIn(false);
    setAuthed(false);
  }

  // --- data file / backup helpers ---
  function downloadFile(filename: string, text: string, type: string) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    downloadFile(
      "anik-ai-labs-content.json",
      JSON.stringify(content, null, 2),
      "application/json"
    );
    showFlash("Downloaded JSON backup");
  }

  function safeMerge(saved: Partial<SiteContent>): SiteContent {
    const base = cloneDefault();
    return {
      hero: { ...base.hero, ...(saved.hero ?? {}) },
      about: { ...base.about, ...(saved.about ?? {}) },
      projects: Array.isArray(saved.projects) ? saved.projects : base.projects,
      gallery: Array.isArray(saved.gallery) ? saved.gallery : base.gallery,
      services: Array.isArray(saved.services) ? saved.services : base.services,
      contact: { ...base.contact, ...(saved.contact ?? {}) },
      media: { ...base.media, ...(saved.media ?? {}) },
      assistant: { ...base.assistant, ...(saved.assistant ?? {}) },
      videoShowcase: { ...base.videoShowcase, ...(saved.videoShowcase ?? {}) },
      cmo: { ...base.cmo, ...(saved.cmo ?? {}) },
      reviews: Array.isArray(saved.reviews) ? saved.reviews : base.reviews,
    };
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<SiteContent>;
        const merged = safeMerge(parsed);
        setContent(merged);
        saveContent(merged);
        showFlash("Imported JSON successfully");
      } catch {
        showFlash("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function buildDataFile(): string {
    return (
      "// ===========================================================================\n" +
      "// PERMANENT SITE CONTENT — generated by the admin panel\n" +
      "// Paste this ENTIRE block over the contents of lib/site-data.ts, then rebuild.\n" +
      "// ===========================================================================\n\n" +
      'import type { SiteContent } from "./types";\n\n' +
      "export const siteData: SiteContent = " +
      JSON.stringify(content, null, 2) +
      ";\n"
    );
  }

  function generateDataFile() {
    const code = buildDataFile();
    setCodeText(code);
    setShowCode(true);
    showFlash("Generated — copy into lib/site-data.ts");
  }

  function copyCode() {
    const code = codeText || buildDataFile();
    if (!codeText) setCodeText(code);
    setShowCode(true);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(
        () => showFlash("Copied site-data.ts to clipboard"),
        () => showFlash("Copy failed — select the code and copy manually")
      );
    } else {
      showFlash("Select the code below and copy manually");
    }
  }

  // helpers to update nested state
  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setContent((c) => ({ ...c, [key]: value }));

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-midnight/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-glow to-cyan-glow text-midnight shadow-glow">
              <Sparkles size={18} />
            </span>
            <div className="leading-tight">
              <div className="font-display text-sm font-bold text-white">
                Content Manager
              </div>
              <div className="text-[11px] text-slate-400">ANIK AI LABS</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !px-3 !py-2 text-xs"
            >
              <ExternalLink size={14} />
              Preview
            </a>
            <button
              onClick={resetDefaults}
              className="btn-ghost !px-3 !py-2 text-xs"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={clearAll}
              className="btn-ghost !px-3 !py-2 text-xs !text-red-300 hover:!border-red-400/40"
            >
              <Trash2 size={14} />
              Clear All
            </button>
            <button
              onClick={logout}
              className="btn-ghost !px-3 !py-2 text-xs"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 md:flex-row">
        {/* sidebar */}
        <nav className="flex gap-2 overflow-x-auto md:w-56 md:flex-col md:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-gradient-to-r from-teal-glow/20 to-cyan-glow/10 text-teal-glow"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* content */}
        <main className="min-w-0 flex-1">
          {tab === "hero" && (
            <SectionShell
              title="Hero"
              description="The headline area at the top of your site."
              onSave={() => persist()}
            >
              <Card className="space-y-4">
                <Field
                  label="Brand name"
                  value={content.hero.brand}
                  onChange={(v) => set("hero", { ...content.hero, brand: v })}
                />
                <Field
                  label="Tagline"
                  value={content.hero.tagline}
                  onChange={(v) =>
                    set("hero", { ...content.hero, tagline: v })
                  }
                />
                <TextArea
                  label="Hero description"
                  value={content.hero.description}
                  onChange={(v) =>
                    set("hero", { ...content.hero, description: v })
                  }
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Primary CTA text"
                    value={content.hero.primaryCta}
                    onChange={(v) =>
                      set("hero", { ...content.hero, primaryCta: v })
                    }
                  />
                  <Field
                    label="Secondary CTA text"
                    value={content.hero.secondaryCta}
                    onChange={(v) =>
                      set("hero", { ...content.hero, secondaryCta: v })
                    }
                  />
                </div>
              </Card>
            </SectionShell>
          )}

          {tab === "about" && (
            <SectionShell
              title="About Founder"
              description="Your bio, photo and skills."
              onSave={() => persist()}
            >
              <Card className="space-y-4">
                <div className="space-y-4">
                  <Field
                    label="Founder name"
                    value={content.about.founderName}
                    onChange={(v) =>
                      set("about", { ...content.about, founderName: v })
                    }
                  />
                  <ImageUrlField
                    label="Founder photo URL"
                    value={content.about.photoUrl}
                    onChange={(v) =>
                      set("about", { ...content.about, photoUrl: v })
                    }
                    placeholder="https://… (leave empty for initials)"
                  />
                  <TextArea
                    label="About text"
                    rows={6}
                    value={content.about.aboutText}
                    onChange={(v) =>
                      set("about", { ...content.about, aboutText: v })
                    }
                  />
                </div>
              </Card>
              <Card>
                <ListEditor
                  label="Skills"
                  items={content.about.skills}
                  onChange={(skills) =>
                    set("about", { ...content.about, skills })
                  }
                  placeholder="Add a skill and press Enter"
                />
              </Card>
            </SectionShell>
          )}

          {tab === "projects" && (
            <SectionShell
              title="Projects"
              description="Edit each project card and its details."
              onSave={() => persist()}
            >
              {content.projects.map((p, i) => {
                const update = (patch: Partial<typeof p>) => {
                  const next = [...content.projects];
                  next[i] = { ...p, ...patch };
                  set("projects", next);
                };
                return (
                  <Card key={p.slug} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="chip border-teal-glow/30 text-teal-glow">
                        Project {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {p.name}
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Project title"
                        value={p.name}
                        onChange={(v) => update({ name: v })}
                      />
                      <Field
                        label="Subtitle"
                        value={p.tagline}
                        onChange={(v) => update({ tagline: v })}
                      />
                    </div>
                    <TextArea
                      label="Description"
                      value={p.description}
                      onChange={(v) => update({ description: v })}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <ImageUrlField
                          label="Image URL"
                          value={p.image}
                          onChange={(v) => update({ image: v })}
                          placeholder="/projects/name.png or https://…"
                        />
                      </div>
                      <div className="space-y-2">
                        <Field
                          label="Video URL"
                          value={p.video}
                          onChange={(v) => update({ video: v })}
                          placeholder="YouTube / Vimeo / mp4 link"
                        />
                        <VideoPreview url={p.video} />
                      </div>
                    </div>
                    <ListEditor
                      label="Tech stack"
                      items={p.stack}
                      onChange={(stack) => update({ stack })}
                    />
                    <ListEditor
                      label="Key features"
                      items={p.features}
                      onChange={(features) => update({ features })}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Live demo URL"
                        value={p.liveUrl}
                        onChange={(v) => update({ liveUrl: v })}
                      />
                      <Field
                        label="GitHub URL"
                        value={p.githubUrl}
                        onChange={(v) => update({ githubUrl: v })}
                      />
                    </div>
                    <Field
                      label="Ask Developer CTA text"
                      value={p.askCta}
                      onChange={(v) => update({ askCta: v })}
                    />
                  </Card>
                );
              })}
            </SectionShell>
          )}

          {tab === "gallery" && (
            <SectionShell
              title="Gallery"
              description="Add, edit or remove gallery images."
              onSave={() => persist()}
            >
              {content.gallery.map((g, i) => {
                const update = (patch: Partial<typeof g>) => {
                  const next = [...content.gallery];
                  next[i] = { ...g, ...patch };
                  set("gallery", next);
                };
                return (
                  <Card key={g.id} className="space-y-3">
                    <div className="space-y-3">
                      <ImageUrlField
                        label="Image URL"
                        value={g.url}
                        onChange={(v) => update({ url: v })}
                      />
                      <Field
                        label="Image title"
                        value={g.title}
                        onChange={(v) => update({ title: v })}
                      />
                      <Field
                        label="Image description"
                        value={g.description}
                        onChange={(v) => update({ description: v })}
                      />
                      <button
                        onClick={() =>
                          set(
                            "gallery",
                            content.gallery.filter((_, idx) => idx !== i)
                          )
                        }
                        className="btn-ghost !py-2 text-xs !text-red-300 hover:!border-red-400/40"
                      >
                        <Trash2 size={14} />
                        Delete image
                      </button>
                    </div>
                  </Card>
                );
              })}
              <button
                onClick={() =>
                  set("gallery", [
                    ...content.gallery,
                    {
                      id: `g-${Date.now()}`,
                      url: "",
                      title: "New image",
                      description: "",
                    },
                  ])
                }
                className="btn-ghost w-full"
              >
                <Plus size={16} />
                Add image
              </button>
            </SectionShell>
          )}

          {tab === "services" && (
            <SectionShell
              title="Services"
              description="Add, edit or remove the services you offer."
              onSave={() => persist()}
            >
              {content.services.map((s, i) => {
                const update = (patch: Partial<typeof s>) => {
                  const next = [...content.services];
                  next[i] = { ...s, ...patch };
                  set("services", next);
                };
                return (
                  <Card key={s.id} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
                      <Field
                        label="Service title"
                        value={s.title}
                        onChange={(v) => update({ title: v })}
                      />
                      <Field
                        label="Icon name or emoji"
                        value={s.icon}
                        onChange={(v) => update({ icon: v })}
                        placeholder="e.g. Boxes or 🚀"
                      />
                    </div>
                    <TextArea
                      label="Service description"
                      rows={2}
                      value={s.description}
                      onChange={(v) => update({ description: v })}
                    />
                    <button
                      onClick={() =>
                        set(
                          "services",
                          content.services.filter((_, idx) => idx !== i)
                        )
                      }
                      className="btn-ghost !py-2 text-xs !text-red-300 hover:!border-red-400/40"
                    >
                      <Trash2 size={14} />
                      Delete service
                    </button>
                  </Card>
                );
              })}
              <div className="text-[11px] text-slate-500">
                Icon names available: {ICON_NAMES.join(", ")} — or paste any
                emoji.
              </div>
              <button
                onClick={() =>
                  set("services", [
                    ...content.services,
                    {
                      id: `s-${Date.now()}`,
                      title: "New service",
                      description: "",
                      icon: "Sparkles",
                    },
                  ])
                }
                className="btn-ghost w-full"
              >
                <Plus size={16} />
                Add service
              </button>
            </SectionShell>
          )}

          {tab === "contact" && (
            <SectionShell
              title="Contact"
              description="Your contact links and handles."
              onSave={() => persist()}
            >
              <Card className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Email"
                  value={content.contact.email}
                  onChange={(v) =>
                    set("contact", { ...content.contact, email: v })
                  }
                />
                <Field
                  label="WhatsApp number"
                  value={content.contact.whatsapp}
                  onChange={(v) =>
                    set("contact", { ...content.contact, whatsapp: v })
                  }
                  placeholder="+91 00000 00000"
                />
                <Field
                  label="GitHub URL"
                  value={content.contact.github}
                  onChange={(v) =>
                    set("contact", { ...content.contact, github: v })
                  }
                />
                <Field
                  label="LinkedIn URL"
                  value={content.contact.linkedin}
                  onChange={(v) =>
                    set("contact", { ...content.contact, linkedin: v })
                  }
                />
                <Field
                  label="Instagram URL"
                  value={content.contact.instagram}
                  onChange={(v) =>
                    set("contact", { ...content.contact, instagram: v })
                  }
                />
              </Card>
            </SectionShell>
          )}

          {tab === "media" && (
            <SectionShell
              title="Media"
              description="Product photos, promo videos and document links."
              onSave={() => persist()}
            >
              <Card className="space-y-4">
                <ListEditor
                  label="Product photo URLs"
                  items={content.media.productPhotos}
                  onChange={(productPhotos) =>
                    set("media", { ...content.media, productPhotos })
                  }
                  placeholder="Paste image URL and press Enter"
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {content.media.productPhotos.map((u, i) => (
                    <ImagePreview key={i} url={u} />
                  ))}
                </div>
              </Card>
              <Card className="space-y-4">
                <ListEditor
                  label="Promotional video URLs"
                  items={content.media.promoVideos}
                  onChange={(promoVideos) =>
                    set("media", { ...content.media, promoVideos })
                  }
                  placeholder="Paste video URL and press Enter"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {content.media.promoVideos.map((u, i) => (
                    <VideoPreview key={i} url={u} />
                  ))}
                </div>
              </Card>
              <Card className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Brand book PDF URL"
                  value={content.media.brandBookPdf}
                  onChange={(v) =>
                    set("media", { ...content.media, brandBookPdf: v })
                  }
                />
                <Field
                  label="Resume PDF URL"
                  value={content.media.resumePdf}
                  onChange={(v) =>
                    set("media", { ...content.media, resumePdf: v })
                  }
                />
              </Card>
            </SectionShell>
          )}
          {tab === "video" && (
            <SectionShell
              title="Video Showcase"
              description="Promotional video section shown after the gallery."
              onSave={() => persist()}
            >
              <Card className="space-y-4">
                <Field
                  label="Section Title"
                  value={content.videoShowcase.sectionTitle}
                  onChange={(v) =>
                    set("videoShowcase", {
                      ...content.videoShowcase,
                      sectionTitle: v,
                    })
                  }
                />
                <TextArea
                  label="Section Description"
                  value={content.videoShowcase.sectionDescription}
                  onChange={(v) =>
                    set("videoShowcase", {
                      ...content.videoShowcase,
                      sectionDescription: v,
                    })
                  }
                />
              </Card>

              <Card className="space-y-4">
                <Field
                  label="Video Title"
                  value={content.videoShowcase.videoTitle}
                  onChange={(v) =>
                    set("videoShowcase", {
                      ...content.videoShowcase,
                      videoTitle: v,
                    })
                  }
                />
                <TextArea
                  label="Video Description"
                  rows={2}
                  value={content.videoShowcase.videoDescription}
                  onChange={(v) =>
                    set("videoShowcase", {
                      ...content.videoShowcase,
                      videoDescription: v,
                    })
                  }
                />
                <ImageUrlField
                  label="Video Thumbnail URL"
                  value={content.videoShowcase.thumbnailUrl}
                  onChange={(v) =>
                    set("videoShowcase", {
                      ...content.videoShowcase,
                      thumbnailUrl: v,
                    })
                  }
                  placeholder="https://… (cinematic cover image)"
                />
                <div>
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-xs font-medium text-slate-400">
                      Video URL
                    </span>
                    {content.videoShowcase.videoUrl && (
                      <a
                        href={content.videoShowcase.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-teal-glow hover:underline"
                      >
                        Test video URL ↗
                      </a>
                    )}
                  </div>
                  <input
                    value={content.videoShowcase.videoUrl}
                    onChange={(e) =>
                      set("videoShowcase", {
                        ...content.videoShowcase,
                        videoUrl: e.target.value,
                      })
                    }
                    placeholder="YouTube / Vimeo / .mp4 / Google Drive link"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-teal-glow/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-glow/40"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Supports YouTube, Vimeo, direct .mp4, and public Google Drive
                    links. Preview below.
                  </p>
                  <div className="mt-2">
                    <VideoPreview url={content.videoShowcase.videoUrl} />
                  </div>
                </div>
              </Card>

              <Card className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="Project Tag"
                  value={content.videoShowcase.projectTag}
                  onChange={(v) =>
                    set("videoShowcase", {
                      ...content.videoShowcase,
                      projectTag: v,
                    })
                  }
                />
                <Field
                  label="Duration"
                  value={content.videoShowcase.duration}
                  onChange={(v) =>
                    set("videoShowcase", {
                      ...content.videoShowcase,
                      duration: v,
                    })
                  }
                  placeholder="e.g. 2:30"
                />
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">
                    Video Status
                  </span>
                  <select
                    value={content.videoShowcase.status}
                    onChange={(e) =>
                      set("videoShowcase", {
                        ...content.videoShowcase,
                        status: e.target.value as "coming-soon" | "active",
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-teal-glow/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-glow/40"
                  >
                    <option value="coming-soon" className="bg-midnight-100">
                      Coming Soon
                    </option>
                    <option value="active" className="bg-midnight-100">
                      Active
                    </option>
                  </select>
                </label>
              </Card>
            </SectionShell>
          )}

          {tab === "assistant" && (
            <SectionShell
              title="AI Assistant / Telegram Bot"
              description="Configure the AI Assistant section and Telegram bot link."
              onSave={() => persist()}
            >
              <Card className="space-y-4">
                <Field
                  label="Section Title"
                  value={content.assistant.title}
                  onChange={(v) =>
                    set("assistant", { ...content.assistant, title: v })
                  }
                />
                <TextArea
                  label="Section Description"
                  value={content.assistant.description}
                  onChange={(v) =>
                    set("assistant", { ...content.assistant, description: v })
                  }
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Telegram Bot URL"
                    value={content.assistant.telegramUrl}
                    onChange={(v) =>
                      set("assistant", { ...content.assistant, telegramUrl: v })
                    }
                    placeholder="https://t.me/your_bot"
                  />
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">
                      Bot Status
                    </span>
                    <select
                      value={content.assistant.status}
                      onChange={(e) =>
                        set("assistant", {
                          ...content.assistant,
                          status: e.target.value as "coming-soon" | "active",
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-teal-glow/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-glow/40"
                    >
                      <option value="coming-soon" className="bg-midnight-100">
                        Coming Soon
                      </option>
                      <option value="active" className="bg-midnight-100">
                        Active
                      </option>
                    </select>
                  </label>
                </div>
                <Field
                  label="Primary CTA Text"
                  value={content.assistant.ctaText}
                  onChange={(v) =>
                    set("assistant", { ...content.assistant, ctaText: v })
                  }
                />
                <p className="text-[11px] text-slate-500">
                  The button opens Telegram only when a Bot URL is set AND status
                  is Active. Otherwise the site shows &quot;Telegram assistant
                  coming soon&quot;.
                </p>
              </Card>

              <Card>
                <span className="mb-2 block text-xs font-medium text-slate-400">
                  Bot Flow Steps
                </span>
                <div className="space-y-2">
                  {content.assistant.flowSteps.map((step, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={step}
                        onChange={(e) => {
                          const next = [...content.assistant.flowSteps];
                          next[i] = e.target.value;
                          set("assistant", {
                            ...content.assistant,
                            flowSteps: next,
                          });
                        }}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-teal-glow/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-glow/40"
                      />
                      <button
                        onClick={() =>
                          set("assistant", {
                            ...content.assistant,
                            flowSteps: content.assistant.flowSteps.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 text-slate-400 hover:bg-red-500/20 hover:text-red-300"
                        aria-label="Delete step"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  {content.assistant.flowSteps.length === 0 && (
                    <span className="text-xs text-slate-600">No steps yet</span>
                  )}
                </div>
                <button
                  onClick={() =>
                    set("assistant", {
                      ...content.assistant,
                      flowSteps: [
                        ...content.assistant.flowSteps,
                        "New step",
                      ],
                    })
                  }
                  className="btn-ghost mt-3 !py-2 text-xs"
                >
                  <Plus size={14} />
                  Add step
                </button>
              </Card>

              <Card className="space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <span>
                    WhatsApp link will be shown only inside the Telegram bot when
                    user selects Hire Developer. It is never displayed on the
                    public website.
                  </span>
                </div>
                <Field
                  label="Hire Developer WhatsApp URL (admin only)"
                  value={content.assistant.hireWhatsappUrl}
                  onChange={(v) =>
                    set("assistant", {
                      ...content.assistant,
                      hireWhatsappUrl: v,
                    })
                  }
                  placeholder="https://wa.me/91XXXXXXXXXX"
                />
                <Field
                  label="WhatsApp Reveal Condition"
                  value={content.assistant.whatsappRevealCondition}
                  onChange={(v) =>
                    set("assistant", {
                      ...content.assistant,
                      whatsappRevealCondition: v,
                    })
                  }
                  placeholder="Hire Developer"
                />
              </Card>
            </SectionShell>
          )}

          {tab === "cmo" && (
            <SectionShell
              title="AI CMO Dashboard"
              description="Settings for the AI marketing automation dashboard."
              onSave={() => persist()}
            >
              <Card className="space-y-4">
                <Field
                  label="Dashboard Title"
                  value={content.cmo.title}
                  onChange={(v) => set("cmo", { ...content.cmo, title: v })}
                />
                <Field
                  label="Dashboard Subtitle"
                  value={content.cmo.subtitle}
                  onChange={(v) => set("cmo", { ...content.cmo, subtitle: v })}
                />
                <TextArea
                  label="Dashboard Description"
                  value={content.cmo.description}
                  onChange={(v) =>
                    set("cmo", { ...content.cmo, description: v })
                  }
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">
                      Status
                    </span>
                    <select
                      value={content.cmo.status}
                      onChange={(e) =>
                        set("cmo", {
                          ...content.cmo,
                          status: e.target.value as
                            | "active"
                            | "paused"
                            | "offline",
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-teal-glow/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-glow/40"
                    >
                      <option value="active" className="bg-midnight-100">
                        Active
                      </option>
                      <option value="paused" className="bg-midnight-100">
                        Paused
                      </option>
                      <option value="offline" className="bg-midnight-100">
                        Offline
                      </option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">
                      Refresh Interval (seconds)
                    </span>
                    <input
                      type="number"
                      min={10}
                      value={content.cmo.refreshSeconds}
                      onChange={(e) =>
                        set("cmo", {
                          ...content.cmo,
                          refreshSeconds: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-teal-glow/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-glow/40"
                    />
                  </label>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-teal-glow/20 bg-teal-glow/5 p-4 text-[11px] text-slate-300">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-teal-glow" />
                  <span>
                    Live content now comes from the website API at{" "}
                    <code className="rounded bg-black/30 px-1">/api/ai-cmo</code>.
                    Point your n8n HTTP Request node (POST) at it. CSV / Google
                    Sheets are no longer used by the dashboard.
                  </span>
                </div>
                <Field
                  label="Webhook Secret (optional)"
                  value={content.cmo.webhookSecret}
                  onChange={(v) =>
                    set("cmo", { ...content.cmo, webhookSecret: v })
                  }
                  placeholder="reference copy of AI_CMO_WEBHOOK_SECRET"
                />
                <p className="-mt-2 text-[11px] text-slate-500">
                  Reference only. To actually require it, set{" "}
                  <code className="rounded bg-black/30 px-1">
                    AI_CMO_WEBHOOK_SECRET
                  </code>{" "}
                  in your environment; n8n must then send header{" "}
                  <code className="rounded bg-black/30 px-1">x-ai-cmo-secret</code>.
                </p>
                <p className="text-[11px] text-slate-500">
                  Content Source: demo data in lib/site-data.ts (cmo.items) +
                  localStorage. Add a Google Sheet / n8n endpoint above to go
                  live later — no UI changes needed.
                </p>
              </Card>

              <Card className="space-y-2">
                <span className="mb-1 block text-xs font-medium text-slate-400">
                  Visibility
                </span>
                {(
                  [
                    { key: "apiEnabled", label: "API Enabled" },
                    { key: "enableAutoRefresh", label: "Enable Auto Refresh" },
                    { key: "enablePublic", label: "Enable Public Dashboard" },
                    { key: "enableStatistics", label: "Enable Statistics" },
                    { key: "enableFeed", label: "Enable Recent Content Feed" },
                  ] as const
                ).map((t) => {
                  const on = content.cmo[t.key];
                  return (
                    <button
                      key={t.key}
                      onClick={() =>
                        set("cmo", { ...content.cmo, [t.key]: !on })
                      }
                      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/[0.05]"
                    >
                      {t.label}
                      <span
                        className={`relative h-5 w-9 rounded-full transition ${
                          on ? "bg-teal-glow" : "bg-white/15"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                            on ? "left-4" : "left-0.5"
                          }`}
                        />
                      </span>
                    </button>
                  );
                })}
              </Card>

              <Card>
                <p className="text-xs text-slate-400">
                  Content is stored at{" "}
                  <code className="rounded bg-black/30 px-1">
                    data/ai-cmo-content.json
                  </code>{" "}
                  and served via{" "}
                  <code className="rounded bg-black/30 px-1">GET /api/ai-cmo</code>.
                  n8n adds content with{" "}
                  <code className="rounded bg-black/30 px-1">POST /api/ai-cmo</code>
                  . Demo items in lib/site-data.ts are only used if API Enabled is
                  off.
                </p>
              </Card>

              <Card className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Danger Zone
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Permanently delete all AI CMO content from Redis (key{" "}
                    <code className="rounded bg-black/30 px-1">
                      ai-cmo-content
                    </code>
                    ). The dashboard shows an empty state until n8n posts again.
                    Sends the Webhook Secret as{" "}
                    <code className="rounded bg-black/30 px-1">
                      x-ai-cmo-secret
                    </code>
                    .
                  </p>
                </div>
                <button
                  onClick={clearCmoRedis}
                  className="btn-ghost !py-2.5 !text-red-300 hover:!border-red-400/40"
                >
                  <Trash2 size={15} />
                  Clear AI CMO Redis Content
                </button>
              </Card>
            </SectionShell>
          )}

          {tab === "reviews" && (
            <SectionShell
              title="Reviews"
              description="Client testimonials shown on the public website."
              onSave={() => persist()}
            >
              {content.reviews.map((r, i) => {
                const update = (patch: Partial<typeof r>) => {
                  const next = [...content.reviews];
                  next[i] = { ...r, ...patch };
                  set("reviews", next);
                };
                return (
                  <Card key={r.id} className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="chip border-teal-glow/30 text-teal-glow">
                        Review {i + 1}
                      </span>
                      <button
                        onClick={() =>
                          set(
                            "reviews",
                            content.reviews.filter((_, idx) => idx !== i)
                          )
                        }
                        className="btn-ghost !py-2 text-xs !text-red-300 hover:!border-red-400/40"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Client Name"
                        value={r.clientName}
                        onChange={(v) => update({ clientName: v })}
                      />
                      <Field
                        label="Project Name"
                        value={r.projectName}
                        onChange={(v) => update({ projectName: v })}
                      />
                    </div>
                    <label className="block sm:max-w-[160px]">
                      <span className="mb-1.5 block text-xs font-medium text-slate-400">
                        Rating
                      </span>
                      <select
                        value={r.rating}
                        onChange={(e) =>
                          update({ rating: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-teal-glow/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-glow/40"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n} className="bg-midnight-100">
                            {n} star{n === 1 ? "" : "s"}
                          </option>
                        ))}
                      </select>
                    </label>
                    <TextArea
                      label="Review Text"
                      rows={3}
                      value={r.text}
                      onChange={(v) => update({ text: v })}
                    />
                  </Card>
                );
              })}
              {content.reviews.length === 0 && (
                <p className="text-xs text-slate-600">No reviews yet.</p>
              )}
              <button
                onClick={() =>
                  set("reviews", [
                    ...content.reviews,
                    {
                      id: `rev-${Date.now()}`,
                      clientName: "New client",
                      projectName: "",
                      rating: 5,
                      text: "",
                    },
                  ])
                }
                className="btn-ghost w-full"
              >
                <Plus size={16} />
                Add review
              </button>
            </SectionShell>
          )}

          {tab === "data" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-white">
                  Data &amp; Backup
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Make your changes permanent and manage backups.
                </p>
              </div>

              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <span>
                  Browser storage is temporary. To make changes permanent across
                  browsers, click <strong>Generate Permanent Data</strong> and
                  copy it into{" "}
                  <code className="rounded bg-black/30 px-1 py-0.5">
                    lib/site-data.ts
                  </code>
                  .
                </span>
              </div>

              <Card className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Permanent Data File
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Generate your full content, then paste it over{" "}
                    <code className="rounded bg-black/30 px-1">
                      lib/site-data.ts
                    </code>{" "}
                    and rebuild to save permanently.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={generateDataFile} className="btn-primary !py-2.5">
                    <FileCode2 size={15} />
                    Generate Permanent Data
                  </button>
                  <button onClick={copyCode} className="btn-ghost !py-2.5">
                    <Copy size={15} />
                    Copy updated site-data.ts
                  </button>
                </div>
                {showCode && (
                  <textarea
                    readOnly
                    value={codeText}
                    onFocus={(e) => e.currentTarget.select()}
                    spellCheck={false}
                    className="h-80 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-slate-200 outline-none"
                  />
                )}
              </Card>

              <Card className="mt-5 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Backup &amp; Restore (JSON)
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Download your content as JSON, import a previous backup, or
                    reset everything to the defaults from lib/site-data.ts.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={exportJson} className="btn-ghost !py-2.5">
                    <Download size={15} />
                    Export JSON
                  </button>
                  <button onClick={exportJson} className="btn-ghost !py-2.5">
                    <Download size={15} />
                    Download Backup JSON
                  </button>
                  <label className="btn-ghost !py-2.5 cursor-pointer">
                    <Upload size={15} />
                    Import Backup JSON
                    <input
                      type="file"
                      accept="application/json,.json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                  <label className="btn-ghost !py-2.5 cursor-pointer">
                    <Upload size={15} />
                    Upload Backup JSON
                    <input
                      type="file"
                      accept="application/json,.json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={resetDefaults}
                    className="btn-ghost !py-2.5 !text-red-300 hover:!border-red-400/40"
                  >
                    <RotateCcw size={15} />
                    Reset to Permanent Defaults
                  </button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* save flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-teal-glow/40 bg-midnight-100/95 px-5 py-2.5 text-sm font-medium text-teal-glow shadow-glow backdrop-blur-xl"
          >
            <Check size={16} />
            {flash}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
