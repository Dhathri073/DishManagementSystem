/**
 * Resolve a stored imageUrl to a displayable src.
 * - data: URLs (base64 from production upload) — returned as-is
 * - http/https URLs — returned as-is
 * - /uploads/... paths (local dev) — prefixed with backend base URL
 */
const BACKEND = import.meta.env.VITE_API_BASE_URL || "";

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("data:")) return imageUrl;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  if (imageUrl.startsWith("/uploads/")) return `${BACKEND}${imageUrl}`;
  return imageUrl;
}
