import { useEffect, useState } from "react";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  categoryId: "",
  brandId: "",
  imageUrls: "",
};

export default function ProductForm({ initialValue, categories, brands, onSubmit, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        description: initialValue.description || "",
        price: initialValue.price ?? "",
        stockQuantity: initialValue.stockQuantity ?? "",
        categoryId: initialValue.category?.categoryId ?? initialValue.category?.id ?? initialValue.categoryId ?? "",
        brandId: initialValue.brand?.brandId ?? initialValue.brand?.id ?? initialValue.brandId ?? "",
        imageUrls: (initialValue.images || []).join(", "),
      });
    }
  }, [initialValue]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.price || Number(form.price) <= 0) next.price = "Enter a valid price";
    if (form.stockQuantity === "" || Number(form.stockQuantity) < 0) next.stockQuantity = "Enter a valid quantity";
    if (!form.categoryId) next.categoryId = "Required";
    if (!form.brandId) next.brandId = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
  name: form.name.trim(),
  description: form.description.trim(),
  price: Number(form.price),
  stockQuantity: Number(form.stockQuantity),
  categoryId: Number(form.categoryId),
  brandId: Number(form.brandId),
  imageUrls: form.imageUrls
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
});
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 max-w-2xl">
      <div>
        <label className="field-label" htmlFor="name">Product name</label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={`input ${errors.name ? "input-error" : ""}`}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="input resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="field-label" htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className={`input ${errors.price ? "input-error" : ""}`}
          />
          {errors.price && <p className="error-text">{errors.price}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="stockQuantity">Stock quantity</label>
          <input
            id="stockQuantity"
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={(e) => update("stockQuantity", e.target.value)}
            className={`input ${errors.stockQuantity ? "input-error" : ""}`}
          />
          {errors.stockQuantity && <p className="error-text">{errors.stockQuantity}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="field-label" htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            value={form.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            className={`select ${errors.categoryId ? "input-error" : ""}`}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.categoryId ?? c.id} value={c.categoryId ?? c.id}>
                {c.categoryName}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="error-text">{errors.categoryId}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="brandId">Brand</label>
          <select
            id="brandId"
            value={form.brandId}
            onChange={(e) => update("brandId", e.target.value)}
            className={`select ${errors.brandId ? "input-error" : ""}`}
          >
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.brandId ?? b.id} value={b.brandId ?? b.id}>
                {b.brandName}
              </option>
            ))}
          </select>
          {errors.brandId && <p className="error-text">{errors.brandId}</p>}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="imageUrls">Image URLs (comma-separated)</label>
        <input
          id="imageUrls"
          value={form.imageUrls}
          onChange={(e) => update("imageUrls", e.target.value)}
          placeholder="https://…, https://…"
          className="input"
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}
