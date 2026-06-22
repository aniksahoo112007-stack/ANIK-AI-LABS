// Helpers for turning a pasted video URL into an embeddable URL.

/**
 * Converts common video URLs (YouTube, Vimeo) into embeddable iframe URLs.
 * Returns the original URL for anything that already looks embeddable, or
 * null if the input is empty.
 */
export function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube: watch?v=, youtu.be/, /shorts/, /embed/
  const yt =
    trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
    ) || null;
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Google Drive: /file/d/<id>/view  OR  open?id=<id>
  const gd =
    trimmed.match(/drive\.google\.com\/file\/d\/([\w-]+)/) ||
    trimmed.match(/drive\.google\.com\/open\?id=([\w-]+)/);
  if (gd) return `https://drive.google.com/file/d/${gd[1]}/preview`;

  // Vimeo
  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return trimmed;
}

/** True if the URL points directly to a video file we can use in <video>. */
export function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url.trim());
}
