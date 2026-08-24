import { useState } from "react";

const EMPTY = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export default function AddressForm({ initialValue, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...EMPTY, ...initialValue });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    ["fullName", "phone", "line1", "city", "state", "postalCode", "country"].forEach((f) => {
      if (!form[f]?.trim()) next[f] = "Required";
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) onSubmit(form);
  }

  const Field = ({ label, field, placeholder, span }) => (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="field-label" htmlFor={field}>
        {label}
      </label>
      <input
        id={field}
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className={`input ${errors[field] ? "input-error" : ""}`}
      />
      {errors[field] && <p className="error-text">{errors[field]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Full name" field="fullName" placeholder="Jordan Lee" />
      <Field label="Phone" field="phone" placeholder="+1 555 010 1234" />
      <Field label="Address line 1" field="line1" placeholder="Street, house no." span />
      <Field label="Address line 2 (optional)" field="line2" placeholder="Apartment, suite" span />
      <Field label="City" field="city" placeholder="Springfield" />
      <Field label="State" field="state" placeholder="IL" />
      <Field label="Postal code" field="postalCode" placeholder="62704" />
      <Field label="Country" field="country" placeholder="United States" />

      <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving…" : "Save address"}
        </button>
      </div>
    </form>
  );
}
