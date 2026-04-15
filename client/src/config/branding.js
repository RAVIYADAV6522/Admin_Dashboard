/**
 * App branding — edit these values to match your product.
 * Optional: set VITE_APP_NAME / VITE_APP_TAGLINE / VITE_APP_MARK in .env (see .env.example)
 */
function envString(key, fallback) {
  const v = import.meta.env[key];
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

const name = envString("VITE_APP_NAME", "Meridian");
const tagline = envString("VITE_APP_TAGLINE", "Suite");

export const BRAND = {
  /** Display name (sidebar, login) */
  name,
  /** Small caps line above page titles */
  eyebrow: envString("VITE_APP_EYEBROW", name.toUpperCase().replace(/\s+/g, " ")),
  /** Word under the name in the sidebar */
  tagline,
  /** Letter inside the gold logo tile */
  mark: envString("VITE_APP_MARK", name.trim().charAt(0).toUpperCase() || "M"),
  /** Browser tab title */
  documentTitle: `${name} — ${tagline}`,
};
