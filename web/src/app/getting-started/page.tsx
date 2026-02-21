import type { Metadata } from "next";
import InstallCommand from "@/components/InstallCommand";

export const metadata: Metadata = {
  title: "Getting Started | Claude Playground",
};

export default function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 py-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Getting Started
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Everything you need to start using Claude Playground.
        </p>
      </header>

      {/* What is Claude Code */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">
          What is Claude Code
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Claude Code is Anthropic&apos;s CLI tool for working with Claude in
          your terminal and IDE. It can read and write files, run commands, and
          follow project-specific instructions. Claude Playground builds on top
          of Claude Code by giving you a curated library of reusable assets you
          can install with a single command.
        </p>
      </section>

      {/* Skills */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">Skills</h2>
        <p className="text-gray-700 leading-relaxed">
          Skills are <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">SKILL.md</code> files
          that teach Claude specific workflows. They live in{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">~/.claude/skills/</code> and
          are automatically available in all Claude Code sessions. Example use
          cases include code review, PR generation, and framework-specific
          guidance.
        </p>
      </section>

      {/* Templates */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">Templates</h2>
        <p className="text-gray-700 leading-relaxed">
          Templates are <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">CLAUDE.md</code> files
          you drop into a project root. They tell Claude about your
          project&apos;s conventions, structure, and preferred patterns. Think of
          them as onboarding docs for your AI pair programmer.
        </p>
      </section>

      {/* Prompts */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">Prompts</h2>
        <p className="text-gray-700 leading-relaxed">
          Prompts are standalone instructions you paste into a Claude
          conversation to kick off a specific task. They&apos;re more ad-hoc
          than skills but produce consistent results for common tasks.
        </p>
      </section>

      {/* Installing */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">Installing</h2>
        <p className="text-gray-700 leading-relaxed">
          Run the following command to get started:
        </p>
        <InstallCommand command="curl -fsSL https://raw.githubusercontent.com/nsporich/claude-playground/main/install.sh | bash" />
        <p className="text-gray-700 leading-relaxed">
          The installer clones the repo, presents a menu, and installs selected
          assets to the right locations on your machine.
        </p>
      </section>

      {/* Where things go */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">
          Where things go
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          <li>
            <strong>Skills:</strong>{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">
              ~/.claude/skills/&lt;name&gt;/SKILL.md
            </code>
          </li>
          <li>
            <strong>Templates:</strong> copied as{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">
              CLAUDE.md
            </code>{" "}
            in your project root.
          </li>
          <li>
            <strong>Prompts:</strong> copy-paste into a Claude conversation.
          </li>
        </ul>
      </section>

      {/* Contributing */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">Contributing</h2>
        <p className="text-gray-700 leading-relaxed">
          To add a new asset:
        </p>
        <ol className="list-decimal space-y-2 pl-6 text-gray-700">
          <li>
            Create a <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">.md</code> file
            in the right directory (<code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">skills/</code>,{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">templates/</code>, or{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">prompts/</code>).
          </li>
          <li>
            Add YAML frontmatter with{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">name</code>,{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">description</code>, and{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">tags</code>.
          </li>
          <li>Submit a PR.</li>
        </ol>
      </section>
    </div>
  );
}
