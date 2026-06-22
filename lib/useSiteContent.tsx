"use client";

import { useEffect, useState } from "react";
import { loadContent } from "./content";
import { defaultContent } from "./data";
import type { SiteContent } from "./types";

/**
 * Reads site content from localStorage on the client.
 * During SSR / first paint it returns the defaults from lib/data.ts, then
 * swaps in any saved content after mount (so admin edits show after refresh).
 */
export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    setContent(loadContent());
  }, []);

  return content;
}
