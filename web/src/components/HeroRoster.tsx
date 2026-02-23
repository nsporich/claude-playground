"use client";

import { useState } from "react";
import Link from "next/link";
import type { CatalogAsset } from "@/lib/types";
import { getHeroColor } from "@/lib/hero-colors";

interface HeroStats {
  power: number;
  precision: number;
  speed: number;
  range: number;
  teamwork: number;
}

interface HeroMeta {
  title: string;
  role: string;
  skillSet: string;
  flavorText: string;
  color: string;
  colorLight: string;
  stats: HeroStats;
}

const HERO_META: Record<string, HeroMeta> = {
  ironclad: {
    title: "The Heavy Hitter",
    role: "Feature Development",
    skillSet: "Master of Planning, TDD, and Feature-Implementation.",
    flavorText:
      "If you can dream the blueprint, Ironclad can forge the fortress. He doesn\u2019t just write code; he constructs reality.",
    color: "#E23636",
    colorLight: "#FEE2E2",
    stats: { power: 5, precision: 3, speed: 3, range: 4, teamwork: 4 },
  },
  deadeye: {
    title: "The Marksman",
    role: "Elite Bug Hunting",
    skillSet: "Precision Bug-Diagnosis, TDD, and Code-Review.",
    flavorText:
      "Deadeye never misses. While others guess at the cause, he\u2019s already neutralized the target from ten thousand lines away.",
    color: "#7C3AED",
    colorLight: "#EDE9FE",
    stats: { power: 3, precision: 5, speed: 4, range: 3, teamwork: 3 },
  },
  aegis: {
    title: "The Sentinel",
    role: "Code Review Specialist",
    skillSet: "Pure, unyielding Code-Review.",
    flavorText:
      "The final line of defense. If a single semicolon is out of place, the shield stays up. Nothing enters the master branch without Aegis\u2019s seal.",
    color: "#2563EB",
    colorLight: "#DBEAFE",
    stats: { power: 3, precision: 5, speed: 2, range: 2, teamwork: 4 },
  },
  titan: {
    title: "The Colossus",
    role: "Optimization Specialist",
    skillSet: "Performance Optimization and Code-Review.",
    flavorText:
      "Built for the heavy lifting. When the system groans under the weight of technical debt, Titan pulls the load until it\u2019s lean and lethal.",
    color: "#16A34A",
    colorLight: "#DCFCE7",
    stats: { power: 5, precision: 4, speed: 4, range: 3, teamwork: 3 },
  },
  lorekeeper: {
    title: "The Archivist",
    role: "Master of Documentation",
    skillSet: "Comprehensive Documentation orchestration.",
    flavorText:
      "The guardian of the sacred texts. Lorekeeper ensures that the \u2018how\u2019 and \u2018why\u2019 of your mission are never lost to time.",
    color: "#D97706",
    colorLight: "#FEF3C7",
    stats: { power: 2, precision: 4, speed: 3, range: 5, teamwork: 5 },
  },
  oracle: {
    title: "The All-Seeing",
    role: "Codebase Onboarding",
    skillSet: "Operates via specialized Built-in Subagents.",
    flavorText:
      "Oracle doesn\u2019t read your code; she understands it. She maps the dark corners of legacy repos so the rest of the team can strike with certainty.",
    color: "#0891B2",
    colorLight: "#CFFAFE",
    stats: { power: 3, precision: 4, speed: 5, range: 5, teamwork: 4 },
  },
};

/* ── Power Rating Stat Bars ──────────────────────────────────── */
const STAT_LABELS: { key: keyof HeroStats; label: string }[] = [
  { key: "power", label: "Power" },
  { key: "precision", label: "Precision" },
  { key: "speed", label: "Speed" },
  { key: "range", label: "Range" },
  { key: "teamwork", label: "Teamwork" },
];

