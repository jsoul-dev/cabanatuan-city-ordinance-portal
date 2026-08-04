"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title: string;
  resolutionNumber?: string;
  series?: string | null;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  pdfUrl,
  title,
  resolutionNumber,
  series,
}: PdfViewerModalProps) {
  if (!isOpen || !pdfUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose}
    >
      <div
        className="relative flex h-[88vh] w-full max-w-5xl flex-col rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--bg-card)] shadow-[var(--shadow-floating)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-6 py-4">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                OFFICIAL PDF DOCUMENT
              </span>
              {resolutionNumber && (
                <span className="font-mono text-xs text-[var(--text-mute)]">
                  Res. No. {resolutionNumber} {series ? `(${series})` : ""}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[var(--text-ink)] truncate">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              📥 I-download ang PDF
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs font-semibold text-[var(--text-ink)] hover:bg-[var(--border-hairline)] transition-colors"
            >
              🔗 Buksan sa Bagong Tab
            </a>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 rounded-[var(--radius-sm)] p-1.5 text-[var(--text-mute)] hover:bg-[var(--border-hairline)] hover:text-[var(--text-ink)] transition-colors"
              aria-label="Isara ang modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PDF Iframe */}
        <div className="flex-1 w-full bg-neutral-900 overflow-hidden relative">
          <iframe
            src={`${pdfUrl}#toolbar=1&view=FitH`}
            className="h-full w-full border-0"
            title={`PDF Viewer - ${title}`}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full text-xs text-neutral-300 pointer-events-none hidden sm:block">
            💡 Kung hindi ma-load ang preview, i-click ang &quot;Buksan sa Bagong Tab&quot; sa itaas.
          </div>
        </div>
      </div>
    </div>
  );
}
