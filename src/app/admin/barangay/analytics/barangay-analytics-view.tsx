"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type OrdinanceMin = {
  status: string;
  category: string | null;
  year: number | null;
  dateEnacted: Date | null;
};

type ReportMin = {
  status: string;
  type: string;
  submittedAt: Date;
};

interface BarangayAnalyticsViewProps {
  ordinances: OrdinanceMin[];
  reports: ReportMin[];
  barangayName: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  PEACE_AND_ORDER: "Kapayapaan",
  HEALTH_AND_SAFETY: "Kalusugan",
  ENVIRONMENT: "Kalikasan",
  TRAFFIC: "Trapiko",
  BUSINESS_AND_TRADE: "Negosyo",
  PUBLIC_MORALS: "Moralidad",
  YOUTH_AND_SPORTS: "Kabataan",
  OTHER: "Iba pa",
};

const STATUS_LABELS: Record<string, string> = {
  APPROVED: "Naaprubahan",
  PENDING: "Nakabinbin",
  DRAFT: "Draft",
  REJECTED: "Tinanggihan",
};

const REPORT_STATUS_LABELS: Record<string, string> = {
  NEW: "Bagong Ulat",
  IN_PROGRESS: "Inaaksyunan",
  RESOLVED: "Naresolba",
  DISMISSED: "Hindi Tanggap",
};

const REPORT_TYPE_LABELS: Record<string, string> = {
  TRASH_BURNING: "Pagsusunog ng Basura",
  NOISE: "Ingay (Noise Complaint)",
  ROAD_OBSTRUCTION: "Harang sa Daan",
  OTHER: "Iba pa",
};

const PIE_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

