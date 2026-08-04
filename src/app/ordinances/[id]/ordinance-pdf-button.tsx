"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PdfViewerModal } from "@/components/ui/pdf-viewer-modal";

interface OrdinancePdfButtonProps {
  pdfUrl: string | null;
  title: string;
  resolutionNumber?: string;
  series?: string | null;
}

export function OrdinancePdfButton({
  pdfUrl,
  title,
  resolutionNumber,
  series,
}: OrdinancePdfButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!pdfUrl) return null;

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--accent-primary-hover)] transition-colors shadow-sm"
        >
          📄 Tingnan ang PDF Preview
        </Button>
        <a
          href={pdfUrl}
          download
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 py-2 text-xs font-semibold text-[var(--text-ink)] hover:bg-[var(--border-hairline)] transition-colors shadow-sm"
        >
          📥 I-download ang PDF
        </a>
      </div>

      <PdfViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pdfUrl={pdfUrl}
        title={title}
        resolutionNumber={resolutionNumber}
        series={series}
      />
    </>
  );
}
