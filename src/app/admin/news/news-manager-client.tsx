"use client";

import { useState } from "react";
import type { NewsItem } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  createNewsAction,
  deleteNewsAction,
  type CreateNewsInput,
} from "./actions";

interface NewsManagerClientProps {
  initialNews: NewsItem[];
}

export function NewsManagerClient({ initialNews }: NewsManagerClientProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"CITY" | "BARANGAY">("CITY");
  const [isPinned, setIsPinned] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Pamagat at nilalaman ay kinakailangan.");
      return;
    }

    setIsSubmitting(true);
    const input: CreateNewsInput = {
      title,
      content,
      category,
      isPinned,
    };

    const res = await createNewsAction(input);
    setIsSubmitting(false);

    if (res.success && res.news) {
      setNews([res.news, ...news]);
      setShowCreateForm(false);
      setTitle("");
      setContent("");
      setIsPinned(false);
    } else {
      alert(res.error || "May error sa pag-save.");
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Sigurado ka bang nais burahin ang "${itemTitle}"?`)) return;
    const res = await deleteNewsAction(id);
    if (res.success) {
      setNews((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-mute)]">
          Kabuuang Anunsyo: <strong className="text-[var(--text-ink)]">{news.length}</strong>
        </p>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Isara ang Form" : "+ Magdagdag ng Anunsyo"}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-2 border-[var(--accent-primary)] bg-[var(--bg-card)]">
          <CardHeader>
            <CardTitle>Bagong Balita o Anunsyo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Pamagat ng Anunsyo *"
                placeholder="Hal. Public Hearing sa Bagong Traffic Scheme"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="news-category"
                    className="mb-1 block text-sm font-medium text-[var(--text-ink)]"
                  >
                    Sakop / Kategorya *
                  </label>
                  <select
                    id="news-category"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as "CITY" | "BARANGAY")
                    }
                    className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-ink)]"
                  >
                    <option value="CITY">City-wide Announcement</option>
                    <option value="BARANGAY">Barangay Notice</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-ink)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                    />
                    I-pin sa itaas ng Marquee / News Feed
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="news-content"
                  className="mb-1 block text-sm font-medium text-[var(--text-ink)]"
                >
                  Buong Detalye ng Anunsyo *
                </label>
                <textarea
                  id="news-content"
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Isulat dito ang lugar, oras, at mahahalagang detalye..."
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)] p-3 text-sm bg-[var(--bg-card)] text-[var(--text-ink)] placeholder:text-[var(--text-mute)]"
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
                  {isSubmitting ? "Inilalathala..." : "I-publish ang Anunsyo"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs uppercase text-[var(--text-mute)]">
                  <th className="p-4 font-semibold">Pamagat</th>
                  <th className="p-4 font-semibold">Kategorya</th>
                  <th className="p-4 font-semibold">Pin</th>
                  <th className="p-4 font-semibold">Petsa</th>
                  <th className="p-4 font-semibold text-right">Aksyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--bg-canvas)]">
                    <td className="p-4 font-medium text-[var(--text-ink)] max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={item.category === "CITY" ? "city" : "barangay"}
                      >
                        {item.category === "CITY" ? "Lungsod" : "Barangay"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {item.isPinned ? (
                        <Badge variant="approved">Pinned</Badge>
                      ) : (
                        <span className="text-xs text-[var(--text-mute)]">-</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-[var(--text-body)]">
                      {new Date(item.publishedAt).toLocaleDateString("en-PH")}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(item.id, item.title)}
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
