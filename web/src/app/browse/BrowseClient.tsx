"use client";

import { useState } from "react";
import type { AssetCategory, CatalogAsset } from "@/lib/types";
import TagFilter from "@/components/TagFilter";
import AssetCard from "@/components/AssetCard";

const categoryOrder: AssetCategory[] = ["agents", "skills"];

const categoryConfig: Record<AssetCategory, { label: string; colorClass: string }> = {
  agents: { label: "AGENTS", colorClass: "text-[var(--accent-text)]" },
  skills: { label: "SKILLS", colorClass: "text-[var(--cyan-text)]" },
};

export default function BrowseClient({
  assets,
  allTags,
}: {
  assets: CatalogAsset[];
  allTags: string[];
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  function handleToggle(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  const filtered =
    selectedTags.length === 0
      ? assets
      : assets.filter((asset) =>
          selectedTags.some((tag) => asset.tags.includes(tag)),
        );

  const grouped = new Map<AssetCategory, Map<string, CatalogAsset[]>>();
  for (const asset of filtered) {
    if (!grouped.has(asset.category)) {
      grouped.set(asset.category, new Map());
    }
    const categoryMap = grouped.get(asset.category)!;
    const group = asset.group || "";
    if (!categoryMap.has(group)) {
      categoryMap.set(group, []);
    }
    categoryMap.get(group)!.push(asset);
  }

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-[0.08em] text-[var(--text-primary)] mb-2">
          THE ROSTER
        </h1>
        <p className="text-[var(--text-muted)]">
          Filter by tag or explore by category.
        </p>
      </div>

      {/* Tag filter */}
      <div className="rounded-xl border-2 border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
        <div className="mb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
          Filter by tag
        </div>
        <TagFilter
          tags={allTags}
          selected={selectedTags}
          onToggle={handleToggle}
        />
      </div>

      {/* Categories */}
      {categoryOrder.map((category) => {
        const groupMap = grouped.get(category);
        if (!groupMap || groupMap.size === 0) return null;

        const sortedGroups = [...groupMap.keys()].sort();
        const allAssets = [...groupMap.values()].flat();
        const config = categoryConfig[category];
        const hasMultipleGroups = sortedGroups.length > 1 || (sortedGroups.length === 1 && sortedGroups[0] !== "");

        return (
          <section key={category}>
            <div className="mb-6 flex items-center gap-4">
              <h2 className={`font-[family-name:var(--font-display)] text-2xl tracking-[0.12em] ${config.colorClass}`}>
                {config.label}
              </h2>
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {allAssets.length}
              </span>
            </div>

            {hasMultipleGroups ? (
              sortedGroups.map((group) => {
                const groupAssets = groupMap.get(group)!;
                return (
                  <div key={group} className="mb-8">
                    <h3 className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
                      {group}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {groupAssets.map((asset) => (
                        <AssetCard key={asset.slug} asset={asset} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allAssets.map((asset) => (
                  <AssetCard key={asset.slug} asset={asset} />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[var(--text-muted)]">
            No assets match the selected tags.
          </p>
        </div>
      )}
    </div>
  );
}
