"use client";

import React, { useState } from "react";
import { toast } from "sonner";

interface ExtractedData {
  title: string;
  ordinanceNumber: string;
  series: string;
  year: number;
  dateEnacted: string;
  category: string;
  summary: string;
  coverage: string;
  tags: string[];
  penalties: string;
  enforcement: string;
  content: string;
}

interface AiOrdinanceExtractorModalProps {
  open: boolean;
  onClose: () => void;
  onExtract: (data: ExtractedData) => void;
}

export function AiOrdinanceExtractorModal({
  open,
  onClose,
  onExtract,
}: AiOrdinanceExtractorModalProps) {
  const [text, setText] = useState("");
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setBase64Image(null);
      setMimeType(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const [header, data] = base64String.split(",");
      const match = header.match(/:(.*?);/);
      const mime = match ? match[1] : file.type;
      setBase64Image(data);
      setMimeType(mime);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!text.trim() && !base64Image) {
      toast.error("Mangyaring maglagay ng teksto o mag-upload ng larawan ng ordinansa.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ordinances/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim() || undefined,
          base64Image: base64Image || undefined,
          mimeType: mimeType || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Hindi nabasa ang ordinansa.");
      }

      toast.success("⚡ Matagumpay na na-extract ng AI ang mga detalye!");
      onExtract(json.data);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Aberya sa AI extraction. Subukan muli.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-extractor-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="bg-[var(--bg-card)] border border-[var(--border-hairline)] rounded-[var(--radius-lg)] w-full max-w-2xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-lg">
              ⚡
            </span>
            <div>
              <h2
                id="ai-extractor-title"
                className="text-base font-bold text-[var(--text-ink)]"
              >
                AI Auto-Extraction (gemini-3.5-flash-lite)
              </h2>
              <p className="text-xs text-[var(--text-mute)]">
                Awtomatikong kukunin ang pamagat, buod, parusa, petsa, at nilalaman mula sa dokumento o teksto.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Isara"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-mute)] hover:bg-[var(--bg-canvas)] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* File Upload Option */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-mute)]">
              Opsyon 1: Mag-upload ng Larawan / Scanned Page ng Resolusyon
            </label>
            <div className="border-2 border-dashed border-[var(--border-hairline)] rounded-[var(--radius-md)] p-4 text-center bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-[var(--text-body)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-emerald-500/20"
              />
              {base64Image && (
                <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  ✔ Na-upload ang larawan para sa AI Scan
                </p>
              )}
            </div>
          </div>

          {/* Text Paste Option */}
          <div className="space-y-2">
            <label
              htmlFor="ai-paste-text"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-mute)]"
            >
              Opsyon 2: I-paste ang Teksto ng Ordinansa o Resolusyon
            </label>
            <textarea
              id="ai-paste-text"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I-paste dito ang buong teksto o bahagi ng ordinansa..."
              className="w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-3 text-sm font-mono text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            />
          </div>
        </div>

        {/* Note about Clean Title */}
        <div className="rounded-[var(--radius-sm)] bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-200">
          <strong>Paalala:</strong> Awtomatikong aalisin ng AI ang mga paulit-ulit na salita tulad ng
          &ldquo;City Ordinance...&rdquo; o &ldquo;Ordinansa para sa...&rdquo; sa pamagat upang maging malinis at maayos.
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-hairline)]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="min-h-[40px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 py-2 text-sm font-medium text-[var(--text-body)] hover:bg-[var(--bg-card)] transition-colors"
          >
            Kanselahin
          </button>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="min-h-[40px] inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sinusuri ng AI...
              </>
            ) : (
              "⚡ Suriin at I-extract (AI)"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
