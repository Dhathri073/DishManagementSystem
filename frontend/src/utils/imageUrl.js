/**
 * Resolve a stored imageUrl to a displayable src.
 * - Relative paths (/uploads/...) are prefixed with the backend base URL.
 * - Absolute URLs (http/https) and data URLs are returned as-is.
 */
const BACKEND = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("data:")) return imageUrl;           // base64
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl; // external
  if (imageUrl.startsWith("/uploads/")) return `${BACKEND}${imageUrl}`; // local upload
  return imageUrl;
}
