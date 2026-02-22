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
            className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer border-2 border-[var(--ink)] ${
              isSelected
                ? "bg-[var(--comic-red)] text-white"
                : "bg-[var(--panel-bg)] text-[var(--ink)] hover:bg-[var(--comic-yellow)] hover:text-[var(--ink)]"
            }`}
            style={{ boxShadow: isSelected ? "none" : "2px 2px 0 var(--ink)" }}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
