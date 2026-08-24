import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import QuantitySelector from "@/components/product/QuantitySelector";
import { formatCurrency } from "@/utils/formatters";

export default function CartItem({ item, selected, onToggleSelect, onQuantityChange, onRemove, updating }) {
  const product = item.product || item;
  const image = product.images?.[0] || product.imageUrl || product.image;
  const lineTotal = (product.price || 0) * item.quantity;
  console.log("item ",image);
  return (
    <div className="flex items-start gap-3 sm:gap-4 py-4 border-b border-border last:border-b-0">
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggleSelect(item)}
        aria-label={`Select ${product.productName}`}
        className="mt-2 h-4 w-4 accent-[#1F6F54]"
      />
      <Link to={`/products/${product.productId}`} className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded bg-bg overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink-faint text-[10px]">No image</div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.productId}`} className="text-sm font-medium text-ink hover:text-primary line-clamp-2">
          {product.productName}
        </Link>
        <p className="price text-sm text-ink-soft mt-1">{formatCurrency(product.price)}</p>

        <div className="flex items-center justify-between gap-3 mt-3">
          <QuantitySelector
            quantity={item.quantity}
            max={product.stockQuantity ?? 99}
            onChange={(q) => onQuantityChange(item, q)}
            size="sm"
          />
          <button
            onClick={() => onRemove(item)}
            disabled={updating}
            aria-label={`Remove ${product.name} from cart`}
            className="text-ink-faint hover:text-danger p-1.5 disabled:opacity-40"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <span className="price text-sm text-ink shrink-0 hidden sm:block">{formatCurrency(lineTotal)}</span>
    </div>
  );
}
