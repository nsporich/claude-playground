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
    <div
      className="relative overflow-hidden border-3 border-[var(--ink)] bg-[#1e1e2e]"
      style={{ border: "3px solid var(--ink)", boxShadow: "var(--shadow-comic)" }}
    >
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 border-b-2 border-[var(--ink)] px-4 py-2 bg-[#2d2d44]">
        <div className="h-3 w-3 rounded-full bg-[var(--comic-red)] border border-[var(--ink)]" />
        <div className="h-3 w-3 rounded-full bg-[var(--comic-yellow)] border border-[var(--ink)]" />
        <div className="h-3 w-3 rounded-full bg-[var(--comic-green)] border border-[var(--ink)]" />
        <span className="ml-2 text-[10px] tracking-[0.2em] uppercase text-[#8888aa] font-[family-name:var(--font-mono)]">
          mission-control
        </span>
      </div>

      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2 min-w-0 overflow-x-auto">
          <span className="shrink-0 text-[var(--comic-red)] font-mono text-sm font-bold">
            $
          </span>
          <code className="text-sm text-[var(--comic-cyan)] font-mono whitespace-nowrap">
            {command}
          </code>
        </div>
        <button
          onClick={handleCopy}
          className="ml-4 shrink-0 border-2 border-[#555] px-3 py-1 text-xs font-bold text-[#aaa] transition-all cursor-pointer hover:border-[var(--comic-yellow)] hover:text-[var(--comic-yellow)] hover:bg-[var(--comic-yellow)]/10"
          aria-label="Copy command"
        >
          {copied ? (
            <span className="flex items-center gap-1 text-[var(--comic-green)]">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </span>
          ) : (
            "Copy"
          )}
        </button>
      </div>
    </div>
  );
}
