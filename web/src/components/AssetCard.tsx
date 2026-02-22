import Link from "next/link";
import type { CatalogAsset } from "@/lib/types";

const categoryStyles: Record<string, { border: string; text: string; bg: string; label: string }> = {
  agents: {
    border: "border-[var(--accent)]/30",
    text: "text-[var(--accent-text)]",
    bg: "bg-[var(--accent)]/10",
    label: "AGENT",
  },
  skills: {
    border: "border-[var(--cyan)]/30",
    text: "text-[var(--cyan-text)]",
    bg: "bg-[var(--cyan)]/10",
    label: "SKILL",
  },
};

export default function AssetCard({ asset }: { asset: CatalogAsset }) {
  const style = categoryStyles[asset.category] ?? {
    border: "border-white/10",
    text: "text-white/60",
    bg: "bg-white/5",
    label: asset.category.toUpperCase(),
  };

  const requiresCount = asset.requires
    ? asset.requires.skills.length + asset.requires.agents.length
    : 0;

  return (
    <Link
      href={`/${asset.category}/${asset.slug}`}
      className={`glow-border group relative block rounded-xl border-2 ${style.border} bg-[var(--bg-surface)] p-5 transition-all duration-300 hover:bg-[var(--bg-elevated)] hover:-translate-y-0.5`}
    >
      <div className="relative">
        {/* Category + group badges */}
        <div className="mb-3 flex items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] ${style.bg} ${style.text}`}>
            {style.label}
          </span>
          {asset.group && (
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
              {asset.group}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className={`mb-1.5 font-[family-name:var(--font-display)] text-xl tracking-[0.06em] text-[var(--text-primary)] group-hover:${style.text} transition-colors`}>
          {asset.name.toUpperCase()}
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-[var(--text-muted)]">
          {asset.description}
        </p>

        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {asset.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-[11px] text-[var(--text-muted)] font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Requires count for agents */}
        {requiresCount > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {requiresCount} {requiresCount === 1 ? "dependency" : "dependencies"}
          </div>
        )}
      </div>
    </Link>
  );
}