function StatBar({ stats, color, colorLight }: { stats: HeroStats; color: string; colorLight: string }) {
  return (
    <div className="space-y-1.5">
      {STAT_LABELS.map(({ key, label }) => {
        const value = stats[key];
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="w-16 text-[11px] font-bold text-[var(--ink-light)]">
              {label}
            </span>
            <div className="flex gap-[2px] flex-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 flex-1"
                  style={{
                    border: "1px solid var(--ink)",
                    background: i < value ? color : colorLight,
                    opacity: i < value ? 1 : 0.4,
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Simple SVG icons for each hero */
function HeroIcon({ slug, color }: { slug: string; color: string }) {
  const props = {
    className: "h-8 w-8 sm:h-10 sm:w-10",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: color,
    strokeWidth: 2,
  };

  switch (slug) {
    case "ironclad":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"
          />
        </svg>
      );
    case "deadeye":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" fill={color} />
          <line x1="12" y1="1" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="1" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="23" y2="12" />
        </svg>
      );
    case "aegis":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      );
    case "oracle":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      );
    case "lorekeeper":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      );
    case "titan":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function HeroRoster({ agents }: { agents: CatalogAsset[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedAgent = agents.find((a) => a.slug === selectedSlug);
  const selectedMeta = selectedSlug ? HERO_META[selectedSlug] : null;

  function handleSelect(slug: string) {
    setSelectedSlug((prev) => (prev === slug ? null : slug));
  }

  return (
    <div>
      {/* Assembly Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {agents.map((agent, i) => {
          const meta = HERO_META[agent.slug];
          if (!meta) return null;
          const isSelected = selectedSlug === agent.slug;

          return (
            <button
              key={agent.slug}
              onClick={() => handleSelect(agent.slug)}
              className="animate-fade-up group relative p-4 sm:p-5 text-center transition-all duration-200 cursor-pointer bg-[var(--panel-bg)] speed-hover"
              style={{
                border: `3px solid var(--ink)`,
                boxShadow: isSelected
                  ? `6px 6px 0 ${meta.color}`
                  : "4px 4px 0 var(--ink)",
                animationDelay: `${0.06 + i * 0.06}s`,
                transform: isSelected ? "translate(-2px, -2px)" : undefined,
              }}
            >
              {/* Color bar at top */}
              <div
                className="absolute top-0 left-0 right-0 h-[4px]"
                style={{ background: meta.color }}
              />

              {/* Icon with halftone-colored background */}
              <div
                className="relative mx-auto mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center"
                style={{ background: meta.colorLight }}
              >
                {/* Halftone dots inside the icon area */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${meta.color} 0.6px, transparent 0.6px)`,
                    backgroundSize: "4px 4px",
                    opacity: 0.12,
                  }}
                />
                <div className="relative z-10">
                  <HeroIcon slug={agent.slug} color={meta.color} />
                </div>
              </div>

              {/* Name */}
              <h3
                className="font-[family-name:var(--font-display)] text-lg sm:text-xl tracking-wide transition-colors duration-200"
                style={{ color: isSelected ? meta.color : "var(--ink)" }}
              >
                {agent.name.toUpperCase()}
              </h3>

              {/* Title */}
              <p className="mt-0.5 text-[10px] sm:text-[11px] tracking-wider uppercase text-[var(--ink-light)] font-bold">
                {meta.title}
              </p>

              {/* Selection indicator — star burst */}
              {isSelected && (
                <div
                  className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center text-white text-[10px] font-bold animate-pop"
                  style={{
                    background: meta.color,
                    clipPath:
                      "polygon(50% 0%, 63% 28%, 98% 35%, 72% 57%, 82% 91%, 50% 72%, 18% 91%, 28% 57%, 2% 35%, 37% 28%)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Dossier Panel */}
      {selectedAgent && selectedMeta && (
        <div
          key={selectedSlug}
          className="dossier-enter mt-6 overflow-hidden"
          style={{
            border: "3px solid var(--ink)",
            boxShadow: `6px 6px 0 ${selectedMeta.color}`,
          }}
        >
          {/* Dossier Header — colored band */}
          <div
            className="relative px-6 sm:px-8 py-5 border-b-3"
            style={{
              background: selectedMeta.colorLight,
              borderBottom: "3px solid var(--ink)",
            }}
          >
            {/* Halftone dot pattern — dense at edges, fading to center */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, ${selectedMeta.color} 1.2px, transparent 1.2px)`,
                backgroundSize: "6px 6px",
                opacity: 0.35,
                maskImage: "linear-gradient(to right, black, transparent 35%, transparent 65%, black)",
                WebkitMaskImage: "linear-gradient(to right, black, transparent 35%, transparent 65%, black)",
              }}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center border-2 border-[var(--ink)]"
                  style={{ background: "var(--panel-bg)" }}
                >
                  <HeroIcon
                    slug={selectedAgent.slug}
                    color={selectedMeta.color}
                  />
                </div>
                <div>
                  <h3
                    className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl tracking-wider comic-text-3d"
                    style={{ color: selectedMeta.color }}
                  >
                    {selectedAgent.name.toUpperCase()}
                  </h3>
                  <p className="text-xs tracking-widest uppercase text-[var(--ink-medium)] font-bold">
                    {selectedMeta.title}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <div
                  className="caption-box text-sm"
                  style={{ transform: "rotate(2deg)" }}
                >
                  STATUS: READY
                </div>
              </div>
            </div>
          </div>

          {/* Dossier Body */}
          <div className="bg-[var(--panel-bg)] p-6 sm:p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Left: Intel */}
              <div className="space-y-5">
                {/* Role */}
                <div>
                  <p className="text-[10px] font-[family-name:var(--font-display)] tracking-widest uppercase text-[var(--ink-light)] mb-1.5 text-sm">
                    Primary Role
                  </p>
                  <p className="text-lg font-bold text-[var(--ink)]">
                    {selectedMeta.role}
                  </p>
                </div>

                {/* Skill Set */}
                <div>
                  <p className="text-[10px] font-[family-name:var(--font-display)] tracking-widest uppercase text-[var(--ink-light)] mb-1.5 text-sm">
                    Skill Set
                  </p>
                  <p className="text-sm text-[var(--ink-medium)] leading-relaxed font-bold">
                    {selectedMeta.skillSet}
                  </p>
                </div>

                {/* Team Synergies */}
                {selectedAgent.suggests &&
                  selectedAgent.suggests.agents.length > 0 && (
                    <div>
                      <p className="text-[10px] font-[family-name:var(--font-display)] tracking-widest uppercase text-[var(--ink-light)] mb-1 text-sm">
                        Team Synergies
                      </p>
                      <p className="text-[11px] text-[var(--ink-light)] mb-2">
                        Calls on these teammates
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.suggests.agents.map((agent) => {
                          const agentColor = getHeroColor(agent);
                          return (
                            <Link
                              key={agent}
                              href={`/agents/${agent}`}
                              className="border-2 border-[var(--ink)] px-3 py-1 text-xs font-bold transition-colors hover:text-white"
                              style={{
                                color: agentColor?.color ?? selectedMeta.color,
                                background: agentColor?.light ?? selectedMeta.colorLight,
                              }}
                            >
                              {agent}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Required Skills */}
                {selectedAgent.requires &&
                  (selectedAgent.requires.skills.length > 0 ||
                    selectedAgent.requires.agents.length > 0) && (
                    <div>
                      <p className="text-[10px] font-[family-name:var(--font-display)] tracking-widest uppercase text-[var(--ink-light)] mb-2 text-sm">
                        Dependencies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.requires.skills.map((skill) => (
                          <Link
                            key={skill}
                            href={`/skills/${skill}`}
                            className="border-2 border-[var(--ink)] px-3 py-1 text-xs font-bold transition-colors hover:bg-[var(--comic-blue)] hover:text-white"
                            style={{ color: selectedMeta.color }}
                          >
                            {skill}
                          </Link>
                        ))}
                        {selectedAgent.requires.agents.map((agent) => (
                          <Link
                            key={agent}
                            href={`/agents/${agent}`}
                            className="border-2 border-[var(--ink)] px-3 py-1 text-xs font-bold text-[var(--comic-red)] transition-colors hover:bg-[var(--comic-red)] hover:text-white"
                          >
                            {agent}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Features */}
                {selectedAgent.features &&
                  selectedAgent.features.length > 0 && (
                    <div>
                      <p className="text-[10px] font-[family-name:var(--font-display)] tracking-widest uppercase text-[var(--ink-light)] mb-2 text-sm">
                        Capabilities
                      </p>
                      <div className="flex gap-2">
                        {selectedAgent.features.map((feature) => (
                          <span
                            key={feature}
                            className="border-2 border-[var(--ink)] bg-[var(--paper)] px-2.5 py-1 text-[11px] font-mono font-bold text-[var(--ink-medium)]"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Right: Flavor + Actions */}
              <div className="space-y-5">
                {/* Flavor Text — Speech Bubble */}
                <div className="speech-bubble">
                  <p className="text-sm italic leading-relaxed text-[var(--ink-medium)] font-bold">
                    &ldquo;{selectedMeta.flavorText}&rdquo;
                  </p>
                </div>

                {/* Spacer for speech bubble tail */}
                <div className="h-2" />

                {/* Power Rating Stats */}
                <StatBar
                  stats={selectedMeta.stats}
                  color={selectedMeta.color}
                  colorLight={selectedMeta.colorLight}
                />

                {/* View Full Dossier */}
                <Link
                  href={`/agents/${selectedAgent.slug}`}
                  className="inline-flex items-center gap-2 border-3 px-5 py-2.5 font-[family-name:var(--font-display)] text-lg tracking-wider transition-all duration-200 hover:translate-x-0.5 hover:-translate-y-0.5"
                  style={{
                    border: `3px solid var(--ink)`,
                    color: selectedMeta.color,
                    boxShadow: `3px 3px 0 ${selectedMeta.color}`,
                  }}
                >
                  View Full Dossier
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
