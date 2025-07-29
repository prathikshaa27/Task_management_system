import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword} from "../../services/auth";
import { motion } from "framer-motion";
import { changePasswordFields } from "../../forms/formFields"
import FormRenderer from "../common/FormRenderer";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [fieldToggles, setFieldToggles] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await changePassword({
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });
      if (res.status === 200) {
        setMessage("Password updated successfully!");
      }
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errMsg =
        err.response?.data?.error || "Something went wrong. Try again.";
      setError(Array.isArray(errMsg) ? errMsg.join(" ") : errMsg);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card-shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "1rem",
          backgroundColor: "#ffffffd9",
        }}
      >
        <h3 className="text-center fw-bold mb-2">Reset Your Password 🔐</h3>
        <p className="text-muted text-center mb-4 small">
          Just a few steps away from getting back in!
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <FormRenderer
            fields={changePasswordFields}
            formData={formData}
            handleChange={handleChange}
            fieldErrors={{}} 
            setToggles={setFieldToggles}
          />
          <button type="submit" className="btn btn-primary w-100">
            Update Password
          </button>
        </form>

        <p className="text-center text-muted mt-3 small">
          We will help you get back on track 🚀
        </p>
      </motion.div>
    </div>
  );
}
