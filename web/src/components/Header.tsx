import Link from "next/link";

export default function Header() {
  return (
    <header className="relative bg-[var(--comic-yellow)] border-b-[3px] border-[var(--ink)] sticky top-0 z-50">
      {/* Red top stripe */}
      <div className="h-[4px] bg-[var(--comic-red)]" />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Shield logo */}
          <span
            className="relative flex h-10 w-10 items-center justify-center bg-[var(--comic-red)] border-2 border-[var(--ink)] text-white transition-transform group-hover:rotate-[-4deg]"
            style={{ boxShadow: "2px 2px 0 var(--ink)" }}
          >
            <svg
              className="h-5 w-5 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-display)] text-[1.6rem] tracking-wider text-[var(--ink)] leading-none comic-text-3d">
              AGENTS ASSEMBLE
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--ink-medium)] font-bold leading-none mt-0.5">
              Command Center &bull; Issue #1
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/browse"
            className="px-3.5 py-2 font-[family-name:var(--font-display)] text-lg tracking-wider text-[var(--ink)] hover:text-[var(--comic-red)] transition-colors"
          >
            Roster
          </Link>
          <Link
            href="/getting-started"
            className="px-3.5 py-2 font-[family-name:var(--font-display)] text-lg tracking-wider text-[var(--ink)] hover:text-[var(--comic-red)] transition-colors"
          >
            Briefing
          </Link>
          <div className="ml-2 h-5 w-[2px] bg-[var(--ink)] opacity-20" />
          <a
            href="https://github.com/nsporich/claude-playground"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-2 text-[var(--ink-medium)] transition-colors hover:text-[var(--ink)]"
            aria-label="GitHub"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
