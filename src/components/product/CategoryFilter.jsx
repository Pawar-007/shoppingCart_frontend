export default function CategoryFilter({ categories, selectedId, onSelect }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2.5">Category</h4>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onSelect(null)}
          className={`text-left text-sm px-2.5 py-1.5 rounded transition-colors ${
            !selectedId ? "bg-primary-light text-primary-dark font-medium" : "text-ink-soft hover:bg-bg"
          }`}
        >
          All categories
        </button>
        {categories.map((c) => (
          <button
            key={c.categoryId ?? c.id}
            onClick={() => onSelect(c.categoryId ?? c.id)}
            className={`text-left text-sm px-2.5 py-1.5 rounded transition-colors ${
              selectedId === (c.categoryId ?? c.id)
                ? "bg-primary-light text-primary-dark font-medium"
                : "text-ink-soft hover:bg-bg"
            }`}
          >
            {c.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
}
