import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

const ClaimForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    user: "", // Add user field
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userId = JSON.parse(storedUser).id; // Extract user ID from localStorage
      setFormData((prevData) => ({ ...prevData, user: userId })); // Set user ID in formData
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Message is required";
    if (formData.message.length < 10) newErrors.message = "Message should be at least 10 characters";
    if (!formData.user) newErrors.user = "User ID is missing";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:3001/reclamation/addRec", formData);
      setMessage("Reclamation added successfully!");
      setFormData({ subject: "", message: "", user: formData.user }); // Reset form but keep user ID
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      setMessage("Error adding reclamation: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="content-container">
        <div className="claim-form-container">
          <div className="claim-form-header">
            <h2>Submit a Reclamation</h2>
            <p>Please fill out the form below to submit your reclamation</p>
          </div>
          
          <form className="claim-form" onSubmit={handleSubmit}>
            <input type="hidden" name="user" value={formData.user} /> {/* Hidden input for user ID */}

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Enter the subject of your reclamation"
                className={errors.subject ? "error" : ""}
              />
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe your reclamation in detail..."
                className={errors.message ? "error" : ""}
              />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            {message && (
              <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Submit Reclamation"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClaimForm;