import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";

const AddPatientForm = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // State for patient inputs
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    allergies: [],
    chronicDiseases: [],
  });

  // Handle change for inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle change for arrays (allergies and chronicDiseases)
  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(",").map((item) => item.trim()),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const patientData = {
      ...formData,
      role: "Patient", // Ensure the role is set to "Patient"
    };

    try {
      const response = await fetch("http://localhost:3001/users/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (response.ok) {
          alert("Patient added successfully!");
          // Redirect to Patient.jsx
          navigate("/patient");
        } else {
          alert(`Error: ${data.message}`);
        }
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Error submitting form: Invalid response format");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <SideBar
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
      </div>
      <div className="content-container flex flex-col min-h-screen">
        <Header
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        <div className="flex-grow flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Add Patient
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allergies (comma separated)
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies.join(", ")}
                  onChange={handleArrayChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chronic Diseases (comma separated)
                </label>
                <input
                  type="text"
                  name="chronicDiseases"
                  value={formData.chronicDiseases.join(", ")}
                  onChange={handleArrayChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatientForm;
