import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import productApi from "@/api/productApi";
import categoryApi from "@/api/categoryApi";
import cartApi from "@/api/cartApi";
import ProductGrid from "@/components/product/ProductGrid";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "../../components/layout/HeroCarousel";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { refresh } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [productData, categoryData] = await Promise.all([productApi.list(), categoryApi.list()]);
      setProducts((productData || []).slice(0, 8));
      setCategories((categoryData || []).slice(0, 6));

    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    
  }, []);

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

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="shell py-14 sm:py-20 lg:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary bg-primary-light px-2.5 py-1 rounded-full mb-5">
              New arrivals every week
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-ink max-w-xl">
              Goods worth keeping, priced to actually buy.
            </h1>
            <p className="text-ink-soft text-base mt-4 max-w-md">
              Curated products, straightforward pricing, and shipping that
              doesn't make you wait. Browse the shelf and see for yourself.
            </p>
            <div className="flex items-center gap-3 mt-7">
              <Link to="/products" className="btn-primary">
                Shop all products <ArrowRight size={16} />
              </Link>
              <Link to="/products" className="btn-secondary">
                Browse categories
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <HeroCarousel images={products.slice(0, 6).map((p) => p.images?.[0] || p.imageUrl).filter(Boolean)} />
         </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-bg">
        <div className="shell py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Truck, text: "Fast, tracked shipping" },
            { icon: ShieldCheck, text: "Secure checkout" },
            { icon: RotateCcw, text: "Easy 30-day returns" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-sm text-ink-soft">
              <Icon size={17} className="text-primary shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="shell py-10">
          <div className="shelf-heading">
            <h2>Shop by category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((c) => (
              <Link
                key={c.categoryId ?? c.id}
                to={`/categories/${c.categoryId ?? c.id}`}
                className="card card-pad text-center hover:border-primary transition-colors"
              >
                <span className="text-sm font-medium text-ink">{c.categoryName}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="shell py-10">
        <div className="shelf-heading">
          <h2>Popular right now</h2>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline hidden sm:block">
            View all
          </Link>
        </div>
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={load}
          onAddToCart={handleAddToCart}
        />
      </section>
    </div>
  );
}
