import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-2 border-[var(--accent-dim)]/30 bg-[var(--bg-surface)]/90 backdrop-blur-xl sticky top-0 z-50">
      {/* Thin accent line at very top */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Logo mark */}
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-black overflow-hidden">
            <svg className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.12em] text-[var(--text-primary)] leading-none">
              AGENTS ASSEMBLE
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--text-muted)] leading-none mt-0.5">
              Command Center
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/browse"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
          >
            Roster
          </Link>
          <Link
            href="/getting-started"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
          >
            Briefing
          </Link>
          <div className="ml-2 h-4 w-px bg-[var(--border-default)]" />
          <a
            href="https://github.com/nsporich/claude-playground"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
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
