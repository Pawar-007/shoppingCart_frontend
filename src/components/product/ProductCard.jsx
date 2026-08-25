import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

export default function ProductCard({ product, onAddToCart, addingToCart }) {
  const image = product.images?.[0] || product.imageUrl || product.image;
  const outOfStock = (product.stockQuantity ?? 1) <= 0;

  return (
    <div className="card overflow-hidden group flex flex-col h-full">
      <Link to={`/products/${product.productId}`} className="block relative aspect-square bg-bg overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink-faint text-xs">
            No image
          </div>
        )}
        {outOfStock && (
          <span className="absolute top-2 left-2 badge bg-ink/85 text-white">Out of stock</span>
        )}
      </Link>

      <div className="p-3.5 flex flex-col flex-1">
        {product.brand?.name && (
          <span className="text-[11px] uppercase tracking-wide text-ink-faint mb-0.5">
            {product.brand.name}
          </span>
        )}
        <Link to={`/products/${product.productId}`} className="text-sm font-medium text-ink line-clamp-2 mb-1.5 hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="price text-base text-ink">{formatCurrency(product.price)}</span>
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={outOfStock || addingToCart}
            aria-label={`Add ${product.name} to cart`}
            className="btn-primary btn-sm !px-2.5"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
