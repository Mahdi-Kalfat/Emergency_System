import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Permet d'interagir avec le calendrier
import axios from "axios"; // Pour récupérer et envoyer des données à votre API

const Calendrier = () => {
  const [events, setEvents] = useState([]); // Événements à afficher dans le calendrier
  const [newEvent, setNewEvent] = useState({
    description: "",
    date: "",
    patientId: "",
  }); // Nouvel événement
  const [patients, setPatients] = useState([]); // Liste des patients
  const [loading, setLoading] = useState(true); // Loading state for patient data
  const [refresh, setRefresh] = useState(false); // State to trigger useEffect on event addition
  const [selectedEvent, setSelectedEvent] = useState(null); // State for the selected event
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch the list of patients from the backend
  useEffect(() => {
    axios
      .get("http://localhost:3001/users/patients")
      .then((response) => {
        setPatients(response.data); // On récupère la liste des patients
        setLoading(false); // Set loading to false once the data is fetched
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des patients:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

  // Fetch the list of rendezvous (appointments) from the backend
  useEffect(() => {
    axios
      .get("http://localhost:3001/rendezvous/display")
      .then((response) => {
        console.log(response.data); // On récupère la liste des rdv

        // Map the response data to match FullCalendar's format
        const mappedEvents = response.data.map((rdv) => ({
          title: `${rdv.name} (${rdv.email})`, // Show the name and email in the event title
          start: new Date(rdv.date), // Set the start date
          description: rdv.description, // Store the description
          extendedProps: {
            name: rdv.name,
            email: rdv.email,
            description: rdv.description,
          },
        }));

        setEvents(mappedEvents); // Set the events to be displayed on the calendar
        setLoading(false); // Set loading to false once the data is fetched
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des rdvs:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, [refresh]); // Re-run the effect when 'refresh' is set to true

  // Fonction pour ajouter un nouvel événement
  const handleAddEvent = () => {
    if (!newEvent.description || !newEvent.date || !newEvent.patientId) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // Envoi de l'événement au backend
    axios
      .post("http://localhost:3001/rendezvous/addRendezVous", {
        patientId: newEvent.patientId, // ID du patient
        description: newEvent.description,
        date: newEvent.date,
      })
      .then((response) => {
        // Directly update the calendar by appending the new event
        const newEventToAdd = {
          title: `${response.data.name} (${response.data.email})`, // Title with name and email
          start: new Date(response.data.date), // Set the start date
          description: response.data.description, // Store the description
          extendedProps: {
            name: response.data.name,
            email: response.data.email,
            description: response.data.description,
          },
        };

        setEvents((prevEvents) => [...prevEvents, newEventToAdd]); // Update the events state with the new event
        setNewEvent({ description: "", date: "", patientId: "" }); // Réinitialiser le formulaire

        // Trigger the refresh to re-fetch the events from the backend
        setRefresh((prevState) => !prevState); // Trigger the effect again to reload the events
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout de l'événement:", error);
      });
  };

  const handleEventClick = (info) => {
    const { name, email, description } = info.event.extendedProps;
    const date = info.event.start.toLocaleDateString();
    const time = info.event.start.toLocaleTimeString();
    setSelectedEvent({ name, email, description, date, time });
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div className="calendar-container">
      <h2>Planification des Rendez-vous</h2>

      {/* Formulaire pour ajouter un événement */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Titre de l'événement"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
          <input
            type="datetime-local"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        <div className="mt-4">
          <select
            value={newEvent.patientId}
            onChange={(e) =>
              setNewEvent({ ...newEvent, patientId: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner un patient</option>
            {loading ? (
              <option value="">Chargement...</option>
            ) : (
              patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAddEvent}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajouter l'événement
          </button>
        </div>
      </div>

      {/* Affichage du calendrier */}
      <div className="calendar-wrapper" style={{ width: "100%" }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth" // Afficher le mois par défaut
          events={events} // Passer les événements à afficher
          height="auto" // Let the calendar height adjust based on its content
          editable={true} // Permet de modifier les événements
          droppable={true} // Permet de glisser-déposer les événements
          eventClick={handleEventClick} // Handle event click
        />
      </div>

      {/* Modal for event details */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <span
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl cursor-pointer"
            >
              &times;
            </span>
            <h3 className="text-lg font-semibold mb-4">Détails du rendez-vous</h3>
            <p><strong>Nom:</strong> {selectedEvent.name}</p>
            <p><strong>Email:</strong> {selectedEvent.email}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Date:</strong> {selectedEvent.date}</p>
            <p><strong>Heure:</strong> {selectedEvent.time}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendrier;
