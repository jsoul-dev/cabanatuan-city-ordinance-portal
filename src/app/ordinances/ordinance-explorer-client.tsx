"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Ordinance, Barangay } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { clsx } from "clsx";

type OrdinanceWithBarangay = Ordinance & {
  barangay: Barangay | null;
};

interface OrdinanceExplorerClientProps {
  initialOrdinances: OrdinanceWithBarangay[];
  barangays: Barangay[];
}

export function OrdinanceExplorerClient({
  initialOrdinances,
  barangays,
}: OrdinanceExplorerClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "CITY" | "BARANGAY">(
    "ALL"
  );
  const [selectedBarangayId, setSelectedBarangayId] = useState<string>("ALL");

  // Filter ordinances based on search query, type, and barangay
  const filteredOrdinances = useMemo(() => {
    return initialOrdinances.filter((ord) => {
      // 1. Type Filter
      if (selectedType !== "ALL" && ord.type !== selectedType) {
        return false;
      }

      // 2. Barangay Filter
      if (
        selectedBarangayId !== "ALL" &&
        ord.barangayId !== selectedBarangayId
      ) {
        return false;
      }

      // 3. Keyword Search (Title, Resolution No, Content)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchTitle = ord.title.toLowerCase().includes(query);
        const matchRes = ord.resolutionNumber.toLowerCase().includes(query);
        const matchContent =
          ord.content?.toLowerCase().includes(query) ?? false;

        if (!matchTitle && !matchRes && !matchContent) {
          return false;
        }
      }

      return true;
    });
  }, [initialOrdinances, selectedType, selectedBarangayId, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search Bar & Filters Controls */}
      <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--bg-card)] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            label="Mag-search ng Ordinansa"
            placeholder="Hal. pagsusunog, basura, curfew, Res No. 003..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            }
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-6 sm:pt-0">
          {(["ALL", "CITY", "BARANGAY"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={clsx(
                "rounded-[var(--radius-pill)] px-3 py-2 text-xs font-medium transition-colors",
                "min-h-[44px] sm:min-h-[36px]", // A11Y touch target
                selectedType === type
                  ? "bg-[var(--accent-primary)] text-white"
                  : "bg-[var(--bg-canvas)] text-[var(--text-body)] hover:bg-[var(--border-hairline-soft,#f2f2f2)]"
              )}
            >
              {type === "ALL"
                ? "Lahat"
                : type === "CITY"
                  ? "City Ordinances"
                  : "Barangay Ordinances"}
            </button>
          ))}
        </div>

        {/* Barangay Dropdown Filter (shown when ALL or BARANGAY is active) */}
        {(selectedType === "ALL" || selectedType === "BARANGAY") && (
          <div className="w-full sm:w-60 pt-6 sm:pt-0">
            <label
              htmlFor="barangay-select"
              className="mb-1 block text-sm font-medium text-[var(--text-ink)]"
            >
              Barangay
            </label>
            <select
              id="barangay-select"
              value={selectedBarangayId}
              onChange={(e) => setSelectedBarangayId(e.target.value)}
              className={clsx(
                "h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)]",
                "bg-[var(--bg-card)] px-3 text-sm text-[var(--text-ink)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              )}
            >
              <option value="ALL">Lahat ng Barangay</option>
              {barangays.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-sm text-[var(--text-mute)]">
        <p>
          Ipinapakita ang{" "}
          <span className="font-semibold text-[var(--text-ink)]">
            {filteredOrdinances.length}
          </span>{" "}
          sa <span className="font-semibold">{initialOrdinances.length}</span>{" "}
          ordinansa
        </p>
        {(searchQuery ||
          selectedType !== "ALL" ||
          selectedBarangayId !== "ALL") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedType("ALL");
              setSelectedBarangayId("ALL");
            }}
          >
            I-reset ang filter
          </Button>
        )}
      </div>

      {/* Ordinances Grid / List */}
      {filteredOrdinances.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-hairline)] bg-[var(--bg-card)] p-12 text-center">
          <p className="text-3xl mb-2" aria-hidden="true">
            🔍
          </p>
          <h3 className="text-base font-semibold text-[var(--text-ink)]">
            Walang nahanap na ordinansa
          </h3>
          <p className="mt-1 text-sm text-[var(--text-body)]">
            Subukang baguhin ang iyong search query o i-reset ang mga filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredOrdinances.map((ord) => (
            <Card
              key={ord.id}
              className="flex flex-col justify-between transition-shadow duration-200 hover:shadow-[var(--shadow-floating)]"
            >
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge
                      variant={ord.type === "CITY" ? "city" : "barangay"}
                    >
                      {ord.type === "CITY"
                        ? "City Ordinance"
                        : `Brgy. ${ord.barangay?.name ?? "N/A"}`}
                    </Badge>
                    <span className="text-xs font-mono text-[var(--text-mute)]">
                      Res. No. {ord.resolutionNumber}{" "}
                      {ord.series ? `(${ord.series})` : ""}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{ord.title}</CardTitle>
                </CardHeader>

                <CardContent className="pb-4">
                  <CardDescription className="line-clamp-3">
                    {ord.content || "Walang nakalagay na buod."}
                  </CardDescription>
                </CardContent>
              </div>

              <CardFooter className="border-t border-[var(--border-hairline)] pt-4 flex items-center justify-between">
                <span className="text-xs text-[var(--text-mute)]">
                  Inaprubahan:{" "}
                  {ord.approvedAt
                    ? new Date(ord.approvedAt).toLocaleDateString("tl-PH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>

                <Link href={`/ordinances/${ord.id}`}>
                  <Button variant="secondary" size="sm">
                    Basahin ang Buong Batas →
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
