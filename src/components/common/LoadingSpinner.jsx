import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = 28, label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-ink-soft" role="status" aria-live="polite">
      <Loader2 size={size} className="animate-spin text-primary" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
