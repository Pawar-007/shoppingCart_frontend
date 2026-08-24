import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import productApi from "@/api/productApi";
import categoryApi from "@/api/categoryApi";
import brandApi from "@/api/brandApi";
import ProductForm from "@/components/product/ProductForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useToast } from "@/context/ToastContext";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([categoryApi.list(), brandApi.list()])
      .then(([c, b]) => {
        setCategories(c || []);
        setBrands(b || []);
      })
      .catch((err) => toast.error(err.friendlyMessage))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(payload) {
    setSubmitting(true);
    try {
      await productApi.addProduct(payload);
      toast.success("Product added");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading form" />;

  return (
    <div>
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-6">
        <ChevronLeft size={15} /> Back to products
      </Link>
      <div className="shelf-heading">
        <h2>Add product</h2>
      </div>
      <ProductForm categories={categories} brands={brands} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
