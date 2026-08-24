import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import productApi from "@/api/productApi";
import cartApi from "@/api/cartApi";
import ProductGrid from "@/components/product/ProductGrid";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { refresh } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  async function load() {
    if (!keyword) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.search(keyword);
      setProducts(data || []);
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  async function handleAddToCart(product) {
    if (!isAuthenticated) return navigate("/login");
    try {
      await cartApi.add({ productId: product.productId, quantity: 1 });
      await refresh();
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.friendlyMessage);
    }
  }

  return (
    <div className="shell py-8">
      <div className="shelf-heading">
        <h2>Results for "{keyword}"</h2>
      </div>
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={load}
        onAddToCart={handleAddToCart}
        emptyMessage="Try a different search term."
      />
    </div>
  );
}
