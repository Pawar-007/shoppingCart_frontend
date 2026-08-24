import { Pencil, Trash2, Star } from "lucide-react";

export default function AddressCard({ address, selected, selectable, onSelect, onEdit, onDelete }) {
  return (
    <div
      onClick={selectable ? () => onSelect?.(address) : undefined}
      className={`card card-pad relative ${selectable ? "cursor-pointer" : ""} ${
        selected ? "border-primary ring-2 ring-primary/15" : ""
      }`}
    >
      {address.isDefault && (
        <span className="badge bg-accent-light text-accent absolute top-4 right-4">
          <Star size={11} /> Default
        </span>
      )}
      <p className="text-sm font-semibold text-ink">{address.fullName || address.name}</p>
      <p className="text-sm text-ink-soft mt-1 leading-relaxed">
        {address.line1 || address.addressLine1}
        {address.line2 || address.addressLine2 ? `, ${address.line2 || address.addressLine2}` : ""}
        <br />
        {address.city}, {address.state} {address.postalCode || address.zipCode}
        <br />
        {address.country}
      </p>
      {address.phone && <p className="text-sm text-ink-soft mt-1">{address.phone}</p>}

      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button onClick={() => onEdit(address)} className="btn-ghost btn-sm">
              <Pencil size={13} /> Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(address)} className="btn-ghost btn-sm !text-danger hover:!bg-danger-light">
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
