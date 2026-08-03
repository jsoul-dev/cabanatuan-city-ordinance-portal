"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { approveOrdinance, rejectOrdinance, deleteOrdinance } from "../actions";

type OrdinanceStatus = "ALL" | "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

type Ordinance = {
  id: string;
  title: string;
  resolutionNumber: string;
  series: string | null;
  type: "BARANGAY" | "CITY";
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  barangay: { name: string } | null;
  submittedBy: { name: string; role: string };
  reviewedBy: { name: string } | null;
  rejectedReason: string | null;
};

interface Props {
  initialOrdinances: Ordinance[];
  defaultReviewId?: string;
}

const STATUS_TABS: { value: OrdinanceStatus; label: string; icon: string }[] = [
  { value: "ALL",      label: "Lahat",     icon: "📋" },
  { value: "PENDING",  label: "Pending",   icon: "⏳" },
  { value: "APPROVED", label: "Approved",  icon: "✅" },
  { value: "DRAFT",    label: "Draft",     icon: "✏️" },
  { value: "REJECTED", label: "Rejected",  icon: "❌" },
];

export function LguOrdinanceManager({ initialOrdinances, defaultReviewId }: Props) {
  const [ordinances, setOrdinances] = useState(initialOrdinances);
  const [statusFilter, setStatusFilter] = useState<OrdinanceStatus>("ALL");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const [dialogState, setDialogState] = useState<{
    type: "approve" | "reject" | "delete" | null;
    id: string;
    title: string;
  }>({ type: null, id: "", title: "" });
  const [rejectReason, setRejectReason] = useState("");
  const [triggerRef, setTriggerRef] = useState<HTMLButtonElement | null>(null);

  // Auto-open review dialog if URL has ?review=id
  useEffect(() => {
    if (defaultReviewId) {
      const ord = initialOrdinances.find((o) => o.id === defaultReviewId);
      if (ord && ord.status === "PENDING") {
        setDialogState({ type: "approve", id: ord.id, title: ord.title });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDialog = useCallback(
    (type: "approve" | "reject" | "delete", id: string, title: string, btn: HTMLButtonElement) => {
      setDialogState({ type, id, title });
      setRejectReason("");
      setTriggerRef(btn);
    },
    []
  );

  const closeDialog = useCallback(() => {
    setDialogState({ type: null, id: "", title: "" });
    triggerRef?.focus();
    setTriggerRef(null);
  }, [triggerRef]);

  const handleConfirm = useCallback(() => {
    const { type, id } = dialogState;
    if (!type || !id) return;

    startTransition(async () => {
      let result: { error?: string } = {};

      if (type === "approve")      result = await approveOrdinance(id);
      else if (type === "reject")  result = await rejectOrdinance(id, rejectReason);
      else if (type === "delete")  result = await deleteOrdinance(id);

      if (result.error) {
        toast.error(result.error);
      } else {
        if (type === "approve") {
          setOrdinances((prev) => prev.map((o) => o.id === id ? { ...o, status: "APPROVED" } : o));
          toast.success("Ordinansa ay naaprubahan.");
        } else if (type === "reject") {
          setOrdinances((prev) => prev.map((o) => o.id === id ? { ...o, status: "REJECTED", rejectedReason: rejectReason } : o));
          toast.success("Ordinansa ay tinanggihan.");
        } else if (type === "delete") {
          setOrdinances((prev) => prev.filter((o) => o.id !== id));
          toast.success("Ordinansa ay natanggal.");
        }
      }
      closeDialog();
    });
  }, [dialogState, rejectReason, closeDialog]);

  const filtered = ordinances.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchSearch =
      !search ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.resolutionNumber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("fil-PH", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-4">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status Tabs */}
        <div
          role="tablist"
          aria-label="I-filter ayon sa status"
          className="flex flex-wrap gap-1 p-1 rounded-[var(--radius-sm)] bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
        >
          {STATUS_TABS.map((tab) => {
            const count = tab.value === "ALL" ? ordinances.length : ordinances.filter((o) => o.status === tab.value).length;
            return (
              <button
                key={tab.value}
                role="tab"
                aria-selected={statusFilter === tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`flex items-center gap-1.5 min-h-[36px] rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  statusFilter === tab.value
                    ? "bg-[var(--bg-card)] text-[var(--text-ink)] shadow-sm"
                    : "text-[var(--text-mute)] hover:text-[var(--text-ink)]"
                }`}
              >
                <span aria-hidden="true">{tab.icon}</span>
                {tab.label}
                <span className="ml-0.5 rounded-full bg-[var(--border-hairline)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--text-mute)]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex-1">
          <label htmlFor="search-ordinances" className="sr-only">Maghanap ng ordinansa</label>
          <input
            id="search-ordinances"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Maghanap ng pamagat o res. no…"
            className="w-full min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-card)] px-4 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3" aria-hidden="true">🔍</p>
            <p className="text-sm font-semibold text-[var(--text-ink)]">Walang nahanap na ordinansa.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Lahat ng ordinansa">
              <caption className="sr-only">Listahan ng lahat ng ordinansa sa sistema</caption>
              <thead>
                <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
                  {["Res. No.", "Pamagat", "Uri", "Status", "Barangay", "Isinumite ni", "Petsa", "Aksyon"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-mute)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[var(--bg-canvas)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-mute)] whitespace-nowrap">{ord.resolutionNumber}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-[var(--text-ink)] line-clamp-2">{ord.title}</p>
                      {ord.rejectedReason && (
                        <p className="text-[10px] text-red-500 mt-0.5 italic line-clamp-1">Dahilan: {ord.rejectedReason}</p>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge type="ordinanceType" status={ord.type} /></td>
                    <td className="px-4 py-3"><StatusBadge type="ordinance" status={ord.status} /></td>
                    <td className="px-4 py-3 text-sm text-[var(--text-body)] whitespace-nowrap">
                      {ord.barangay?.name ?? <span className="text-[var(--text-mute)]">City-wide</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-body)] whitespace-nowrap">{ord.submittedBy.name}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text-mute)] whitespace-nowrap">{formatDate(ord.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Link
                          href={`/ordinances/${ord.id}`}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-hairline)] text-xs text-[var(--text-body)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] px-2"
                          aria-label={`Tingnan ang ordinansa: ${ord.title}`}
                        >
                          👁️
                        </Link>
                        {ord.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={(e) => openDialog("approve", ord.id, ord.title, e.currentTarget)}
                              className="min-h-[36px] rounded-[var(--radius-sm)] bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50"
                              aria-label={`Aprubahan ang ordinansa: ${ord.title}`}
                            >
                              ✅ Aprubahan
                            </button>
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={(e) => openDialog("reject", ord.id, ord.title, e.currentTarget)}
                              className="min-h-[36px] rounded-[var(--radius-sm)] bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                              aria-label={`Tanggihan ang ordinansa: ${ord.title}`}
                            >
                              ❌ Tanggihan
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={(e) => openDialog("delete", ord.id, ord.title, e.currentTarget)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-mute)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                          aria-label={`Tanggalin ang ordinansa: ${ord.title}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={dialogState.type === "approve"}
        title="Aprubahan ang Ordinansa"
        description={`Sigurado ka bang iaapruba ang ordinansang ito?\n"${dialogState.title}"`}
        confirmLabel="✅ Aprubahan"
        cancelLabel="Bumalik"
        variant="default"
        onConfirm={handleConfirm}
        onCancel={closeDialog}
      />

      <ConfirmDialog
        open={dialogState.type === "reject"}
        title="Tanggihan ang Ordinansa"
        description={`"${dialogState.title}"`}
        confirmLabel="❌ Tanggihan"
        cancelLabel="Bumalik"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={closeDialog}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        reasonLabel="Dahilan ng pagtanggi"
        reasonRequired
      />

      <ConfirmDialog
        open={dialogState.type === "delete"}
        title="Tanggalin ang Ordinansa?"
        description={`Permanenteng matatanggal ang ordinansang ito. Hindi ito maibabalik.\n"${dialogState.title}"`}
        confirmLabel="🗑️ Tanggalin"
        cancelLabel="Huwag"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={closeDialog}
      />
    </div>
  );
}
