"use client";

import { useState } from "react";

export default function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border-2 border-[var(--border-default)] bg-[var(--bg-surface)]">
      {/* Terminal chrome */}
      <div className="flex items-center gap-1.5 border-b border-[var(--border-subtle)] px-4 py-2.5 bg-[var(--bg-elevated)]/50">
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--gold)]/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--hero-lorekeeper)]/50" />
        <span className="ml-2 text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] font-[family-name:var(--font-mono)]">
          mission-control
        </span>
      </div>

      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2 min-w-0 overflow-x-auto">
          <span className="shrink-0 text-[var(--accent)] font-mono text-sm font-bold">$</span>
          <code className="text-sm text-[var(--cyan-text)] font-mono whitespace-nowrap">
            {command}
          </code>
        </div>
        <button
          onClick={handleCopy}
          className="ml-4 shrink-0 rounded-lg border border-[var(--border-default)] px-3 py-1 text-xs font-medium text-[var(--text-muted)] transition-all cursor-pointer hover:border-[var(--accent)]/40 hover:text-[var(--accent-text)] hover:bg-[var(--accent-glow)]"
          aria-label="Copy command"
        >
          {copied ? (
            <span className="flex items-center gap-1 text-[var(--hero-lorekeeper)]">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </span>
          ) : (
            "Copy"
          )}
        </button>
      </div>
    </div>
  );
}
