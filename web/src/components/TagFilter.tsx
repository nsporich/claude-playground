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
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              isSelected
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
