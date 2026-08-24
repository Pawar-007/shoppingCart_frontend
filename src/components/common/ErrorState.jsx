import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorState({ message = "Something went wrong. Please try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="h-14 w-14 rounded-full bg-danger-light flex items-center justify-center mb-4">
        <AlertTriangle size={26} className="text-danger" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">Couldn't load this</h3>
      <p className="text-sm text-ink-soft max-w-sm mb-5">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          <RotateCcw size={15} />
          Try again
        </button>
      )}
    </div>
  );
}
