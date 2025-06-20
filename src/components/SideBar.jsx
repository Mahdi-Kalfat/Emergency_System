import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert

const SideBar = ({ sidebarToggle, setSidebarToggle, page }) => {
  const [selected, setSelected] = useState("");
  const [userRole, setUserRole] = useState(null); // State for user role
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Parse the user object from local storage
    setUserRole(user?.role || null); // Extract the role or set to null if not found
  }, []);

  const handleSelection = (item) => {
    setSelected(selected === item ? "" : item);
  };

  const handleAmbulanceAccess = () => {
    if (userRole === "Driver" || userRole === "Chef") {
      navigate("/ambulance");
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You don't have permission to access this section.",
      });
    }
  };

  const handleDepotAccess = () => {
    if (userRole === "Chef" || userRole === "Worker") {
      navigate("/depot");
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You don't have permission to access this section.",
      });
    }
  };

  const handlePersonelleAccess = () => {
    if (userRole === "Doctor" || userRole === "Nurse" || userRole === "Chef") {
      navigate("/personelle");
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You don't have permission to access this section.",
      });
    }
  };

  const handlePatientAccess = () => {
    if (userRole === "Doctor" || userRole === "Nurse" || userRole === "Chef") {
      navigate("/patient");
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You don't have permission to access this section.",
      });
    }
  };

  return (
    <aside
      className={`sidebar fixed left-0 top-0 z-full flex h-screen w-[290px] flex-col overflow-y-hidden border-r border-gray-200 bg-white px-5 duration-300 ease-linear dark:border-gray-800 dark:bg-black lg:static lg:translate-x-0 ${
        sidebarToggle ? "translate-x-0 lg:w-[90px]" : "-translate-x-full"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* SIDEBAR HEADER */}
      <div
        className={`sidebar-header flex items-center gap-2 pb-7 pt-8 ${
          sidebarToggle ? "justify-center" : "justify-between"
        }`}
      >
        <a href="index.html">
          <span className={`logo ${sidebarToggle ? "hidden" : ""}`}>
            <img
              className="dark:hidden"
              src="./images/logo/logo.svg"
              alt="Logo"
            />
            <img
              className="hidden dark:block"
              src="./images/logo/logo-dark.svg"
              alt="Logo"
            />
          </span>
          <img
            className={`logo-icon ${sidebarToggle ? "lg:block" : "hidden"}`}
            src="./images/logo/logo-icon.svg"
            alt="Logo"
          />
        </a>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav>
          {/* Menu Group */}
          <div>
            <h3 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
              <span
                className={`menu-group-title ${
                  sidebarToggle ? "lg:hidden" : ""
                }`}
              >
                MENU
              </span>
              {sidebarToggle && (
                <svg
                  className="menu-group-icon mx-auto fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.99915 10.2451C6.96564 10.2451 7.74915 11.0286 7.74915 11.9951V12.0051C7.74915 12.9716 6.96564 13.7551 5.99915 13.7551C5.03265 13.7551 4.24915 12.9716 4.24915 12.0051V11.9951C4.24915 11.0286 5.03265 10.2451 5.99915 10.2451ZM17.9991 10.2451C18.9656 10.2451 19.7491 11.0286 19.7491 11.9951V12.0051C19.7491 12.9716 18.9656 13.7551 17.9991 13.7551C17.0326 13.7551 16.2491 12.9716 16.2491 12.0051V11.9951C16.2491 11.0286 17.0326 10.2451 17.9991 10.2451ZM13.7491 11.9951C13.7491 11.0286 12.9656 10.2451 11.9991 10.2451C11.0326 10.2451 10.2491 11.0286 10.2491 11.9951V12.0051C10.2491 12.9716 11.0326 13.7551 11.9991 13.7551C12.9656 13.7551 13.7491 12.9716 13.7491 12.0051V11.9951Z"
                    fill=""
                  />
                </svg>
              )}
            </h3>

            <ul className="mb-6 flex flex-col gap-4">
              {/* Menu Item Dashboard */}
              <li>
                <a
                  href="#"
                  onClick={() => navigate("/home")}
                  className={`menu-item group ${
                    selected === "Dashboard" ||
                    [
                      "ecommerce",
                      "analytics",
                      "marketing",
                      "crm",
                      "stocks",
                    ].includes(page)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <svg
                    className={`${
                      selected === "Dashboard" ||
                      [
                        "ecommerce",
                        "analytics",
                        "marketing",
                        "crm",
                        "stocks",
                      ].includes(page)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V8.99998C3.25 10.2426 4.25736 11.25 5.5 11.25H9C10.2426 11.25 11.25 10.2426 11.25 8.99998V5.5C11.25 4.25736 10.2426 3.25 9 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H9C9.41421 4.75 9.75 5.08579 9.75 5.5V8.99998C9.75 9.41419 9.41421 9.74998 9 9.74998H5.5C5.08579 9.74998 4.75 9.41419 4.75 8.99998V5.5ZM5.5 12.75C4.25736 12.75 3.25 13.7574 3.25 15V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H9C10.2426 20.75 11.25 19.7427 11.25 18.5V15C11.25 13.7574 10.2426 12.75 9 12.75H5.5ZM4.75 15C4.75 14.5858 5.08579 14.25 5.5 14.25H9C9.41421 14.25 9.75 14.5858 9.75 15V18.5C9.75 18.9142 9.41421 19.25 9 19.25H5.5C5.08579 19.25 4.75 18.9142 4.75 18.5V15ZM12.75 5.5C12.75 4.25736 13.7574 3.25 15 3.25H18.5C19.7426 3.25 20.75 4.25736 20.75 5.5V8.99998C20.75 10.2426 19.7426 11.25 18.5 11.25H15C13.7574 11.25 12.75 10.2426 12.75 8.99998V5.5ZM15 4.75C14.5858 4.75 14.25 5.08579 14.25 5.5V8.99998C14.25 9.41419 14.5858 9.74998 15 9.74998H18.5C18.9142 9.74998 19.25 9.41419 19.25 8.99998V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H15ZM15 12.75C13.7574 12.75 12.75 13.7574 12.75 15V18.5C12.75 19.7426 13.7574 20.75 15 20.75H18.5C19.7426 20.75 20.75 19.7427 20.75 18.5V15C20.75 13.7574 19.7426 12.75 18.5 12.75H15ZM14.25 15C14.25 14.5858 14.5858 14.25 15 14.25H18.5C18.9142 14.25 19.25 14.5858 19.25 15V18.5C19.25 18.9142 18.9142 19.25 18.5 19.25H15C14.5858 19.25 14.25 18.9142 14.25 18.5V15Z"
                      fill=""
                    />
                  </svg>

                  <span
                    className={`menu-item-text ${
                      sidebarToggle ? "lg:hidden" : ""
                    }`}
                  >
                    Dashboard
                  </span>
                </a>
              </li>
              {/* Menu Item Dashboard */}

              {/* Menu Item User Actions */}
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelection("UserActions");
                  }}
                  className={`menu-item group ${
                    selected === "UserActions"
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <svg
                    className={`${
                      selected === "UserActions"
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V8.99998C3.25 10.2426 4.25736 11.25 5.5 11.25H9C10.2426 11.25 11.25 10.2426 11.25 8.99998V5.5C11.25 4.25736 10.2426 3.25 9 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H9C9.41421 4.75 9.75 5.08579 9.75 5.5V8.99998C9.75 9.41419 9.41421 9.74998 9 9.74998H5.5C5.08579 9.74998 4.75 9.41419 4.75 8.99998V5.5ZM5.5 12.75C4.25736 12.75 3.25 13.7574 3.25 15V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H9C10.2426 20.75 11.25 19.7427 11.25 18.5V15C11.25 13.7574 10.2426 12.75 9 12.75H5.5ZM4.75 15C4.75 14.5858 5.08579 14.25 5.5 14.25H9C9.41421 14.25 9.75 14.5858 9.75 15V18.5C9.75 18.9142 9.41421 19.25 9 19.25H5.5C5.08579 19.25 4.75 18.9142 4.75 18.5V15ZM12.75 5.5C12.75 4.25736 13.7574 3.25 15 3.25H18.5C19.7426 3.25 20.75 4.25736 20.75 5.5V8.99998C20.75 10.2426 19.7426 11.25 18.5 11.25H15C13.7574 11.25 12.75 10.2426 12.75 8.99998V5.5ZM15 4.75C14.5858 4.75 14.25 5.08579 14.25 5.5V8.99998C14.25 9.41419 14.5858 9.74998 15 9.74998H18.5C18.9142 9.74998 19.25 9.41419 19.25 8.99998V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H15ZM15 12.75C13.7574 12.75 12.75 13.7574 12.75 15V18.5C12.75 19.7426 13.7574 20.75 15 20.75H18.5C19.7426 20.75 20.75 19.7427 20.75 18.5V15C20.75 13.7574 19.7426 12.75 18.5 12.75H15ZM14.25 15C14.25 14.5858 14.5858 14.25 15 14.25H18.5C18.9142 14.25 19.25 14.5858 19.25 15V18.5C19.25 18.9142 18.9142 19.25 18.5 19.25H15C14.5858 19.25 14.25 18.9142 14.25 18.5V15Z"
                      fill=""
                    />
                  </svg>

                  <span
                    className={`menu-item-text ${
                      sidebarToggle ? "lg:hidden" : ""
                    }`}
                  >
                    User Actions
                  </span>

                  <svg
                    className={`menu-item-arrow ${
                      selected === "UserActions"
                        ? "menu-item-arrow-active"
                        : "menu-item-arrow-inactive"
                    } ${sidebarToggle ? "lg:hidden" : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585"
                      stroke=""
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                {selected === "UserActions" && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li>
                      <a
                        href="#"
                        className="menu-item group menu-item-inactive"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePersonelleAccess();
                        }}
                      >
                        <svg
                          className="menu-item-icon"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20ZM11 11H13V13H11V11ZM11 7H13V9H11V7ZM11 15H13V17H11V15Z"
                            fill="currentColor"
                          />
                        </svg>
                        Personal Actions
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="menu-item group menu-item-inactive"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePatientAccess();
                        }}
                      >
                        <svg
                          className="menu-item-icon"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20ZM11 11H13V13H11V11ZM11 7H13V9H11V7ZM11 15H13V17H11V15Z"
                            fill="currentColor"
                          />
                        </svg>
                        Patient Actions
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              {/* Menu Item User Actions */}

              {/* Menu Item Depot */}
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDepotAccess();
                  }}
                  style={{ textDecoration: "none" }} // Ensure no underline
                  className={`menu-item group ${
                    selected === "Depot" ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <svg
                    className={`${
                      selected === "Depot"
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20ZM11 11H13V13H11V11ZM11 7H13V9H11V7ZM11 15H13V17H11V15Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span
                    className={`menu-item-text ${
                      sidebarToggle ? "lg:hidden" : ""
                    }`}
                  >
                    Depot
                  </span>
                </a>
              </li>
              {/* Menu Item Depot */}

              {/* Menu Item Ambulance */}
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAmbulanceAccess();
                  }}
                  className={`menu-item group ${
                    selected === "Ambulance"
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <svg
                    className={`${
                      selected === "Ambulance"
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20ZM11 11H13V13H11V11ZM11 7H13V9H11V7ZM11 15H13V17H11V15Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span
                    className={`menu-item-text ${
                      sidebarToggle ? "lg:hidden" : ""
                    }`}
                  >
                    Ambulance
                  </span>
                </a>
              </li>
              {/* Menu Item Ambulance */}

              {/* Menu Item Reclamation */}
              <li>
                <a
                  href="#"
                  onClick={() => navigate("/reclamation")}
                  style={{ textDecoration: "none" }} // Ensure no underline
                  className={`menu-item group ${
                    selected === "Reclamation" ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <svg
                    className={`${
                      selected === "Reclamation"
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20ZM11 11H13V13H11V11ZM11 7H13V9H11V7ZM11 15H13V17H11V15Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span
                    className={`menu-item-text ${
                      sidebarToggle ? "lg:hidden" : ""
                    }`}
                  >
                    Reclamation
                  </span>
                </a>
              </li>
              {/* Menu Item Reclamation */}
            </ul>
          </div>
        </nav>
        {/* Sidebar Menu */}
      </div>
    </aside>
  );
};

export default SideBar;
