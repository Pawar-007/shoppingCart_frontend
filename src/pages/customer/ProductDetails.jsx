import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ShoppingCart, Zap, ChevronLeft } from "lucide-react";
import productApi from "@/api/productApi";
import cartApi from "@/api/cartApi";
import QuantitySelector from "@/components/product/QuantitySelector";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/utils/formatters";

export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const { isAuthenticated } = useAuth();
  const { refresh } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.getOne(productId);
      console.log("data",data);
      setProduct(data);
      setQuantity(1);
      setActiveImage(0);
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (loading) return <LoadingSpinner label="Loading product" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!product) return null;

  const images = Array.isArray(product.imageUrl)
  ? product.imageUrl
  : product.images?.length
  ? product.images
  : [product.imageUrl].filter(Boolean);

  const outOfStock = (product.stockQuantity ?? 1) <= 0;

  async function addToCart(andCheckout) {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setBusy(true);
    try {
      await cartApi.add({ productId: product.productId, quantity });
      await refresh();
      if (andCheckout) {
        navigate("/checkout");
      } else {
        toast.success("Added to cart");
      }
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setBusy(false);
    }
  }

 return (
  <div className="shell py-8">

    <Link
      to="/products"
      className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-6"
    >
      <ChevronLeft size={15} /> Back to products
    </Link>

    <div className="grid lg:grid-cols-2 gap-10">

      {/* Gallery */}
      <div>
        <div className="max-w-md mx-auto lg:mx-0 w-full">

          <div className="aspect-square max-h-[420px] rounded-lg bg-bg border border-border overflow-hidden flex items-center justify-center">
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-ink-faint text-sm">
                No image
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 rounded border overflow-hidden ${
                    activeImage === i
                      ? "border-primary ring-1 ring-primary"
                      : "border-border"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Details */}
      <div>
        {product.brand?.name && (
          <span className="text-xs uppercase tracking-wide text-ink-faint font-medium">
            {product.brand.name}
          </span>
        )}

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink mt-1">
          {product.name}
        </h1>

        {product.category?.name && (
          <Link
            to={`/categories/${product.category.categoryId ?? product.category.id}`}
            className="text-sm text-primary hover:underline mt-1 inline-block"
          >
            {product.category.name}
          </Link>
        )}

        <p className="price text-2xl text-ink mt-4">
          {formatCurrency(product.price)}
        </p>

        <div className="mt-2">
          {outOfStock ? (
            <span className="badge bg-danger-light text-danger">
              Out of stock
            </span>
          ) : (
            <span className="badge bg-primary-light text-primary-dark">
              In stock
              {product.stockQuantity != null
                ? ` · ${product.stockQuantity} left`
                : ""}
            </span>
          )}
        </div>

        {product.description && (
          <p className="text-sm text-ink-soft leading-relaxed mt-5">
            {product.description}
          </p>
        )}

        {!outOfStock && (
          <div className="mt-6">
            <span className="field-label">Quantity</span>

            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              max={product.stockQuantity ?? 99}
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-7">
          <button
            onClick={() => addToCart(false)}
            disabled={outOfStock || busy}
            className="btn-primary flex-1"
          >
            <ShoppingCart size={16} /> Add to cart
          </button>

          <button
            onClick={() => addToCart(true)}
            disabled={outOfStock || busy}
            className="btn-secondary flex-1"
          >
            <Zap size={16} /> Buy now
          </button>
        </div>
      </div>

    </div>
  </div>
);
}
