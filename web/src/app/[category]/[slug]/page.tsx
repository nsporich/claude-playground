import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAssets, getAsset, getAssetContent } from "@/lib/catalog";
import type { AssetCategory } from "@/lib/types";
import InstallCommand from "@/components/InstallCommand";
import MarkdownPreview from "@/components/MarkdownPreview";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  skills: "Skill",
  templates: "Template",
  prompts: "Prompt",
};

export function generateStaticParams() {
  const assets = getAllAssets();
  return assets.map((asset) => ({
    category: asset.category,
    slug: asset.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const asset = getAsset(category as AssetCategory, slug);
  if (!asset) {
    return { title: "Not Found | Claude Playground" };
  }
  return { title: `${asset.name} | Claude Playground` };
}

export default async function AssetDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const asset = getAsset(category as AssetCategory, slug);

  if (!asset) {
    notFound();
  }

  const content = getAssetContent(asset);
  const label = CATEGORY_LABELS[asset.category] ?? asset.category;
  const installCommand = `curl -fsSL https://raw.githubusercontent.com/nsporich/claude-playground/main/install.sh | bash`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/browse"
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        &larr; Back to browse
      </Link>

      <div className="mb-4 flex items-center gap-2">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
          {label}
        </span>
      </div>

      <h1 className="mb-4 text-3xl font-bold">{asset.name}</h1>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
          {asset.group}
        </span>
        {asset.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mb-8">
        <p className="mb-2 text-sm text-gray-500">Install</p>
        <InstallCommand command={installCommand} />
      </div>

      <article className="prose prose-gray max-w-none">
        <MarkdownPreview content={content} />
      </article>
    </main>
  );
}
