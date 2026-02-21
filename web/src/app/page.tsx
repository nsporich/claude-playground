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

      {/* How It Works */}
      <section className="animate-fade-up animate-delay-4">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 sm:p-10">
          <h2 className="font-display text-2xl text-[var(--text-primary)] text-center mb-2">
            How it works
          </h2>
          <p className="text-sm text-[var(--text-muted)] text-center mb-10">
            Three asset types, one installer. Each lands exactly where Claude Code expects it.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* Skills */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                Skills
              </h3>
              <p className="text-xs leading-relaxed text-[var(--text-muted)] mb-4">
                Teach Claude specific workflows like code review, PR generation, or framework guidance. Always available in every session.
              </p>
              <code className="inline-block rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-2 py-1 text-[10px] font-mono text-[var(--accent-text)]">
                ~/.claude/skills/
              </code>
            </div>

            {/* Templates */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                Templates
              </h3>
              <p className="text-xs leading-relaxed text-[var(--text-muted)] mb-4">
                Project-level CLAUDE.md files that set conventions, structure, and patterns. Onboarding docs for your AI pair programmer.
              </p>
              <code className="inline-block rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-2 py-1 text-[10px] font-mono text-[var(--accent-text)]">
                ./CLAUDE.md
              </code>
            </div>

            {/* Prompts */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                Prompts
              </h3>
              <p className="text-xs leading-relaxed text-[var(--text-muted)] mb-4">
                Standalone instructions you paste into a conversation to kick off a specific task. Consistent results, zero setup.
              </p>
              <code className="inline-block rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-2 py-1 text-[10px] font-mono text-[var(--accent-text)]">
                copy &amp; paste
              </code>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--accent-text)] transition-colors hover:text-[var(--accent)]"
            >
              Learn more
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
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
