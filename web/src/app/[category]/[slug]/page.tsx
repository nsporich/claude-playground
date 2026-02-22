import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAssets, getAsset, getAssetContent } from "@/lib/catalog";
import type { AssetCategory } from "@/lib/types";
import { getHeroColor } from "@/lib/hero-colors";
import InstallCommand from "@/components/InstallCommand";
import MarkdownPreview from "@/components/MarkdownPreview";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

const CATEGORY_DEFAULTS: Record<AssetCategory, { label: string; color: string; colorText: string; colorBg: string }> = {
  agents: {
    label: "AGENT",
    color: "#dc2626",
    colorText: "#fca5a5",
    colorBg: "rgba(220, 38, 38, 0.15)",
  },
  skills: {
    label: "SKILL",
    color: "#22d3ee",
    colorText: "#a5f3fc",
    colorBg: "rgba(34, 211, 238, 0.12)",
  },
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
    return { title: "Not Found | Agents Assemble" };
  }
  return { title: `${asset.name} | Agents Assemble` };
}

export default async function AssetDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const asset = getAsset(category as AssetCategory, slug);

  if (!asset) {
    notFound();
  }

  const content = getAssetContent(asset);
  const defaults = CATEGORY_DEFAULTS[asset.category] ?? {
    label: asset.category.toUpperCase(),
    color: "#ffffff",
    colorText: "#ffffff",
    colorBg: "rgba(255,255,255,0.1)",
  };

  // For agents, override with per-hero colors
  const heroColor = asset.category === "agents" ? getHeroColor(asset.slug) : undefined;
  const color = heroColor?.color ?? defaults.color;
  const colorText = heroColor?.text ?? defaults.colorText;
  const colorBg = heroColor?.bg ?? defaults.colorBg;
  const label = defaults.label;

  const installCommand = `curl -fsSL claude.sporich.dev/install.sh | bash`;

  return (
    <main className="mx-auto max-w-3xl py-12">
      {/* Back link */}
      <Link
        href="/browse"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors"
        style={{ ["--hover-color" as string]: colorText }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
        Back to roster
      </Link>

      {/* Header area */}
      <div className="mb-6 rounded-xl border-2 p-6 relative overflow-hidden classified-stamp"
        style={{
          borderColor: `${color}4d`,
          background: `linear-gradient(135deg, var(--bg-surface), ${color}08)`,
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />

        {/* Category badge */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className="rounded-md px-2.5 py-0.5 text-[10px] font-bold tracking-[0.15em]"
            style={{ background: colorBg, color: colorText }}
          >
            {label}
          </span>
          {asset.group && (
            <span className="rounded-md bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
              {asset.group}
            </span>
          )}
        </div>

        {/* Name */}
        <h1
          className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl tracking-[0.06em] leading-none"
          style={{ color: colorText }}
        >
          {asset.name.toUpperCase()}
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          {asset.description}
        </p>

        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {asset.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-2.5 py-0.5 text-[11px] font-mono"
                style={{ borderColor: `${color}25`, color: `${color}aa` }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Agent-specific: Dependencies */}
      {asset.requires && (asset.requires.skills.length > 0 || asset.requires.agents.length > 0) && (
        <div
          className="mb-5 rounded-xl border bg-[var(--bg-surface)] p-5"
          style={{ borderColor: `${color}20` }}
        >
          <p className="mb-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
            Dependencies
          </p>
          <div className="flex flex-wrap gap-2">
            {asset.requires.skills.map((skill) => (
              <Link
                key={skill}
                href={`/skills/${skill}`}
                className="rounded-lg border px-3 py-1 text-xs font-medium transition-colors hover:brightness-125"
                style={{
                  borderColor: "var(--cyan-glow)",
                  background: "var(--cyan-glow)",
                  color: "var(--cyan-text)",
                }}
              >
                {skill}
              </Link>
            ))}
            {asset.requires.agents.map((agent) => {
              const agentColor = getHeroColor(agent);
              return (
                <Link
                  key={agent}
                  href={`/agents/${agent}`}
                  className="rounded-lg border px-3 py-1 text-xs font-medium transition-colors hover:brightness-125"
                  style={{
                    borderColor: `${agentColor?.color ?? color}30`,
                    background: agentColor?.bg ?? colorBg,
                    color: agentColor?.text ?? colorText,
                  }}
                >
                  {agent}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Agent-specific: Capabilities */}
      {asset.features && asset.features.length > 0 && (
        <div
          className="mb-5 rounded-xl border bg-[var(--bg-surface)] p-5"
          style={{ borderColor: `${color}20` }}
        >
          <p className="mb-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
            Capabilities
          </p>
          <div className="flex flex-wrap gap-2">
            {asset.features.map((feature) => (
              <span
                key={feature}
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1 text-xs font-mono font-medium text-[var(--text-secondary)]"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Install */}
      <div
        className="mb-10 rounded-xl border bg-[var(--bg-surface)] p-5"
        style={{ borderColor: `${color}20` }}
      >
        <p className="mb-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
          Deploy
        </p>
        <InstallCommand command={installCommand} />
      </div>

      {/* Content */}
      <article>
        <MarkdownPreview content={content} />
      </article>
    </main>
  );
}
