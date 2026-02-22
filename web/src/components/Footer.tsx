import { getCatalog } from "@/lib/catalog";

export default function Footer() {
  const catalog = getCatalog();
  const agentCount = catalog.agents.length;
  const skillCount = catalog.skills.length;

  return (
    <footer className="border-t-[3px] border-[var(--ink)] bg-[var(--panel-bg)]">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
        {/* Stats */}
        <div className="flex items-center gap-4 font-[family-name:var(--font-display)] text-base tracking-wider">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 bg-[var(--comic-red)] border border-[var(--ink)]"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            />
            <span className="text-[var(--comic-red)]">
              {agentCount} AGENTS
            </span>
          </div>
          <div className="h-4 w-[2px] bg-[var(--ink)] opacity-20" />
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 bg-[var(--comic-blue)] border border-[var(--ink)]"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            />
            <span className="text-[var(--comic-blue)]">
              {skillCount} SKILLS
            </span>
          </div>
          <div className="h-4 w-[2px] bg-[var(--ink)] opacity-20" />
          <span className="text-sm text-[var(--ink-faded)] tracking-widest">
            READY FOR ACTION
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--ink-light)] font-bold">
            Built for the{" "}
            <span className="text-[var(--ink)]">Claude Code</span>{" "}
            community
          </span>
          <a
            href="https://github.com/nsporich/claude-playground"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border-2 border-[var(--ink)] px-3 py-1.5 text-[var(--ink)] font-bold text-sm transition-all hover:bg-[var(--ink)] hover:text-white"
            style={{ boxShadow: "2px 2px 0 var(--ink)" }}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}
