import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { PackageSearch } from "lucide-react";

export default function ProductGrid({ products, loading, error, onRetry, onAddToCart, emptyMessage }) {

  if (loading) return <ProductGridSkeleton />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        message={emptyMessage || "Try adjusting your filters or search terms."}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
