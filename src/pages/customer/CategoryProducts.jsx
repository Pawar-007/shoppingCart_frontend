import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "@/api/productApi";
import categoryApi from "@/api/categoryApi";
import cartApi from "@/api/cartApi";
import ProductGrid from "@/components/product/ProductGrid";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
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
      const [productData, categoryData] = await Promise.all([
        productApi.byCategory(categoryId),
        categoryApi.getOne(categoryId).catch(() => null),
      ]);
      setProducts(productData || []);
      setCategory(categoryData);
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

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
        <h2>{category?.name || "Category"}</h2>
      </div>
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={load}
        onAddToCart={handleAddToCart}
        emptyMessage="No products in this category yet."
      />
    </div>
  );
}
