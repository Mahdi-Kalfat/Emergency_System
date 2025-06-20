import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import UserInfoModal from "./PersonelleInfo";
import Swal from "sweetalert2"; // Import SweetAlert2

const Personelle = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const connectedUserRole = JSON.parse(localStorage.getItem("user"))?.role || ""; // Get the role of the connected user
  const navigate = useNavigate();

  const allowedRoles = ["Doctor", "Nurse", "Driver", "Chef", "worker"];

  const fetchUsers = async () => {
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

      const response = await fetch("http://localhost:3001/users/display", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      // Filter users based on allowed roles
      const filteredUsers = data.filter((user) => allowedRoles.includes(user.role));

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddClick = () => {
    navigate("/addpersonelle");
  };

  const handleEditClick = (emailSent) => {
    // Redirect to the edit page and pass the email as state
    navigate("/editPersonelle", { state: { emailSent } });
  };

  const handleViewClick = async (email) => {
    try {
      const response = await fetch(`http://localhost:3001/users/findBymail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1]}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await response.json();
      setSelectedUser(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleDeleteClick = async (userId) => {
    // Show confirmation pop-up
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    // If user confirms, proceed with deletion
    if (result.isConfirmed) {
      try {
        const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

        const response = await fetch(`http://localhost:3001/users/deleteUser/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        // Show success message
        await Swal.fire({
          title: "Deleted!",
          text: "The user has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        // Refresh the page to reflect the changes
        window.location.reload();
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete user. Please try again later.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  const getImageByRole = (role) => {
    switch (role) {
      case "Doctor":
        return "public/avatar/doc.png";
      case "Nurse":
        return "public/avatar/nurse.png";
      case "Driver":
        return "public/avatar/driver.png";
      case "Chef":
        return "public/avatar/chief.png";
      default:
        return "src/images/user/default.jpg";
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <SideBar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
      </div>

      <div className="content-container">
        <Header sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />

        <div className="space-y-5 sm:space-y-6 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-5 py-4 sm:px-6 sm:py-5 flex justify-between items-center">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                List Personal
              </h3>
              {connectedUserRole === "Chef" && (
                <button className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600" onClick={handleAddClick}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                          <img src={`http://localhost:3001/uploads/${user.image}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">{user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                        <div className="flex justify-center gap-2 mt-4">
                          {connectedUserRole === "Chef" && (
                            <button
                              className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                              onClick={() => handleEditClick(user.email)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          )}
                          {connectedUserRole === "Chef" && (
                            <button
                              className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                              onClick={() => handleDeleteClick(user.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}
                          <button
                            className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                            onClick={() => handleViewClick(user.email)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 col-span-full">No users found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedUser && <UserInfoModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

export default Personelle;