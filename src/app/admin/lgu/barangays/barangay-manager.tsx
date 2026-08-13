"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import {
  createBarangay,
  updateBarangay,
  deleteBarangay,
  upsertBarangayAdminAccount,
} from "../actions";

type BarangayWithDetails = {
  id: string;
  name: string;
  description: string | null;
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  }[];
  _count: {
    ordinances: number;
    reports: number;
  };
};

interface BarangayManagerProps {
  initialBarangays: BarangayWithDetails[];
}

const roleLabel: Record<string, string> = {
  BARANGAY_ADMIN: "Barangay Admin",
};

export function BarangayManager({ initialBarangays }: BarangayManagerProps) {
  const [barangays] = useState<BarangayWithDetails[]>(initialBarangays);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "NO_ACCOUNT">("ALL");

  // Modals state
  const [showBarangayModal, setShowBarangayModal] = useState(false);
  const [editingBarangay, setEditingBarangay] = useState<BarangayWithDetails | null>(null);

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [targetBarangayForAccount, setTargetBarangayForAccount] = useState<BarangayWithDetails | null>(null);

  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Delete confirm dialog
  const [deleteId, setDeleteId] = useState<{ id: string; name: string } | null>(null);

  // Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showBarangayModal) setShowBarangayModal(false);
        if (showAccountModal) setShowAccountModal(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showBarangayModal, showAccountModal]);

  // Stats computation
  const stats = useMemo(() => {
    const total = barangays.length;
    const withAccount = barangays.filter((b) => b.users.length > 0).length;
    const totalOrdinances = barangays.reduce((acc, b) => acc + b._count.ordinances, 0);
    const totalReports = barangays.reduce((acc, b) => acc + b._count.reports, 0);
    return { total, withAccount, totalOrdinances, totalReports };
  }, [barangays]);

  // Filtered barangays
  const filteredBarangays = useMemo(() => {
    return barangays.filter((b) => {
      const hasAccount = b.users.length > 0;
      if (statusFilter === "ACTIVE" && !hasAccount) return false;
      if (statusFilter === "NO_ACCOUNT" && hasAccount) return false;

      if (!search.trim()) return true;
      const term = search.trim().toLowerCase();
      const matchesName = b.name.toLowerCase().includes(term);
      const matchesUser = b.users.some(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
      return matchesName || matchesUser;
    });
  }, [barangays, search, statusFilter]);

  // Open Create Barangay modal
  function openCreateBarangay() {
    setEditingBarangay(null);
    setFormError("");
    setShowBarangayModal(true);
  }

  // Open Edit Barangay modal
  function openEditBarangay(b: BarangayWithDetails) {
    setEditingBarangay(b);
    setFormError("");
    setShowBarangayModal(true);
  }

  // Open Manage Account modal
  function openManageAccount(b: BarangayWithDetails) {
    setTargetBarangayForAccount(b);
    setFormError("");
    setShowAccountModal(true);
  }

  // Submit create/update barangay
  const handleBarangaySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      let result;
      if (editingBarangay) {
        result = await updateBarangay(editingBarangay.id, fd);
      } else {
        result = await createBarangay(fd);
      }

      if (result.error) {
        setFormError(result.error);
        toast.error(result.error);
      } else {
        toast.success(
          editingBarangay
            ? "Na-update ang Barangay."
            : "Nairehistro ang bagong Barangay."
        );
        setShowBarangayModal(false);
        window.location.reload();
      }
    });
  };

  // Submit manage account
  const handleAccountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await upsertBarangayAdminAccount(fd);
      if (result.error) {
        setFormError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Na-save ang Barangay Admin account.");
        setShowAccountModal(false);
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-elevated p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Kabuuang Barangay
          </p>
          <p className="text-2xl font-bold text-[var(--text-ink)] mt-1">
            {stats.total}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Rehistrado sa sistema
          </p>
        </div>

        <div className="card-elevated p-4 border-l-4 border-l-blue-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            May Admin Account
          </p>
          <p className="text-2xl font-bold text-[var(--text-ink)] mt-1">
            {stats.withAccount}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Aktibong Barangay Admin
          </p>
        </div>

        <div className="card-elevated p-4 border-l-4 border-l-purple-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Mga Ordinansa
          </p>
          <p className="text-2xl font-bold text-[var(--text-ink)] mt-1">
            {stats.totalOrdinances}
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Mula sa lahat ng barangay
          </p>
        </div>

        <div className="card-elevated p-4 border-l-4 border-l-amber-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Ulat ng Komunidad
          </p>
          <p className="text-2xl font-bold text-[var(--text-ink)] mt-1">
            {stats.totalReports}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Mula sa mga mamamayan
          </p>
        </div>
      </div>

      {/* Top Toolbar: Search, Filters, Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 card-elevated p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Maghanap ng Barangay o email ng opisyal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-h-[42px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as never)}
            aria-label="I-filter ayon sa status ng account"
            className="min-h-[42px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Lahat ng Barangay</option>
            <option value="ACTIVE">May Admin Account</option>
            <option value="NO_ACCOUNT">Walang Account</option>
          </select>
        </div>

        <button
          type="button"
          onClick={openCreateBarangay}
          className="min-h-[42px] inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <span>+ Mag-rehistro ng Bagong Barangay</span>
        </button>
      </div>

      {/* Barangays Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-mute)]">
                <th scope="col" className="px-4 py-3.5">
                  Pangalan ng Barangay
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Barangay Admin Account
                </th>
                <th scope="col" className="px-4 py-3.5 text-center">
                  Ordinansa
                </th>
                <th scope="col" className="px-4 py-3.5 text-center">
                  Ulat
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  mga Aksyon
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {filteredBarangays.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-[var(--text-mute)]"
                  >
                    Walang nahanap na Barangay base sa inyong filter.
                  </td>
                </tr>
              ) : (
                filteredBarangays.map((b) => {
                  const adminUser = b.users[0]; // Take primary admin
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-[var(--bg-canvas)]/60 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-medium text-[var(--text-ink)]">
                        <div>
                          <p className="font-semibold text-base">
                            Barangay {b.name}
                          </p>
                          {b.description && (
                            <p className="text-xs text-[var(--text-mute)] line-clamp-1">
                              {b.description}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {adminUser ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-[var(--text-ink)]">
                              {adminUser.name}
                            </span>
                            <span className="text-xs text-[var(--text-mute)]">
                              {adminUser.email}
                            </span>
                            <span className="inline-flex mt-1">
                              <StatusBadge
                                type="role"
                                status={adminUser.role as any}
                              />
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Walang Account
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          {b._count.ordinances}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-bold">
                          {b._count.reports}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openManageAccount(b)}
                            className="inline-flex items-center rounded-[var(--radius-sm)] bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors"
                          >
                            {adminUser
                              ? "I-edit ang Account"
                              : "+ Gawan ng Account"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditBarangay(b)}
                            className="inline-flex items-center rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:bg-[var(--border-hairline)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-ink)] transition-colors"
                          >
                            I-edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteId({ id: b.id, name: b.name })
                            }
                            className="inline-flex items-center rounded-[var(--radius-sm)] text-red-600 dark:text-red-400 hover:bg-red-500/10 px-2 py-1.5 text-xs font-medium transition-colors"
                            title="Burahin ang Barangay"
                          >
                            Burahin
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL 1: REGISTER / EDIT BARANGAY ─── */}
      {showBarangayModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBarangayModal(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="barangay-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] px-6 py-4 bg-[var(--bg-canvas)]">
              <h3
                id="barangay-modal-title"
                className="text-lg font-bold text-[var(--text-ink)]"
              >
                {editingBarangay
                  ? `I-edit ang Barangay ${editingBarangay.name}`
                  : "+ Mag-rehistro ng Bagong Barangay"}
              </h3>
              <button
                type="button"
                onClick={() => setShowBarangayModal(false)}
                className="text-[var(--text-mute)] hover:text-[var(--text-ink)]"
                aria-label="Isara ang modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBarangaySubmit} className="p-6 space-y-4">
              {formError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-600 dark:text-red-400">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="brgy-name"
                  className="text-sm font-semibold text-[var(--text-ink)]"
                >
                  Pangalan ng Barangay <span className="text-red-500">*</span>
                </label>
                <input
                  id="brgy-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editingBarangay?.name || ""}
                  placeholder="Halimbawa: Camp Tinio, Kapitan Pepe, D.S. Garcia"
                  className="w-full min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="brgy-desc"
                  className="text-sm font-semibold text-[var(--text-ink)]"
                >
                  Paglalarawan / Description{" "}
                  <span className="text-xs font-normal text-[var(--text-mute)]">
                    (opsyonal)
                  </span>
                </label>
                <textarea
                  id="brgy-desc"
                  name="description"
                  rows={3}
                  defaultValue={editingBarangay?.description || ""}
                  placeholder="Maikling impormasyon tungkol sa barangay..."
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-hairline)]">
                <button
                  type="button"
                  onClick={() => setShowBarangayModal(false)}
                  className="rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 py-2 text-sm font-semibold text-[var(--text-ink)] hover:bg-[var(--border-hairline)]"
                >
                  Kanselahin
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-[var(--radius-sm)] bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm ring-2 ring-emerald-500 ring-offset-2 ring-offset-[var(--bg-card)] focus:outline-none focus:ring-4 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {isPending ? "Nagse-save..." : "I-save ang Barangay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: MANAGE BARANGAY ADMIN ACCOUNT ─── */}
      {showAccountModal && targetBarangayForAccount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAccountModal(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] px-6 py-4 bg-[var(--bg-canvas)]">
              <div>
                <h3
                  id="account-modal-title"
                  className="text-lg font-bold text-[var(--text-ink)]"
                >
                  Pamahalaan ang Admin Account
                </h3>
                <p className="text-xs text-[var(--text-mute)]">
                  Barangay {targetBarangayForAccount.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountModal(false)}
                className="text-[var(--text-mute)] hover:text-[var(--text-ink)]"
                aria-label="Isara ang modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAccountSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-600 dark:text-red-400">
                  {formError}
                </div>
              )}

              <input
                type="hidden"
                name="barangayId"
                value={targetBarangayForAccount.id}
              />
              {targetBarangayForAccount.users[0] && (
                <input
                  type="hidden"
                  name="userId"
                  value={targetBarangayForAccount.users[0].id}
                />
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="acc-email"
                  className="text-sm font-semibold text-[var(--text-ink)]"
                >
                  Email Address (<span className="text-emerald-600">@gmail.com</span>){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="acc-email"
                  name="email"
                  type="email"
                  required
                  defaultValue={
                    targetBarangayForAccount.users[0]?.email || ""
                  }
                  placeholder="halimbawa: camptinio.kapitan@gmail.com"
                  className="w-full min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-[var(--text-mute)]">
                  Dapat magtapos sa @gmail.com para sa standard ng sistema.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="acc-name"
                  className="text-sm font-semibold text-[var(--text-ink)]"
                >
                  Pangalan ng Opisyal <span className="text-red-500">*</span>
                </label>
                <input
                  id="acc-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={targetBarangayForAccount.users[0]?.name || ""}
                  placeholder="Halimbawa: Kap. Roberto Reyes"
                  className="w-full min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="acc-role"
                  className="text-sm font-semibold text-[var(--text-ink)]"
                >
                  Papel sa Barangay
                </label>
                <select
                  id="acc-role"
                  name="role"
                  defaultValue={
                    targetBarangayForAccount.users[0]?.role || "BARANGAY_ADMIN"
                  }
                  aria-label="Pumili ng papel sa barangay"
                  className="w-full min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BARANGAY_ADMIN">Barangay Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="acc-password"
                  className="text-sm font-semibold text-[var(--text-ink)]"
                >
                  {targetBarangayForAccount.users[0]
                    ? "Bagong Password (iwanang blangko kung hindi babaguhin)"
                    : "Pansamantalang Password"}
                </label>
                <input
                  id="acc-password"
                  name="password"
                  type="password"
                  placeholder="Default: password123"
                  className="w-full min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-hairline)]">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 py-2 text-sm font-semibold text-[var(--text-ink)] hover:bg-[var(--border-hairline)]"
                >
                  Kanselahin
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-[var(--radius-sm)] bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm ring-2 ring-emerald-500 ring-offset-2 ring-offset-[var(--bg-card)] focus:outline-none focus:ring-4 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {isPending ? "Nagse-save..." : "I-save ang Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {deleteId && (
        <ConfirmDialog
          open={true}
          title={`Burahin ang Barangay ${deleteId.name}?`}
          description="Aalisin ang Barangay sa sistema. Hindi ito mabubura kung may mga ordinansa, opisyal, o ulat pang nakarehistro rito."
          confirmLabel="Oo, Burahin"
          cancelLabel="Kanselahin"
          variant="danger"
          onConfirm={() => {
            const id = deleteId.id;
            setDeleteId(null);
            startTransition(async () => {
              const res = await deleteBarangay(id);
              if (res.error) {
                toast.error(res.error);
              } else {
                toast.success("Nabura na ang Barangay.");
                window.location.reload();
              }
            });
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
