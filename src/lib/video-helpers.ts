/**
 * Video URL parser and helper utilities
 * Supports Cloudinary direct URLs (mp4, webm, etc.), blob URLs, and YouTube embeds.
 */

export interface ParsedVideo {
  type: "youtube" | "direct";
  src: string;
}

export function parseVideoSource(url?: string | null): ParsedVideo | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Check for YouTube link
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
    };
  }

  // Cloudinary or direct video URL (mp4, webm, mov, blob:, etc.)
  return {
    type: "direct",
    src: trimmed,
  };
}
