export default function BrandFilter({ brands, selectedId, onSelect }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2.5">Brand</h4>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onSelect(null)}
          className={`text-left text-sm px-2.5 py-1.5 rounded transition-colors ${
            !selectedId ? "bg-primary-light text-primary-dark font-medium" : "text-ink-soft hover:bg-bg"
          }`}
        >
          All brands
        </button>
        {brands.map((b) => (
          <button
            key={b.brandId ?? b.id}
            onClick={() => onSelect(b.brandId ?? b.id)}
            className={`text-left text-sm px-2.5 py-1.5 rounded transition-colors ${
              selectedId === (b.brandId ?? b.id)
                ? "bg-primary-light text-primary-dark font-medium"
                : "text-ink-soft hover:bg-bg"
            }`}
          >
            {b.brandName}
          </button>
        ))}
      </div>
    </div>
  );
}
