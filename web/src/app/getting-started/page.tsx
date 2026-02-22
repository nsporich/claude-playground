import type { Metadata } from "next";
import InstallCommand from "@/components/InstallCommand";

export const metadata: Metadata = {
  title: "Mission Briefing | Agents Assemble",
};

function SectionHeading({ children, color = "var(--accent-text)" }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border-subtle)]" />
      <h2
        className="font-[family-name:var(--font-display)] text-2xl tracking-[0.12em]"
        style={{ color }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px bg-[var(--border-subtle)]" />
    </div>
  );
}

function CodeTag({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-1.5 py-0.5 text-sm font-mono text-[var(--cyan-text)]">
      {children}
    </code>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/30 text-[11px] font-bold text-[var(--accent)] font-[family-name:var(--font-display)] tracking-wider">
      {n}
    </span>
  );
}

function InfoCard({
  icon,
  iconColor,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border-2 border-[var(--border-default)] bg-[var(--bg-surface)] p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${iconColor}15` }}>
        {icon}
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-xl tracking-[0.08em] text-[var(--text-primary)] mb-2">
        {title.toUpperCase()}
      </h3>
      <div className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

export default function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-16 py-8">
      {/* Header */}
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-1.5 mb-5">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--accent-text)] font-medium">
            Mission Briefing
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl text-[var(--text-primary)] tracking-[0.06em]">
          GETTING STARTED
        </h1>
        <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
          Everything you need to deploy the team and start running operations.
        </p>
      </header>

      {/* Prerequisites */}
      <section className="space-y-4">
        <SectionHeading>PREREQUISITES</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Before deploying agents, you need{" "}
          <strong className="text-[var(--text-primary)]">Claude Code</strong>{" "}
          installed on your machine.
        </p>

        <div className="rounded-xl border-2 border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-4">
          <div className="flex items-start gap-3">
            <StepNumber n={1} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Install Claude Code
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Follow the{" "}
                <a
                  href="https://docs.anthropic.com/en/docs/claude-code/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--cyan-text)] border-b border-[var(--cyan)]/30 hover:border-[var(--cyan)] transition-colors"
                >
                  official installation guide
                </a>{" "}
                from Anthropic. Claude Code works on macOS and Linux.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={2} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Verify it works
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Open your terminal and run <CodeTag>claude --version</CodeTag>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={3} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Have git installed
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                The installer uses git to fetch assets. Run{" "}
                <CodeTag>git --version</CodeTag> to confirm it&apos;s available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Claude Playground */}
      <section className="space-y-4">
        <SectionHeading>WHAT IS AGENTS ASSEMBLE</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Claude Code is Anthropic&apos;s CLI for working with Claude in your
          terminal and IDE. It reads files, runs commands, and follows
          project-specific instructions&mdash;but it&apos;s only as good as
          the context you give it.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-[var(--text-primary)]">Agents Assemble</strong>{" "}
          gives Claude Code a team of specialized agents. Each agent is an opinionated
          persona that orchestrates skills into end-to-end workflows&mdash;code review,
          debugging, feature development&mdash;delivering structured, repeatable
          results instead of ad-hoc prompting.
        </p>
      </section>

      {/* Two Asset Types */}
      <section className="space-y-6">
        <SectionHeading>ASSET TYPES</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Two types. Agents are the operators. Skills are their equipment.
        </p>

        <div className="space-y-5">
          {/* Agents */}
          <InfoCard
            iconColor="var(--accent)"
            icon={
              <svg className="h-5 w-5" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            }
            title="Agents"
          >
            <p>
              Agents are <CodeTag>AGENT.md</CodeTag> files that define
              opinionated personas. Each agent has a specialty&mdash;Aegis for
              code review, Deadeye for debugging, Ironclad for feature
              development&mdash;and knows exactly which skills to deploy.
            </p>
            <p>
              When you install an agent, the installer{" "}
              <strong className="text-[var(--text-primary)]">
                automatically resolves and installs all required skills
              </strong>.
              Agents can leverage worktrees for isolation and subagents for
              parallel work.
            </p>
            <div className="rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] p-4 font-mono text-xs text-[var(--text-muted)]">
              <div className="text-[var(--text-muted)]/60">~/.claude/skills/</div>
              <div className="ml-4">
                <span className="text-[var(--accent-text)]">ironclad/</span>
                <span className="text-[var(--text-muted)]/40"> AGENT.md</span>
              </div>
              <div className="ml-4">
                <span className="text-[var(--accent-text)]">aegis/</span>
                <span className="text-[var(--text-muted)]/40"> AGENT.md</span>
              </div>
              <div className="ml-4">
                <span className="text-[var(--accent-text)]">deadeye/</span>
                <span className="text-[var(--text-muted)]/40"> AGENT.md</span>
              </div>
            </div>
          </InfoCard>

          {/* Skills */}
          <InfoCard
            iconColor="var(--cyan)"
            icon={
              <svg className="h-5 w-5" style={{ color: "var(--cyan)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
            }
            title="Skills"
          >
            <p>
              Skills are <CodeTag>SKILL.md</CodeTag> files that teach Claude
              specific workflows. They live in{" "}
              <CodeTag>~/.claude/skills/</CodeTag> and are{" "}
              <strong className="text-[var(--text-primary)]">
                available in every Claude Code session
              </strong>.
            </p>
            <p>
              Skills define structured processes like severity-rated code
              reviews, TDD workflows, or planning sessions. Agents compose
              these skills into larger operations.
            </p>
            <div className="rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] p-4 font-mono text-xs text-[var(--text-muted)]">
              <div className="text-[var(--text-muted)]/60">~/.claude/skills/</div>
              <div className="ml-4">
                <span className="text-[var(--cyan-text)]">code-review/</span>
                <span className="text-[var(--text-muted)]/40"> SKILL.md</span>
              </div>
              <div className="ml-4">
                <span className="text-[var(--cyan-text)]">tdd/</span>
                <span className="text-[var(--text-muted)]/40"> SKILL.md</span>
              </div>
              <div className="ml-4">
                <span className="text-[var(--cyan-text)]">planning/</span>
                <span className="text-[var(--text-muted)]/40"> SKILL.md</span>
              </div>
            </div>
          </InfoCard>
        </div>
      </section>

      {/* Installing */}
      <section className="space-y-6">
        <SectionHeading>DEPLOYMENT</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          One command. Pick your agents. The installer handles dependency resolution.
        </p>

        <InstallCommand command="curl -fsSL claude.sporich.dev/install.sh | bash" />

        <div className="rounded-xl border-2 border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-5">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
            Deployment Sequence
          </h3>

          <div className="flex items-start gap-3">
            <StepNumber n={1} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Cache the repository
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Fetches the latest assets from GitHub into{" "}
                <CodeTag>~/.claude-playground</CodeTag>. Subsequent runs pull
                updates automatically.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={2} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Select your team
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                You&apos;ll see a numbered list of all agents and skills.
                Enter the numbers of the ones you want, or type{" "}
                <CodeTag>all</CodeTag> to deploy everything.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={3} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Resolve dependencies and install
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Assets are symlinked to <CodeTag>~/.claude/skills/</CodeTag>.
                Agent dependencies are automatically resolved and installed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={4} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Deployment summary
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                See exactly what was installed and where it went.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Try it out */}
      <section className="space-y-4">
        <SectionHeading>FIRST MISSION</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Deploy{" "}
          <strong className="text-[var(--text-primary)]">Aegis</strong>{" "}
          and run your first code review operation.
        </p>

        <div className="rounded-xl border-2 border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-5">
          <div className="flex items-start gap-3">
            <StepNumber n={1} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Deploy the Aegis agent
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                The installer automatically pulls in the code-review skill
                that Aegis requires.
              </p>
              <div className="mt-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] p-3 font-mono text-xs text-[var(--text-muted)]">
                <span className="text-[var(--accent)]">$</span> curl -fsSL claude.sporich.dev/install.sh | bash
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={2} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Open Claude Code in any project
              </p>
              <div className="mt-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] p-3 font-mono text-xs text-[var(--text-muted)]">
                <span className="text-[var(--accent)]">$</span> cd your-project && claude
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={3} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Initiate review
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Aegis will run a multi-layered code review with severity
                ratings, file references, and actionable suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where things go */}
      <section className="space-y-4">
        <SectionHeading>FILE LOCATIONS</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
          Where each asset type deploys on your system.
        </p>

        <div className="overflow-hidden rounded-xl border-2 border-[var(--border-default)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-elevated)]">
                <th className="px-5 py-3 text-left text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
                  Location
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
                  Scope
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              <tr className="bg-[var(--bg-surface)]">
                <td className="px-5 py-3 font-[family-name:var(--font-display)] tracking-[0.08em] text-[var(--accent-text)]">AGENTS</td>
                <td className="px-5 py-3 font-mono text-xs text-[var(--cyan-text)]">
                  ~/.claude/skills/&lt;name&gt;/AGENT.md
                </td>
                <td className="px-5 py-3 text-[var(--text-muted)]">Global &mdash; all sessions</td>
              </tr>
              <tr className="bg-[var(--bg-surface)]">
                <td className="px-5 py-3 font-[family-name:var(--font-display)] tracking-[0.08em] text-[var(--cyan-text)]">SKILLS</td>
                <td className="px-5 py-3 font-mono text-xs text-[var(--cyan-text)]">
                  ~/.claude/skills/&lt;name&gt;/SKILL.md
                </td>
                <td className="px-5 py-3 text-[var(--text-muted)]">Global &mdash; all sessions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Contributing */}
      <section className="space-y-4">
        <SectionHeading>CONTRIBUTING</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Want to add your own agent or skill? Here&apos;s the process:
        </p>
        <ol className="space-y-3 text-[var(--text-secondary)] list-none">
          {[
            <>
              Create a <CodeTag>.md</CodeTag> file in the right directory (
              <CodeTag>agents/&lt;name&gt;/AGENT.md</CodeTag> or{" "}
              <CodeTag>skills/&lt;group&gt;/&lt;name&gt;/SKILL.md</CodeTag>).
            </>,
            <>
              Add YAML frontmatter with <CodeTag>name</CodeTag>,{" "}
              <CodeTag>description</CodeTag>, and <CodeTag>tags</CodeTag>.
              Agents also need <CodeTag>requires</CodeTag> and{" "}
              <CodeTag>features</CodeTag>.
            </>,
            <>
              Run <CodeTag>bash scripts/build-catalog.sh</CodeTag> to
              regenerate the catalog.
            </>,
            <>
              Submit a PR to the{" "}
              <a
                href="https://github.com/nsporich/claude-playground"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--cyan-text)] border-b border-[var(--cyan)]/30 hover:border-[var(--cyan)] transition-colors"
              >
                GitHub repo
              </a>.
            </>,
          ].map((content, i) => (
            <li key={i} className="flex items-start gap-3">
              <StepNumber n={i + 1} />
              <span className="text-sm">{content}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
