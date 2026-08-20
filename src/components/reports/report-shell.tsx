"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { PdfReportData } from "@/lib/generate-report-pdf";

interface ReportShellProps {
  title: string;
  subtitle?: string;
  dateRange?: string;
  groupedBy?: string;
  filters?: string;
  generatedBy: string;
  generatedByRole: string;
  totalRecords?: number;
  /** Structured report data for PDF generation via jsPDF */
  pdfData?: PdfReportData;
  children: React.ReactNode;
}

/**
 * Formal report wrapper with official government header, metadata,
 * prepared-by section, and jsPDF download button.
 */
export function ReportShell({
  title,
  subtitle,
  dateRange,
  groupedBy,
  filters,
  generatedBy,
  generatedByRole,
  pdfData,
  children,
}: ReportShellProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const now = new Date();
  const generatedOn = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const generatedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleDownloadPdf = async () => {
    if (!pdfData) return;
    setIsGenerating(true);
    try {
      const { generateReportPdf } = await import("@/lib/generate-report-pdf");
      await generateReportPdf(pdfData);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Screen-only toolbar */}
      <div className="print:hidden flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--bg-card)] px-4 py-3">
        <p className="text-sm text-[var(--text-body)]">
          Report preview is shown below. Click the button to download as PDF.
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={!pdfData || isGenerating}
          className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  className="opacity-75"
                />
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              I-download bilang PDF
            </>
          )}
        </button>
      </div>

      {/* On-screen report preview */}
      <div
        className="report-document bg-white text-black mx-auto shadow-xl"
        style={{ maxWidth: "210mm" }}
      >
        {/* ── Official Header ── */}
        <div className="report-header border-b-[3px] border-[#1a5632] px-8 pt-6 pb-4">
          {/* Top metadata line */}
          <div className="flex justify-end text-[10px] text-gray-500 mb-2">
            <div className="text-right space-y-0.5">
              {dateRange && <p>Date Range: {dateRange}</p>}
              {groupedBy && <p>Grouped By: {groupedBy}</p>}
              {filters && <p>Filters: {filters}</p>}
              <p>
                Generated On: {generatedOn} at {generatedTime}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Left logo */}
            <div className="w-14 h-14 flex-shrink-0">
              <Image
                src="/lgu-logo.png"
                alt="Cabanatuan City LGU Seal"
                width={56}
                height={56}
                className="rounded-full object-contain"
              />
            </div>

            {/* Center text */}
            <div className="text-center flex-1 px-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-sans">
                Republic of the Philippines
              </p>
              <h1 className="text-lg font-bold text-[#1a5632] leading-tight">
                City of Cabanatuan
              </h1>
              <p className="text-[10px] text-gray-500 font-sans">
                Province of Nueva Ecija
              </p>
            </div>

            {/* Right logo */}
            <div className="w-14 h-14 flex-shrink-0">
              <Image
                src="/lgu-logo.png"
                alt=""
                width={56}
                height={56}
                className="rounded-full object-contain"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* ── Report Title ── */}
        <div className="px-8 pt-6 pb-4 text-center">
          <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* ── Report Body ── */}
        <div className="px-8 pb-6">{children}</div>

        {/* ── Prepared By ── */}
        <div className="px-8 pb-6 mt-4">
          <p className="text-xs text-gray-600 mb-6">Prepared by:</p>
          <div className="inline-block">
            <div className="border-b border-gray-900 pb-0.5 min-w-[200px]">
              <p className="text-sm font-bold text-gray-900">{generatedBy}</p>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">{generatedByRole}</p>
            <p className="text-[10px] text-gray-400 italic">
              Signature over printed name
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="report-footer border-t-2 border-[#1a5632] px-8 py-3 mt-4">
          <div className="flex items-end justify-between text-[9px] text-gray-500">
            <div>
              <p className="font-semibold text-gray-700">City of Cabanatuan</p>
              <p>Province of Nueva Ecija</p>
            </div>
            <div className="text-right">
              <p>
                Date Printed: {generatedOn}&nbsp;&nbsp;&nbsp;Time Printed:{" "}
                {generatedTime}
              </p>
              <p className="text-gray-400">
                Generated by: Cabanatuan City Ordinance Portal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
