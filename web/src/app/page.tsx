import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import HeroRoster from "@/components/HeroRoster";
import InstallCommand from "@/components/InstallCommand";

export default function Home() {
  const catalog = getCatalog();

  return (
    <div className="space-y-24">
      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-8 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -top-20 flex items-center justify-center">
          <div className="h-[500px] w-[700px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[150px]" />
        </div>
        <div className="pointer-events-none absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[var(--cyan)] opacity-[0.02] blur-[120px]" />

        <div className="relative">
          {/* Status badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--accent-text)] font-medium">
              Mission Active
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-up animate-delay-1 font-[family-name:var(--font-display)] text-7xl sm:text-8xl lg:text-9xl tracking-[0.04em] text-[var(--text-primary)] leading-none">
            ASSEMBLE
            <br />
            <span className="text-[var(--accent)]">YOUR TEAM</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up animate-delay-2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
            Opinionated agent personas for{" "}
            <span className="text-[var(--text-primary)] font-semibold">Claude Code</span>.
            Each agent orchestrates specialized skills into battle-tested workflows.
          </p>
        </div>
      </section>

      {/* ── MISSION CALL ──────────────────────────────────────────────── */}
      <section className="animate-fade-up animate-delay-3">
        <div className="rounded-2xl border-2 border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 halftone">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent)]/40 to-transparent" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.15em] text-[var(--accent-text)]">
              MISSION CALL
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-[var(--accent)]/40 to-transparent" />
          </div>

          <p className="text-center text-sm text-[var(--text-muted)] mb-5">
            One command to deploy the full roster. Pick your agents, the installer handles the rest.
          </p>

          <div className="max-w-2xl mx-auto">
            <InstallCommand command="curl -fsSL claude.sporich.dev/install.sh | bash" />
          </div>
        </div>
      </section>

      {/* ── THE ROSTER ────────────────────────────────────────────────── */}
      <section className="animate-fade-up animate-delay-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--accent)]/30" />
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.12em] text-[var(--text-primary)]">
            THE ROSTER
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--accent)]/30" />
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mb-8">
          Select an agent to view their dossier. Each one is built for a specific mission.
        </p>

        <HeroRoster agents={catalog.agents} />
      </section>

      {/* ── SKILL ARMORY ──────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--cyan)]/30" />
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.12em] text-[var(--cyan-text)]">
            SKILL ARMORY
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--cyan)]/30" />
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mb-8">
          The building blocks agents deploy. Each skill teaches Claude a specific discipline.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.skills.map((skill) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="group relative rounded-xl border border-[var(--cyan)]/20 bg-[var(--bg-surface)] p-4 transition-all duration-300 hover:border-[var(--cyan)]/40 hover:bg-[var(--bg-elevated)] hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-[family-name:var(--font-display)] text-lg tracking-[0.08em] text-[var(--text-primary)] group-hover:text-[var(--cyan-text)] transition-colors">
                  {skill.name.toUpperCase()}
                </h3>
                <svg className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--cyan)] transition-colors mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
                {skill.description}
              </p>

              {/* Used by agents */}
              {skill.used_by && skill.used_by.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[var(--text-muted)]">Used by</span>
                  <div className="flex gap-1">
                    {skill.used_by.map((agent) => (
                      <span
                        key={agent}
                        className="rounded bg-[var(--accent)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent-text)]"
                      >
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <div className="text-center pb-8">
        <Link
          href="/browse"
          className="group relative inline-flex items-center gap-2 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)]/10 px-8 py-3.5 text-sm font-bold tracking-[0.08em] text-[var(--accent-text)] transition-all hover:bg-[var(--accent)] hover:text-black hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]"
        >
          BROWSE THE FULL ROSTER
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
