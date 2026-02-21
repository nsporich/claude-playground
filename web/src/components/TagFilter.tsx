"use client";

export default function TagFilter({
  tags,
  selected,
  onToggle,
}: {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-mono font-medium transition-all duration-200 ${
              isSelected
                ? "bg-[var(--accent)] text-black shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                : "border border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--accent)]/40 hover:text-[var(--accent-text)]"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
