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

const categoryStyles: Record<string, { bg: string; text: string }> = {
  skills: { bg: "bg-amber-500/10", text: "text-amber-400" },
  templates: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  prompts: { bg: "bg-violet-500/10", text: "text-violet-400" },
};

export function generateStaticParams() {
  const assets = getAllAssets();
  return assets.map((asset) => ({
    category: asset.category,
    slug: asset.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
  const style = categoryStyles[asset.category] ?? {
    bg: "bg-white/5",
    text: "text-white/60",
  };
  const installCommand = `curl -fsSL claude.sporich.dev/install.sh | bash`;

  return (
    <main className="mx-auto max-w-3xl py-12">
      <Link
        href="/browse"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent-text)]"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 17l-5-5m0 0l5-5m-5 5h12"
          />
        </svg>
        Back to browse
      </Link>

      <div className="mb-4 flex items-center gap-2">
        <span
          className={`rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${style.bg} ${style.text}`}
        >
          {label}
        </span>
        <span className="rounded-md bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
          {asset.group}
        </span>
      </div>

      <h1 className="mb-4 font-display text-4xl text-[var(--text-primary)]">
        {asset.name}
      </h1>

      {asset.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {asset.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border-subtle)] px-2.5 py-0.5 text-[11px] font-mono text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mb-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <p className="mb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--text-muted)]">
          Install
        </p>
        <InstallCommand command={installCommand} />
      </div>

      <article>
        <MarkdownPreview content={content} />
      </article>
    </main>
  );
}
