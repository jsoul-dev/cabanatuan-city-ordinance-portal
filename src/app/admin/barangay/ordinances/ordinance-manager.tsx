"use client";

import { useState, useTransition, useRef } from "react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { submitOrdinance } from "../actions";

type Ordinance = {
  id: string;
  title: string;
  resolutionNumber: string;
  series: string | null;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  rejectedReason: string | null;
  submittedBy: { name: string; role: string };
  reviewedBy: { name: string } | null;
};

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
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitOrdinance(fd);
      if (result.error) {
        setFormError(result.error);
      } else {
        setFormSuccess(true);
        setShowForm(false);
        addBtnRef.current?.focus();
        // Refresh via navigation to get updated server data
        window.location.reload();
      }
    });
  };

  function formatDate(d: Date) {
    return new Date(d).toLocaleDateString("fil-PH", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-4">
      {/* Success toast */}
      {formSuccess && (
        <div role="status" aria-live="polite" className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-[var(--radius-sm)] px-4 py-3 text-sm font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <span aria-hidden="true">✅</span>
          Ordinansa ay matagumpay na naisumite para sa pagsusuri ng LGU.
        </div>
      )}

      {/* Toolbar */}
      {canSubmit && (
        <div className="flex justify-end">
          <button
            ref={addBtnRef}
            type="button"
            onClick={() => { setShowForm((v) => !v); setFormError(""); setFormSuccess(false); }}
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
          <h2 className="text-sm font-bold text-[var(--text-ink)]">Bagong Ordinansa para sa Pagsusuri</h2>
          {formError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[var(--radius-sm)] px-3 py-2">
              ❌ {formError}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label htmlFor="ord-title" className="text-sm font-medium text-[var(--text-ink)]">
                Pamagat ng Ordinansa <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="ord-title" name="title" type="text" required
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                placeholder="Hal. Isang Ordinansa na Nagtatakda ng…"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ord-res-no" className="text-sm font-medium text-[var(--text-ink)]">
                Resolution Number <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="ord-res-no" name="resolutionNumber" type="text" required
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                placeholder="Hal. RES-2025-001"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ord-series" className="text-sm font-medium text-[var(--text-ink)]">
                Series <span className="text-[var(--text-mute)] font-normal text-xs">(opsyonal)</span>
              </label>
              <input id="ord-series" name="series" type="text"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                placeholder="Hal. Series of 2025"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ord-category" className="text-sm font-medium text-[var(--text-ink)]">
                Kategorya
              </label>
              <select id="ord-category" name="category"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              >
                {ORDINANCE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label htmlFor="ord-description" className="text-sm font-medium text-[var(--text-ink)]">
                Maikling Paglalarawan
              </label>
              <textarea id="ord-description" name="description" rows={2}
                className="rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                placeholder="Maikling paglalarawan ng layunin ng ordinansa…"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label htmlFor="ord-content" className="text-sm font-medium text-[var(--text-ink)]">
                Buong Nilalaman ng Ordinansa
              </label>
              <textarea id="ord-content" name="content" rows={8}
                className="rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm font-mono text-[var(--text-ink)] placeholder:text-[var(--text-mute)] resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                placeholder="Ilagay ang buong teksto ng ordinansa dito…"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
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
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-mute)]">{ord.resolutionNumber}</td>
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
