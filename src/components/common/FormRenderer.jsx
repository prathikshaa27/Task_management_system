import React from "react";

export default function FormRenderer({
  fields,
  formData,
  fieldErrors,
  handleChange,
  toggles,
  setToggles,
}) {
  return fields.map((field) => {
    const showPassword = toggles?.[field.name];
    return (
      <div
        key={field.name}
        className={`form-floating mb-3 ${field.hasToggle ? "position-relative" : ""}`}
      >
        <input
          type={field.hasToggle ? (showPassword ? "text" : "password") : field.type}
          className={`form-control ${fieldErrors?.[field.name] ? "is-invalid" : ""}`}
          id={field.name}
          name={field.name}
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChange={handleChange}
          required
        />
        <label htmlFor={field.name}>{field.label}</label>
        {fieldErrors?.[field.name] && (
          <div className="invalid-feedback">{fieldErrors[field.name]}</div>
        )}

        {field.hasToggle && (
          <i
            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 translate-middle-y me-3`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              setToggles((prev) => ({ ...prev, [field.name]: !prev[field.name] }))
            }
          ></i>
        )}
      </div>
    );
  });
}
