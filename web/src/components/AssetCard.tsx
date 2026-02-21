import Link from "next/link";
import type { CatalogAsset } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  skills: "Skill",
  templates: "Template",
  prompts: "Prompt",
};

export default function AssetCard({ asset }: { asset: CatalogAsset }) {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {categoryLabels[asset.category] ?? asset.category}
        </span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          {asset.group}
        </span>
      </div>

      <Link
        href={`/${asset.category}/${asset.slug}`}
        className="mb-1 block text-lg font-semibold text-gray-900 group-hover:text-blue-600"
      >
        {asset.name}
      </Link>

      <p className="mb-3 text-sm text-gray-600">{asset.description}</p>

      {asset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {asset.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
