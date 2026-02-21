import Link from "next/link";
import type { CatalogAsset } from "@/lib/types";

const categoryStyles: Record<string, { bg: string; text: string }> = {
  skills: { bg: "bg-amber-500/10", text: "text-amber-400" },
  templates: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  prompts: { bg: "bg-violet-500/10", text: "text-violet-400" },
};

const categoryLabels: Record<string, string> = {
  skills: "Skill",
  templates: "Template",
  prompts: "Prompt",
};

export default function AssetCard({ asset }: { asset: CatalogAsset }) {
  const style = categoryStyles[asset.category] ?? {
    bg: "bg-white/5",
    text: "text-white/60",
  };

  return (
    <Link
      href={`/${asset.category}/${asset.slug}`}
      className="group relative block rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-all duration-300 hover:border-[var(--border-accent)] hover:bg-[var(--bg-elevated)]"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top,var(--accent-glow),transparent_70%)]" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${style.bg} ${style.text}`}
          >
            {categoryLabels[asset.category] ?? asset.category}
          </span>
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
            {asset.group}
          </span>
        </div>

        <h3 className="mb-1.5 text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)] transition-colors">
          {asset.name}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-[var(--text-muted)]">
          {asset.description}
        </p>

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
      </div>
    </Link>
  );
}
