"use client";

import { useState } from "react";
import Link from "next/link";
import type { CatalogAsset } from "@/lib/types";
import InstallCommand from "./InstallCommand";

interface HeroMeta {
  title: string;
  role: string;
  skillSet: string;
  synergy?: string;
  flavorText: string;
  color: string;
  colorDim: string;
  colorGlow: string;
}

const HERO_META: Record<string, HeroMeta> = {
  ironclad: {
    title: "The Heavy Hitter",
    role: "Feature Development",
    skillSet: "Master of Planning, TDD, and Feature-Implementation.",
    synergy: "Automatically calls in Aegis for final code verification.",
    flavorText:
      "If you can dream the blueprint, Ironclad can forge the fortress. He doesn\u2019t just write code; he constructs reality.",
    color: "#ef4444",
    colorDim: "#991b1b",
    colorGlow: "rgba(239, 68, 68, 0.2)",
  },
  deadeye: {
    title: "The Marksman",
    role: "Elite Bug Hunting",
    skillSet: "Precision Bug-Diagnosis, TDD, and Code-Review.",
    flavorText:
      "Deadeye never misses. While others guess at the cause, he\u2019s already neutralized the target from ten thousand lines away.",
    color: "#a855f7",
    colorDim: "#581c87",
    colorGlow: "rgba(168, 85, 247, 0.2)",
  },
  aegis: {
    title: "The Sentinel",
    role: "Code Review Specialist",
    skillSet: "Pure, unyielding Code-Review.",
    flavorText:
      "The final line of defense. If a single semicolon is out of place, the shield stays up. Nothing enters the master branch without Aegis\u2019s seal.",
    color: "#3b82f6",
    colorDim: "#1e3a5f",
    colorGlow: "rgba(59, 130, 246, 0.2)",
  },
  titan: {
    title: "The Colossus",
    role: "Optimization Specialist",
    skillSet: "Performance Optimization and Code-Review.",
    flavorText:
      "Built for the heavy lifting. When the system groans under the weight of technical debt, Titan pulls the load until it\u2019s lean and lethal.",
    color: "#10b981",
    colorDim: "#064e3b",
    colorGlow: "rgba(16, 185, 129, 0.2)",
  },
  lorekeeper: {
    title: "The Archivist",
    role: "Master of Documentation",
    skillSet: "Comprehensive Documentation orchestration.",
    flavorText:
      "The guardian of the sacred texts. Lorekeeper ensures that the \u2018how\u2019 and \u2018why\u2019 of your mission are never lost to time.",
    color: "#f59e0b",
    colorDim: "#92400e",
    colorGlow: "rgba(245, 158, 11, 0.2)",
  },
  oracle: {
    title: "The All-Seeing",
    role: "Codebase Onboarding",
    skillSet: "Operates via specialized Built-in Subagents.",
    flavorText:
      "Oracle doesn\u2019t read your code; she understands it. She maps the dark corners of legacy repos so the rest of the team can strike with certainty.",
    color: "#06b6d4",
    colorDim: "#164e63",
    colorGlow: "rgba(6, 182, 212, 0.2)",
  },
};

