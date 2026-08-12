"use client";

import { useState, useTransition, useRef } from "react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { toast } from "sonner";
import { AiOrdinanceExtractorModal } from "@/components/dashboard/ai-ordinance-extractor-modal";
import { submitOrdinance } from "../actions";

interface Ordinance {
  id: string;
  slug: string;
  title: string;
  resolutionNumber: string;
  series: string | null;
  category: string | null;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  rejectedReason: string | null;
  submittedBy: { name: string; role: string };
  reviewedBy: { name: string } | null;
}

interface Props {
  initialOrdinances: Ordinance[];
  canSubmit: boolean;
}

const ORDINANCE_CATEGORIES = [
  "General", "Environment", "Public Safety", "Health", "Infrastructure",
  "Education", "Livelihood", "Youth", "Senior Citizens", "Women & Children",
];

export function BarangayOrdinanceManager({ initialOrdinances, canSubmit }: Props) {
  const [ordinances, setOrdinances] = useState(initialOrdinances);
  const [showForm, setShowForm] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const [formState, setFormState] = useState({
    title: "",
    resolutionNumber: "",
    ordinanceLabel: "",
    series: new Date().getFullYear().toString(),
    year: new Date().getFullYear().toString(),
    dateEnacted: "",
    category: "General",
    description: "",
    content: "",
    penalties: "",
    coverage: "",
    enforcement: "",
    signatories: "",
    tags: "",
    pdfUrl: "",
  });

  const handleAiExtract = (data: any) => {
    setFormState({
      title: data.title || "",
      resolutionNumber: data.ordinanceNumber || "",
      ordinanceLabel: data.ordinanceLabel || "",
      series: data.series || new Date().getFullYear().toString(),
      year: data.year?.toString() || new Date().getFullYear().toString(),
      dateEnacted: data.dateEnacted ? data.dateEnacted.split("T")[0] : "",
      category: ORDINANCE_CATEGORIES.includes(data.category) ? data.category : "General",
      description: data.summary || "",
      content: data.content || "",
      penalties: data.penalties || "",
      coverage: data.coverage || "",
      enforcement: data.enforcement || "",
      signatories: data.signatories || "",
      tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
      pdfUrl: data.pdfUrl || "",
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitOrdinance(fd);
      if (result.error) {
        setFormError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Ordinansa ay matagumpay na naisumite para sa pagsusuri ng LGU.");
        setShowForm(false);
        addBtnRef.current?.focus();
        window.location.reload();
      }
    });
  };

  function formatDate(d: Date) {
    return new Date(d).toLocaleDateString("fil-PH", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-4">
      <AiOrdinanceExtractorModal
        open={showAiModal}
        onClose={() => setShowAiModal(false)}
        onExtract={handleAiExtract}
      />

      {/* Toolbar */}
      {canSubmit && (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            ⚡ Auto-Extract (AI)
          </button>
          <button
            ref={addBtnRef}
            type="button"
            onClick={() => { setShowForm((v) => !v); setFormError(""); }}
            aria-expanded={showForm}
            aria-controls="submit-ordinance-form"
            className="min-h-[44px] rounded-[var(--radius-sm)] bg-[var(--accent-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-primary)]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          >
            + Magsumite ng Ordinansa
          </button>
        </div>
      )}

      {/* Submit Ordinance Form */}
      {showForm && canSubmit && (
        <form
          id="submit-ordinance-form"
          onSubmit={handleSubmit}
          className="card-elevated p-5 space-y-4"
          aria-label="Form para magsumite ng bagong ordinansa"
          noValidate
        >
          <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
            <h2 className="text-sm font-bold text-[var(--text-ink)]">Bagong Ordinansa para sa Pagsusuri</h2>
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              ⚡ Punan sa pamamagitan ng AI
            </button>
          </div>
          {formError && (
            <p className="text-xs text-red-600 bg-red-50 dark:bg-red-950/40 p-2.5 rounded border border-red-200 dark:border-red-800" role="alert">
              ❌ {formError}
            </p>
          )}
          <input type="hidden" name="pdfUrl" value={formState.pdfUrl} />
          <input type="hidden" name="ordinanceLabel" value={formState.ordinanceLabel} />
          {formState.pdfUrl && (
            <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <span>📎 Naka-attach na ang opisyal na dokumento mula sa Auto-Extract</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3 flex flex-col gap-1.5">
              <label htmlFor="ord-title" className="text-sm font-medium text-[var(--text-ink)]">
                Pamagat ng Ordinansa <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="ord-title" name="title" type="text" required
                value={formState.title} onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                placeholder="Hal. Isang Ordinansa na Nagtatakda ng…"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ord-res-no" className="text-sm font-medium text-[var(--text-ink)]">
                Resolution Number <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="ord-res-no" name="resolutionNumber" type="text" required
                value={formState.resolutionNumber} onChange={(e) => setFormState({ ...formState, resolutionNumber: e.target.value })}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                placeholder="Hal. RES-2025-001"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ord-series" className="text-sm font-medium text-[var(--text-ink)]">
                Series <span className="text-[var(--text-mute)] font-normal text-xs">(opsyonal)</span>
              </label>
              <input id="ord-series" name="series" type="text"
                value={formState.series} onChange={(e) => setFormState({ ...formState, series: e.target.value })}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                placeholder="Hal. 2025"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ord-year" className="text-sm font-medium text-[var(--text-ink)]">Taon</label>
              <input id="ord-year" name="year" type="number" value={formState.year} onChange={(e) => setFormState({ ...formState, year: e.target.value })}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ord-category" className="text-sm font-medium text-[var(--text-ink)]">Kategorya</label>
              <select id="ord-category" name="category" value={formState.category} onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              >
                {ORDINANCE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ord-date" className="text-sm font-medium text-[var(--text-ink)]">Petsa ng Pagpapatibay</label>
              <input id="ord-date" name="dateEnacted" type="date" value={formState.dateEnacted} onChange={(e) => setFormState({ ...formState, dateEnacted: e.target.value })}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ord-tags" className="text-sm font-medium text-[var(--text-ink)]">Search Tags <span className="text-xs text-[var(--text-mute)]">(comma-separated)</span></label>
              <input id="ord-tags" name="tags" type="text" value={formState.tags} onChange={(e) => setFormState({ ...formState, tags: e.target.value })}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                placeholder="Hal. curfew, kabataan"
              />
            </div>
            <div className="sm:col-span-3 flex flex-col gap-1.5">
              <label htmlFor="ord-description" className="text-sm font-medium text-[var(--text-ink)]">Maikling Paglalarawan</label>
              <textarea id="ord-description" name="description" rows={2} value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                className="rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              />
            </div>
            <div className="sm:col-span-3 flex flex-col gap-1.5">
              <label htmlFor="ord-coverage" className="text-sm font-medium text-[var(--text-ink)]">Saklaw / Coverage</label>
              <input id="ord-coverage" name="coverage" type="text" value={formState.coverage} onChange={(e) => setFormState({ ...formState, coverage: e.target.value })}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              />
            </div>
            <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ord-penalties" className="text-sm font-medium text-[var(--text-ink)]">Parusa at Multa</label>
                <textarea id="ord-penalties" name="penalties" rows={3} value={formState.penalties} onChange={(e) => setFormState({ ...formState, penalties: e.target.value })}
                  className="rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ord-enforcement" className="text-sm font-medium text-[var(--text-ink)]">Ahensyang Magpapatupad</label>
                <textarea id="ord-enforcement" name="enforcement" rows={3} value={formState.enforcement} onChange={(e) => setFormState({ ...formState, enforcement: e.target.value })}
                  className="rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                />
              </div>
            </div>
            <div className="sm:col-span-3 flex flex-col gap-1.5">
              <label htmlFor="ord-signatories" className="text-sm font-medium text-[var(--text-ink)]">Mga Lumagda / Signatories</label>
              <textarea id="ord-signatories" name="signatories" rows={2} value={formState.signatories} onChange={(e) => setFormState({ ...formState, signatories: e.target.value })}
                className="rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                placeholder="Hal. Punong Barangay, Mga Kagawad, Kalihim"
              />
            </div>
            <div className="sm:col-span-3 flex flex-col gap-1.5">
              <label htmlFor="ord-content" className="text-sm font-medium text-[var(--text-ink)]">Buong Nilalaman</label>
              <textarea id="ord-content" name="content" rows={8} value={formState.content} onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                className="rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm font-mono text-[var(--text-ink)] resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-[var(--border-hairline)]">
            <button type="button" onClick={() => { setShowForm(false); addBtnRef.current?.focus(); }}
              className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 py-2 text-sm font-semibold text-[var(--text-ink)] hover:bg-[var(--border-hairline)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            >
              Kanselahin
            </button>
            <button type="submit" disabled={isPending}
              className="min-h-[44px] rounded-[var(--radius-sm)] bg-[var(--accent-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-primary)]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] disabled:opacity-50"
            >
              {isPending ? "Isinusumite…" : "📜 Isumite para sa Pagsusuri"}
            </button>
          </div>
        </form>
      )}

      {/* Ordinances Table */}
      <div className="card-elevated overflow-hidden">
        {ordinances.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3" aria-hidden="true">📭</p>
            <p className="text-sm font-semibold text-[var(--text-ink)]">Wala pang ordinansa ang inyong barangay.</p>
            {canSubmit && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-4 min-h-[44px] rounded-[var(--radius-sm)] bg-[var(--accent-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-primary)]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              >
                Magsumite ng Unang Ordinansa
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Mga ordinansa ng barangay">
              <caption className="sr-only">Listahan ng lahat ng ordinansa ng inyong barangay</caption>
              <thead>
                <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
                  {["Res. No.", "Pamagat", "Status", "Isinumite ni", "Petsa"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-mute)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {ordinances.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[var(--bg-canvas)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-mute)]">
                      {ord.resolutionNumber.includes("-") || !ord.series
                        ? ord.resolutionNumber
                        : `${ord.series.replace(/\D/g, "")}-${ord.resolutionNumber}`}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-[var(--text-ink)] line-clamp-2">{ord.title}</p>
                      {ord.rejectedReason && (
                        <p className="text-[10px] text-red-500 mt-0.5 italic">Dahilan: {ord.rejectedReason}</p>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge type="ordinance" status={ord.status} /></td>
                    <td className="px-4 py-3 text-sm text-[var(--text-body)]">{ord.submittedBy.name}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text-mute)] whitespace-nowrap">{formatDate(ord.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
