import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar"; // Import SideBar
import Header from "../../components/Header"; // Import Header
import Chart from "react-apexcharts"; // Import ApexCharts for the line chart
import Swal from "sweetalert2"; // Import SweetAlert2

export default function Reclamation() {
  const [reclamations, setReclamations] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "line",
        height: 350,
      },
      xaxis: {
        categories: [], // Months
      },
      title: {
        text: "Reclamations Created Per Month",
        align: "center",
      },
    },
  });

  const [roleChartData, setRoleChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "pie",
      },
      labels: [], // Roles
      title: {
        text: "Reclamations by Role",
        align: "center",
      },
    },
  });

  const [showAddForm, setShowAddForm] = useState(false); // State to toggle the add form
  const [newReclamation, setNewReclamation] = useState({
    subject: "",
    message: "",
  });

  const badWords = ["dog", "cat", "cow", "pig", "goat", "sheep", "horse"];

  const filterBadWords = (text) => {
    const regex = new RegExp(`(${badWords.join("|")})`, "gi"); // Match bad words even if concatenated
    return text.replace(regex, (match) => "*".repeat(match.length)); // Replace each bad word with the same number of asterisks
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReclamation({ ...newReclamation, [name]: filterBadWords(value) });
  };

  const refreshStatistics = async () => {
    try {
      const response = await axios.get("http://localhost:3001/reclamation/getAllRec");
      const data = Array.isArray(response.data) ? response.data : [];

      // Process data for the chart
      const monthlyCounts = Array(12).fill(0);
      data.forEach((reclamation) => {
        const month = new Date(reclamation.createdAt).getMonth();
        monthlyCounts[month]++;
      });

      setChartData({
        series: [
          {
            name: "Reclamations",
            data: monthlyCounts,
          },
        ],
        options: {
          ...chartData.options,
          xaxis: {
            categories: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
          },
        },
      });
    } catch (error) {
      console.error("Error refreshing statistics:", error);
    }
  };

  const refreshRoleStatistics = async () => {
    try {
      const response = await axios.get("http://localhost:3001/reclamation/getAllRec");
      const data = Array.isArray(response.data) ? response.data : [];

      // Process data for the pie chart
      const roleCounts = {};
      data.forEach((reclamation) => {
        const role = reclamation.role || "Unknown";
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });

      setRoleChartData({
        series: Object.values(roleCounts),
        options: {
          ...roleChartData.options,
          labels: Object.keys(roleCounts),
        },
      });
    } catch (error) {
      console.error("Error refreshing role statistics:", error);
    }
  };

  const refreshAllStatistics = async () => {
    await refreshStatistics();
    await refreshRoleStatistics();
  };

  const handleAddReclamation = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
      if (!user || !user.id) {
        throw new Error("User not found in localStorage.");
      }

      console.log("Payload:", {
        ...newReclamation,
        user: user.id,
      });

      const response = await axios.post("http://localhost:3001/reclamation/addRec", {
        ...newReclamation,
        user: user.id, // Pass the user ID
      });

      setReclamations((prev) => [response.data, ...prev]); // Add the new reclamation to the list
      await refreshAllStatistics(); // Refresh all statistics after adding
      setNewReclamation({ subject: "", message: "" }); // Reset the form
      setShowAddForm(false); // Hide the form
      Swal.fire("Success!", "Reclamation added successfully.", "success");
    } catch (error) {
      console.error("Error adding reclamation:", error.response?.data || error.message);
      Swal.fire("Error!", error.response?.data?.message || "Failed to add the reclamation.", "error");
    }
  };

  const getCensoredReclamations = () => {
    return reclamations.filter((reclamation) => reclamation.message.includes("***"));
  };

  useEffect(() => {
    // Fetch user role from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user?.role || null);

    // Fetch reclamations from the backend
    const fetchReclamations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/reclamation/getAllRec"); // Use http for localhost
        const data = Array.isArray(response.data) ? response.data : [];
        setReclamations(data);

        // Process data for the chart
        const monthlyCounts = Array(12).fill(0); // Initialize counts for each month
        data.forEach((reclamation) => {
          const month = new Date(reclamation.createdAt).getMonth(); // Get month (0-11)
          monthlyCounts[month]++;
        });

        setChartData({
          series: [
            {
              name: "Reclamations",
              data: monthlyCounts,
            },
          ],
          options: {
            ...chartData.options,
            xaxis: {
              categories: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
            },
          },
        });

        // Process data for the pie chart
        const roleCounts = {};
        data.forEach((reclamation) => {
          const role = reclamation.role || "Unknown";
          roleCounts[role] = (roleCounts[role] || 0) + 1;
        });

        setRoleChartData({
          series: Object.values(roleCounts),
          options: {
            ...roleChartData.options,
            labels: Object.keys(roleCounts),
          },
        });
      } catch (error) {
        console.error("Error fetching reclamations:", error);
      }
    };

    fetchReclamations();
  }, []);

  const handleDeleteReclamation = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this reclamation!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/reclamation/deleteRec/${id}`);
          setReclamations((prev) => prev.filter((rec) => rec._id !== id)); // Update the list after deletion
          await refreshAllStatistics(); // Refresh all statistics after deletion
          Swal.fire("Deleted!", "The reclamation has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting reclamation:", error);
          Swal.fire("Error!", "Failed to delete the reclamation.", "error");
        }
      }
    });
  };

  const handleUpdateStatus = async (id) => {
    Swal.fire({
      title: "Mark as Traité?",
      text: "This will update the status of the reclamation to 'Traité'.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`http://localhost:3001/reclamation/updateStatus/${id}`, {
            status: "Traité",
          });
          setReclamations((prev) =>
            prev.map((rec) =>
              rec._id === id ? { ...rec, status: response.data.status } : rec
            )
          );
          await refreshAllStatistics(); // Refresh all statistics after status update
          Swal.fire("Updated!", "The reclamation status has been updated to 'Traité'.", "success");
        } catch (error) {
          console.error("Error updating reclamation status:", error);
          Swal.fire("Error!", "Failed to update the reclamation status.", "error");
        }
      }
    });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar sidebarToggle={false} setSidebarToggle={() => {}} page="reclamation" />

      <div className="flex-1">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Reclamation List</h1>
            <button
              onClick={() => setShowAddForm((prev) => !prev)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
            >
              +
            </button>
          </div>
          {showAddForm && (
            <form onSubmit={handleAddReclamation} className="mb-4 p-4 border border-gray-300 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={newReclamation.subject}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  value={newReclamation.message}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
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
          )}
          {userRole === "Chef" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Table Section */}
              <div className="lg:col-span-7 h-[400px] border border-gray-300 rounded-lg overflow-y-auto relative">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">User</th>
                      <th className="border border-gray-300 px-4 py-2">Role</th>
                      <th className="border border-gray-300 px-4 py-2">Subject</th>
                      <th className="border border-gray-300 px-4 py-2">Message</th>
                      <th className="border border-gray-300 px-4 py-2">Status</th>
                      <th className="border border-gray-300 px-4 py-2">Created At</th>
                      <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reclamations.length > 0 ? (
                      reclamations.map((reclamation) => (
                        <tr key={reclamation._id} className="hover:bg-gray-100">
                          <td className="border border-gray-300 px-4 py-2">{reclamation.user}</td>
                          <td className="border border-gray-300 px-4 py-2">{reclamation.role}</td>
                          <td className="border border-gray-300 px-4 py-2">{reclamation.subject}</td>
                          <td className="border border-gray-300 px-4 py-2">{reclamation.message}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <span
                              className={`${
                                reclamation.status === "Traité" ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {reclamation.status}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(reclamation.createdAt).toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleUpdateStatus(reclamation._id)}
                                className={`${
                                  reclamation.status === "Traité"
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-green-500 hover:text-green-700"
                                }`}
                                aria-label="Mark as Traité"
                                disabled={reclamation.status === "Traité"}
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteReclamation(reclamation._id)}
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
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-gray-500 p-4 text-center">
                          No reclamations available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Chart Section */}
              <div className="lg:col-span-5 bg-white p-4 rounded-lg shadow-md">
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="line"
                  height={350}
                />
              </div>

              {/* Pie Chart Section */}
              <div className="lg:col-span-5 bg-white p-4 rounded-lg shadow-md">
                <Chart
                  options={roleChartData.options}
                  series={roleChartData.series}
                  type="pie"
                  height={350}
                />
              </div>

              {/* Censored Reclamations Table */}
              <div className="lg:col-span-7 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Censored Reclamations</h2>
                <div className="h-[350px] overflow-y-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">User</th>
                        <th className="border border-gray-300 px-4 py-2">Role</th>
                        <th className="border border-gray-300 px-4 py-2">Subject</th>
                        <th className="border border-gray-300 px-4 py-2">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCensoredReclamations().length > 0 ? (
                        getCensoredReclamations().map((reclamation) => (
                          <tr key={reclamation._id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{reclamation.user}</td>
                            <td className="border border-gray-300 px-4 py-2">{reclamation.role}</td>
                            <td className="border border-gray-300 px-4 py-2">{reclamation.subject}</td>
                            <td className="border border-gray-300 px-4 py-2">{reclamation.message}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-gray-500 p-4 text-center">
                            No censored reclamations available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-red-500 font-semibold">
              Only Chef service can view the list of reclamations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
