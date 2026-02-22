import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { getHeroColor } from "@/lib/hero-colors";
import HeroRoster from "@/components/HeroRoster";
import InstallCommand from "@/components/InstallCommand";

export default function Home() {
  const catalog = getCatalog();

  return (
    <div className="space-y-10">
      {/* ── SPLASH PANEL — Hero Section ─────────────────────────────── */}
      <section
        className="relative pt-16 pb-12 text-center overflow-hidden bg-[var(--panel-bg)]"
        style={{
          border: "3px solid var(--ink)",
          boxShadow: "6px 6px 0 var(--ink)",
        }}
      >
        {/* Speed lines background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-conic-gradient(transparent 0deg 4deg, rgba(226,54,54,0.02) 4deg 8deg)",
          }}
        />

        {/* Halftone dots background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(226,54,54,0.04) 1px, transparent 1px)",
            backgroundSize: "6px 6px",
          }}
        />

        <div className="relative z-10">
          {/* Caption box badge */}
          <div className="animate-fade-up inline-block caption-box mb-8">
            <span className="text-sm tracking-widest not-italic font-bold">
              MISSION ACTIVE
            </span>
          </div>

          {/* Title — Big, bold, comic style */}
          <h1 className="animate-fade-up animate-delay-1 font-[family-name:var(--font-display)] text-7xl sm:text-8xl lg:text-[10rem] tracking-wider text-[var(--ink)] leading-none comic-text-3d">
            ASSEMBLE
            <br />
            <span className="text-[var(--comic-red)]">YOUR TEAM</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up animate-delay-2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-medium)] font-bold">
            Opinionated agent personas for{" "}
            <span className="text-[var(--ink)] font-bold border-b-3 border-[var(--comic-red)]">
              Claude Code
            </span>
            . Each agent orchestrates specialized skills into battle-tested
            workflows.
          </p>
        </div>

        {/* Decorative action words */}
        <div className="absolute top-6 left-6 action-word text-3xl sm:text-4xl opacity-20 rotate-[-12deg]">
          POW!
        </div>
        <div className="absolute bottom-8 right-8 action-word text-2xl sm:text-3xl opacity-15 rotate-[8deg]">
          ZAP!
        </div>
      </section>

      {/* ── MISSION CALL — Install Command ──────────────────────────── */}
      <section className="animate-fade-up animate-delay-3">
        <div
          className="relative bg-[var(--panel-bg)] p-6 sm:p-8 overflow-hidden"
          style={{
            border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
          }}
        >
          {/* Halftone dots */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--ink) 0.5px, transparent 0.5px)",
              backgroundSize: "5px 5px",
              opacity: 0.03,
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-[3px] flex-1 bg-[var(--ink)] opacity-10" />
              <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-widest text-[var(--comic-red)]">
                MISSION CALL
              </h2>
              <div className="h-[3px] flex-1 bg-[var(--ink)] opacity-10" />
            </div>

            <p className="text-center text-sm text-[var(--ink-light)] mb-5 font-bold">
              One command to deploy the full roster. Pick your agents, the
              installer handles the rest.
            </p>

            <div className="max-w-2xl mx-auto">
              <InstallCommand command="curl -fsSL claude.sporich.dev/install.sh | bash" />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE ROSTER ──────────────────────────────────────────────── */}
      <section className="animate-fade-up animate-delay-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-[3px] flex-1 bg-[var(--ink)] opacity-10" />
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-widest text-[var(--ink)]">
            THE ROSTER
          </h2>
          <div className="h-[3px] flex-1 bg-[var(--ink)] opacity-10" />
        </div>

        <p className="text-center text-sm text-[var(--ink-light)] mb-8 font-bold">
          Select an agent to view their dossier. Each one is built for a
          specific mission.
        </p>

        <HeroRoster agents={catalog.agents} />
      </section>

      {/* ── SKILL ARMORY ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-[3px] flex-1 bg-[var(--ink)] opacity-10" />
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-widest text-[var(--comic-blue)]">
            SKILL ARMORY
          </h2>
          <div className="h-[3px] flex-1 bg-[var(--ink)] opacity-10" />
        </div>

        <p className="text-center text-sm text-[var(--ink-light)] mb-8 font-bold">
          The building blocks agents deploy. Each skill teaches Claude a
          specific discipline.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.skills.map((skill) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="group relative bg-[var(--panel-bg)] p-4 transition-all duration-200 hover:-translate-y-1"
              style={{
                border: "2px solid var(--ink)",
                boxShadow: "3px 3px 0 var(--ink)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wider text-[var(--ink)] group-hover:text-[var(--comic-blue)] transition-colors">
                  {skill.name.toUpperCase()}
                </h3>
                <svg
                  className="h-4 w-4 text-[var(--ink-faded)] group-hover:text-[var(--comic-blue)] transition-colors mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>

              <p className="text-xs text-[var(--ink-light)] leading-relaxed mb-3 font-bold">
                {skill.description}
              </p>

              {/* Used by agents */}
              {skill.used_by && skill.used_by.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[var(--ink-faded)] font-bold">
                    Used by
                  </span>
                  <div className="flex gap-1">
                    {skill.used_by.map((agent) => {
                      const heroColor = getHeroColor(agent);
                      return (
                        <span
                          key={agent}
                          className="border border-[var(--ink)] px-1.5 py-0.5 text-[10px] font-bold"
                          style={{
                            background: heroColor?.light ?? "var(--comic-red-light)",
                            color: heroColor?.color ?? "var(--comic-red)",
                          }}
                        >
                          {agent}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <div className="text-center pb-8">
        <Link
          href="/browse"
          className="group relative inline-flex items-center gap-2 border-3 bg-[var(--comic-red)] px-8 py-3.5 font-[family-name:var(--font-display)] text-xl tracking-widest text-white transition-all hover:translate-x-0.5 hover:-translate-y-0.5"
          style={{
            border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
          }}
        >
          BROWSE THE FULL ROSTER
          <svg
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
