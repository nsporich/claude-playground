"use client";

import { useState } from "react";
import type { AssetCategory, CatalogAsset } from "@/lib/types";
import TagFilter from "@/components/TagFilter";
import AssetCard from "@/components/AssetCard";

const categoryOrder: AssetCategory[] = ["agents", "skills"];

const categoryConfig: Record<
  AssetCategory,
  { label: string; color: string }
> = {
  agents: { label: "AGENTS", color: "var(--comic-red)" },
  skills: { label: "SKILLS", color: "var(--comic-blue)" },
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
        <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-widest text-[var(--ink)] mb-2 comic-text-3d">
          THE ROSTER
        </h1>
        <p className="text-[var(--ink-light)] font-bold">
          Filter by tag or explore by category.
        </p>
      </div>

      {/* Tag filter panel */}
      <div
        className="bg-[var(--panel-bg)] p-5"
        style={{
          border: "3px solid var(--ink)",
          boxShadow: "4px 4px 0 var(--ink)",
        }}
      >
        <div className="mb-3 font-[family-name:var(--font-display)] text-sm tracking-widest uppercase text-[var(--ink-light)]">
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
        const hasMultipleGroups =
          sortedGroups.length > 1 ||
          (sortedGroups.length === 1 && sortedGroups[0] !== "");

        return (
          <section key={category}>
            <div className="mb-6 flex items-center gap-4">
              <h2
                className="font-[family-name:var(--font-display)] text-2xl tracking-widest"
                style={{ color: config.color }}
              >
                {config.label}
              </h2>
              <div className="flex-1 h-[2px] bg-[var(--ink)] opacity-10" />
              <span className="text-sm font-mono font-bold text-[var(--ink-light)]">
                {allAssets.length}
              </span>
            </div>

            {hasMultipleGroups ? (
              sortedGroups.map((group) => {
                const groupAssets = groupMap.get(group)!;
                return (
                  <div key={group} className="mb-8">
                    <h3 className="mb-4 font-[family-name:var(--font-display)] tracking-widest uppercase text-[var(--ink-light)] text-sm">
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
        <div
          className="py-16 text-center bg-[var(--panel-bg)]"
          style={{
            border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
          }}
        >
          <p className="text-[var(--ink-light)] font-bold text-lg">
            No assets match the selected tags.
          </p>
        </div>
      )}
    </div>
  );
}
