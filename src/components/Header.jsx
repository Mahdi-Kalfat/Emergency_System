import React, { useState, useEffect } from 'react';
import logo from '../assets/logoEms.png'; 

const Header = () => {
  const [isPatientConnected, setIsPatientConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsPatientConnected(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    setIsPatientConnected(false);
    setUser(null);
    window.location.href = "/home"; // Redirect to login page
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  return (
    <header>
      <div className="header-area">
        <div className="main-header header-sticky">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-2 col-md-1">
                <div className="logo">
                  <a href="/" className="d-flex align-items-center" style={{ textDecoration: "none" }}>
                    <img src={logo} alt="Emergency Logo" className="img-fluid" style={{ height: "40px" }} />
                    <span className="logo-text ms-2" style={{ fontSize: "24px", fontWeight: "700", color: "#3face4" }}>EMS</span>
                  </a>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8 col-md-8">
                <div className="menu-main d-flex align-items-center">
                  <div className="main-menu f-left d-none d-lg-block">
                    <nav>
                      <ul id="navigation" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: "20px" }}>
                        <li><a href="/home" style={{ textDecoration: "none" }}>Home</a></li>
                        <li><a href="/contact" style={{ textDecoration: "none" }}>Contact</a></li>
                        {isPatientConnected && (
                          <>
                            <li><a href="/claimList" style={{ textDecoration: "none" }}>List of My Complaints</a></li>
                            <li><a href="/rdv" style={{ textDecoration: "none" }}>List of My Appointment</a></li>
                          </>
                        )}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2">
                <div className="header-right-btn f-right d-none d-lg-block ml-30">
                  {isPatientConnected ? (
                    <div className="dropdown" style={{ position: "relative" }}>
                      <div
                        className="user-circle d-flex align-items-center"
                        onClick={toggleDropdown} // Add click handler
                        style={{
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: "50px", // Increased size
                            height: "50px", // Increased size
                            borderRadius: "50%",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src="/pat.png"
                            alt="User"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "16px",
                            marginLeft: "8px", // Move arrow to the right
                            transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s",
                          }}
                        >
                          ▼
                        </span>
                      </div>
                      {isDropdownOpen && ( // Conditionally render dropdown menu
                        <div
                          className="dropdown-menu"
                          style={{
                            position: "absolute",
                            top: "60px",
                            right: "0",
                            backgroundColor: "#fff",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            borderRadius: "4px",
                            zIndex: 1000,
                            display: "block", // Ensure it's displayed
                          }}
                        >
                          {user && (
                            <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>{user.name}</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>{user.email}</p>
                            </div>
                          )}
                          <a href="/edit-profile" style={{ display: "block", padding: "10px", textDecoration: "none", color: "#333" }}>Edit Profile</a>
                          <button onClick={handleLogout} style={{ display: "block", padding: "10px", width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer", color: "#333" }}>Logout</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <a href="/login" style={{ textDecoration: "none" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#3face4", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        ?
                      </div>
                    </a>
                  )}
                </div>
              </div>
              <div className="col-12">
                <div className="mobile_menu d-block d-lg-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
