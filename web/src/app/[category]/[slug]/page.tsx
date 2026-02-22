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

const CATEGORY_DEFAULTS: Record<
  AssetCategory,
  { label: string; color: string; colorText: string; colorBg: string; colorLight: string }
> = {
  agents: {
    label: "AGENT",
    color: "#E23636",
    colorText: "#B91C1C",
    colorBg: "rgba(226, 54, 54, 0.12)",
    colorLight: "#FEE2E2",
  },
  skills: {
    label: "SKILL",
    color: "#2563EB",
    colorText: "#1D4ED8",
    colorBg: "rgba(37, 99, 235, 0.12)",
    colorLight: "#DBEAFE",
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
    color: "#1a1a2e",
    colorText: "#1a1a2e",
    colorBg: "rgba(26,26,46,0.1)",
    colorLight: "#f0f0f0",
  };

  // For agents, override with per-hero colors
  const heroColor =
    asset.category === "agents" ? getHeroColor(asset.slug) : undefined;
  const color = heroColor?.color ?? defaults.color;
  const colorText = heroColor?.text ?? defaults.colorText;
  const colorLight = heroColor?.light ?? defaults.colorLight;
  const label = defaults.label;

  const installCommand = `curl -fsSL claude.sporich.dev/install.sh | bash`;

  return (
    <main className="mx-auto max-w-3xl py-12">
      {/* Back link */}
      <Link
        href="/browse"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ink-light)] transition-colors hover:text-[var(--comic-red)]"
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
        Back to roster
      </Link>

      {/* Header panel */}
      <div
        className="mb-6 p-6 relative overflow-hidden bg-[var(--panel-bg)] classified-stamp"
        style={{
          border: "3px solid var(--ink)",
          boxShadow: `6px 6px 0 ${color}`,
        }}
      >
        {/* Top color bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[4px]"
          style={{ background: color }}
        />

        {/* Halftone background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${color} 0.7px, transparent 0.7px)`,
            backgroundSize: "5px 5px",
            opacity: 0.05,
          }}
        />

        <div className="relative z-10">
          {/* Category badge */}
          <div className="mb-4 flex items-center gap-2">
            <span
              className="border-2 border-[var(--ink)] px-2.5 py-0.5 text-[10px] font-[family-name:var(--font-display)] tracking-widest"
              style={{ background: colorLight, color: colorText }}
            >
              {label}
            </span>
            {asset.group && (
              <span className="border border-[var(--ink)] bg-[var(--paper-alt)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--ink-light)]">
                {asset.group}
              </span>
            )}
          </div>

          {/* Name */}
          <h1
            className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl tracking-widest leading-none comic-text-3d"
            style={{ color }}
          >
            {asset.name.toUpperCase()}
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm text-[var(--ink-medium)] leading-relaxed font-bold">
            {asset.description}
          </p>

          {/* Tags */}
          {asset.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {asset.tags.map((tag) => (
                <span
                  key={tag}
                  className="border-[1.5px] border-[var(--ink)] px-2.5 py-0.5 text-[11px] font-mono font-bold bg-[var(--paper)]"
                  style={{ color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Agent-specific: Dependencies */}
      {asset.requires &&
        (asset.requires.skills.length > 0 ||
          asset.requires.agents.length > 0) && (
          <div
            className="mb-5 bg-[var(--panel-bg)] p-5"
            style={{
              border: "3px solid var(--ink)",
              boxShadow: "var(--shadow-comic)",
            }}
          >
            <p className="mb-3 font-[family-name:var(--font-display)] tracking-widest uppercase text-[var(--ink-light)] text-sm">
              Dependencies
            </p>
            <div className="flex flex-wrap gap-2">
              {asset.requires.skills.map((skill) => (
                <Link
                  key={skill}
                  href={`/skills/${skill}`}
                  className="border-2 border-[var(--ink)] px-3 py-1 text-xs font-bold text-[var(--comic-blue)] bg-[var(--comic-blue-light)] transition-colors hover:bg-[var(--comic-blue)] hover:text-white"
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
                    className="border-2 border-[var(--ink)] px-3 py-1 text-xs font-bold transition-colors hover:text-white"
                    style={{
                      color: agentColor?.color ?? color,
                      background: agentColor?.light ?? colorLight,
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
          className="mb-5 bg-[var(--panel-bg)] p-5"
          style={{
            border: "3px solid var(--ink)",
            boxShadow: "var(--shadow-comic)",
          }}
        >
          <p className="mb-3 font-[family-name:var(--font-display)] tracking-widest uppercase text-[var(--ink-light)] text-sm">
            Capabilities
          </p>
          <div className="flex flex-wrap gap-2">
            {asset.features.map((feature) => (
              <span
                key={feature}
                className="border-2 border-[var(--ink)] bg-[var(--paper)] px-3 py-1 text-xs font-mono font-bold text-[var(--ink-medium)]"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Install */}
      <div
        className="mb-10 bg-[var(--panel-bg)] p-5"
        style={{
          border: "3px solid var(--ink)",
          boxShadow: "var(--shadow-comic)",
        }}
      >
        <p className="mb-3 font-[family-name:var(--font-display)] tracking-widest uppercase text-[var(--ink-light)] text-sm">
          Deploy
        </p>
        <InstallCommand command={installCommand} />
      </div>

      {/* Content */}
      <article
        className="bg-[var(--panel-bg)] p-6 sm:p-8"
        style={{
          border: "3px solid var(--ink)",
          boxShadow: "var(--shadow-comic)",
        }}
      >
        <MarkdownPreview content={content} />
      </article>
    </main>
  );
}
