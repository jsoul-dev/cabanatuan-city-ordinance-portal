/**
 * Utility helper functions for formatting Ordinance metadata cleanly across the UI.
 */

export function cleanOrdinanceTitle(title: string): string {
  if (!title) return "";
  let t = title.trim();

  // Strip common redundant prefixes to keep display titles clean and scannable
  const prefixPatterns = [
    /^City\s+Ordinance\s+(No\.\s*[\w-]+\s*,?\s*)?(Establishing\s+|On\s+|Concerning\s+|Creating\s+|Enacting\s+|Regulating\s+|For\s+|Para sa\s+)?/i,
    /^An\s+Ordinance\s+(No\.\s*[\w-]+\s*,?\s*)?(Establishing\s+|On\s+|Concerning\s+|Creating\s+|Enacting\s+|Regulating\s+|For\s+)?/i,
    /^Ordinance\s+(No\.\s*[\w-]+\s*,?\s*)?(Establishing\s+|On\s+|Concerning\s+|Creating\s+|Enacting\s+|Regulating\s+|For\s+)?/i,
    /^Ordinansa(ng)?\s+(Para\s+Sa\s+|Tungkol\s+Sa\s+)?/i,
  ];

  for (const pattern of prefixPatterns) {
    if (pattern.test(t)) {
      const stripped = t.replace(pattern, "").trim();
      if (stripped.length > 4) {
        t = stripped;
        break;
      }
    }
  }

  // Ensure capitalized first letter
  if (t.length > 0) {
    t = t.charAt(0).toUpperCase() + t.slice(1);
  }

  return t || title;
}

export function formatOrdinanceYear(
  year: number | null | undefined,
  dateEnacted: Date | string | null | undefined,
  createdAt?: Date | string | null | undefined
): number {
  if (year && !isNaN(Number(year))) {
    return Number(year);
  }
  if (dateEnacted) {
    const y = new Date(dateEnacted).getFullYear();
    if (!isNaN(y)) return y;
  }
  if (createdAt) {
    const y = new Date(createdAt).getFullYear();
    if (!isNaN(y)) return y;
  }
  return new Date().getFullYear();
}
