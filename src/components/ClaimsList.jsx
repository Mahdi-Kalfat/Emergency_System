import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

const ClaimList = ({ userRole }) => { // Ajoutez userRole comme prop
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const userId = JSON.parse(storedUser).id; // Extract user ID from localStorage
        const response = await axios.get(`http://localhost:3001/reclamation/getAllRecByIdPatient/${userId}`); // Pass user ID as a route parameter
        setReclamations(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReclamations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/reclamation/deleteRec/${id}`);
      setReclamations(reclamations.filter(reclamation => reclamation._id !== id));
    } catch (err) {
      setError("Failed to delete reclamation");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/reclamation/updateStatus/${id}`,
        { status: newStatus }
      );
      setReclamations(reclamations.map(reclamation => 
        reclamation._id === id ? response.data : reclamation
      ));
    } catch (err) {
      setError("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <main className="content-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading reclamations...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Header />
        <main className="content-container">
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <main className="content-container">
        <div className="claim-list-container">
          <div className="claim-list-header">
            <h2>My Reclamations</h2>
            <button 
              className="add-reclamation-btn"
              onClick={() => navigate("/claim-form")}
            >
              Add New Reclamation
            </button>
          </div>

          {reclamations.length === 0 ? (
            <div className="no-reclamations">
              <p>No reclamations found.</p>
            </div>
          ) : (
            <div className="reclamations-table">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    {/* <th>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {reclamations.map((reclamation) => (
                    <tr key={reclamation._id}>
                      <td>{reclamation.subject}</td>
                      <td>{reclamation.message}</td>
                      <td>{new Date(reclamation.createdAt).toLocaleDateString()}</td>
                      <td>
                        {userRole === 'chef_service' ? (
                          <select
                            value={reclamation.status || 'Non traité'}
                            onChange={(e) => handleStatusChange(reclamation._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="Non traité">Non traité</option>
                            <option value="Traité">Traité</option>
                          </select>
                        ) : (
                          <span className={`status-badge ${reclamation.status === 'Traité' ? 'treated' : 'pending'}`}>
                            {reclamation.status || 'Non traité'}
                          </span>
                        )}
                      </td>
                      {/* <td className="actions">
                        <button 
                          className="edit-btn"
                          onClick={() => navigate(`/edit-claim/${reclamation._id}`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(reclamation._id)}
                        >
                          Delete
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClaimList;