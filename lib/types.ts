// Serializable content model — everything here can be stored in localStorage.

export type HeroContent = {
  brand: string;
  tagline: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

export type AboutContent = {
  founderName: string;
  aboutText: string;
  photoUrl: string;
  skills: string[];
};

export type ProjectContent = {
  slug: string;
  name: string;
  tagline: string; // subtitle
  description: string;
  image: string;
  video: string;
  stack: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
  askCta: string;
  accent: string; // gradient classes, not edited in admin
};

export type GalleryItem = {
  id: string;
  url: string;
  title: string;
  description: string;
};

export type ServiceContent = {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name OR an emoji
};

export type ContactContent = {
  email: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  instagram: string;
};

export type MediaContent = {
  productPhotos: string[];
  promoVideos: string[];
  brandBookPdf: string;
  resumePdf: string;
};

export type AssistantContent = {
  title: string;
  description: string;
  telegramUrl: string;
  status: "coming-soon" | "active";
  ctaText: string;
  flowSteps: string[];
  // Stored for the Telegram bot setup only — NEVER rendered on the public site.
  hireWhatsappUrl: string;
  whatsappRevealCondition: string;
};

export type VideoShowcaseContent = {
  sectionTitle: string;
  sectionDescription: string;
  videoTitle: string;
  videoDescription: string;
  thumbnailUrl: string;
  videoUrl: string;
  projectTag: string;
  duration: string;
  status: "coming-soon" | "active";
};

export type CmoContentItem = {
  id: string;
  keyword: string;
  blog_title: string;
  meta_title: string;
  meta_description: string;
  blog: string;
  instagram_caption: string;
  linkedin_post: string;
  generated_date: string;
};

export type CmoDashboardContent = {
  title: string;
  subtitle: string;
  description: string;
  status: "active" | "paused" | "offline";
  googleSheetUrl: string;
  googleSheetCsvUrl: string; // published CSV URL for live data
  refreshInterval: number; // legacy (minutes)
  refreshSeconds: number; // live auto-refresh interval in seconds
  apiEnabled: boolean;
  webhookSecret: string; // reference copy; server enforces via env
  enableAutoRefresh: boolean;
  enablePublic: boolean;
  enableStatistics: boolean;
  enableFeed: boolean;
  items: CmoContentItem[];
};

export type ReviewItem = {
  id: string;
  clientName: string;
  projectName: string;
  rating: number; // 1-5
  text: string;
};

export type SiteContent = {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectContent[];
  gallery: GalleryItem[];
  services: ServiceContent[];
  contact: ContactContent;
  media: MediaContent;
  assistant: AssistantContent;
  videoShowcase: VideoShowcaseContent;
  cmo: CmoDashboardContent;
  reviews: ReviewItem[];
};
