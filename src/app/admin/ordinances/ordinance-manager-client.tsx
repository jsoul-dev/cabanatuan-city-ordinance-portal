"use client";

import { useState } from "react";
import type { Ordinance, Barangay } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  createOrdinanceAction,
  toggleOrdinanceStatusAction,
  deleteOrdinanceAction,
  type CreateOrdinanceInput,
} from "./actions";
import { clsx } from "clsx";

type OrdinanceWithDetails = Ordinance & {
  barangay: Barangay | null;
};

interface OrdinanceManagerClientProps {
  initialOrdinances: OrdinanceWithDetails[];
  barangays: Barangay[];
}

export function OrdinanceManagerClient({
  initialOrdinances,
  barangays,
}: OrdinanceManagerClientProps) {
  const [ordinances, setOrdinances] =
    useState<OrdinanceWithDetails[]>(initialOrdinances);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New ordinance form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"CITY" | "BARANGAY">("CITY");
  const [resolutionNumber, setResolutionNumber] = useState("");
  const [series, setSeries] = useState("2026");
  const [content, setContent] = useState("");
  const [barangayId, setBarangayId] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "APPROVED">("APPROVED");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !resolutionNumber.trim()) {
      setErrorMessage("Pamagat at Resolution Number ay kinakailangan.");
      return;
    }
    if (type === "BARANGAY" && !barangayId) {
      setErrorMessage("Pumili ng barangay para sa Barangay Ordinance.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const input: CreateOrdinanceInput = {
      title,
      type,
      resolutionNumber,
      series,
      content,
      barangayId: type === "BARANGAY" ? barangayId : undefined,
      status,
    };

    const result = await createOrdinanceAction(input);
    setIsSubmitting(false);

    if (!result.success || !result.ordinance) {
      setErrorMessage(result.error || "May error sa pag-save.");
      return;
    }

    // Add to top of list
    const newOrd: OrdinanceWithDetails = {
      ...result.ordinance,
      barangay:
        barangays.find((b) => b.id === result.ordinance?.barangayId) || null,
    };
    setOrdinances([newOrd, ...ordinances]);
    setShowCreateForm(false);
    setTitle("");
    setResolutionNumber("");
    setContent("");
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: "DRAFT" | "APPROVED"
  ) => {
    const result = await toggleOrdinanceStatusAction(id, currentStatus);
    if (result.success && result.ordinance) {
      setOrdinances((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: result.ordinance!.status } : o
        )
      );
    }
  };

  const handleDelete = async (id: string, ordTitle: string) => {
    if (!confirm(`Sigurado ka bang nais burahin ang "${ordTitle}"?`)) return;
    const result = await deleteOrdinanceAction(id);
    if (result.success) {
      setOrdinances((prev) => prev.filter((o) => o.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-mute)]">
          Kabuuang Tala:{" "}
          <strong className="text-[var(--text-ink)]">{ordinances.length}</strong>
        </p>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Isara ang Form" : "+ Magdagdag ng Ordinansa"}
        </Button>
      </div>

      {/* Collapsible Create Form */}
      {showCreateForm && (
        <Card className="border-2 border-[var(--accent-primary)] bg-[var(--bg-card)]">
          <CardHeader>
            <CardTitle>Bagong Ordinansa</CardTitle>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <p
                role="alert"
                className="mb-4 text-sm font-medium text-red-600 dark:text-red-400"
              >
                ⚠️ {errorMessage}
              </p>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Pamagat ng Ordinansa *"
                placeholder="Hal. Anti-Littering Ordinance of Cabanatuan City"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="ord-type"
                    className="mb-1 block text-sm font-medium text-[var(--text-ink)]"
                  >
                    Uri *
                  </label>
                  <select
                    id="ord-type"
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as "CITY" | "BARANGAY")
                    }
                    className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-ink)]"
                  >
                    <option value="CITY">City Ordinance</option>
                    <option value="BARANGAY">Barangay Ordinance</option>
                  </select>
                </div>

                {type === "BARANGAY" && (
                  <div>
                    <label
                      htmlFor="ord-barangay"
                      className="mb-1 block text-sm font-medium text-[var(--text-ink)]"
                    >
                      Barangay *
                    </label>
                    <select
                      id="ord-barangay"
                      value={barangayId}
                      onChange={(e) => setBarangayId(e.target.value)}
                      className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-ink)]"
                    >
                      <option value="">-- Pumili --</option>
                      {barangays.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="ord-status"
                    className="mb-1 block text-sm font-medium text-[var(--text-ink)]"
                  >
                    Status
                  </label>
                  <select
                    id="ord-status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "DRAFT" | "APPROVED")
                    }
                    className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-ink)]"
                  >
                    <option value="APPROVED">APPROVED (I-publish agad)</option>
                    <option value="DRAFT">DRAFT (Review muna)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Resolution Number *"
                  placeholder="001-2026"
                  value={resolutionNumber}
                  onChange={(e) => setResolutionNumber(e.target.value)}
                  required
                />
                <Input
                  label="Series Year"
                  placeholder="2026"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="ord-content"
                  className="mb-1 block text-sm font-medium text-[var(--text-ink)]"
                >
                  Buong Nilalaman / Teksto
                </label>
                <textarea
                  id="ord-content"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ilagay ang mga probisyon, parusa, at detalye ng ordinansa..."
                  className={clsx(
                    "w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)] p-3 text-sm",
                    "bg-[var(--bg-card)] text-[var(--text-ink)] placeholder:text-[var(--text-mute)]"
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateForm(false)}
                >
                  Kanselahin
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Inililigtas..." : "I-save ang Ordinansa"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ordinances Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs uppercase text-[var(--text-mute)]">
                  <th className="p-4 font-semibold">Res. No.</th>
                  <th className="p-4 font-semibold">Pamagat</th>
                  <th className="p-4 font-semibold">Uri</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Mga Aksyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {ordinances.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[var(--bg-canvas)]">
                    <td className="p-4 font-mono text-xs">
                      {ord.resolutionNumber}
                    </td>
                    <td className="p-4 font-medium text-[var(--text-ink)] max-w-xs truncate">
                      {ord.title}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={ord.type === "CITY" ? "city" : "barangay"}
                      >
                        {ord.type === "CITY"
                          ? "City"
                          : `Brgy. ${ord.barangay?.name || ""}`}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          ord.status === "APPROVED" ? "approved" : "draft"
                        }
                      >
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleStatus(
                            ord.id,
                            ord.status as "DRAFT" | "APPROVED"
                          )
                        }
                      >
                        {ord.status === "APPROVED"
                          ? "I-unpublish"
                          : "I-approve"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(ord.id, ord.title)}
                      >
                        Burahin
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
