import React, { useEffect, useState } from 'react';
import Header from './Header'; // Assuming Header component exists
import Footer from './Footer'; // Assuming Footer component exists
import './ListRdv.css'; // Assuming a CSS file for styling

export default function ListRdv() {
  const [rendezvous, setRendezvous] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Display 3 items per page

  useEffect(() => {
    const fetchRendezvous = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          console.error("User not logged in");
          return;
        }

        const patientId = JSON.parse(storedUser).id;
        console.log(patientId); // ID from localStorage
        const response = await fetch(`http://localhost:3001/rendezvous/displaybyidPatient/${patientId}`);
        const data = await response.json();
        setRendezvous(data);
      } catch (err) {
        console.error("Error fetching rendezvous:", err.message);
      }
    };

    fetchRendezvous();
  }, []);

  const totalPages = Math.ceil(rendezvous.length / itemsPerPage);
  const paginatedRendezvous = rendezvous.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const joinMeeting = () => {
    const jitsiContainerId = "jitsi-container";

    // Check if Jitsi Meet API is available
    if (!window.JitsiMeetExternalAPI) {
      console.error("Jitsi Meet API script not loaded");
      return;
    }

    // Generate a unique room name on the frontend
    const roomName = `room-${Date.now()}`;

    // Check if the container already exists
    let jitsiContainer = document.getElementById(jitsiContainerId);
    if (!jitsiContainer) {
      jitsiContainer = document.createElement("div");
      jitsiContainer.id = jitsiContainerId;
      jitsiContainer.style.position = "fixed";
      jitsiContainer.style.width = "100%";
      jitsiContainer.style.height = "100%";
      jitsiContainer.style.top = "0";
      jitsiContainer.style.left = "0";
      jitsiContainer.style.zIndex = "9999";
      jitsiContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      document.body.appendChild(jitsiContainer);
    }

    // Initialize Jitsi Meet iframe
    const domain = "meet.jit.si";
    const options = {
      roomName, // Use the generated room name
      parentNode: jitsiContainer,
      width: "100%",
      height: "100%",
      configOverwrite: {},
      interfaceConfigOverwrite: {},
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    // Handle meeting end
    api.addEventListener("readyToClose", () => {
      api.dispose(); // Clean up the Jitsi Meet instance
      document.body.removeChild(jitsiContainer); // Remove the container
      window.location.reload(); // Refresh the page
    });
  };

  return (
    <div className="list-rdv-container">
      <Header />
      <div className="rendezvous-content">
        <div className="rendezvous-container">
          {paginatedRendezvous.length > 0 ? (
            <div className="cards-container">
              {paginatedRendezvous.map((rdv, index) => (
                <div key={index} className="card">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/1572/1572663.png" 
                    alt="Rendezvous Icon" 
                    className="card-image" 
                  />
                  <h4>Appointment</h4>
                  <p><strong>Description:</strong>{rdv.description || 'Description not available'}</p>
                  <p><strong>Date:</strong> <br /> {rdv.date ? formatDateTime(rdv.date) : 'N/A'}</p>
                  <button
                    className="join-meeting-button"
                    onClick={() => joinMeeting()} // Use the generated room name
                  >
                    Join Meeting
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-rendezvous-message">You have no rendez-vous for today.</p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
