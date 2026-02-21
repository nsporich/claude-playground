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
    <div className="flex items-center justify-between rounded-lg bg-gray-900 px-4 py-3">
      <code className="text-sm text-gray-100 font-mono">{command}</code>
      <button
        onClick={handleCopy}
        className="ml-4 shrink-0 rounded px-3 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        aria-label="Copy command"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
