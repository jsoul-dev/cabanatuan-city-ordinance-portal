"use client";

import React from "react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

interface OrdinanceSectionsViewProps {
  articles?: string | null;
  fallbackContent?: string | null;
}

export function OrdinanceSectionsView({
  articles,
  fallbackContent,
}: OrdinanceSectionsViewProps) {
  const rawText = (articles || fallbackContent || "").trim();
  if (!rawText) return null;

  const sections = parseSections(rawText);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-4">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Articles &amp; Sections
        </h2>
      </div>

      <div className="space-y-3">
        {sections.map((sec, idx) => {
          const isPenalty = /penalty|penalties|parusa|multa|fines/i.test(sec.badge) || /penalty|penalties|parusa|multa|fines/i.test(sec.title);
          
          return (
            <div
              key={idx}
              className={`group relative rounded-2xl border p-5 shadow-sm transition-colors ${
                isPenalty 
                  ? "border-red-500/20 bg-red-950/20 hover:border-red-500/40" 
                  : "border-neutral-800/80 bg-[#0d1310] hover:border-emerald-500/30"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                  isPenalty ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {sec.badge}
                </span>
                {sec.title && (
                  <h3 className={`text-base sm:text-lg font-bold tracking-tight ${
                    isPenalty ? "text-red-400" : "text-white"
                  }`}>
                    {sec.title}
                  </h3>
                )}
              </div>
              <div className={`text-sm sm:text-base leading-relaxed ${
                isPenalty ? "text-neutral-200" : "text-neutral-300"
              }`}>
                <MarkdownRenderer content={sec.content} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface OrdinanceEnforcementViewProps {
  enforcement?: string | null;
  coverage?: string | null;
}

export function OrdinanceEnforcementView({
  enforcement,
  coverage,
}: OrdinanceEnforcementViewProps) {
  const { personnel, actions } = parseEnforcement(enforcement, coverage);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-4">
        <svg
          className="w-5 h-5 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <h2 className="text-xl font-extrabold text-emerald-400 tracking-tight">
          Enforcement Actions
        </h2>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-[#0c120f] p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Authorized Personnel */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 mb-3.5">
              AUTHORIZED PERSONNEL
            </h3>
            <div className="space-y-2.5">
              {personnel.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-800/80 bg-[#0d1310] px-4 py-3 text-sm font-medium text-neutral-200"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 mb-3.5">
              ACTIONS
            </h3>
            <div className="space-y-2.5">
              {actions.map((act, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-800/80 bg-[#0d1310] px-4 py-3 text-sm font-medium text-neutral-200"
                >
                  {act}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrdinanceSignatoriesViewProps {
  signatories?: string | null;
}

export function OrdinanceSignatoriesView({ signatories }: OrdinanceSignatoriesViewProps) {
  if (!signatories || !signatories.trim()) return null;

  const names = signatories
    .split(/\r?\n|;|,|•/)
    .map((s) => s.trim().replace(/^\(+|\)+$/g, ''))
    .filter(Boolean)
    .filter((name) => {
      const lower = name.toLowerCase();
      if (
        lower === "sangguniang panlungsod" ||
        lower === "sangguniang barangay" ||
        lower === "presiding officer" ||
        lower === "punong barangay" ||
        lower === "city mayor" ||
        lower === "barangay captain" ||
        lower === "kagawad" ||
        lower === "sk chairperson" ||
        lower === "secretary" ||
        lower === "barangay secretary"
      ) {
        return false;
      }
      return /[A-Za-z]/.test(name);
    });

  if (names.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-4">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Signatories &amp; Approval
        </h2>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-[#0d1310] p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {names.map((name, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-neutral-800/60 bg-neutral-900/60 px-4 py-3 flex items-center gap-3"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500/80 flex-shrink-0" />
              <span className="text-sm font-semibold text-neutral-200 truncate">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * HELPER PARSERS FOR SECTIONS, PENALTIES, AND ENFORCEMENT
 * ========================================================================= */

interface ParsedSection {
  badge: string;
  title: string;
  content: string;
}

function parseSections(text: string): ParsedSection[] {
  const boilerplateRegex = /(?:NAGKAKAISANG PINAGTIBAY|PINATUTUNAYANG WASTO|UNANIMOUSLY APPROVED|APPROVED:|CERTIFIED CORRECT:|I HEREBY CERTIFY|ATTESTED BY:)/i;
  let cleanText = text;
  const boilerplateMatch = boilerplateRegex.exec(text);
  if (boilerplateMatch) {
    cleanText = text.substring(0, boilerplateMatch.index);
  }

  const regex = /(?:^|\n)(?:#{1,3}\s*)?((?:SECTION|SEKSYON|ARTICLE|ARTIKULO)\s+(?:\d+|[IVXLCDM]+))([\s\S]*?)(?=(?:\n(?:#{1,3}\s*)?(?:SECTION|SEKSYON|ARTICLE|ARTIKULO)\s+(?:\d+|[IVXLCDM]+)|\s*$))/gi;

  const results: ParsedSection[] = [];
  let match;
  while ((match = regex.exec(cleanText)) !== null) {
    const badge = match[1].trim().toUpperCase();
    let rawContent = match[2].trim();

    // Strip leading dashes, dots, or colons from the beginning of the entire section content
    rawContent = rawContent.replace(/^[-–—.:\s]+/, '');

    let title = "";
    const lines = rawContent.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // Only extract the title if there's a short distinct line
    if (lines.length > 1 && lines[0].length < 150 && !lines[0].endsWith(".")) {
      title = lines[0];
      rawContent = lines.slice(1).join("\n");
    } else {
      rawContent = lines.join("\n");
    }

    const paragraphs = rawContent.split(/\n/);
    const uniqueParas = Array.from(new Set(paragraphs));
    const content = uniqueParas.join("\n").trim();

    results.push({
      badge,
      title: title || badge,
      content: content || title || badge,
    });
  }

  if (results.length > 0) {
    return results;
  }

  const paragraphs = cleanText
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return [{ badge: "SECTION 1", title: "General Provisions", content: cleanText }];
  }

  return paragraphs.map((para, i) => {
    const lines = para.split(/\r?\n/).map(l => l.trim());
    let title = "";
    let content = para;
    if (lines.length > 1 && lines[0].length < 80 && !lines[0].endsWith(".")) {
      title = lines[0].replace(/^#{1,3}\s*/, "").replace(/^[-–—.:\s]+/, '').trim();
      content = lines.slice(1).join("\n").trim();
    }
    return {
      badge: `SECTION ${i + 1}`,
      title: title || `Probisyon ${i + 1}`,
      content: content || para,
    };
  });
}

function parseEnforcement(
  enforcementText?: string | null,
  coverage?: string | null
): { personnel: string[]; actions: string[] } {
  let personnel: string[] = [];
  let actions: string[] = [];

  if (enforcementText && enforcementText.trim()) {
    const lines = enforcementText
      .split(/\r?\n|;/)
      .map((l) => l.trim())
      .filter(Boolean);

    lines.forEach((line) => {
      const parts = line.split(/[(),]/).map(p => p.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
      
      parts.forEach(part => {
        if (
          /tanod|police|pnp|officer|personnel|sangguniang|committee|kapitan|kagawad|poso|ctmo|task\s*force|chairman|chairperson|member|alagad|bantay|kapulisan|lto|bureau|department|office|agency|opisyales|opisyal|kinatawan|pulis|enforcer|tanggapan|hepe|puno/i.test(
            part
          )
        ) {
          personnel.push(part);
        } else {
          actions.push(part);
        }
      });
    });
  }

  personnel = Array.from(new Set(personnel));
  actions = Array.from(new Set(actions));

  if (personnel.length === 0) {
    personnel = [
      "Sangguniang Barangay / Panlungsod",
      "Barangay Tanod & Peace and Order Committee",
      "Cabanatuan Traffic / Safety Officers",
    ];
  }

  if (actions.length === 0) {
    actions = [
      "Issuance of violation warning & compliance notice",
      "Regular inspection and monitoring of area",
      "Imposition of designated penalties and community service",
      "Coordination with Cabanatuan City Authorities",
    ];
  }

  return { personnel, actions };
}
