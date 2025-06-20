import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";

const AddPersonalForm = () => {
  const navigate = useNavigate();
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    role: "",
    password: "",
    age: "",
    admission_date: "",
    conge: "",
    nbr_conge: "",
  });
  const [roleSpecificData, setRoleSpecificData] = useState({});
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleCommonInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }, []);

  const handleRoleSpecificInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setRoleSpecificData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }, []);

  const handleRoleChange = useCallback((e) => {
    const role = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      role,
    }));
    setRoleSpecificData({});
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    if (!/^\d{8}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone Number must be exactly 8 digits";
    if (!formData.email) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (formData.age < 20 || formData.age > 70) newErrors.age = "Age must be between 20 and 70";
    if (!formData.admission_date) newErrors.admission_date = "Admission Date is required";
    if (formData.conge !== "true" && formData.conge !== "false") newErrors.conge = "Conge must be true or false";
    if (!formData.nbr_conge) newErrors.nbr_conge = "Number of Conge is required";
    if (formData.nbr_conge < 0 || formData.nbr_conge > 25) newErrors.nbr_conge = "Number of Conge must be between 0 and 25";

    // Role-specific validations
    switch (formData.role) {
      case "Doctor":
        if (!roleSpecificData.speciality) newErrors.speciality = "Speciality is required";
        if (!["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Psychiatry", "Radiology", "Surgery"].includes(roleSpecificData.speciality)) {
          newErrors.speciality = "Invalid speciality";
        }
        if (!roleSpecificData.grade) newErrors.grade = "Grade is required";
        if (!["Junior", "Senior", "Consultant"].includes(roleSpecificData.grade)) {
          newErrors.grade = "Invalid grade";
        }
        break;
      case "Nurse":
        if (!roleSpecificData.poste_inf) newErrors.poste_inf = "Poste Infirmier is required";
        if (!["General", "Pediatric", "Surgical", "Psychiatric", "Critical Care", "Oncology", "Geriatric"].includes(roleSpecificData.poste_inf)) {
          newErrors.poste_inf = "Invalid poste infirmier";
        }
        if (!roleSpecificData.grade_inf) newErrors.grade_inf = "Grade Infirmier is required";
        if (!["Junior", "Senior", "Head Nurse"].includes(roleSpecificData.grade_inf)) {
          newErrors.grade_inf = "Invalid grade infirmier";
        }
        break;
      case "Driver":
        if (!roleSpecificData.experience) newErrors.experience = "Experience is required";
        if (!["Beginner", "Intermediate", "Expert"].includes(roleSpecificData.experience)) {
          newErrors.experience = "Invalid experience";
        }
        if (!roleSpecificData.garde) newErrors.garde = "Garde is required";
        if (!["Day", "Night"].includes(roleSpecificData.garde)) {
          newErrors.garde = "Invalid garde";
        }
        break;
      case "Chef":
        if (!roleSpecificData.speciality_chief) newErrors.speciality_chief = "Speciality Chef is required";
        if (!["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Psychiatry", "Radiology", "Surgery"].includes(roleSpecificData.speciality_chief)) {
          newErrors.speciality_chief = "Invalid speciality chef";
        }
        if (!roleSpecificData.garde) newErrors.garde = "Garde is required";
        if (!["Junior", "Senior", "Consultant"].includes(roleSpecificData.garde)) {
          newErrors.garde = "Invalid garde";
        }
        break;
      case "worker":
        if (!roleSpecificData.poste) newErrors.poste = "Poste is required";
        if (!["Maintenance", "Cleaning", "Security", "Administration"].includes(roleSpecificData.poste)) {
          newErrors.poste = "Invalid poste";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found in cookies. Please log in.");
      }

      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Append all regular form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append role-specific data
      Object.entries(roleSpecificData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append the image file if it exists
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await axios.post("http://localhost:3001/users/addUser", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      setMessage("Personnel added successfully!");
      console.log("Response:", response.data);

      // Clear the form
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        role: "",
        password: "",
        age: "",
        admission_date: "",
        conge: "",
        nbr_conge: "",
      });
      setRoleSpecificData({});
      setImage(null);
      navigate("/personelle");
      setErrors({});
    } catch (error) {
      setMessage("Error adding personnel: " + (error.response?.data?.message || error.message));
      console.error("Error:", error);
    }
  };

  const renderRoleSpecificInputs = useCallback(() => {
    switch (formData.role) {
      case "Doctor":
        return (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Speciality
              </label>
              <select
                name="speciality"
                value={roleSpecificData.speciality || ""}
                onChange={handleRoleSpecificInputChange}
                className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                  errors.speciality ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Speciality</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Radiology">Radiology</option>
                <option value="Surgery">Surgery</option>
              </select>
              {errors.speciality && <p className="text-red-500 text-sm mt-1">{errors.speciality}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Grade
              </label>
              <select
                name="grade"
                value={roleSpecificData.grade || ""}
                onChange={handleRoleSpecificInputChange}
                className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                  errors.grade ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Grade</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Consultant">Consultant</option>
              </select>
              {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
            </div>
          </>
        );
      case "Nurse":
        return (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Poste Infirmier
              </label>
              <select
                name="poste_inf"
                value={roleSpecificData.poste_inf || ""}
                onChange={handleRoleSpecificInputChange}
                className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                  errors.poste_inf ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Poste Infirmier</option>
                <option value="General">General</option>
                <option value="Pediatric">Pediatric</option>
                <option value="Surgical">Surgical</option>
                <option value="Psychiatric">Psychiatric</option>
                <option value="Critical Care">Critical Care</option>
                <option value="Oncology">Oncology</option>
                <option value="Geriatric">Geriatric</option>
              </select>
              {errors.poste_inf && <p className="text-red-500 text-sm mt-1">{errors.poste_inf}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Grade Infirmier
              </label>
              <select
                name="grade_inf"
                value={roleSpecificData.grade_inf || ""}
                onChange={handleRoleSpecificInputChange}
                className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                  errors.grade_inf ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Grade Infirmier</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Head Nurse">Head Nurse</option>
              </select>
              {errors.grade_inf && <p className="text-red-500 text-sm mt-1">{errors.grade_inf}</p>}
            </div>
          </>
        );
      case "Driver":
        return (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Experience
              </label>
              <select
                name="experience"
                value={roleSpecificData.experience || ""}
                onChange={handleRoleSpecificInputChange}
                className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                  errors.experience ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Experience</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Garde
              </label>
              <select
                name="garde"
                value={roleSpecificData.garde || ""}
                onChange={handleRoleSpecificInputChange}
                className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                  errors.garde ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Garde</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
              {errors.garde && <p className="text-red-500 text-sm mt-1">{errors.garde}</p>}
            </div>
          </>
        );
      case "Chef":
        return (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Speciality Chef
              </label>
              <select
                name="speciality_chief"
                value={roleSpecificData.speciality_chief || ""}
                onChange={handleRoleSpecificInputChange}
                className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                  errors.speciality_chief ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Speciality Chef</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Radiology">Radiology</option>
                <option value="Surgery">Surgery</option>
              </select>
              {errors.speciality_chief && <p className="text-red-500 text-sm mt-1">{errors.speciality_chief}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Garde
              </label>
              <select
                name="garde"
                value={roleSpecificData.garde || ""}
                onChange={handleRoleSpecificInputChange}
                className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                  errors.garde ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Garde</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Consultant">Consultant</option>
              </select>
              {errors.garde && <p className="text-red-500 text-sm mt-1">{errors.garde}</p>}
            </div>
          </>
        );
      case "worker":
        return (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Poste
            </label>
            <select
              name="poste"
              value={roleSpecificData.poste || ""}
              onChange={handleRoleSpecificInputChange}
              className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                errors.poste ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Poste</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Security">Security</option>
              <option value="Administration">Administration</option>
            </select>
            {errors.poste && <p className="text-red-500 text-sm mt-1">{errors.poste}</p>}
          </div>
        );
      default:
        return null;
    }
  }, [formData.role, roleSpecificData, handleRoleSpecificInputChange, errors]);

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <SideBar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
      </div>
      <div className="content-container">
        <Header sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 p-6">
          {/* Left Column - Personal Information */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="px-5 py-4 sm:px-6 sm:py-5">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                  Personal Information
                </h3>
              </div>
              <div className="space-y-6 border-t border-gray-100 p-5 dark:border-gray-800 sm:p-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleCommonInputChange}
                    className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleCommonInputChange}
                    className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      errors.phoneNumber ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleCommonInputChange}
                    className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleRoleChange}
                    className={`dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      errors.role ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Role</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Driver">Driver</option>
                    <option value="Chef">Chef</option>
                    <option value="worker">Worker</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleCommonInputChange}
                    className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleCommonInputChange}
                    className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      errors.age ? "border-red-500" : ""
                    }`}
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Role-Specific Information */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="px-5 py-4 sm:px-6 sm:py-5">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                  Role-Specific Information
                </h3>
              </div>
              <div className="space-y-6 border-t border-gray-100 p-5 dark:border-gray-800 sm:p-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    name="admission_date"
                    value={formData.admission_date}
                    onChange={handleCommonInputChange}
                    className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      errors.admission_date ? "border-red-500" : ""
                    }`}
                  />
                  {errors.admission_date && <p className="text-red-500 text-sm mt-1">{errors.admission_date}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Conge
                  </label>
                  <select
                    name="conge"
                    value={formData.conge}
                    onChange={handleCommonInputChange}
                    className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      errors.conge ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Conge</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  {errors.conge && <p className="text-red-500 text-sm mt-1">{errors.conge}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Number of Conge
                  </label>
                  <input
                    type="number"
                    name="nbr_conge"
                    value={formData.nbr_conge}
                    onChange={handleCommonInputChange}
                    className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      errors.nbr_conge ? "border-red-500" : ""
                    }`}
                  />
                  {errors.nbr_conge && <p className="text-red-500 text-sm mt-1">{errors.nbr_conge}</p>}
                </div>
                {renderRoleSpecificInputs()}
                <div className="col-span-full">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    >
                      Submit
                    </button>
                    {message && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{message}</p>}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPersonalForm;