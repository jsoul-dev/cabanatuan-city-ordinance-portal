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
  AreaChart,
  Area,
  Legend,
} from "recharts";

type OrdinanceMin = {
  status: string;
  category: string | null;
  year: number | null;
  dateEnacted: Date | null;
  barangayId: string | null;
};

type ReportMin = {
  status: string;
  type: string;
  barangay: { name: string };
};

type BarangayCountMin = {
  name: string;
  _count: {
    ordinances: number;
    reports: number;
  };
};

interface LguAnalyticsViewProps {
  ordinances: OrdinanceMin[];
  reports: ReportMin[];
  barangays: BarangayCountMin[];
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

export function LguAnalyticsView({
  ordinances,
  reports,
  barangays,
}: LguAnalyticsViewProps) {
  const [selectedYear, setSelectedYear] = useState<string>("ALL");

  // Filter ordinances by selected year
  const filteredOrdinances = useMemo(() => {
    if (selectedYear === "ALL") return ordinances;
    return ordinances.filter((o) => (o.year || 0).toString() === selectedYear);
  }, [ordinances, selectedYear]);

  // Compute available years dynamically
  const availableYears = useMemo(() => {
    const yrs = Array.from(new Set(ordinances.map((o) => o.year || 2026))).sort(
      (a, b) => b - a
    );
    if (yrs.length === 0) return [2026, 2025, 2024];
    return yrs;
  }, [ordinances]);

  // 1. Ordinances by category
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(CATEGORY_LABELS).forEach((k) => (counts[k] = 0));

    filteredOrdinances.forEach((o) => {
      const cat = o.category || "GENERAL";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts).map(([key, value]) => ({
      name: CATEGORY_LABELS[key] || key,
      bilang: value,
    }));
  }, [filteredOrdinances]);

  // 2. Ordinances by status (Pie chart)
  const ordinanceStatusData = useMemo(() => {
    const counts: Record<string, number> = {
      APPROVED: 0,
      PENDING: 0,
      DRAFT: 0,
      REJECTED: 0,
    };

    filteredOrdinances.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });

