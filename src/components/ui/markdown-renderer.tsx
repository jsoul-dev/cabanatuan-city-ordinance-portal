"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Custom lightweight Markdown renderer safe for React 19 / Next.js 16.
 * Supports headings (#, ##, ###), bold (**text**), italic (*text*),
 * bullet lists (*, -, •), numbered lists (1., 2.), inline code (`code`),
 * and paragraphs.
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let listBuffer: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = (keyPrefix: string) => {
    if (!listBuffer) return null;
    const { type, items } = listBuffer;
    const listEl =
      type === "ul" ? (
        <ul
          key={`${keyPrefix}-ul`}
          className="my-2.5 ml-5 list-disc space-y-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-ink)]"
        >
          {items.map((item, idx) => (
            <li key={idx} className="pl-1">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      ) : (
        <ol
          key={`${keyPrefix}-ol`}
          className="my-2.5 ml-5 list-decimal space-y-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-ink)]"
        >
          {items.map((item, idx) => (
            <li key={idx} className="pl-1">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
    listBuffer = null;
    return listEl;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      const flushed = flushList(`line-${index}`);
      if (flushed) elements.push(flushed);
      return;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      const flushed = flushList(`line-${index}`);
      if (flushed) elements.push(flushed);
      elements.push(
        <h4
          key={`line-${index}`}
          className="mt-3 mb-1.5 text-sm sm:text-base font-bold text-[var(--text-ink)] tracking-tight"
        >
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      const flushed = flushList(`line-${index}`);
      if (flushed) elements.push(flushed);
      elements.push(
        <h3
          key={`line-${index}`}
          className="mt-4 mb-2 text-base sm:text-lg font-bold text-[var(--text-ink)] tracking-tight"
        >
          {parseInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      const flushed = flushList(`line-${index}`);
      if (flushed) elements.push(flushed);
      elements.push(
        <h2
          key={`line-${index}`}
          className="mt-4 mb-2 text-lg sm:text-xl font-extrabold text-[var(--text-ink)] tracking-tight"
        >
          {parseInlineMarkdown(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    // Unordered list item (- , * , • )
    const ulMatch = trimmed.match(/^([-*•])\s+(.*)$/);
    if (ulMatch) {
      if (listBuffer && listBuffer.type !== "ul") {
        const flushed = flushList(`line-${index}`);
        if (flushed) elements.push(flushed);
      }
      if (!listBuffer) {
        listBuffer = { type: "ul", items: [] };
      }
      listBuffer.items.push(ulMatch[2]);
      return;
    }

    // Ordered list item (1. , 2. )
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (listBuffer && listBuffer.type !== "ol") {
        const flushed = flushList(`line-${index}`);
        if (flushed) elements.push(flushed);
      }
      if (!listBuffer) {
        listBuffer = { type: "ol", items: [] };
      }
      listBuffer.items.push(olMatch[2]);
      return;
    }

    // Standard paragraph line
    const flushed = flushList(`line-${index}`);
    if (flushed) elements.push(flushed);
    elements.push(
      <p
        key={`line-${index}`}
        className="my-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-ink)]"
      >
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  const finalFlushed = flushList("line-final");
  if (finalFlushed) elements.push(finalFlushed);

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}

/**
 * Parses bold (** or __), italic (* or _), and inline code (`code`) tokens.
 */
function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex pattern matching inline code, bold, italic
  // Order matters: code first, then bold, then italic
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+\*(?!\*)|(?<!_)_[^_]+_(?!_))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={`${match.index}-code`}
          className="rounded bg-neutral-200/60 dark:bg-neutral-800 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (
      (token.startsWith("**") && token.endsWith("**")) ||
      (token.startsWith("__") && token.endsWith("__"))
    ) {
      parts.push(
        <strong
          key={`${match.index}-bold`}
          className="font-bold text-[var(--text-ink)]"
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (
      (token.startsWith("*") && token.endsWith("*")) ||
      (token.startsWith("_") && token.endsWith("_"))
    ) {
      parts.push(
        <em
          key={`${match.index}-italic`}
          className="italic text-[var(--text-ink)]"
        >
          {token.slice(1, -1)}
        </em>
      );
    } else {
      parts.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
