"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PdfViewerModal } from "@/components/ui/pdf-viewer-modal";
import { formatResolutionDisplay } from "@/lib/ordinance-utils";

interface OrdinancePdfButtonProps {
  pdfUrl?: string | null;
  title: string;
  resolutionNumber?: string;
  slug?: string;
  dateEnacted?: string | null;
  category?: string | null;
  coverage?: string | null;
  description?: string | null;
  articles?: string | null;
  penalties?: string | null;
  signatories?: string | null;
}

export function OrdinancePdfButton({
  pdfUrl,
  title,
  resolutionNumber,
  slug,
  dateEnacted,
  category,
  coverage,
  description,
  articles,
  penalties,
  signatories,
}: OrdinancePdfButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!pdfUrl) return null;

  const downloadFilename = `${slug || formatResolutionDisplay(resolutionNumber) || "ordinance"}.pdf`;

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    try {
      // Blob-fetch to bypass cross-origin filename restrictions
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab if blob fetch fails
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          type="button"
          onClick={handleDownloadClick}
          disabled={isDownloading}
          className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-600 text-white font-bold px-6 py-3 text-sm hover:bg-emerald-500 transition-colors shadow-md disabled:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {isDownloading ? "Downloading..." : "Download Official PDF Document"}
        </Button>
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-neutral-800/90 text-white font-bold px-6 py-3 text-sm hover:bg-neutral-700 transition-colors shadow-md"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          View Official PDF Document
        </Button>
      </div>

      <PdfViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pdfUrl={pdfUrl}
        title={title}
        resolutionNumber={resolutionNumber}
        slug={slug}
        dateEnacted={dateEnacted}
        category={category}
        coverage={coverage}
        description={description}
        articles={articles}
        penalties={penalties}
        signatories={signatories}
      />
    </>
  );
}
