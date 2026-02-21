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

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[11px] font-bold text-[var(--accent)]">
      {n}
    </span>
  );
}

function InfoCard({
  icon,
  iconBg,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
        {title}
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
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-3">
          Documentation
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
          Getting Started
        </h1>
        <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
          A complete guide to installing and using Claude Playground assets in your workflow.
        </p>
      </header>

      {/* Prerequisites */}
      <section className="space-y-4">
        <SectionHeading>Prerequisites</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Before using Claude Playground, you need{" "}
          <strong className="text-[var(--text-primary)]">Claude Code</strong>{" "}
          installed on your machine.
        </p>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4">
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
                  className="text-[var(--accent-text)] border-b border-[var(--accent-text)]/30 hover:border-[var(--accent-text)] transition-colors"
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
                You should see the version number printed.
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
        <SectionHeading>What is Claude Playground</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Claude Code is Anthropic&apos;s CLI for working with Claude in your
          terminal and IDE. It reads files, runs commands, and follows
          project-specific instructions&mdash;but it&apos;s only as useful as
          the context you give it.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-[var(--text-primary)]">Claude Playground</strong>{" "}
          is a curated library of pre-built assets that give Claude Code instant
          context: coding workflows, project conventions, and task-specific
          instructions. Instead of writing everything from scratch, install what
          you need and start working.
        </p>
      </section>

      {/* The Three Asset Types */}
      <section className="space-y-6">
        <SectionHeading>The three asset types</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Every asset in Claude Playground is one of three types. Each serves a
          different purpose and installs to a different location.
        </p>

        <div className="space-y-5">
          {/* Skills */}
          <InfoCard
            iconBg="bg-amber-500/10"
            icon={
              <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                automatically available in every Claude Code session
              </strong>,
              regardless of which project you&apos;re in.
            </p>
            <p>
              When you invoke a skill (e.g., type <CodeTag>/review</CodeTag> in
              Claude Code), Claude reads the SKILL.md file and follows its
              instructions. Skills can define structured processes like
              severity-rated code reviews, PR description templates, or
              step-by-step framework migrations.
            </p>
            <div className="rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] p-4 font-mono text-xs text-[var(--text-muted)]">
              <div className="text-[var(--text-muted)]/60">~/.claude/skills/</div>
              <div className="ml-4">
                <span className="text-amber-400">code-review/</span>
                <span className="text-[var(--text-muted)]/40"> SKILL.md</span>
              </div>
              <div className="ml-4">
                <span className="text-amber-400">pr-description/</span>
                <span className="text-[var(--text-muted)]/40"> SKILL.md</span>
              </div>
              <div className="ml-4">
                <span className="text-amber-400">angular-upgrade/</span>
                <span className="text-[var(--text-muted)]/40"> SKILL.md</span>
              </div>
            </div>
          </InfoCard>

          {/* Templates */}
          <InfoCard
            iconBg="bg-emerald-500/10"
            icon={
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            }
            title="Templates"
          >
            <p>
              Templates are <CodeTag>CLAUDE.md</CodeTag> files you drop into a
              project root. When Claude Code starts a session, it reads
              CLAUDE.md and treats it as project-level context&mdash;your
              conventions, directory structure, testing patterns, and preferred
              approaches.
            </p>
            <p>
              Think of templates as{" "}
              <strong className="text-[var(--text-primary)]">
                onboarding docs for your AI pair programmer
              </strong>.
              A good CLAUDE.md means Claude immediately knows how your project
              is organized, which frameworks you use, and how you prefer things
              done. Use a template as a starting point and customize it for your project.
            </p>
            <div className="rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] p-4 font-mono text-xs text-[var(--text-muted)]">
              <div className="text-[var(--text-muted)]/60">your-project/</div>
              <div className="ml-4">
                <span className="text-emerald-400">CLAUDE.md</span>
                <span className="text-[var(--text-muted)]/40"> &larr; installed here</span>
              </div>
              <div className="ml-4 text-[var(--text-muted)]/40">src/</div>
              <div className="ml-4 text-[var(--text-muted)]/40">package.json</div>
            </div>
          </InfoCard>

          {/* Prompts */}
          <InfoCard
            iconBg="bg-violet-500/10"
            icon={
              <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            }
            title="Prompts"
          >
            <p>
              Prompts are standalone instructions you paste directly into a
              Claude conversation. Unlike skills (which are persistent and
              automatic), prompts are{" "}
              <strong className="text-[var(--text-primary)]">
                one-shot and on-demand
              </strong>.
              Use them when you want consistent results for a specific task
              without installing anything permanently.
            </p>
            <p>
              Prompts are great for tasks you do occasionally: setting up
              Storybook in a new project, configuring browser testing, or
              getting a structured codebase tour. Copy the prompt, paste it
              into Claude Code, and it handles the rest.
            </p>
          </InfoCard>
        </div>
      </section>

      {/* Installing */}
      <section className="space-y-6">
        <SectionHeading>Installing assets</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          The interactive installer handles everything. Run one command and pick
          what you want.
        </p>

        <InstallCommand command="curl -fsSL claude.sporich.dev/install.sh | bash" />

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--text-muted)]">
            What happens when you run it
          </h3>

          <div className="flex items-start gap-3">
            <StepNumber n={1} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Clones the repository
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                The installer fetches the latest assets from GitHub into a cache
                at <CodeTag>~/.claude-playground</CodeTag>. Subsequent runs
                pull updates automatically.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={2} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Presents a menu
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                You&apos;ll see a numbered list of all available assets grouped by
                category. Enter the numbers of the ones you want, or type{" "}
                <CodeTag>all</CodeTag> to install everything.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={3} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Installs to the right locations
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Skills are symlinked to <CodeTag>~/.claude/skills/</CodeTag>.
                Templates are copied as <CodeTag>CLAUDE.md</CodeTag> in your
                current directory. Prompts are printed to the terminal or saved
                to a file.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StepNumber n={4} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Shows a summary
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                After installation, you&apos;ll see exactly what was installed
                and where it went.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Try it out */}
      <section className="space-y-4">
        <SectionHeading>Try it out</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Here&apos;s a quick way to see Claude Playground in action: install
          the <strong className="text-[var(--text-primary)]">code-review</strong>{" "}
          skill and use it immediately.
        </p>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5">
          <div className="flex items-start gap-3">
            <StepNumber n={1} />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Run the installer and select the code-review skill
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
                Ask Claude to review your code
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Claude will automatically use the code-review skill to give you
                a structured review with severity ratings, specific file
                references, and actionable suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where things go */}
      <section className="space-y-4">
        <SectionHeading>Where things go</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
          A quick reference for where each asset type lives on your system.
        </p>

        <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-surface)]">
                <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--text-muted)]">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--text-muted)]">
                  Location
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--text-muted)]">
                  Scope
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              <tr className="bg-[var(--bg-base)]">
                <td className="px-5 py-3 font-medium text-amber-400">Skills</td>
                <td className="px-5 py-3 font-mono text-xs text-[var(--accent-text)]">
                  ~/.claude/skills/&lt;name&gt;/SKILL.md
                </td>
                <td className="px-5 py-3 text-[var(--text-muted)]">Global &mdash; all sessions</td>
              </tr>
              <tr className="bg-[var(--bg-base)]">
                <td className="px-5 py-3 font-medium text-emerald-400">Templates</td>
                <td className="px-5 py-3 font-mono text-xs text-[var(--accent-text)]">
                  ./CLAUDE.md
                </td>
                <td className="px-5 py-3 text-[var(--text-muted)]">Project-level</td>
              </tr>
              <tr className="bg-[var(--bg-base)]">
                <td className="px-5 py-3 font-medium text-violet-400">Prompts</td>
                <td className="px-5 py-3 font-mono text-xs text-[var(--accent-text)]">
                  copy &amp; paste
                </td>
                <td className="px-5 py-3 text-[var(--text-muted)]">One-shot</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Contributing */}
      <section className="space-y-4">
        <SectionHeading>Contributing</SectionHeading>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Want to add your own asset? The process is simple:
        </p>
        <ol className="space-y-3 text-[var(--text-secondary)] list-none">
          {[
            <>
              Create a <CodeTag>.md</CodeTag> file in the right directory (
              <CodeTag>skills/&lt;category&gt;/&lt;name&gt;/SKILL.md</CodeTag>,{" "}
              <CodeTag>templates/&lt;name&gt;.md</CodeTag>, or{" "}
              <CodeTag>prompts/&lt;category&gt;/&lt;name&gt;.md</CodeTag>).
            </>,
            <>
              Add YAML frontmatter with <CodeTag>name</CodeTag>,{" "}
              <CodeTag>description</CodeTag>, and <CodeTag>tags</CodeTag>.
            </>,
            <>
              Run <CodeTag>bash scripts/build-catalog.sh</CodeTag> to
              regenerate the catalog and verify your asset appears.
            </>,
            <>
              Submit a PR to the{" "}
              <a
                href="https://github.com/nsporich/claude-playground"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-text)] border-b border-[var(--accent-text)]/30 hover:border-[var(--accent-text)] transition-colors"
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