export function BarangayAnalyticsView({
  ordinances,
  reports,
  barangayName,
}: BarangayAnalyticsViewProps) {
  const [selectedYear, setSelectedYear] = useState<string>("ALL");

  // Filter ordinances by year
  const filteredOrdinances = useMemo(() => {
    if (selectedYear === "ALL") return ordinances;
    return ordinances.filter((o) => (o.year || 0).toString() === selectedYear);
  }, [ordinances, selectedYear]);

  // Available years
  const availableYears = useMemo(() => {
    const yrs = Array.from(new Set(ordinances.map((o) => o.year || 2026))).sort(
      (a, b) => b - a
    );
    if (yrs.length === 0) return [2026, 2025, 2024];
    return yrs;
  }, [ordinances]);

  // 1. Ordinances by category (Pie chart)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredOrdinances.forEach((o) => {
      const cat = o.category || "GENERAL";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .filter(([, val]) => val > 0)
      .map(([key, value]) => ({
        name: CATEGORY_LABELS[key] || key,
        value,
      }));
  }, [filteredOrdinances]);

  // 2. Ordinances by status (Bar chart)
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      APPROVED: 0,
      PENDING: 0,
      DRAFT: 0,
      REJECTED: 0,
    };

    filteredOrdinances.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });

    return Object.entries(counts).map(([key, value]) => ({
      name: STATUS_LABELS[key] || key,
      bilang: value,
    }));
  }, [filteredOrdinances]);

  // 3. Citizen reports by type
  const reportTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });

    return Object.entries(counts)
      .filter(([, val]) => val > 0)
      .map(([key, value]) => ({
        name: REPORT_TYPE_LABELS[key] || key,
        value,
      }));
  }, [reports]);

  // 4. Citizen reports by status
  const reportStatusData = useMemo(() => {
    const counts: Record<string, number> = {
      NEW: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      DISMISSED: 0,
    };

    reports.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });

    return Object.entries(counts).map(([key, value]) => ({
      name: REPORT_STATUS_LABELS[key] || key,
      bilang: value,
    }));
  }, [reports]);

  // Totals
  const totalOrds = filteredOrdinances.length;
  const approvedOrds = filteredOrdinances.filter(
    (o) => o.status === "APPROVED"
  ).length;
  const totalReps = reports.length;
  const resolvedReps = reports.filter((r) => r.status === "RESOLVED").length;

  return (
    <div className="space-y-8">
      {/* Banner / Year Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-elevated p-4">
        <div>
          <h2 className="text-base font-bold text-[var(--text-ink)]">
            Barangay {barangayName} — Analytics
          </h2>
          <p className="text-xs text-[var(--text-mute)]">
            Lokal na pagsusuri ng mga ordinansa at ulat ng mamamayan sa inyong barangay.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="yr-select-brgy"
            className="text-xs font-semibold text-[var(--text-mute)] uppercase"
          >
            Taon:
          </label>
          <select
            id="yr-select-brgy"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="min-h-[38px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5 text-sm font-semibold text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Lahat ng Taon</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-elevated p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Kabuuang Ordinansa
          </p>
          <p className="text-3xl font-black text-[var(--text-ink)] mt-1">
            {totalOrds}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            {approvedOrds} naaprubahan
          </p>
        </div>

        <div className="card-elevated p-4 border-l-4 border-l-blue-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Ulat ng Komunidad
          </p>
          <p className="text-3xl font-black text-[var(--text-ink)] mt-1">
            {totalReps}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Mula sa mga mamamayan
          </p>
        </div>

        <div className="card-elevated p-4 border-l-4 border-l-amber-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Naresolbang Ulat
          </p>
          <p className="text-3xl font-black text-[var(--text-ink)] mt-1">
            {resolvedReps}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            {totalReps > 0
              ? `${Math.round((resolvedReps / totalReps) * 100)}% resolution rate`
              : "0% resolution rate"}
          </p>
        </div>

        <div className="card-elevated p-4 border-l-4 border-l-purple-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Nakabinbing Ordinansa
          </p>
          <p className="text-3xl font-black text-[var(--text-ink)] mt-1">
            {
              filteredOrdinances.filter((o) => o.status === "PENDING").length
            }
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Naghihintay ng pagsusuri
          </p>
        </div>
      </div>

      {/* Row 1 Charts: Ordinances by Category & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-5 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-ink)] mb-1">
            Mga Ordinansa sa Aming Barangay
          </h3>
          <p className="text-xs text-[var(--text-mute)] mb-6">
            Bahagdan ng ordinansa sa bawat kategorya.
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-hairline)",
                    borderRadius: "8px",
                    color: "var(--text-ink)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-medium text-[var(--text-ink)]">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated p-5 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-ink)] mb-1">
            Status ng mga Ordinansa
          </h3>
          <p className="text-xs text-[var(--text-mute)] mb-6">
            Bilang ng ordinansang naaprubahan, nakabinbin, o tinanggihan.
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" />
                <XAxis dataKey="name" stroke="var(--text-mute)" fontSize={11} />
                <YAxis stroke="var(--text-mute)" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-hairline)",
                    borderRadius: "8px",
                    color: "var(--text-ink)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="bilang" fill="#10B981" radius={[6, 6, 0, 0]} name="Bilang ng Ordinansa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Reports by Type & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-5 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-ink)] mb-1">
            Uri ng mga Ulat sa Aming Komunidad
          </h3>
          <p className="text-xs text-[var(--text-mute)] mb-6">
            Mga pinakamadalas na sumbong mula sa mga nasasakupan.
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {reportTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[(index + 2) % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-hairline)",
                    borderRadius: "8px",
                    color: "var(--text-ink)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-medium text-[var(--text-ink)]">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated p-5 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-ink)] mb-1">
            Status ng Pagtugon sa mga Ulat
          </h3>
          <p className="text-xs text-[var(--text-mute)] mb-6">
            Bilis ng pag-aksyon at pagresolba sa mga ulat sa barangay.
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" />
                <XAxis dataKey="name" stroke="var(--text-mute)" fontSize={11} />
                <YAxis stroke="var(--text-mute)" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-hairline)",
                    borderRadius: "8px",
                    color: "var(--text-ink)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="bilang" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Bilang ng Ulat" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
