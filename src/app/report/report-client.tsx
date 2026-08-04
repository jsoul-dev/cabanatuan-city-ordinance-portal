"use client";

import { useState, useEffect } from "react";
import type { Barangay } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { submitCommunityReport } from "./actions";

interface ReportClientFormProps {
  barangays: Barangay[];
}

interface ReportDraft {
  subject: string;
  barangayId: string;
  category: string;
  details: string;
  isAnonymous: boolean;
  contactName: string;
  contactPhone: string;
}

const STORAGE_KEY = "cabanatuan_community_report_draft_v1";

const DEFAULT_DRAFT: ReportDraft = {
  subject: "",
  barangayId: "",
  category: "Sanitation / Basura",
  details: "",
  isAnonymous: false,
  contactName: "",
  contactPhone: "",
};

export function ReportClientForm({ barangays }: ReportClientFormProps) {
  const [formData, setFormData] = useState<ReportDraft>(DEFAULT_DRAFT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData({ ...DEFAULT_DRAFT, ...parsed });
      }
    } catch (e) {
      console.error("Failed to load report draft from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error("Failed to save draft to localStorage:", e);
    }
  }, [formData, isLoaded]);

  const handleChange = (
    field: keyof ReportDraft,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (successMessage) setSuccessMessage(null);
  };

  const handleClearDraft = () => {
    setFormData(DEFAULT_DRAFT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear localStorage:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.details.trim() || !formData.barangayId) {
      alert("Mangyaring punan ang pamagat, barangay, at detalye ng ulat.");
      return;
    }

    setIsSubmitting(true);
    const res = await submitCommunityReport({
      subject: formData.subject,
      barangayId: formData.barangayId,
      category: formData.category,
      details: formData.details,
      isAnonymous: formData.isAnonymous,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
    });
    setIsSubmitting(false);

    if (res.error) {
      alert(res.error);
      return;
    }

    setSuccessMessage(
      `Maraming salamat! Ang inyong ulat "${formData.subject}" ay naisumite na sa Barangay Hall at makikita sa dashboard ng inyong Barangay Admin.`
    );

    handleClearDraft();
  };


  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-sm">
      {successMessage && (
        <div
          role="alert"
          className="mb-6 rounded-[var(--radius-md)] border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300 flex items-start gap-3"
        >
          <span className="text-lg" aria-hidden="true">
            ✅
          </span>
          <div>
            <p className="font-semibold">Naisumite na ang Ulat!</p>
            <p className="mt-1">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between border-b border-[var(--border-hairline)] pb-4">
        <span className="text-xs font-medium text-[var(--accent-primary)] flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
          Awtomatikong nai-save ang draft sa browser
        </span>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={handleClearDraft}
        >
          I-clear ang Draft
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject */}
        <Input
          label="Pamagat ng Ulat / Reklamo *"
          placeholder="Hal. Nakatambak na basura sa gilid ng kalsada"
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          required
        />

        {/* Barangay and Category row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="barangay-select"
              className="mb-1 block text-sm font-medium text-[var(--text-ink)]"
            >
              Barangay *
            </label>
            <select
              id="barangay-select"
              value={formData.barangayId}
              onChange={(e) => handleChange("barangayId", e.target.value)}
              required
              className={clsx(
                "h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)]",
                "bg-[var(--bg-card)] px-3 text-sm text-[var(--text-ink)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              )}
            >
              <option value="">-- Pumili ng Barangay --</option>
              {barangays.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="category-select"
              className="mb-1 block text-sm font-medium text-[var(--text-ink)]"
            >
              Kategorya
            </label>
            <select
              id="category-select"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className={clsx(
                "h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)]",
                "bg-[var(--bg-card)] px-3 text-sm text-[var(--text-ink)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              )}
            >
              <option value="Sanitation / Basura">Sanitation / Basura</option>
              <option value="Curfew / Maingay na Videoke">
                Curfew / Maingay na Videoke
              </option>
              <option value="Ilegal na Paradahan / Trapiko">
                Ilegal na Paradahan / Trapiko
              </option>
              <option value="Paglabag sa Negosyo / Permit">
                Paglabag sa Negosyo / Permit
              </option>
              <option value="Iba pang Paglabag sa Ordinansa">
                Iba pang Paglabag sa Ordinansa
              </option>
            </select>
          </div>
        </div>

        {/* Details Textarea */}
        <div>
          <label
            htmlFor="report-details"
            className="mb-1 block text-sm font-medium text-[var(--text-ink)]"
          >
            Buong Salaysay / Detalye *
          </label>
          <textarea
            id="report-details"
            rows={5}
            value={formData.details}
            onChange={(e) => handleChange("details", e.target.value)}
            required
            placeholder="Ilagay ang petsa, oras, lokasyon, at iba pang mahahalagang impormasyon na makakatulong sa imbestigasyon..."
            className={clsx(
              "w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)] p-3 text-sm",
              "bg-[var(--bg-card)] text-[var(--text-ink)] placeholder:text-[var(--text-mute)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            )}
          />
        </div>

        {/* Anonymous Toggle */}
        <div className="flex items-center gap-3 py-2">
          <input
            id="anonymous-check"
            type="checkbox"
            checked={formData.isAnonymous}
            onChange={(e) => handleChange("isAnonymous", e.target.checked)}
            className="h-5 w-5 rounded border-[var(--border-hairline)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
          />
          <label
            htmlFor="anonymous-check"
            className="text-sm font-medium text-[var(--text-ink)]"
          >
            I-sumite nang hindi nagpapakilala (Anonymous Report)
          </label>
        </div>

        {/* Contact Info (if not anonymous) */}
        {!formData.isAnonymous && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 rounded-[var(--radius-md)] bg-[var(--bg-canvas)] p-4 border border-[var(--border-hairline)]">
            <Input
              label="Pangalan (Opsyonal)"
              placeholder="Juan dela Cruz"
              value={formData.contactName}
              onChange={(e) => handleChange("contactName", e.target.value)}
            />
            <Input
              label="Numero ng Telepono / Email"
              placeholder="0917-000-0000 / juan@gmail.com"
              value={formData.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Ipinapadala sa Barangay..."
              : "I-sumite ang Ulat sa Barangay"}
          </Button>
        </div>
      </form>
    </div>
  );
}
