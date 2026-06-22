# ANIK AI LABS

**Building AI Solutions That Solve Real Problems**

A premium, dark, futuristic Next.js website — AI software studio, developer portfolio, and freelance lead-generation site for Anik Sahoo.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion**.

---

## How to run

```bash
# 1. install dependencies (run once)
npm install

# 2. start the dev server
npm run dev
# open http://localhost:3000

# 3. production build
npm run build
npm start
```

> Requires Node 18+ (you have Node 22 — perfect).

---

## Project structure

```
MAIN WEB/
├─ app/
│  ├─ layout.tsx          # fonts, metadata, root layout
│  ├─ page.tsx            # assembles all sections
│  └─ globals.css         # Tailwind + design system
├─ components/
│  ├─ Background.tsx      # animated glow/grid backdrop
│  ├─ Navbar.tsx          # sticky glass nav + mobile menu
│  ├─ Footer.tsx
│  ├─ SectionHeading.tsx
│  ├─ motion.tsx          # reusable Framer Motion helpers
│  └─ sections/
│     ├─ Hero.tsx
│     ├─ About.tsx
│     ├─ Projects.tsx     # cards + detail modal
│     ├─ Services.tsx
│     ├─ Workflow.tsx     # AI automation flow
│     ├─ Gallery.tsx
│     ├─ AskDeveloper.tsx # lead form (n8n-ready)
│     └─ Contact.tsx
├─ lib/
│  ├─ data.ts             # projects, services, contact, nav (edit here)
│  └─ config.ts           # form options + n8n webhook URL
├─ public/projects/       # << add your 4 project images here
└─ tailwind.config.ts
```

---

## Where to add your project images

Put your 4 generated images in `public/projects/` with these exact names:

- `filemind.png`
- `nandarani-pos.png`
- `nandarani-catalog.png`
- `ai-data-detective.png`

Until then, the cards and gallery show a clean placeholder with the expected filename. To rename, edit the `image` field in `lib/data.ts`.

---

## Connect the Ask Developer form to n8n (later)

The form already posts a clean JSON payload — you just add the webhook URL.

1. In **n8n**, add a **Webhook** node (HTTP `POST`) and copy its **Production URL**.
2. Create `.env.local` in the project root (copy from `.env.local.example`):
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-host/webhook/xxxx
   ```
3. Restart the dev server. The form now POSTs:
   ```json
   {
     "name": "...",
     "email": "...",
     "phone": "...",
     "projectInterest": "...",
     "budgetRange": "...",
     "message": "...",
     "submittedAt": "ISO timestamp"
   }
   ```
4. In n8n, branch the webhook into your pipeline:
   **AI Lead Assistant → Google Sheet CRM → Telegram Notification → WhatsApp**

If no webhook is set, the form just shows a success message and logs the lead to the browser console — no backend required.

---

## Edit your details

- **Contact links / email / WhatsApp / GitHub / LinkedIn:** `lib/data.ts` → `contact`
- **Projects, features, tech stacks:** `lib/data.ts` → `projects`
- **Services:** `lib/data.ts` → `services`
- **Form dropdown options & budget ranges:** `lib/config.ts`

---

Built by **Anik Sahoo** · ANIK AI LABS

---

## Admin Panel / Content Manager

A login-protected admin panel lets you edit most site content without touching code. All content is stored in your browser's **localStorage** (no database, no backend).

**Admin URL:** `http://localhost:3000/admin`

**Login credentials (demo only):**

- **Username:** `anik`
- **Password:** `anik@112007`

> This is not real security — it only hides the editor behind a login screen for a college/demo project. The credentials live in `lib/content.ts`.

### What you can edit

- **Hero** — brand, tagline, description, both CTA texts
- **About** — founder name, about text, photo URL, skills list
- **Projects** — title, subtitle, description, image URL, video URL, tech stack, key features, live demo URL, GitHub URL, Ask CTA text
- **Gallery** — add / edit / delete images (URL, title, description)
- **Services** — add / edit / delete (title, description, icon name or emoji)
- **Contact** — email, WhatsApp, GitHub, LinkedIn, Instagram
- **Media** — product photo URLs, promo video URLs, brand book PDF URL, resume PDF URL

### How it works

- Each section has its own **Save** button (writes to localStorage).
- Top bar: **Preview** (opens the live site), **Reset** (restore defaults), **Clear All** (wipe saved content), **Logout**.
- The website reads from localStorage if present, otherwise falls back to `lib/data.ts`. **Refresh the public site after saving** to see changes.
- Images/videos use URL fields only (no uploads). Image URLs preview instantly; YouTube/Vimeo/mp4 video URLs preview in the panel and on project cards.

### Notes

- Service icons accept a Lucide icon name (e.g. `Boxes`, `BrainCircuit`, `Rocket`) or any emoji.
- Resume / Brand Book links appear as download buttons in the Contact section once their URLs are set.
