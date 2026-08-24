import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import productApi from "@/api/productApi";
import categoryApi from "@/api/categoryApi";
import brandApi from "@/api/brandApi";
import cartApi from "@/api/cartApi";
import ProductGrid from "@/components/product/ProductGrid";
import CategoryFilter from "@/components/product/CategoryFilter";
import BrandFilter from "@/components/product/BrandFilter";
import PriceFilter from "@/components/product/PriceFilter";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function ProductListing() {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [categoryId, setCategoryId] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });

  const { isAuthenticated } = useAuth();
  const { refresh } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [productData, categoryData, brandData] = await Promise.all([
        productApi.list(),
        categoryApi.list(),
        brandApi.list(),
      ]);
      setAllProducts(productData || []);
      setCategories(categoryData || []);
      setBrands(brandData || []);
      console.log(productData);
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      if (categoryId && (p.category?.categoryId ?? p.category?.id ?? p.categoryId) !== categoryId) return false;
      if (brandId && (p.brand?.brandId ?? p.brand?.id ?? p.brandId) !== brandId) return false;
      if (priceRange.min != null && p.price < priceRange.min) return false;
      if (priceRange.max != null && p.price > priceRange.max) return false;
      return true;
    });
  }, [allProducts, categoryId, brandId, priceRange]);

  async function handleAddToCart(product) {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await cartApi.add({ productId: product.productId, quantity: 1 });
      await refresh();
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.friendlyMessage);
    }
  }

  const activeFilterCount = [categoryId, brandId, priceRange.min, priceRange.max].filter(
    (v) => v != null
  ).length;

  const FiltersPanel = (
    <div className="space-y-6">
      <CategoryFilter categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
      <BrandFilter brands={brands} selectedId={brandId} onSelect={setBrandId} />
      <PriceFilter
        min={priceRange.min}
        max={priceRange.max}
        onApply={(min, max) => setPriceRange({ min, max })}
      />
      {activeFilterCount > 0 && (
        <button
          onClick={() => {
            setCategoryId(null);
            setBrandId(null);
            setPriceRange({ min: null, max: null });
          }}
          className="text-sm text-primary font-medium hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="shell py-8">
      <div className="shelf-heading">
        <h2>All products</h2>
        <button
          onClick={() => setFiltersOpen(true)}
          className="btn-secondary btn-sm lg:hidden"
        >
          <SlidersHorizontal size={14} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block">{FiltersPanel}</aside>

        <div>
          <p className="text-sm text-ink-soft mb-4">
            {loading ? "Loading…" : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
          </p>
          <ProductGrid
            products={filtered}
            loading={loading}
            error={error}
            onRetry={load}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface shadow-elevated overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="p-1.5 text-ink-soft">
                <X size={20} />
              </button>
            </div>
            {FiltersPanel}
            <button onClick={() => setFiltersOpen(false)} className="btn-primary btn-full mt-6">
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