    return Object.entries(counts)
      .filter(([, val]) => val > 0)
      .map(([key, value]) => ({
        name: STATUS_LABELS[key] || key,
        value,
      }));
  }, [filteredOrdinances]);

  // 3. Top Barangays by Reports
  const topBarangayReports = useMemo(() => {
    return [...barangays]
      .sort((a, b) => b._count.reports - a._count.reports)
      .slice(0, 10)
      .map((b) => ({
        name: b.name.replace(/^Barangay\s+/i, ""),
        ulat: b._count.reports,
        ordinansa: b._count.ordinances,
      }));
  }, [barangays]);

  // 4. Citizen Reports by status
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
      value,
    }));
  }, [reports]);

  // 5. Ordinances by Year trend (Area Chart)
  const yearlyTrendData = useMemo(() => {
    const counts: Record<number, number> = {};
    const minYear = 2020;
    const maxYear = 2026;
    for (let y = minYear; y <= maxYear; y++) counts[y] = 0;

    ordinances.forEach((o) => {
      if (o.year !== null && o.year >= minYear && o.year <= maxYear) {
        counts[o.year] = (counts[o.year] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([yr, value]) => ({
      taon: yr,
      ordinansa: value,
    }));
  }, [ordinances]);

  // Totals
  const totalOrds = filteredOrdinances.length;
  const approvedOrds = filteredOrdinances.filter(
    (o) => o.status === "APPROVED"
  ).length;
  const totalReps = reports.length;
  const resolvedReps = reports.filter((r) => r.status === "RESOLVED").length;

  return (
    <div className="space-y-8">
      {/* Year Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-elevated p-4">
        <div>
          <h2 className="text-base font-bold text-[var(--text-ink)]">
            LGU Executive Analytics Dashboard
          </h2>
          <p className="text-xs text-[var(--text-mute)]">
            Komprehensibong pagsusuri sa mga ordinansa at ulat ng komunidad sa buong lungsod.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="yr-select"
            className="text-xs font-semibold text-[var(--text-mute)] uppercase"
          >
            Taon:
          </label>
          <select
            id="yr-select"
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

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card-elevated p-4 border-t-4 border-t-emerald-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Kabuuang Ordinansa
          </p>
          <p className="text-3xl font-black text-[var(--text-ink)] mt-1">
            {totalOrds}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            {approvedOrds} naaprubahan
          </p>
        </div>

        <div className="card-elevated p-4 border-t-4 border-t-blue-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Ulat ng Komunidad
          </p>
          <p className="text-3xl font-black text-[var(--text-ink)] mt-1">
            {totalReps}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
            {resolvedReps} naresolba na
          </p>
        </div>

        <div className="card-elevated p-4 border-t-4 border-t-purple-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Kabuuang Barangay
          </p>
          <p className="text-3xl font-black text-[var(--text-ink)] mt-1">
            {barangays.length}
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">
            Nakarehistro sa Lungsod
          </p>
        </div>

        <div className="card-elevated p-4 border-t-4 border-t-amber-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Rate ng Aprubasyon
          </p>
          <p className="text-3xl font-black text-[var(--text-ink)] mt-1">
            {totalOrds > 0 ? Math.round((approvedOrds / totalOrds) * 100) : 0}%
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
            Ordinansang patakaran
          </p>
        </div>

        <div className="card-elevated p-4 border-t-4 border-t-teal-500">
          <p className="text-xs text-[var(--text-mute)] font-medium uppercase tracking-wider">
            Rate ng Resolusyon
          </p>
          <p className="text-3xl font-black text-[var(--text-ink)] mt-1">
            {totalReps > 0 ? Math.round((resolvedReps / totalReps) * 100) : 0}%
          </p>
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-1 font-medium">
            Ulat ng mamamayan
          </p>
        </div>
      </div>

      {/* Row 1 Charts: Ordinances by Category & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-elevated p-5 lg:col-span-2 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-ink)] mb-1">
            Mga Ordinansa bawat Kategorya
          </h3>
          <p className="text-xs text-[var(--text-mute)] mb-6">
            Bilang ng ordinansang naipasa sa bawat sektor o paksa.
          </p>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-mute)"
                  fontSize={11}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
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

        <div className="card-elevated p-5 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-ink)] mb-1">
            Status ng mga Ordinansa
          </h3>
          <p className="text-xs text-[var(--text-mute)] mb-4">
            Bahagdan ayon sa kasalukuyang estado.
          </p>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ordinanceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ordinanceStatusData.map((entry, index) => (
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
      </div>

      {/* Row 2 Charts: Top Barangays & Reports Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-elevated p-5 lg:col-span-2 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-ink)] mb-1">
            Top 10 Barangay ayon sa Ulat ng Komunidad at Ordinansa
          </h3>
          <p className="text-xs text-[var(--text-mute)] mb-6">
            Paghahambing sa naitatalang ulat (asul) at ordinansa (berde) ng bawat barangay.
          </p>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBarangayReports} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-mute)"
                  fontSize={11}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
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
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="ulat" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Ulat ng Komunidad" />
                <Bar dataKey="ordinansa" fill="#10B981" radius={[4, 4, 0, 0]} name="Ordinansa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated p-5 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-ink)] mb-1">
            Status ng Ulat ng Komunidad
          </h3>
          <p className="text-xs text-[var(--text-mute)] mb-6">
            Estado ng pagtugon sa mga sumbong ng mamamayan.
          </p>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportStatusData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" />
                <XAxis type="number" stroke="var(--text-mute)" fontSize={11} allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="var(--text-mute)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-hairline)",
                    borderRadius: "8px",
                    color: "var(--text-ink)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" fill="#6366F1" radius={[0, 6, 6, 0]} name="Bilang ng Ulat" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Historical Trend Area Chart */}
      <div className="card-elevated p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-ink)] mb-1">
          Kasaysayan ng Pagsasabatas (2020 – 2026)
        </h3>
        <p className="text-xs text-[var(--text-mute)] mb-6">
          Bilang ng mga naipabasang ordinansa sa bawat taon.
        </p>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={yearlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" />
              <XAxis dataKey="taon" stroke="var(--text-mute)" fontSize={12} />
              <YAxis stroke="var(--text-mute)" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-hairline)",
                  borderRadius: "8px",
                  color: "var(--text-ink)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="ordinansa"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorOrd)"
                name="Naipasang Ordinansa"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
