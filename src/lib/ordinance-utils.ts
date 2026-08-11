/**
 * Utility helper functions for formatting Ordinance metadata cleanly across the UI.
 */

export function cleanOrdinanceTitle(title: string): string {
  if (!title) return "";
  let t = title.trim();

  // 1. Strip common redundant prefixes to keep display titles clean and scannable
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

  // 2. Strip trailing place/jurisdiction suffixes (e.g. "in Cabanatuan City", "sa Barangay Camp Tinio")
  // Since jurisdiction/coverage is already shown in the table and coverage badge
  const suffixPatterns = [
    /\s+(?:in|within|of)\s+(?:the\s+)?(?:City\s+of\s+)?Cabanatuan(?:\s+City)?$/i,
    /\s+(?:in|within|of)\s+(?:the\s+)?Barangay\s+.+$/i,
    /\s+(?:sa|sa\s+loob\s+ng)\s+(?:Barangay|Brgy\.)\s+.+$/i,
    /\s+(?:sa|sa\s+loob\s+ng)\s+Lungsod\s+ng\s+Cabanatuan$/i,
  ];

  for (const pattern of suffixPatterns) {
    if (pattern.test(t)) {
      const stripped = t.replace(pattern, "").trim();
      if (stripped.length > 3) {
        t = stripped;
        break;
      }
    }
  }

  // 3. Ensure capitalized first letter
  if (t.length > 0) {
    t = t.charAt(0).toUpperCase() + t.slice(1);
  }

  return t || title;
}

/**
 * Ensures standard YYYY-NNN formatting for resolution / ordinance numbers.
 * e.g., "681-2024" -> "2024-681", "02-2024" -> "2024-02"
 */
export function formatResolutionNumber(resNo: string | null | undefined): string {
  if (!resNo) return "N/A";
  const cleaned = resNo.trim();

  // If already in YYYY-NNN (e.g., "2024-681" or "2024-003"), return as is
  if (/^\d{4}-[\w-]+$/.test(cleaned)) {
    return cleaned;
  }

  // If in NNN-YYYY (e.g., "681-2024" or "02-2024"), transform to YYYY-NNN ("2024-681", "2024-02")
  const nnnYyyy = cleaned.match(/^(\w+)-(\d{4})$/);
  if (nnnYyyy) {
    return `${nnnYyyy[2]}-${nnnYyyy[1]}`;
  }

  // If in format like "Resolution No. 681 s. 2024" or "Ordinance No. 02 s. 2024" or "Ordinance Blg. 02 s. 2024"
  const yearSeriesMatch = cleaned.match(/(?:No\.|Blg\.|Number|Blg)?\s*(\d+)\s*(?:s\.|series\s+of|taon)\s*(\d{4})/i);
  if (yearSeriesMatch) {
    const num = yearSeriesMatch[1].length === 1 ? `0${yearSeriesMatch[1]}` : yearSeriesMatch[1];
    return `${yearSeriesMatch[2]}-${num}`;
  }

  return cleaned;
}

/**
 * Standardizes common enforcement agency names so they display consistently across all ordinances.
 */
export function formatEnforcementAgencies(enforcement: string | null | undefined): string {
  if (!enforcement) return "Walang espesipikong ahensya o aksyong nakatala.";
  let e = enforcement.trim();

  // Standardize PNP variations
  e = e.replace(/PNP\s*\(Kapulisan\)|Kapulisan|Philippine National Police/gi, "PNP Cabanatuan");
  // Standardize Bantay Bayan / Tanod variations
  e = e.replace(/Alagad ng Barangay\s*(?:\/|\(|-)?\s*(?:Bantay Bayan\)?)|Barangay Tanod\s*(?:\/|\(|-)?\s*(?:Bantay Bayan\)?)/gi, "Barangay Tanod (Bantay Bayan)");

  return e;
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

/**
 * Converts internal YYYY-NNN format to display format NNN-YYYY
 * as it appears on official documents.
 * e.g., "2024-572" -> "572-2024"
 */
export function formatResolutionDisplay(resNo: string | null | undefined): string {
  if (!resNo) return "N/A";
  const formatted = formatResolutionNumber(resNo);
  const match = formatted.match(/^(\d{4})-(.+)$/);
  if (match) return `${match[2]}-${match[1]}`;
  return formatted;
}

/**
 * Generates a URL-friendly slug from a resolution number.
 * e.g., "2024-572" -> "572-2024", "2024-02" -> "02-2024"
 */
export function generateOrdinanceSlug(resNo: string): string {
  const display = formatResolutionDisplay(formatResolutionNumber(resNo));
  return display.toLowerCase();
}

/**
 * Smart coverage display: don't append "Cabanatuan City" to barangay names,
 * and show only "Cabanatuan City" for city ordinances.
 */
export function formatCoverage(
  coverage: string | null | undefined,
  type: "CITY" | "BARANGAY",
  barangayName?: string | null
): string {
  if (coverage) {
    // Strip trailing ", Cabanatuan City" or ", Lungsod ng Cabanatuan" if present
    let clean = coverage
      .replace(/,?\s*(?:Lungsod ng )?Cabanatuan(?:\s+City)?$/i, "")
      .trim();
    // If after stripping we have nothing left, it was city-level
    if (!clean) return "Cabanatuan City";
    return clean;
  }
  if (type === "CITY") return "Cabanatuan City";
  if (barangayName) return `Barangay ${barangayName}`;
  return "N/A";
}

