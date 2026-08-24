import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import productApi from "@/api/productApi";
import categoryApi from "@/api/categoryApi";
import brandApi from "@/api/brandApi";
import ProductForm from "@/components/product/ProductForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import { useToast } from "@/context/ToastContext";

export default function EditProduct() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [productData, categoryData, brandData] = await Promise.all([
        productApi.getOne(productId),
        categoryApi.list(),
        brandApi.list(),
      ]);
      console.log("catogary list ",categoryData);
      setProduct(productData);
      setCategories(categoryData || []);
      setBrands(brandData || []);
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

  async function handleSubmit(payload) {
    setSubmitting(true);
    try {
      await productApi.updateProduct(productId, payload);
      toast.success("Product updated");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading product" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-6">
        <ChevronLeft size={15} /> Back to products
      </Link>
      <div className="shelf-heading">
        <h2>Edit product</h2>
      </div>
      <ProductForm
        initialValue={product}
        categories={categories}
        brands={brands}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
