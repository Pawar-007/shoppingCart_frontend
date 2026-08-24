import { useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ initialValue = "", compact = false, onClose }) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
    onClose?.();
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full" role="search">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className={`input !pl-9 ${compact ? "!py-2" : ""}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
        >
          <X size={15} />
        </button>
      )}
    </form>
  );
}
