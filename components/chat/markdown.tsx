"use client";

import type { ReactNode } from "react";

/**
 * Minimal markdown for chat messages: `###` headings, `-` lists, **bold**,
 * _italic_, `code` and links.
 *
 * Hand-written instead of pulling in a library: few rules, short content, and
 * nothing here uses `dangerouslySetInnerHTML` — text always lands as a React
 * text node, so there is no path for HTML injection.
 */

const INLINE = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const parts = text.split(INLINE);

  parts.forEach((part, index) => {
    if (!part) return;
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
      return;
    }

    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
      nodes.push(
        <em key={key} className="italic text-muted-foreground">
          {part.slice(1, -1)}
        </em>
      );
      return;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-sm bg-secondary px-1 py-0.5 font-mono text-[0.8em]"
        >
          {part.slice(1, -1)}
        </code>
      );
      return;
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const href = link[2];
      // http(s) and mailto only: blocks javascript: and friends.
      const safe = /^(https?:|mailto:)/i.test(href) ? href : "#";
      nodes.push(
        <a
          key={key}
          href={safe}
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw text-primary"
        >
          {link[1]}
        </a>
      );
      return;
    }

    nodes.push(part);
  });

  return nodes;
}

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];
  let paragraphBuffer: string[] = [];

  function flushList() {
    if (!listBuffer.length) return;
    const items = [...listBuffer];
    listBuffer = [];
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-2 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span aria-hidden="true" className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span>{renderInline(item, `li-${index}`)}</span>
          </li>
        ))}
      </ul>
    );
  }

  function flushParagraph() {
    if (!paragraphBuffer.length) return;
    const text = paragraphBuffer.join("\n");
    paragraphBuffer = [];
    blocks.push(
      <p key={`p-${blocks.length}`} className="whitespace-pre-wrap">
        {renderInline(text, `p-${blocks.length}`)}
      </p>
    );
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushParagraph();
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushList();
      flushParagraph();
      blocks.push(
        <p
          key={`h-${blocks.length}`}
          className="display-tight mt-1 text-sm uppercase tracking-wide text-foreground"
        >
          {renderInline(heading[2], `h-${blocks.length}`)}
        </p>
      );
      continue;
    }

    const item = /^[-*•]\s+(.*)$/.exec(trimmed);
    if (item) {
      flushParagraph();
      listBuffer.push(item[1]);
      continue;
    }

    flushList();
    paragraphBuffer.push(trimmed);
  }

  flushList();
  flushParagraph();

  return <div className="space-y-2 text-sm leading-relaxed">{blocks}</div>;
}
