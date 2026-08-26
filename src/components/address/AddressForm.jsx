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

function Field({ label, field, placeholder, span, form, errors, update }) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="field-label" htmlFor={field}>
        {label}
      </label>

      <input
        id={field}
        value={form[field] || ""}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className={`input ${errors[field] ? "input-error" : ""}`}
      />

      {errors[field] && (
        <p className="error-text">{errors[field]}</p>
      )}
    </div>
  );
}

export default function AddressForm({
  initialValue,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...initialValue,
  });

  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }));
  }

 function validate() {
  const next = {};

  // Full Name
  if (!form.fullName?.trim()) {
    next.fullName = "Full name is required";
  } else if (form.fullName.trim().length < 2) {
    next.fullName = "Full name must be at least 2 characters";
  } else if (!/^[A-Za-z\s]+$/.test(form.fullName.trim())) {
    next.fullName = "Full name can contain only letters and spaces";
  }

  // Phone
  if (!form.phone?.trim()) {
    next.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(form.phone.trim())) {
    next.phone = "Phone number must be exactly 10 digits";
  }

  // Address Line 1
  if (!form.line1?.trim()) {
    next.line1 = "Address line 1 is required";
  } else if (form.line1.trim().length < 5) {
    next.line1 = "Please enter a valid address";
  }

  // Address Line 2 - optional
  if (form.line2?.trim() && form.line2.trim().length < 2) {
    next.line2 = "Please enter a valid address line 2";
  }

  // City
  if (!form.city?.trim()) {
    next.city = "City is required";
  } else if (!/^[A-Za-z\s]+$/.test(form.city.trim())) {
    next.city = "City can contain only letters and spaces";
  }

  // State
  if (!form.state?.trim()) {
    next.state = "State is required";
  } else if (!/^[A-Za-z\s]+$/.test(form.state.trim())) {
    next.state = "State can contain only letters and spaces";
  }

  // Postal Code
  if (!form.postalCode?.trim()) {
    next.postalCode = "Postal code is required";
  } else if (!/^\d{6}$/.test(form.postalCode.trim())) {
    next.postalCode = "Postal code must be exactly 6 digits";
  }

  // Country
  if (!form.country?.trim()) {
    next.country = "Country is required";
  } else if (!/^[A-Za-z\s]+$/.test(form.country.trim())) {
    next.country = "Country can contain only letters and spaces";
  }

  setErrors(next);

  return Object.keys(next).length === 0;
}

  function handleSubmit(e) {
    e.preventDefault();

    if (validate()) {
       const addressData = {
          fullName: form.fullName,
          phone: form.phone,
          addressLine1: form.line1,
          addressLine2: form.line2,
          city: form.city,
          state: form.state,
          country: form.country,
          pincode: form.postalCode,

          // backend ke required fields
          addressType: "HOME",
          isDefault: false,
        };
        console.log("address",addressData);
      onSubmit(addressData);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <Field
        label="Full name"
        field="fullName"
        placeholder="Bhushan Pawar"
        form={form}
        errors={errors}
        update={update}
      />

      <Field
        label="Phone"
        field="phone"
        placeholder="9876543210"
        form={form}
        errors={errors}
        update={update}
      />

      <Field
        label="Address line 1"
        field="line1"
        placeholder="Street, house no."
        span
        form={form}
        errors={errors}
        update={update}
      />

      <Field
        label="Address line 2 (optional)"
        field="line2"
        placeholder="Apartment, suite"
        span
        form={form}
        errors={errors}
        update={update}
      />

      <Field
        label="City"
        field="city"
        placeholder="Pune"
        form={form}
        errors={errors}
        update={update}
      />

      <Field
        label="State"
        field="state"
        placeholder="Maharashtra"
        form={form}
        errors={errors}
        update={update}
      />

      <Field
        label="Postal code"
        field="postalCode"
        placeholder="411001"
        form={form}
        errors={errors}
        update={update}
      />

      <Field
        label="Country"
        field="country"
        placeholder="India"
        form={form}
        errors={errors}
        update={update}
      />

      <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
        >
          {submitting ? "Saving…" : "Save address"}
        </button>
      </div>
    </form>
  );
}