/* Simple SVG icons for each hero */
function HeroIcon({ slug, color }: { slug: string; color: string }) {
  const props = {
    className: "h-8 w-8 sm:h-10 sm:w-10",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: color,
    strokeWidth: 1.5,
  };

  switch (slug) {
    case "ironclad":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      );
    case "oracle":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "lorekeeper":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case "titan":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {agents.map((agent, i) => {
          const meta = HERO_META[agent.slug];
          if (!meta) return null;
          const isSelected = selectedSlug === agent.slug;

          return (
            <button
              key={agent.slug}
              onClick={() => handleSelect(agent.slug)}
              className={`animate-fade-up group relative rounded-xl border-2 p-4 sm:p-5 text-center transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-[var(--bg-elevated)] scale-[1.02]"
                  : "bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] hover:-translate-y-1"
              }`}
              style={{
                borderColor: isSelected ? meta.color : "rgba(255,255,255,0.06)",
                boxShadow: isSelected
                  ? `0 0 30px ${meta.colorGlow}, inset 0 1px 0 ${meta.colorGlow}`
                  : "none",
                animationDelay: `${0.1 + i * 0.08}s`,
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-2 right-2 h-[2px] rounded-b-full transition-opacity duration-300"
                style={{
                  background: meta.color,
                  opacity: isSelected ? 1 : 0.3,
                }}
              />

              {/* Icon */}
              <div className="mx-auto mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl transition-all duration-300"
                style={{
                  background: isSelected ? `${meta.color}15` : `${meta.color}08`,
                }}
              >
                <HeroIcon slug={agent.slug} color={meta.color} />
              </div>

              {/* Name */}
              <h3
                className="font-[family-name:var(--font-display)] text-lg sm:text-xl tracking-[0.1em] transition-colors duration-300"
                style={{ color: isSelected ? meta.color : "var(--text-primary)" }}
              >
                {agent.name.toUpperCase()}
              </h3>

              {/* Title */}
              <p className="mt-0.5 text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[var(--text-muted)]">
                {meta.title}
              </p>

              {/* Selection indicator */}
              {isSelected && (
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full"
                  style={{ background: meta.color }}
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
          className="dossier-enter mt-6 rounded-2xl border-2 overflow-hidden"
          style={{
            borderColor: `${selectedMeta.color}40`,
            background: `linear-gradient(135deg, var(--bg-surface), ${selectedMeta.color}05)`,
          }}
        >
          {/* Dossier Header */}
          <div
            className="relative px-6 sm:px-8 py-5 border-b scan-lines"
            style={{
              borderColor: `${selectedMeta.color}20`,
              background: `linear-gradient(90deg, ${selectedMeta.color}10, transparent)`,
            }}
          >
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <HeroIcon slug={selectedAgent.slug} color={selectedMeta.color} />
                <div>
                  <h3
                    className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl tracking-[0.08em]"
                    style={{ color: selectedMeta.color }}
                  >
                    {selectedAgent.name.toUpperCase()}
                  </h3>
                  <p className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
                    // {selectedMeta.title}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)] mb-1">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full animate-pulse-glow"
                    style={{
                      background: selectedMeta.color,
                      ["--pulse-color" as string]: selectedMeta.colorGlow,
                    }}
                  />
                  <span className="text-xs font-medium" style={{ color: selectedMeta.color }}>
                    READY
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dossier Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Left: Intel */}
              <div className="space-y-5">
                {/* Role */}
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">
                    Primary Role
                  </p>
                  <p className="text-base font-semibold text-[var(--text-primary)]">
                    {selectedMeta.role}
                  </p>
                </div>

                {/* Skill Set */}
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">
                    Skill Set
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {selectedMeta.skillSet}
                  </p>
                </div>

                {/* Synergy */}
                {selectedMeta.synergy && (
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">
                      Synergy
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {selectedMeta.synergy}
                    </p>
                  </div>
                )}

                {/* Required Skills */}
                {selectedAgent.requires && (selectedAgent.requires.skills.length > 0 || selectedAgent.requires.agents.length > 0) && (
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">
                      Dependencies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.requires.skills.map((skill) => (
                        <Link
                          key={skill}
                          href={`/skills/${skill}`}
                          className="rounded-lg border px-3 py-1 text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
                          style={{
                            borderColor: `${selectedMeta.color}30`,
                            color: selectedMeta.color,
                          }}
                        >
                          {skill}
                        </Link>
                      ))}
                      {selectedAgent.requires.agents.map((agent) => (
                        <Link
                          key={agent}
                          href={`/agents/${agent}`}
                          className="rounded-lg border border-[var(--accent)]/30 px-3 py-1 text-xs font-medium text-[var(--accent-text)] transition-colors hover:bg-[var(--bg-hover)]"
                        >
                          {agent}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {selectedAgent.features && selectedAgent.features.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">
                      Capabilities
                    </p>
                    <div className="flex gap-2">
                      {selectedAgent.features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-2.5 py-1 text-[11px] font-mono text-[var(--text-secondary)]"
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
                {/* Flavor Text */}
                <div
                  className="rounded-xl p-5 border"
                  style={{
                    borderColor: `${selectedMeta.color}15`,
                    background: `${selectedMeta.color}05`,
                  }}
                >
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-muted)] mb-3">
                    Intel Brief
                  </p>
                  <p
                    className="text-sm italic leading-relaxed"
                    style={{ color: `${selectedMeta.color}cc` }}
                  >
                    &ldquo;{selectedMeta.flavorText}&rdquo;
                  </p>
                </div>

                {/* Loadout / Install */}
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">
                    Deploy {selectedAgent.name.toUpperCase()}
                  </p>
                  <InstallCommand command="curl -fsSL claude.sporich.dev/install.sh | bash" />
                </div>

                {/* View Full Dossier */}
                <Link
                  href={`/agents/${selectedAgent.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:shadow-lg"
                  style={{
                    borderColor: selectedMeta.color,
                    color: selectedMeta.color,
                    ["--tw-shadow-color" as string]: selectedMeta.colorGlow,
                  }}
                >
                  View Full Dossier
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
