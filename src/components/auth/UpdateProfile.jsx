import React, { useState, useEffect } from "react";
import { fetchUserProfile, updateUserProfile } from "../../services/auth";
import { motion } from "framer-motion";
import { updateProfileFields } from "../../forms/formFields";
import FormRenderer from "../common/FormRenderer";

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    old_password:"",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [originalData, setoriginalData] = useState(null);
  const [toggles, setToggles] = useState({});

  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setFormData({
          username: profile.username,
          email: profile.email,
          password: "",
          old_password:"",
        });
        setoriginalData({ username: profile.username, email: profile.email });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile.");
      }
    };
    loadProfile();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const isFormChanged = () => {
    if (!originalData) return false;
    return (
      formData.username !== originalData.username ||
      formData.email !== originalData.email ||
      formData.password !== ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormChanged()) {
      setSuccess("");
      setError("No changes were made");
      return;
    }
    if(formData.password && !formData.old_password){
      setError('Please enter your current password to change the password.');
      return
    }
    try {
      const dataToSend = {
        username: formData.username,
        email: formData.email,
      };
      if (formData.password) {
        dataToSend.password = formData.password;
        dataToSend.old_password = formData.old_password;
      }
      await updateUserProfile(dataToSend);
      setSuccess("Profile updated successfully!");
      setError("");
      setoriginalData({
        username: formData.username,
        email: formData.email,
      });
      setFormData((prev) => ({ ...prev, password: "" ,old_password:""}));
    } catch (err) {
      const msg = err.response?.data?.old_password ||  err.response?.data?.error ||"Update failed. Try again.";
      setError(msg);
    }
  };
  return (
  <div className="h-100 d-flex justify-content-center align-items-center bg-light px-3">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card shadow-lg border-0 rounded-4 p-4 w-100"
      style={{ maxWidth: "500px", backgroundColor: "#ffffff" }}
    >
      <div className="text-center mb-3">
        <span
          className="d-inline-block bg-primary bg-opacity-10 rounded-circle"
          style={{
            width: "70px",
            height: "70px",
            lineHeight: "70px",
            fontSize: "2rem",
            color: "#0d6efd",
          }}
        >
          👤
        </span>
      </div>

      <h3 className="text-center fw-bold text-dark mb-2">Update Profile</h3>
      <p className="text-muted text-center mb-4">
        Keep your account up to date ✨
      </p>

      <form onSubmit={handleSubmit}>
        <FormRenderer
          fields={updateProfileFields}
          formData={formData}
          fieldErrors={{}} 
          handleChange={handleChange}
          toggles={toggles}
          setToggles={setToggles}
        />

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <button type="submit" className="btn btn-success w-100 fw-bold">
          Save Changes
        </button>
      </form>
    </motion.div>
  </div>
);
}