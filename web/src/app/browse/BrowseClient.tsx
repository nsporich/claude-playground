"use client";

import { useState } from "react";
import type { AssetCategory, CatalogAsset } from "@/lib/types";
import TagFilter from "@/components/TagFilter";
import AssetCard from "@/components/AssetCard";

const categoryOrder: AssetCategory[] = ["skills", "templates", "prompts"];

const categoryLabels: Record<AssetCategory, string> = {
  skills: "Skills",
  templates: "Templates",
  prompts: "Prompts",
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

  // Group by category, then by group within each category
  const grouped = new Map<AssetCategory, Map<string, CatalogAsset[]>>();
  for (const asset of filtered) {
    if (!grouped.has(asset.category)) {
      grouped.set(asset.category, new Map());
    }
    const categoryMap = grouped.get(asset.category)!;
    if (!categoryMap.has(asset.group)) {
      categoryMap.set(asset.group, []);
    }
    categoryMap.get(asset.group)!.push(asset);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Browse</h1>

      <div className="mb-8">
        <TagFilter
          tags={allTags}
          selected={selectedTags}
          onToggle={handleToggle}
        />
      </div>

      {categoryOrder.map((category) => {
        const groupMap = grouped.get(category);
        if (!groupMap || groupMap.size === 0) return null;

        const sortedGroups = [...groupMap.keys()].sort();

        return (
          <section key={category} className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              {categoryLabels[category]}
            </h2>

            {sortedGroups.map((group) => {
              const groupAssets = groupMap.get(group)!;
              return (
                <div key={group} className="mb-6">
                  <h3 className="mb-3 text-lg font-medium text-gray-700">
                    {group}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groupAssets.map((asset) => (
                      <AssetCard key={asset.slug} asset={asset} />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p className="text-center text-gray-500">
          No assets match the selected tags.
        </p>
      )}
    </div>
  );
}
