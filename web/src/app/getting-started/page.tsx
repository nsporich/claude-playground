import type { Metadata } from "next";
import InstallCommand from "@/components/InstallCommand";

export const metadata: Metadata = {
  title: "Getting Started | Claude Playground",
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <h2 className="font-display text-2xl text-[var(--text-primary)]">
        {children}
      </h2>
      <div className="flex-1 h-px bg-[var(--border-subtle)]" />
    </div>
  );
}

function CodeTag({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-1.5 py-0.5 text-sm font-mono text-[var(--accent-text)]">
      {children}
    </code>
  );
}

export default function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-14 py-8">
      <header>
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-3">
          Documentation
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
          Getting Started
        </h1>
        <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
          Everything you need to start using Claude Playground.
        </p>
      </header>

      <section className="space-y-3">
        <SectionHeading>What is Claude Code</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Claude Code is Anthropic&apos;s CLI tool for working with Claude in
          your terminal and IDE. It can read and write files, run commands, and
          follow project-specific instructions. Claude Playground builds on top
          of Claude Code by giving you a curated library of reusable assets you
          can install with a single command.
        </p>
      </section>

      <section className="space-y-3">
        <SectionHeading>Skills</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Skills are <CodeTag>SKILL.md</CodeTag> files that teach Claude
          specific workflows. They live in{" "}
          <CodeTag>~/.claude/skills/</CodeTag> and are automatically available
          in all Claude Code sessions. Example use cases include code review, PR
          generation, and framework-specific guidance.
        </p>
      </section>

      <section className="space-y-3">
        <SectionHeading>Templates</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Templates are <CodeTag>CLAUDE.md</CodeTag> files you drop into a
          project root. They tell Claude about your project&apos;s conventions,
          structure, and preferred patterns. Think of them as onboarding docs for
          your AI pair programmer.
        </p>
      </section>

      <section className="space-y-3">
        <SectionHeading>Prompts</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Prompts are standalone instructions you paste into a Claude
          conversation to kick off a specific task. They&apos;re more ad-hoc
          than skills but produce consistent results for common tasks.
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading>Installing</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Run the following command to get started:
        </p>
        <InstallCommand command="curl -fsSL claude.sporich.dev/install.sh | bash" />
        <p className="text-[var(--text-secondary)] leading-relaxed">
          The installer clones the repo, presents a menu, and installs selected
          assets to the right locations on your machine.
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading>Where things go</SectionHeading>
        <ul className="space-y-3 text-[var(--text-secondary)]">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>
              <strong className="text-[var(--text-primary)]">Skills:</strong>{" "}
              <CodeTag>~/.claude/skills/&lt;name&gt;/SKILL.md</CodeTag>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>
              <strong className="text-[var(--text-primary)]">Templates:</strong>{" "}
              copied as <CodeTag>CLAUDE.md</CodeTag> in your project root.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>
              <strong className="text-[var(--text-primary)]">Prompts:</strong>{" "}
              copy-paste into a Claude conversation.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <SectionHeading>Contributing</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          To add a new asset:
        </p>
        <ol className="space-y-3 text-[var(--text-secondary)] list-none">
          {[
            <>
              Create a <CodeTag>.md</CodeTag> file in the right directory (
              <CodeTag>skills/</CodeTag>, <CodeTag>templates/</CodeTag>, or{" "}
              <CodeTag>prompts/</CodeTag>).
            </>,
            <>
              Add YAML frontmatter with <CodeTag>name</CodeTag>,{" "}
              <CodeTag>description</CodeTag>, and <CodeTag>tags</CodeTag>.
            </>,
            <>Submit a PR.</>,
          ].map((content, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[10px] font-bold text-[var(--accent)] mt-0.5">
                {i + 1}
              </span>
              <span>{content}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
