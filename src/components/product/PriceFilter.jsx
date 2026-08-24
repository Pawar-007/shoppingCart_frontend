import { useState } from "react";

export default function PriceFilter({ min, max, onApply }) {
  const [localMin, setLocalMin] = useState(min ?? "");
  const [localMax, setLocalMax] = useState(max ?? "");

  function submit(e) {
    e.preventDefault();
    onApply(localMin === "" ? null : Number(localMin), localMax === "" ? null : Number(localMax));
  }

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2.5">Price</h4>
      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          placeholder="Min"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          className="input !py-2 text-sm"
          aria-label="Minimum price"
        />
        <span className="text-ink-faint text-sm">–</span>
        <input
          type="number"
          min="0"
          placeholder="Max"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          className="input !py-2 text-sm"
          aria-label="Maximum price"
        />
      </form>
      <button onClick={submit} className="btn-secondary btn-sm mt-2.5 w-full">
        Apply
      </button>
    </div>
  );
}
