import type { Metadata } from "next";
import InstallCommand from "@/components/InstallCommand";

export const metadata: Metadata = {
  title: "Mission Briefing | Agents Assemble",
};

function SectionHeading({
  children,
  color = "var(--comic-red)",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-[3px] flex-1 bg-[var(--ink)] opacity-10" />
      <h2
        className="font-[family-name:var(--font-display)] text-2xl tracking-widest"
        style={{ color }}
      >
        {children}
      </h2>
      <div className="flex-1 h-[3px] bg-[var(--ink)] opacity-10" />
    </div>
  );
}

function CodeTag({ children }: { children: React.ReactNode }) {
  return (
    <code className="border-[1.5px] border-[var(--ink)] bg-[var(--comic-yellow-light)] px-1.5 py-0.5 text-sm font-mono font-bold text-[var(--ink)]">
      {children}
    </code>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-[var(--ink)] bg-[var(--comic-red)] text-white font-[family-name:var(--font-display)] text-sm tracking-wider"
      style={{ boxShadow: "2px 2px 0 var(--ink)" }}
    >
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
    <div
      className="bg-[var(--panel-bg)] p-6"
      style={{
        border: "3px solid var(--ink)",
        boxShadow: "4px 4px 0 var(--ink)",
      }}
    >
      <div
        className="mb-4 flex h-10 w-10 items-center justify-center border-2 border-[var(--ink)]"
        style={{ background: `${iconColor}20` }}
      >
        {icon}
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-xl tracking-widest text-[var(--ink)] mb-2">
        {title.toUpperCase()}
      </h3>
      <div className="text-sm text-[var(--ink-medium)] leading-relaxed space-y-3 font-bold">
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
        <div className="inline-block caption-box mb-5">
          <span className="text-sm not-italic tracking-widest font-bold">
            MISSION BRIEFING
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl text-[var(--ink)] tracking-widest comic-text-3d">
          GETTING STARTED
        </h1>
        <p className="mt-4 text-lg text-[var(--ink-medium)] leading-relaxed font-bold">
          Everything you need to deploy the team and start running operations.
        </p>
      </header>

      {/* Prerequisites */}
      <section className="space-y-4">
        <SectionHeading>PREREQUISITES</SectionHeading>
        <p className="text-[var(--ink-medium)] leading-relaxed font-bold">
          Before deploying agents, you need{" "}
          <strong className="text-[var(--ink)]">Claude Code</strong> installed
          on your machine.
        </p>

        <div
          className="bg-[var(--panel-bg)] p-6 space-y-4"
          style={{
            border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
          }}
        >
          <div className="flex items-start gap-3">
            <StepNumber n={1} />
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                Install Claude Code
              </p>
              <p className="text-sm text-[var(--ink-light)] mt-1 font-bold">
                Follow the{" "}
                <a
                  href="https://docs.anthropic.com/en/docs/claude-code/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--comic-blue)] border-b-2 border-[var(--comic-blue)] hover:text-[var(--comic-red)] hover:border-[var(--comic-red)] transition-colors"
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
              <p className="text-sm font-bold text-[var(--ink)]">
                Verify it works
              </p>
              <p className="text-sm text-[var(--ink-light)] mt-1 font-bold">
                Open your terminal and run <CodeTag>claude --version</CodeTag>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={3} />
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                Have git installed
              </p>
              <p className="text-sm text-[var(--ink-light)] mt-1 font-bold">
                The installer uses git to fetch assets. Run{" "}
                <CodeTag>git --version</CodeTag> to confirm it&apos;s available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Agents Assemble */}
      <section className="space-y-4">
        <SectionHeading>WHAT IS AGENTS ASSEMBLE</SectionHeading>
        <p className="text-[var(--ink-medium)] leading-relaxed font-bold">
          Claude Code is Anthropic&apos;s CLI for working with Claude in your
          terminal and IDE. It reads files, runs commands, and follows
          project-specific instructions&mdash;but it&apos;s only as good as the
          context you give it.
        </p>
        <p className="text-[var(--ink-medium)] leading-relaxed font-bold">
          <strong className="text-[var(--ink)]">Agents Assemble</strong> gives
          Claude Code a team of specialized agents. Each agent is an opinionated
          persona that orchestrates skills into end-to-end workflows&mdash;code
          review, debugging, feature development&mdash;delivering structured,
          repeatable results instead of ad-hoc prompting.
        </p>
      </section>

      {/* Two Asset Types */}
      <section className="space-y-6">
        <SectionHeading>ASSET TYPES</SectionHeading>
        <p className="text-[var(--ink-medium)] leading-relaxed font-bold">
          Two types. Agents are the operators. Skills are their equipment.
        </p>

        <div className="space-y-5">
          {/* Agents */}
          <InfoCard
            iconColor="var(--comic-red)"
            icon={
              <svg
                className="h-5 w-5"
                style={{ color: "var(--comic-red)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
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
              <strong className="text-[var(--ink)]">
                automatically resolves and installs all required skills
              </strong>
              . Agents can leverage worktrees for isolation and subagents for
              parallel work.
            </p>
            <div
              className="p-4 font-mono text-xs text-[var(--ink-medium)] bg-[var(--paper)]"
              style={{ border: "2px solid var(--ink)" }}
            >
              <div className="text-[var(--ink-faded)]">~/.claude/skills/</div>
              <div className="ml-4">
                <span className="text-[var(--comic-red)]">ironclad/</span>
                <span className="text-[var(--ink-faded)]"> AGENT.md</span>
              </div>
              <div className="ml-4">
                <span className="text-[var(--comic-red)]">aegis/</span>
                <span className="text-[var(--ink-faded)]"> AGENT.md</span>
              </div>
              <div className="ml-4">
                <span className="text-[var(--comic-red)]">deadeye/</span>
                <span className="text-[var(--ink-faded)]"> AGENT.md</span>
              </div>
            </div>
          </InfoCard>

          {/* Skills */}
          <InfoCard
            iconColor="var(--comic-blue)"
            icon={
              <svg
                className="h-5 w-5"
                style={{ color: "var(--comic-blue)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            }
            title="Skills"
          >
            <p>
              Skills are <CodeTag>SKILL.md</CodeTag> files that teach Claude
              specific workflows. They live in{" "}
              <CodeTag>~/.claude/skills/</CodeTag> and are{" "}
              <strong className="text-[var(--ink)]">
                available in every Claude Code session
              </strong>
              .
            </p>
            <p>
              Skills define structured processes like severity-rated code
              reviews, TDD workflows, or planning sessions. Agents compose these
              skills into larger operations.
            </p>
            <div
              className="p-4 font-mono text-xs text-[var(--ink-medium)] bg-[var(--paper)]"
              style={{ border: "2px solid var(--ink)" }}
            >
              <div className="text-[var(--ink-faded)]">~/.claude/skills/</div>
              <div className="ml-4">
                <span className="text-[var(--comic-blue)]">code-review/</span>
                <span className="text-[var(--ink-faded)]"> SKILL.md</span>
              </div>
              <div className="ml-4">
                <span className="text-[var(--comic-blue)]">tdd/</span>
                <span className="text-[var(--ink-faded)]"> SKILL.md</span>
              </div>
              <div className="ml-4">
                <span className="text-[var(--comic-blue)]">planning/</span>
                <span className="text-[var(--ink-faded)]"> SKILL.md</span>
              </div>
            </div>
          </InfoCard>
        </div>
      </section>

      {/* Installing */}
      <section className="space-y-6">
        <SectionHeading>DEPLOYMENT</SectionHeading>
        <p className="text-[var(--ink-medium)] leading-relaxed font-bold">
          One command. Pick your agents. The installer handles dependency
          resolution.
        </p>

        <InstallCommand command="curl -fsSL assemble.sporich.dev/install.sh | bash" />

        <div
          className="bg-[var(--panel-bg)] p-6 space-y-5"
          style={{
            border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
          }}
        >
          <h3 className="font-[family-name:var(--font-display)] tracking-widest uppercase text-[var(--ink-light)] text-sm">
            Deployment Sequence
          </h3>

          <div className="flex items-start gap-3">
            <StepNumber n={1} />
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                Cache the repository
              </p>
              <p className="text-sm text-[var(--ink-light)] mt-1 font-bold">
                Fetches the latest assets from GitHub into{" "}
                <CodeTag>~/.agents-assemble</CodeTag>. Subsequent runs pull
                updates automatically.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={2} />
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                Select your team
              </p>
              <p className="text-sm text-[var(--ink-light)] mt-1 font-bold">
                You&apos;ll see a numbered list of all agents and skills. Enter
                the numbers of the ones you want, or type{" "}
                <CodeTag>all</CodeTag> to deploy everything.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={3} />
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                Resolve dependencies and install
              </p>
              <p className="text-sm text-[var(--ink-light)] mt-1 font-bold">
                Assets are symlinked to <CodeTag>~/.claude/skills/</CodeTag>.
                Agent dependencies are automatically resolved and installed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={4} />
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                Deployment summary
              </p>
              <p className="text-sm text-[var(--ink-light)] mt-1 font-bold">
                See exactly what was installed and where it went.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Try it out */}
      <section className="space-y-4">
        <SectionHeading>FIRST MISSION</SectionHeading>
        <p className="text-[var(--ink-medium)] leading-relaxed font-bold">
          The{" "}
          <strong className="text-[var(--ink)]">Director</strong> agent is
          always installed and acts as your single entry point. Just describe
          what you need&mdash;Director figures out which agent to deploy.
        </p>

        <div
          className="bg-[var(--panel-bg)] p-6 space-y-5"
          style={{
            border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
          }}
        >
          <div className="flex items-start gap-3">
            <StepNumber n={1} />
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                Install the team
              </p>
              <p className="text-sm text-[var(--ink-light)] mt-1 font-bold">
                Pick any agents you want. Director is always included
                automatically.
              </p>
              <div
                className="mt-2 p-3 font-mono text-xs text-[var(--ink-light)] bg-[var(--paper)]"
                style={{ border: "2px solid var(--ink)" }}
              >
                <span className="text-[var(--comic-red)] font-bold">$</span>{" "}
                curl -fsSL assemble.sporich.dev/install.sh | bash
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={2} />
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                Open Claude Code in any project
              </p>
              <div
                className="mt-2 p-3 font-mono text-xs text-[var(--ink-light)] bg-[var(--paper)]"
                style={{ border: "2px solid var(--ink)" }}
              >
                <span className="text-[var(--comic-red)] font-bold">$</span> cd
                your-project && claude
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={3} />
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                Invoke Director
              </p>
              <p className="text-sm text-[var(--ink-light)] mt-1 font-bold">
                Type <CodeTag>/director</CodeTag> followed by what you need in
                plain language. No need to memorize agent names.
              </p>
              <div
                className="mt-2 p-3 font-mono text-xs text-[var(--ink-light)] bg-[var(--paper)] space-y-2"
                style={{ border: "2px solid var(--ink)" }}
              >
                <div>
                  <span className="text-[var(--comic-blue)] font-bold">you:</span>{" "}
                  /director review the auth module for security issues
                </div>
                <div>
                  <span className="text-[var(--comic-red)] font-bold">director:</span>{" "}
                  Deploying <strong>Aegis</strong> &mdash; code review specialist
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={4} />
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                Agent runs its workflow
              </p>
              <p className="text-sm text-[var(--ink-light)] mt-1 font-bold">
                The deployed agent takes full control&mdash;running its
                end-to-end workflow with severity ratings, file references, and
                actionable suggestions. When done, Director offers follow-up
                recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where things go */}
      <section className="space-y-4">
        <SectionHeading>FILE LOCATIONS</SectionHeading>
        <p className="text-[var(--ink-medium)] leading-relaxed mb-2 font-bold">
          Where each asset type deploys on your system.
        </p>

        <div
          className="overflow-hidden"
          style={{
            border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--comic-yellow-light)]">
                <th className="px-5 py-3 text-left font-[family-name:var(--font-display)] tracking-widest text-[var(--ink)] text-sm border-b-3 border-[var(--ink)]">
                  Type
                </th>
                <th className="px-5 py-3 text-left font-[family-name:var(--font-display)] tracking-widest text-[var(--ink)] text-sm border-b-3 border-[var(--ink)]">
                  Location
                </th>
                <th className="px-5 py-3 text-left font-[family-name:var(--font-display)] tracking-widest text-[var(--ink)] text-sm border-b-3 border-[var(--ink)]">
                  Scope
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[var(--ink)]/10">
              <tr className="bg-[var(--panel-bg)]">
                <td className="px-5 py-3 font-[family-name:var(--font-display)] tracking-wider text-[var(--comic-red)]">
                  AGENTS
                </td>
                <td className="px-5 py-3 font-mono text-xs text-[var(--comic-blue)] font-bold">
                  ~/.claude/skills/&lt;name&gt;/AGENT.md
                </td>
                <td className="px-5 py-3 text-[var(--ink-light)] font-bold">
                  Global &mdash; all sessions
                </td>
              </tr>
              <tr className="bg-[var(--panel-bg)]">
                <td className="px-5 py-3 font-[family-name:var(--font-display)] tracking-wider text-[var(--comic-blue)]">
                  SKILLS
                </td>
                <td className="px-5 py-3 font-mono text-xs text-[var(--comic-blue)] font-bold">
                  ~/.claude/skills/&lt;name&gt;/SKILL.md
                </td>
                <td className="px-5 py-3 text-[var(--ink-light)] font-bold">
                  Global &mdash; all sessions
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
