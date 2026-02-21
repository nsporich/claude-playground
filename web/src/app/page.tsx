import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import AssetCard from "@/components/AssetCard";
import InstallCommand from "@/components/InstallCommand";

export default function Home() {
  const catalog = getCatalog();

  const skillCount = catalog.skills.length;
  const templateCount = catalog.templates.length;
  const promptCount = catalog.prompts.length;

  const featured = [
    catalog.skills[0],
    catalog.templates[0],
    catalog.prompts[0],
  ].filter(Boolean);

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative pt-16 pb-4 text-center">
        {/* Radial glow behind hero */}
        <div className="pointer-events-none absolute inset-0 -top-20 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px]" />
        </div>

        <div className="relative">
          <p className="animate-fade-up text-xs font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-6">
            Open Source Collection
          </p>

          <h1 className="animate-fade-up animate-delay-1 font-display text-6xl sm:text-7xl tracking-tight text-[var(--text-primary)] leading-[1.05]">
            Claude<br />
            <span className="italic text-[var(--accent)]">Playground</span>
          </h1>

          <p className="animate-fade-up animate-delay-2 mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[var(--text-secondary)]">
            Curated skills, templates, and prompts for{" "}
            <span className="text-[var(--text-primary)]">Claude Code</span>.
            Install what you need, skip the rest.
          </p>

          <div className="animate-fade-up animate-delay-3 mx-auto mt-10 max-w-xl">
            <InstallCommand command="curl -fsSL claude.sporich.dev/install.sh | bash" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="animate-fade-up animate-delay-4">
        <div className="flex items-center justify-center gap-8 sm:gap-12">
          {[
            { count: skillCount, label: "Skills" },
            { count: templateCount, label: "Templates" },
            { count: promptCount, label: "Prompts" },
          ].map(({ count, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl text-[var(--text-primary)]">
                {count}
              </div>
              <div className="mt-1 text-xs tracking-[0.15em] uppercase text-[var(--text-muted)]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="mb-8 flex items-center gap-4">
          <h2 className="font-display text-2xl text-[var(--text-primary)]">
            Featured
          </h2>
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((asset) => (
            <AssetCard key={asset.slug} asset={asset} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pb-8">
        <Link
          href="/browse"
          className="group relative inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-black transition-all hover:shadow-[0_0_24px_rgba(245,158,11,0.3)]"
        >
          Browse all assets
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
