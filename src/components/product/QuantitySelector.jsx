import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ quantity, onChange, max = 99, min = 1, size = "md" }) {
  const dec = () => onChange(Math.max(min, quantity - 1));
  const inc = () => onChange(Math.min(max, quantity + 1));
  const dims = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  return (
    <div className="inline-flex items-center border border-border rounded overflow-hidden">
      <button
        type="button"
        onClick={dec}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={`${dims} flex items-center justify-center text-ink-soft hover:bg-bg disabled:opacity-40`}
      >
        <Minus size={14} />
      </button>
      <span className="w-9 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className={`${dims} flex items-center justify-center text-ink-soft hover:bg-bg disabled:opacity-40`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
