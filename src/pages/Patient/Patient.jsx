import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faEye,
  faSearch,
  faFolderOpen,
  faTimes, // Add close icon
  faPen,  // Add edit icon
  faBolt, // Add predict icon
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import Swal from "sweetalert2";

const Patient = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search field
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced query for search
  const [editPatient, setEditPatient] = useState(null); // State for editing patient
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phoneNumber: "",
    allergies: "",
    chronicDiseases: "",
  }); // Form data for editing
  const [message, setMessage] = useState(""); // Message for success or error
  const [userRole, setUserRole] = useState(null); // State for user role
  const [dossierPatient, setDossierPatient] = useState(null); // State for dossier patient
  const [showDossierForm, setShowDossierForm] = useState(false); // State to toggle dossier form
  const [dossierFormData, setDossierFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
    id_patient: "",
  }); // Removed Outcome field
  const [showEditDossierForm, setShowEditDossierForm] = useState(false); // State to toggle edit dossier form
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
    setUserRole(user?.role || null); // Set the user role
  }, []);

  // Fetch patients from the API
  const fetchPatients = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      const response = await fetch("http://localhost:3001/users/display", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      const filteredPatients = data.filter((user) => user.role === "Patient");
      setPatients(filteredPatients);
      setFilteredPatients(filteredPatients); // Initially, show all patients
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false); // Stop loading after fetching is complete
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms delay to reduce API calls

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Update the filtered results based on the debounced search query
  useEffect(() => {
    const result = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    setFilteredPatients(result);
  }, [debouncedQuery, patients]);

  const handleAddClick = () => {
    navigate("/addpatient");
  };

  const handleViewClick = async (email) => {
    try {
      const response = await fetch(`http://localhost:3001/users/findBymail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="))
              ?.split("=")[1]
          }`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch patient details");
      }

      const patientData = await response.json();
      setSelectedPatient(patientData);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

          const response = await fetch(`http://localhost:3001/users/delete/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to delete patient");
          }

          // Remove the deleted patient from the state
          setPatients((prevPatients) =>
            prevPatients.filter((patient) => patient.id !== id)
          );

          Swal.fire("Deleted!", "The patient has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting patient:", error);
          Swal.fire("Error!", "Failed to delete the patient. Please try again.", "error");
        }
      }
    });
  };

  const handleEditClick = (patient) => {
    setEditPatient(patient);
    setFormData({
      id: patient.id,
      name: patient.name,
      phoneNumber: patient.phoneNumber,
      allergies: Array.isArray(patient.allergies)
        ? patient.allergies.join(", ")
        : patient.allergies || "",
      chronicDiseases: Array.isArray(patient.chronicDiseases)
        ? patient.chronicDiseases.join(", ")
        : patient.chronicDiseases || "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const allergiesArray = formData.allergies
        ? formData.allergies.split(",").map((item) => item.trim())
        : [];
      const chronicDiseasesArray = formData.chronicDiseases
        ? formData.chronicDiseases.split(",").map((item) => item.trim())
        : [];

      const response = await fetch(
        `http://localhost:3001/users/editPatient/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            country: formData.country,
            city: formData.city,
            allergies: allergiesArray,
            chronicDiseases: chronicDiseasesArray,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update patient");
      }

      setMessage("Patient information updated successfully!");
      setTimeout(() => {
        setEditPatient(null); // Close the popup
        setMessage(""); // Clear the message
        fetchPatients(); // Refresh the patient list
      }, 1000);
    } catch (err) {
      console.error("Error updating patient:", err);
      setMessage(err.message || "Error updating patient information");
    }
  };

  const handleDossierClick = async (id_patient) => {
    console.log("Dossier clicked for patient ID:", id_patient);
    try {
      const response = await fetch(`http://localhost:3001/dossierpatient/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const dossiers = await response.json();
      const dossier = dossiers.find((d) => d.id_patient === id_patient);

      if (dossier) {
        setDossierPatient(dossier); // Show dossier details
        setShowDossierForm(false);
      } else {
        setDossierPatient(null); // Show form to create dossier
        setDossierFormData((prev) => ({ ...prev, id_patient })); // Set id_patient in form data
        setShowDossierForm(true);
      }
    } catch (error) {
      console.error("Error fetching dossier:", error);
    }
  };

  const handleDossierFormChange = (e) => {
    const { name, value } = e.target;
    setDossierFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDossierFormSubmit = async (e, id_patient) => {
    e.preventDefault();

    // Validate required fields
    if (
      !id_patient ||
      !dossierFormData.Pregnancies ||
      !dossierFormData.Glucose ||
      !dossierFormData.BloodPressure ||
      !dossierFormData.SkinThickness ||
      !dossierFormData.Insulin ||
      !dossierFormData.BMI ||
      !dossierFormData.DiabetesPedigreeFunction ||
      !dossierFormData.Age
    ) {
      console.error("Missing required fields");
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    try {
      // Add Outcome as an empty string
      const payload = { id_patient, ...dossierFormData, Outcome: "" };

      // Log the request payload for debugging
      console.log("Submitting dossier:", payload);

      const response = await fetch("http://localhost:3001/dossierpatient/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create dossier");
      }

      await response.json();
      setShowDossierForm(false); // Close the form popup
      Swal.fire("Success", "Dossier created successfully.", "success");

      // Refresh the list of patients
      fetchPatients();
    } catch (error) {
      console.error("Error creating dossier:", error);
      Swal.fire("Error", error.message || "Failed to create dossier.", "error");
    }
  };

  const handlePredictClick = async (dossier) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Pregnancies: dossier.Pregnancies,
          Glucose: dossier.Glucose,
          BloodPressure: dossier.BloodPressure,
          SkinThickness: dossier.SkinThickness,
          Insulin: dossier.Insulin,
          BMI: dossier.BMI,
          DiabetesPedigreeFunction: dossier.DiabetesPedigreeFunction,
          Age: dossier.Age,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction from the backend");
      }

      const data = await response.json();
      Swal.fire(
        "Prediction Result",
        `The predicted outcome is: ${data.prediction === 1 ? "Diabetic" : "Non-Diabetic"}`,
        "info"
      );
    } catch (error) {
      console.error("Error fetching prediction:", error);
      Swal.fire("Error", "Failed to get prediction. Please try again.", "error");
    }
  };

  const handleEditDossierClick = () => {
    setShowEditDossierForm(true);
    setDossierFormData(dossierPatient); // Pre-fill the form with existing dossier data
    setDossierPatient(null); // Close the dossier information popup
  };

  const handleEditDossierFormSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !dossierFormData.Pregnancies ||
      !dossierFormData.Glucose ||
      !dossierFormData.BloodPressure ||
      !dossierFormData.SkinThickness ||
      !dossierFormData.Insulin ||
      !dossierFormData.BMI ||
      !dossierFormData.DiabetesPedigreeFunction ||
      !dossierFormData.Age
    ) {
      console.error("Missing required fields");
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/dossierpatient/edit/${dossierFormData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dossierFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update dossier");
      }

      const updatedDossier = await response.json();
      setShowEditDossierForm(false); // Close the edit form popup
      Swal.fire("Success", "Dossier updated successfully.", "success");

      // Refresh the list of patients
      fetchPatients();
    } catch (error) {
      console.error("Error updating dossier:", error);
      Swal.fire("Error", error.message || "Failed to update dossier.", "error");
    }
  };

  const getImageByRole = () => {
    return "public/avatar/patient.png"; // Default avatar for patient
  };

  return (
    <div className="app-container bg-gray-100 min-h-screen">
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

        <div className="px-4 sm:px-6 pt-6 flex-grow">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                List of Patients
              </h3>
              {userRole === "Chef" && (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
                  onClick={handleAddClick}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Patient
                </button>
              )}
            </div>

            {/* Search Field */}
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Search patients by name or email..."
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              />
            </div>

            {/* Patients List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-6">
                  Loading patients...
                </div>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((user) => {
                  const dossier = patients.find((d) => d.id === user.id && d.dossierPatient);

                  return (
                    <div
                      key={user.id}
                      className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-xl"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                          <img
                            src="public\pat.png"
                            alt="Patient"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                          {userRole === "Chef" && (
                            <>
                              <button
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
                                onClick={() => handleEditClick(user)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>

                              <button
                                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-all"
                                onClick={() => handleDeleteClick(user.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </>
                          )}
                          <button
                            className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition-all"
                            onClick={() => handleViewClick(user.email)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            className="px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-all"
                            onClick={() => handleDossierClick(user.id)}
                          >
                            <FontAwesomeIcon icon={faFolderOpen} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-6">
                  No patients found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
            <div className="mb-4">
              <p className="text-sm font-medium">Name:</p>
              <p className="text-gray-700">{selectedPatient.name}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Email:</p>
              <p className="text-gray-700">{selectedPatient.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Phone Number:</p>
              <p className="text-gray-700">{selectedPatient.phoneNumber}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Allergies:</p>
              <p className="text-gray-700">
                {selectedPatient.allergies && selectedPatient.allergies.length > 0
                  ? selectedPatient.allergies.join(", ")
                  : "None"}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Chronic Diseases:</p>
              <p className="text-gray-700">
                {selectedPatient.chronicDiseases && selectedPatient.chronicDiseases.length > 0
                  ? selectedPatient.chronicDiseases.join(", ")
                  : "None"}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Edit Patient</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Comma-separated values"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Chronic Diseases</label>
                <input
                  type="text"
                  name="chronicDiseases"
                  value={formData.chronicDiseases}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Comma-separated values"
                />
              </div>
              {message && (
                <p
                  className={`mt-2 text-sm ${
                    message.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditPatient(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {dossierPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
            {/* Close button at the top-right */}
            <button
              onClick={() => setDossierPatient(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" /> {/* Close icon */}
            </button>

            <h2 className="text-xl font-semibold mb-4">Dossier Patient</h2>
            <div className="mb-4">
              <p className="text-sm font-medium">Pregnancies:</p>
              <p className="text-gray-700">{dossierPatient.Pregnancies}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Glucose:</p>
              <p className="text-gray-700">{dossierPatient.Glucose}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Blood Pressure:</p>
              <p className="text-gray-700">{dossierPatient.BloodPressure}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Skin Thickness:</p>
              <p className="text-gray-700">{dossierPatient.SkinThickness}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Insulin:</p>
              <p className="text-gray-700">{dossierPatient.Insulin}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">BMI:</p>
              <p className="text-gray-700">{dossierPatient.BMI}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Diabetes Pedigree Function:</p>
              <p className="text-gray-700">{dossierPatient.DiabetesPedigreeFunction}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Age:</p>
              <p className="text-gray-700">{dossierPatient.Age}</p>
            </div>

            {/* Buttons at the bottom-right */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => handlePredictClick(dossierPatient)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                <FontAwesomeIcon icon={faBolt} /> {/* Predict icon */}
              </button>
              <button
                onClick={handleEditDossierClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faPen} /> {/* Edit icon */}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDossierForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Create Dossier Patient</h2>
            <form onSubmit={(e) => handleDossierFormSubmit(e, dossierFormData.id_patient)}>
              <input
                type="hidden"
                name="id_patient"
                value={dossierFormData.id_patient}
              />
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Pregnancies</label>
                <input
                  type="number"
                  name="Pregnancies"
                  value={dossierFormData.Pregnancies}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Glucose</label>
                <input
                  type="number"
                  name="Glucose"
                  value={dossierFormData.Glucose}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Blood Pressure</label>
                <input
                  type="number"
                  name="BloodPressure"
                  value={dossierFormData.BloodPressure}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Skin Thickness</label>
                <input
                  type="number"
                  name="SkinThickness"
                  value={dossierFormData.SkinThickness}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Insulin</label>
                <input
                  type="number"
                  name="Insulin"
                  value={dossierFormData.Insulin}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">BMI</label>
                <input
                  type="number"
                  name="BMI"
                  value={dossierFormData.BMI}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Diabetes Pedigree Function</label>
                <input
                  type="number"
                  name="DiabetesPedigreeFunction"
                  value={dossierFormData.DiabetesPedigreeFunction}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  name="Age"
                  value={dossierFormData.Age}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowDossierForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditDossierForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Edit Dossier Patient</h2>
            <form onSubmit={handleEditDossierFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Pregnancies</label>
                <input
                  type="number"
                  name="Pregnancies"
                  value={dossierFormData.Pregnancies}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Glucose</label>
                <input
                  type="number"
                  name="Glucose"
                  value={dossierFormData.Glucose}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Blood Pressure</label>
                <input
                  type="number"
                  name="BloodPressure"
                  value={dossierFormData.BloodPressure}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Skin Thickness</label>
                <input
                  type="number"
                  name="SkinThickness"
                  value={dossierFormData.SkinThickness}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Insulin</label>
                <input
                  type="number"
                  name="Insulin"
                  value={dossierFormData.Insulin}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">BMI</label>
                <input
                  type="number"
                  name="BMI"
                  value={dossierFormData.BMI}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Diabetes Pedigree Function</label>
                <input
                  type="number"
                  name="DiabetesPedigreeFunction"
                  value={dossierFormData.DiabetesPedigreeFunction}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  name="Age"
                  value={dossierFormData.Age}
                  onChange={handleDossierFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditDossierForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patient;
