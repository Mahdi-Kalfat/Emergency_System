import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import Chart from "react-apexcharts";
import axios from "axios";
import Swal from "sweetalert2";

const Depot = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [chartData, setChartData] = useState({
    series: [],
    labels: [],
  });
  const [medicaments, setMedicaments] = useState([]); // Store all medicaments
  const [filteredMedicaments, setFilteredMedicaments] = useState([]); // Store filtered medicaments
  const [hoveredMedicament, setHoveredMedicament] = useState(null); // Store hovered medicament
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // Store cursor position
  const [showPopup, setShowPopup] = useState(false); // State to toggle popup visibility
  const [newMedicament, setNewMedicament] = useState({
    numSerie: "",
    typeMedicament: "",
    nom: "",
    dateAjout: "",
    dateExpiration: "",
    quantite: "",
    photo: null,
  });

  const [materiels, setMateriels] = useState([]); // Store all materiels
  const [showMaterielPopup, setShowMaterielPopup] = useState(false); // State to toggle materiel popup visibility
  const [newMateriel, setNewMateriel] = useState({
    numSerie: "",
    typeMateriel: "",
    nom: "",
    dateAjout: "",
    dateExpiration: "",
    quantite: "",
    photo: null,
  });
  const [hoveredMateriel, setHoveredMateriel] = useState(null); // Store hovered materiel
  const [materielCursorPosition, setMaterielCursorPosition] = useState({ x: 0, y: 0 }); // Store cursor position for materiels

  const [ambulances, setAmbulances] = useState([]); // Store all ambulances

  const options = [
    "Antibiotic",
    "Analgesic",
    "Antipyretic",
    "Antiseptic",
    "Vaccine",
    "Other",
  ];

  const materielOptions = ["Defibrillator", "Ventilator", "Monitor", "Stretcher", "Other"];

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchMedicamentData = async () => {
      try {
        const response = await fetch("http://localhost:3001/med/medlist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch medicament data");
        }

        const data = await response.json();

        // Count medicaments by type for the chart
        const typeCounts = data.reduce((acc, med) => {
          acc[med.typeMedicament] = (acc[med.typeMedicament] || 0) + 1;
          return acc;
        }, {});

        // Prepare series and labels for the chart
        const series = Object.values(typeCounts);
        const labels = Object.keys(typeCounts);

        setChartData({ series, labels });
        setMedicaments(data); // Store all medicaments
      } catch (error) {
        console.error("Error fetching medicament data:", error);
      }
    };

    fetchMedicamentData();
  }, []);

  useEffect(() => {
    const fetchMaterielData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/materiel/materiellist");
        setMateriels(response.data);
      } catch (error) {
        console.error("Error fetching materiel data:", error);
      }
    };

    fetchMaterielData();
  }, []);

  useEffect(() => {
    const fetchAmbulances = async () => {
      try {
        const response = await axios.get("http://localhost:3001/ambulance/getAmbulance");
        setAmbulances(response.data); // Store all ambulances
      } catch (error) {
        console.error("Error fetching ambulances:", error);
      }
    };

    fetchAmbulances();
  }, []);

  // Filter medicaments based on the selected type
  useEffect(() => {
    if (selectedOption) {
      const filtered = medicaments.filter(
        (med) => med.typeMedicament === selectedOption
      );
      setFilteredMedicaments(filtered);
    } else {
      setFilteredMedicaments([]);
    }
  }, [selectedOption, medicaments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedicament({ ...newMedicament, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewMedicament({ ...newMedicament, photo: e.target.files[0] });
  };

  const handleMaterielInputChange = (e) => {
    const { name, value } = e.target;
    setNewMateriel({ ...newMateriel, [name]: value });
  };

  const handleMaterielFileChange = (e) => {
    setNewMateriel({ ...newMateriel, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Convert `quantite` to a number
    const medicamentData = {
      ...newMedicament,
      quantite: parseInt(newMedicament.quantite, 10),
    };

    Object.keys(medicamentData).forEach((key) => {
      formData.append(key, medicamentData[key]);
    });

    try {
      const response = await axios.post("http://localhost:3001/med/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Medicament created:", response.data);

      // Refresh medicament list
      const fetchMedicamentData = async () => {
        try {
          const response = await axios.get("http://localhost:3001/med/medlist");
          const data = response.data;

          // Update chart data
          const typeCounts = data.reduce((acc, med) => {
            acc[med.typeMedicament] = (acc[med.typeMedicament] || 0) + 1;
            return acc;
          }, {});
          const series = Object.values(typeCounts);
          const labels = Object.keys(typeCounts);
          setChartData({ series, labels });

          setMedicaments(data); // Update medicament list
        } catch (error) {
          console.error("Error fetching medicament data:", error);
        }
      };

      fetchMedicamentData();

      setShowPopup(false);
      setNewMedicament({
        numSerie: "",
        typeMedicament: "",
        nom: "",
        dateAjout: "",
        dateExpiration: "",
        quantite: "",
        photo: null,
      });
    } catch (error) {
      console.error("Error creating medicament:", error);
      if (error.response && error.response.data) {
        console.error("Backend error message:", error.response.data.error);
      }
    }
  };

  const handleMaterielSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const materielData = {
      ...newMateriel,
      quantite: parseInt(newMateriel.quantite, 10),
    };

    Object.keys(materielData).forEach((key) => {
      formData.append(key, materielData[key]);
    });

    try {
      const response = await axios.post("http://localhost:3001/materiel/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Materiel created:", response.data);

      // Refresh materiel list
      const updatedMateriels = await axios.get("http://localhost:3001/materiel/materiellist");
      setMateriels(updatedMateriels.data);

      setShowMaterielPopup(false);
      setNewMateriel({
        numSerie: "",
        typeMateriel: "",
        nom: "",
        dateAjout: "",
        dateExpiration: "",
        quantite: "",
        photo: null,
      });
    } catch (error) {
      console.error("Error creating materiel:", error);
    }
  };

  const handleDelete = async (id) => {
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
          await axios.delete(`http://localhost:3001/med/delete/${id}`);
          Swal.fire("Deleted!", "The medicament has been deleted.", "success");

          // Refresh medicament list after deletion
          const response = await axios.get("http://localhost:3001/med/medlist");
          const data = response.data;

          // Update chart data
          const typeCounts = data.reduce((acc, med) => {
            acc[med.typeMedicament] = (acc[med.typeMedicament] || 0) + 1;
            return acc;
          }, {});
          const series = Object.values(typeCounts);
          const labels = Object.keys(typeCounts);
          setChartData({ series, labels });

          setMedicaments(data); // Update medicament list
        } catch (error) {
          console.error("Error deleting medicament:", error);
          Swal.fire("Error!", "Failed to delete the medicament.", "error");
        }
      }
    });
  };

  const handleSetAvailable = async (ambulanceId) => {
    try {
      const response = await axios.put("http://localhost:3001/ambulance/available", {
        id: ambulanceId,
      });
      const updatedAmbulance = response.data;

      // Update the ambulance list
      setAmbulances((prev) =>
        prev.map((amb) =>
          amb._id === updatedAmbulance._id ? updatedAmbulance : amb
        )
      );

      Swal.fire("Success", "The ambulance is now available.", "success");
    } catch (error) {
      console.error("Error updating ambulance status:", error);
      Swal.fire("Error", "Failed to update ambulance status. Please try again.", "error");
    }
  };

  const chartOptions = {
    chart: {
      type: "pie",
      height: 250,
    },
    labels: chartData.labels,
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`, // Format percentage to 1 decimal place
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: (val, opts) => {
          const seriesIndex = opts.seriesIndex;
          return `${chartData.series[seriesIndex]} items`; // Show the count of medicaments
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideBar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} page="Depot" />

      <div className="flex flex-col flex-grow">
        {/* Header */}
        <Header sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />

        {/* Main Content */}
        <main className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Section for Medicaments Statistics */}
            <div className="lg:col-span-4 bg-gray-100 p-4 rounded-lg shadow-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold mb-4">Select Category</h2>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                  >
                    +
                  </button>
                </div>
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    -- Select an option --
                  </option>
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Statistics Card Container */}
              <div className="mt-6 flex-grow">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md h-full">
                  <h3 className="text-lg font-semibold mb-4">Medicament Statistics</h3>
                  <Chart
                    options={chartOptions}
                    series={chartData.series}
                    type="pie"
                    height="100%"
                  />
                </div>
              </div>
            </div>

            {/* Right Section for Medicaments Table */}
            <div className="lg:col-span-8 bg-gray-100 p-4 rounded-lg shadow-md flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-4">Medicaments</h2>
                <div className="h-[400px] border border-gray-300 rounded-lg overflow-y-auto relative">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">Num Serie</th>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Date Added</th>
                        <th className="border border-gray-300 px-4 py-2">Expiration Date</th>
                        <th className="border border-gray-300 px-4 py-2">Quantity</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedicaments.length > 0 ? (
                        filteredMedicaments.map((med) => (
                          <tr
                            key={med._id}
                            onMouseEnter={(e) => {
                              setHoveredMedicament(med);
                              const rowRect = e.currentTarget.getBoundingClientRect();
                              setCursorPosition({ x: rowRect.left, y: rowRect.top });
                            }}
                            onMouseLeave={() => setHoveredMedicament(null)}
                            className="hover:bg-gray-100"
                          >
                            <td className="border border-gray-300 px-4 py-2">{med.numSerie}</td>
                            <td className="border border-gray-300 px-4 py-2">{med.nom}</td>
                            <td className="border border-gray-300 px-4 py-2">{med.dateAjout}</td>
                            <td className="border border-gray-300 px-4 py-2">{med.dateExpiration}</td>
                            <td className="border border-gray-300 px-4 py-2">{med.quantite}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <button
                                onClick={() => handleDelete(med._id)}
                                className="text-red-500 hover:text-red-700"
                                aria-label="Delete"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-gray-500 p-4 text-center">
                            No medicaments available for the selected category.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Hovered Medicament Image */}
                  {hoveredMedicament && hoveredMedicament.photo && (
                    <div
                      className="absolute p-2 bg-white border border-gray-300 rounded-lg shadow-lg pointer-events-none"
                      style={{
                        top: `${cursorPosition.y - 150}px`,
                        left: `${cursorPosition.x - 800}px`,
                      }}
                    >
                      <img
                        src={`http://localhost:3001${hoveredMedicament.photo}`}
                        alt={hoveredMedicament.nom}
                        className="w-32 h-32 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Materiels and Ambulance Section */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Materiels Table */}
            <div className="lg:col-span-6 bg-gray-100 p-4 rounded-lg shadow-md relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Materiels</h3>
                <button
                  onClick={() => setShowMaterielPopup(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  +
                </button>
              </div>
              <div className="h-[400px] border border-gray-300 rounded-lg overflow-y-auto relative">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Num Serie</th>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Date Added</th>
                      <th className="border border-gray-300 px-4 py-2">Expiration Date</th>
                      <th className="border border-gray-300 px-4 py-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materiels.length > 0 ? (
                      materiels.map((mat) => (
                        <tr
                          key={mat._id}
                          onMouseEnter={(e) => {
                            setHoveredMateriel(mat);
                            const rowRect = e.currentTarget.getBoundingClientRect();
                            setMaterielCursorPosition({ x: rowRect.left, y: rowRect.top });
                          }}
                          onMouseLeave={() => setHoveredMateriel(null)}
                          className="hover:bg-gray-100"
                        >
                          <td className="border border-gray-300 px-4 py-2">{mat.numSerie}</td>
                          <td className="border border-gray-300 px-4 py-2">{mat.nom}</td>
                          <td className="border border-gray-300 px-4 py-2">{mat.dateAjout}</td>
                          <td className="border border-gray-300 px-4 py-2">{mat.dateExpiration}</td>
                          <td className="border border-gray-300 px-4 py-2">{mat.quantite}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-gray-500 p-4 text-center">
                          No materiels available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Hovered Materiel Image */}
                {hoveredMateriel && hoveredMateriel.photo && (
                  <div
                    className="absolute p-2 bg-white border border-gray-300 rounded-lg shadow-lg pointer-events-none"
                    style={{
                      top: `${materielCursorPosition.y - 470}px`,
                      left: `${materielCursorPosition.x - 250}px`,
                    }}
                  >
                    <img
                      src={`http://localhost:3001${hoveredMateriel.photo}`}
                      alt={hoveredMateriel.nom}
                      className="w-32 h-32 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Ambulance Table */}
            <div className="lg:col-span-6 bg-gray-100 p-4 rounded-lg shadow-md relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Ambulance (Under Maintenance)</h3>
              </div>
              <div className="h-[400px] border border-gray-300 rounded-lg overflow-y-auto relative">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Plate Number</th>
                      <th className="border border-gray-300 px-4 py-2">Model</th>
                      <th className="border border-gray-300 px-4 py-2">Matricule</th>
                      <th className="border border-gray-300 px-4 py-2">Admission Date</th>
                      <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambulances.filter((amb) => amb.status === "Under Maintenance").length > 0 ? (
                      ambulances
                        .filter((amb) => amb.status === "Under Maintenance")
                        .map((amb) => (
                          <tr key={amb._id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{amb.plate_number}</td>
                            <td className="border border-gray-300 px-4 py-2">{amb.brand}</td>
                            <td className="border border-gray-300 px-4 py-2">{amb.matricule}</td>
                            <td className="border border-gray-300 px-4 py-2">{formatDate(amb.admission_date)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <button
                                onClick={() => handleSetAvailable(amb._id)}
                                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
                                aria-label="Make Available"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-gray-500 p-4 text-center">
                          No ambulances under maintenance.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Popup Form for Medicaments */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add Medicament</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Num Serie</label>
                <input
                  type="text"
                  name="numSerie"
                  value={newMedicament.numSerie}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="typeMedicament"
                  value={newMedicament.typeMedicament}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="" disabled>
                    -- Select Type --
                  </option>
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="nom"
                  value={newMedicament.nom}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date Added</label>
                <input
                  type="date"
                  name="dateAjout"
                  value={newMedicament.dateAjout}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Expiration Date</label>
                <input
                  type="date"
                  name="dateExpiration"
                  value={newMedicament.dateExpiration}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantite"
                  value={newMedicament.quantite}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Photo</label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup Form for Materiels */}
      {showMaterielPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add Materiel</h2>
            <form onSubmit={handleMaterielSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Num Serie</label>
                <input
                  type="text"
                  name="numSerie"
                  value={newMateriel.numSerie}
                  onChange={handleMaterielInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="typeMateriel"
                  value={newMateriel.typeMateriel}
                  onChange={handleMaterielInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="" disabled>
                    -- Select Type --
                  </option>
                  {materielOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="nom"
                  value={newMateriel.nom}
                  onChange={handleMaterielInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date Added</label>
                <input
                  type="date"
                  name="dateAjout"
                  value={newMateriel.dateAjout}
                  onChange={handleMaterielInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Expiration Date</label>
                <input
                  type="date"
                  name="dateExpiration"
                  value={newMateriel.dateExpiration}
                  onChange={handleMaterielInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantite"
                  value={newMateriel.quantite}
                  onChange={handleMaterielInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Photo</label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleMaterielFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMaterielPopup(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Depot;
