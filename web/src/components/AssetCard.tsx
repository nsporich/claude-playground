import Link from "next/link";
import type { CatalogAsset } from "@/lib/types";

const categoryStyles: Record<
  string,
  { color: string; label: string; bg: string }
> = {
  agents: {
    color: "var(--comic-red)",
    label: "AGENT",
    bg: "var(--comic-red-light)",
  },
  skills: {
    color: "var(--comic-blue)",
    label: "SKILL",
    bg: "var(--comic-blue-light)",
  },
};

export default function AssetCard({ asset }: { asset: CatalogAsset }) {
  const style = categoryStyles[asset.category] ?? {
    color: "var(--ink)",
    label: asset.category.toUpperCase(),
    bg: "var(--paper-alt)",
  };

  const requiresCount = asset.requires
    ? asset.requires.skills.length + asset.requires.agents.length
    : 0;

  return (
    <Link
      href={`/${asset.category}/${asset.slug}`}
      className="group relative block border-3 border-[var(--ink)] bg-[var(--panel-bg)] p-5 transition-all duration-200 hover:-translate-y-1 speed-hover"
      style={{
        border: "3px solid var(--ink)",
        boxShadow: "4px 4px 0 var(--ink)",
      }}
    >
      <div className="relative">
        {/* Category + group badges */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className="border-2 border-[var(--ink)] px-2 py-0.5 text-[10px] font-[family-name:var(--font-display)] tracking-widest"
            style={{ background: style.bg, color: style.color }}
          >
            {style.label}
          </span>
          {asset.group && (
            <span className="border border-[var(--ink)] px-2 py-0.5 text-[10px] font-bold text-[var(--ink-light)] bg-[var(--paper-alt)]">
              {asset.group}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="mb-1.5 font-[family-name:var(--font-display)] text-xl tracking-wide text-[var(--ink)] transition-colors group-hover:text-[var(--comic-red)]">
          {asset.name.toUpperCase()}
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-[var(--ink-light)] font-bold">
          {asset.description}
        </p>

        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {asset.tags.map((tag) => (
              <span
                key={tag}
                className="border border-[var(--ink)] px-2 py-0.5 text-[11px] text-[var(--ink-light)] font-mono bg-[var(--paper)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Requires count for agents */}
        {requiresCount > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--ink-light)] font-bold">
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
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            {requiresCount}{" "}
            {requiresCount === 1 ? "dependency" : "dependencies"}
          </div>
        )}
      </div>

      {/* Corner fold effect */}
      <div
        className="absolute top-0 right-0 w-0 h-0"
        style={{
          borderStyle: "solid",
          borderWidth: "0 20px 20px 0",
          borderColor: `transparent var(--paper) transparent transparent`,
        }}
      />
    </Link>
  );
}
