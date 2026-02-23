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
      className="relative overflow-hidden bg-[var(--paper)]"
      style={{
        border: "3px solid var(--ink)",
        boxShadow: "6px 6px 0 var(--ink)",
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{
          background: "var(--ink)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Action dots */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 border-2 border-[var(--comic-red)]" style={{ background: "var(--comic-red)" }} />
            <div className="h-3 w-3 border-2 border-[var(--comic-yellow)]" style={{ background: "var(--comic-yellow)" }} />
            <div className="h-3 w-3 border-2 border-[var(--comic-green)]" style={{ background: "var(--comic-green)" }} />
          </div>
          <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.25em] uppercase text-[var(--paper)] opacity-60">
            Mission Control
          </span>
        </div>

        {/* Copy button in header */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 border-2 px-3 py-1 font-[family-name:var(--font-display)] text-xs tracking-widest uppercase transition-all cursor-pointer"
          style={{
            border: "2px solid var(--comic-yellow)",
            color: "var(--comic-yellow)",
            background: copied ? "var(--comic-yellow)" : "transparent",
            ...(copied ? { color: "var(--ink)" } : {}),
          }}
          aria-label="Copy command"
        >
          {copied ? (
            <>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Command area */}
      <div className="relative px-5 py-4">
        {/* Halftone background dots */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, var(--ink) 0.5px, transparent 0.5px)",
            backgroundSize: "8px 8px",
            opacity: 0.04,
          }}
        />

        <div className="relative flex items-center gap-3">
          <span
            className="font-[family-name:var(--font-display)] text-lg tracking-wider"
            style={{ color: "var(--comic-red)" }}
          >
            &gt;
          </span>
          <code className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--ink)] whitespace-nowrap">
            {command}
          </code>
        </div>
      </div>
    </div>
  );
}
