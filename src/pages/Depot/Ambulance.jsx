import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder"; // Import leaflet-control-geocoder
import "leaflet-routing-machine"; // Import Leaflet Routing Machine
import "leaflet-geosearch"; // Import Leaflet GeoSearch
import "leaflet-geosearch/dist/geosearch.css"; // Import GeoSearch CSS
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"; // Import GeoSearchControl and provider
import L from "leaflet";
import Header from "../../components/Header"; // Adjust the path if necessary
import SideBar from "../../components/SideBar"; // Adjust the path if necessary
import { FaEye, FaWrench } from "react-icons/fa"; // Import the eye and wrench icons from react-icons
import LeafletGeocoder from "./LeafletGeocoder";
import LeafletRoutingMachine from "./LeafletRoutingMachine";
import swal from "sweetalert"; // Import SweetAlert
import axios from "axios"; // Import Axios for API requests

// Custom ambulance icon
const ambulanceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/10805/10805759.png", // Ambulance icon URL
  iconSize: [30, 30], // Reduced size for better visibility
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/790/790065.png", // Hospital star icon URL
  iconSize: [40, 40], // Size for the hospital icon
});

const hospitalLocation = [36.88866137666871, 10.322820208769729]; // Updated hospital coordinates

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Ambulance = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [ambulances, setAmbulances] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null); // State for the randomly selected ambulance
  const [formData, setFormData] = useState({
    id_driver: "",
    matricule: "",
    admission_date: "",
    brand: "",
    plate_number: "",
    ambulance_type: "Standard",
  });
  const [destination, setDestination] = useState(null); // State for the destination
  const [currentPosition, setCurrentPosition] = useState(null); // Current position of the moving ambulance
  const [selectedLocation, setSelectedLocation] = useState(null); // State for the user-selected location
  const [isSelectingLocation, setIsSelectingLocation] = useState(false); // State to enable location selection
  const [contextMenu, setContextMenu] = useState(null); // State for the context menu
  const [routeControl, setRouteControl] = useState(null); // State to manage the routing control
  const [ambulancePositions, setAmbulancePositions] = useState([]); // Save static ambulance positions
  const [mapKey, setMapKey] = useState(0); // State to force map refresh
  const [detailsPopup, setDetailsPopup] = useState(false); // State to control the details popup
  const [popupAmbulance, setPopupAmbulance] = useState(null); // State to store the ambulance for the popup
  const itemsPerPage = 4; // Display 4 ambulances per page

  useEffect(() => {
    const mapElement = document.querySelector(".leaflet-container");
    if (mapElement) {
      mapElement.addEventListener("contextmenu", (e) => e.preventDefault()); // Prevent the browser's default context menu globally
    }

    if (window.mapInstance) {
      const provider = new OpenStreetMapProvider(); // Use OpenStreetMap provider
      const searchControl = new GeoSearchControl({
        provider,
        style: "bar", // Display the search bar
        autoComplete: true,
        autoCompleteDelay: 250,
        showMarker: true,
        marker: {
          icon: ambulanceIcon, // Use the ambulance icon for the marker
        },
      });

      window.mapInstance.addControl(searchControl); // Add the search control to the map
    }
  }, []);

  useEffect(() => {
    // Fetch ambulance data and save their positions
    const fetchAmbulances = async () => {
      try {
        const response = await fetch("http://localhost:3001/ambulance/getAmbulance");
        const data = await response.json();

        // Save positions of only "Available" ambulances
        const positions = data
          .filter((ambulance) => ambulance.status === "Available")
          .map((ambulance) => ({
            id: ambulance._id,
            position: ambulance.position || generateRandomPosition(),
            matricule: ambulance.matricule,
            status: ambulance.status,
          }));
        setAmbulancePositions(positions);
        setAmbulances(data); // Save full ambulance data
      } catch (error) {
        console.error("Error fetching ambulances:", error);
      }
    };
    fetchAmbulances();
  }, []);

  const generateRandomPosition = () => {
    const randomOffsetLat = (Math.random() - 0.5) * 0.002; // Random offset for latitude
    const randomOffsetLng = (Math.random() - 0.5) * 0.002; // Random offset for longitude
    return [
      hospitalLocation[0] + randomOffsetLat,
      hospitalLocation[1] + randomOffsetLng,
    ];
  };

  const handleSelectAmbulance = (ambulanceId) => {
    const selected = ambulancePositions.find((amb) => amb.id === ambulanceId);
    if (selected) {
      setSelectedAmbulance(selected); // Set the selected ambulance
      setCurrentPosition(selected.position); // Set its initial position
      swal("Ambulance Selected", `Ambulance with Matricule ${selected.matricule} has been selected.`, "success");
    }
  };

  const handleSetUnavailable = async (ambulanceId) => {
    try {
      const response = await axios.put("http://localhost:3001/ambulance/unavailable", {
        id: ambulanceId,
      });
      const updatedAmbulance = response.data;

      // Update the ambulance list
      setAmbulances((prev) =>
        prev.map((amb) =>
          amb._id === updatedAmbulance._id ? updatedAmbulance : amb
        )
      );

      // Remove the ambulance from the map-related positions
      setAmbulancePositions((prev) =>
        prev.filter((amb) => amb.id !== updatedAmbulance._id)
      );

      swal("Status Updated", "The ambulance status has been changed to 'Under Maintenance'.", "success");
    } catch (error) {
      console.error("Error updating ambulance status:", error);
      swal("Error", "Failed to update ambulance status. Please try again.", "error");
    }
  };

  useEffect(() => {
    if (!destination || !selectedAmbulance) return;

    // Fetch the route coordinates using Leaflet Routing Machine
    const router = L.Routing.osrmv1();
    router.route(
      [
        L.Routing.waypoint(L.latLng(selectedAmbulance.position)), // Start from the selected ambulance's position
        L.Routing.waypoint(L.latLng(destination)), // End at the destination
      ],
      (err, routes) => {
        if (err || !routes || routes.length === 0) {
          console.error("Error fetching route:", err);
          return;
        }

        const routeToDestination = routes[0].coordinates;
        let step = 0;

        // Simulate ambulance movement to the destination
        const interval = setInterval(() => {
          if (step < routeToDestination.length) {
            const { lat, lng } = routeToDestination[step];
            setCurrentPosition([lat, lng]); // Update the current position of the ambulance

            // Update the position of the moving ambulance in the array
            setAmbulancePositions((prev) =>
              prev.map((amb) =>
                amb.id === selectedAmbulance.id
                  ? { ...amb, position: [lat, lng] }
                  : amb
              )
            );
            step++;
          } else {
            clearInterval(interval); // Stop movement when the destination is reached
            swal("Destination Reached", "The ambulance has reached the destination.", "info");

            // Wait for 10 seconds before returning to the hospital
            setTimeout(() => {
              // Fetch the route back to the hospital
              router.route(
                [
                  L.Routing.waypoint(L.latLng(destination)), // Start from the destination
                  L.Routing.waypoint(L.latLng(hospitalLocation)), // End at the hospital
                ],
                (err, returnRoutes) => {
                  if (err || !returnRoutes || returnRoutes.length === 0) {
                    console.error("Error fetching return route:", err);
                    return;
                  }

                  const routeToHospital = returnRoutes[0].coordinates;
                  let returnStep = 0;

                  // Simulate ambulance movement back to the hospital
                  const returnInterval = setInterval(() => {
                    if (returnStep < routeToHospital.length) {
                      const { lat, lng } = routeToHospital[returnStep];
                      setCurrentPosition([lat, lng]); // Update the current position of the ambulance

                      // Update the position of the moving ambulance in the array
                      setAmbulancePositions((prev) =>
                        prev.map((amb) =>
                          amb.id === selectedAmbulance.id
                            ? { ...amb, position: [lat, lng] }
                            : amb
                        )
                      );
                      returnStep++;
                    } else {
                      clearInterval(returnInterval); // Stop movement when the hospital is reached
                      swal("Returned to Hospital", "The ambulance has returned to the hospital.", "success");

                      // Reset everything
                      setSelectedAmbulance(null); // Reset the selected ambulance
                      setCurrentPosition(null); // Clear the current position
                      setDestination(null); // Remove the destination
                      setRouteControl(null); // Clear the route control
                      setMapKey((prevKey) => prevKey + 1); // Refresh the map container
                    }
                  }, 100); // Adjust speed by changing the interval time
                }
              );
            }, 10000); // Wait for 10 seconds
          }
        }, 100); // Adjust speed by changing the interval time
      }
    );
  }, [destination, selectedAmbulance]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng; // Get latitude and longitude from the click event
    setSelectedLocation([lat, lng]); // Set the selected location
    console.log("Selected location (click):", [lat, lng]); // Log the selected location
    swal("Location Selected", `Latitude: ${lat}, Longitude: ${lng}`, "info");
  };

  const handleMapRightClick = (e) => {
    e.originalEvent.preventDefault(); // Prevent the browser's default context menu
    const { lat, lng } = e.latlng; // Get latitude and longitude from the right-click event
    setContextMenu({
      position: { x: e.originalEvent.clientX, y: e.originalEvent.clientY },
      coords: [lat, lng],
    }); // Set the context menu position and coordinates
  };

  const handleSelectDestination = () => {
    if (!contextMenu) return;
    setSelectedLocation(contextMenu.coords); // Set the selected location as the destination
    console.log("Destination selected:", contextMenu.coords); // Log the destination
    swal("Destination Set", `Latitude: ${contextMenu.coords[0]}, Longitude: ${contextMenu.coords[1]}`, "info");
    setContextMenu(null); // Close the context menu
  };

  const handleSetStartingPoint = () => {
    if (!contextMenu) return;

    // Find the first available ambulance
    const availableAmbulance = ambulances.find(
      (ambulance) => ambulance.status === "Available"
    );

    if (availableAmbulance) {
      setSelectedAmbulance(availableAmbulance); // Set the starting ambulance
      setCurrentPosition(contextMenu.coords); // Set the starting point to the selected coordinates
      console.log("Starting point set to:", contextMenu.coords); // Log the starting point
      swal("Starting Point Set", `Latitude: ${contextMenu.coords[0]}, Longitude: ${contextMenu.coords[1]}`, "info");
    } else {
      swal("No Available Ambulances", "No available ambulances to set as the starting point.", "error");
    }

    setContextMenu(null); // Close the context menu
  };

  const handleSetDestination = () => {
    if (!contextMenu) return;
    setSelectedLocation(contextMenu.coords); // Set the selected location as the destination
    console.log("Destination set to:", contextMenu.coords); // Log the destination
    swal("Destination Set", `Latitude: ${contextMenu.coords[0]}, Longitude: ${contextMenu.coords[1]}`, "info");

    // Add routing if a starting point exists
    if (currentPosition) {
      if (routeControl) {
        routeControl.setWaypoints([currentPosition, contextMenu.coords]); // Update waypoints
      } else {
        const control = L.Routing.control({
          waypoints: [L.latLng(currentPosition), L.latLng(contextMenu.coords)],
          routeWhileDragging: true,
          show: false,
        }).addTo(window.mapInstance); // Add to the map instance
        setRouteControl(control); // Save the routing control instance
      }
    }

    setContextMenu(null); // Close the context menu
  };

  const handleCancelContextMenu = () => {
    setContextMenu(null); // Close the context menu
  };

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users/display", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        // Filter users with the role "Driver"
        const driverUsers = data.filter((user) => user.role === "Driver");
        setDrivers(driverUsers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected Driver ID:", formData.id_driver); // Log the selected driver's ID
    try {
      const response = await fetch("http://localhost:3001/ambulance/addam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newAmbulance = await response.json();

        // Add the new ambulance to the list and map
        setAmbulances((prev) => [...prev, newAmbulance]);
        if (newAmbulance.status === "Available") {
          setAmbulancePositions((prev) => [
            ...prev,
            {
              id: newAmbulance._id,
              position: newAmbulance.position || generateRandomPosition(),
              matricule: newAmbulance.matricule,
              status: newAmbulance.status,
            },
          ]);
        }

        setShowPopup(false); // Close the popup
        setFormData({
          id_driver: "",
          matricule: "",
          admission_date: "",
          brand: "",
          plate_number: "",
          ambulance_type: "Standard",
        });

        swal("Ambulance Added", "The new ambulance has been added successfully.", "success");
      } else {
        console.error("Failed to add ambulance");
        swal("Error", "Failed to add ambulance. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error adding ambulance:", error);
      swal("Error", "An error occurred while adding the ambulance.", "error");
    }
  };

  // Function to handle address submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!destination) {
      swal("No Destination", "Please enter a destination address.", "error");
      return;
    }

    console.log("Entered address:", destination); // Log the entered address

    try {
      // Use L.Control.Geocoder to geocode the address
      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.geocode(destination, (results) => {
        console.log("Geocoding results:", results); // Debugging: Log geocoding results
        if (results && results.length > 0) {
          const destinationCoords = [
            results[0].center.lat,
            results[0].center.lng,
          ]; // Extract latitude and longitude

          console.log("Destination coordinates:", destinationCoords); // Log the coordinates

          // Select the first available ambulance
          const availableAmbulance = ambulances.find(
            (ambulance) => ambulance.status === "Available"
          );

          if (availableAmbulance) {
            console.log("Selected ambulance:", availableAmbulance); // Debugging: Log selected ambulance
            setSelectedAmbulance(availableAmbulance);
            setCurrentPosition(hospitalLocation); // Start from the hospital

            // Simulate movement to the destination
            simulateMovement(destinationCoords, hospitalLocation);
          } else {
            swal("No Available Ambulances", "No available ambulances.", "error");
          }
        } else {
          swal("Address Not Found", "Address not found.", "error");
          console.log("No results returned for the address.");
        }
      });
    } catch (error) {
      console.error("Error geocoding address:", error);
      swal("Geocoding Error", "An error occurred while geocoding the address.", "error");
    }
  };

  // Function to simulate ambulance movement
  const simulateMovement = (destinationCoords, returnCoords) => {
    const steps = 100; // Number of steps for the movement
    let step = 0;

    const interval = setInterval(() => {
      if (step <= steps) {
        // Calculate intermediate position
        const lat =
          currentPosition[0] +
          ((destinationCoords[0] - currentPosition[0]) / steps) * step;
        const lng =
          currentPosition[1] +
          ((destinationCoords[1] - currentPosition[1]) / steps) * step;

        setCurrentPosition([lat, lng]);
        step++;
      } else if (step > steps && step <= steps * 2) {
        // Return to the hospital
        const lat =
          destinationCoords[0] +
          ((returnCoords[0] - destinationCoords[0]) / steps) *
            (step - steps);
        const lng =
          destinationCoords[1] +
          ((returnCoords[1] - destinationCoords[1]) / steps) *
            (step - steps);

        setCurrentPosition([lat, lng]);
        step++;

        // Alert when close to the hospital
        if (
          Math.abs(lat - hospitalLocation[0]) < 0.0001 &&
          Math.abs(lng - hospitalLocation[1]) < 0.0001
        ) {
          swal("Ambulance Close", "Be ready! The ambulance is close to the hospital.", "info");
        }
      } else {
        // Stop movement
        clearInterval(interval);
        setSelectedAmbulance(null);
        setCurrentPosition(null);
      }
    }, 100); // Adjust speed by changing the interval time
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ambulances.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(ambulances.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleViewDetails = (ambulance) => {
    setPopupAmbulance(ambulance); // Set the ambulance to display in the popup
    setDetailsPopup(true); // Show the popup
  };

  const handleCloseDetailsPopup = () => {
    setDetailsPopup(false); // Hide the popup
    setPopupAmbulance(null); // Clear the ambulance data
  };

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <SideBar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        page="ambulance"
      />
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <Header
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        {/* Page Content */}
        <div className="p-4 relative z-10">
          {/* Display Section Container */}
          <div className="container mx-auto">
            <div className="mb-8 bg-gray-100 shadow-md p-4 rounded">
              {/* Add Ambulance Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowPopup(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  +
                </button>
              </div>
              {/* Ambulance Cards */}
              <div className="grid grid-cols-4 gap-6">
                {currentItems.length > 0 ? (
                  currentItems.map((ambulance) => (
                    <div
                      key={ambulance._id}
                      className="relative border rounded-lg shadow-lg bg-white p-6 flex flex-col items-center"
                    >
                      {/* Status Dot */}
                      <div
                        className={`absolute top-3 right-3 w-4 h-4 rounded-full ${
                          ambulance.status === "Available" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <img
                        src="public/ambulance.png" // Placeholder image
                        alt="Ambulance"
                        className="w-24 h-24 object-cover mb-4 rounded-full border"
                      />
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        Matricule: {ambulance.matricule}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">Plate Number: {ambulance.plate_number}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(ambulance)}
                          className="bg-green-500 text-white p-3 rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleSetUnavailable(ambulance._id)}
                          disabled={ambulance.status === "Under Maintenance"} // Disable if status is "Under Maintenance"
                          className={`p-3 rounded-full flex items-center justify-center shadow-md transition ${
                            ambulance.status === "Under Maintenance"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-yellow-500 text-white hover:bg-yellow-600"
                          }`}
                        >
                          <FaWrench />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-gray-500">
                    No ambulances yet.
                  </div>
                )}
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 rounded-l disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-gray-100">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-300 rounded-r disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          {/* Leaflet Map */}
          <MapContainer
            key={mapKey} // Use the mapKey to force re-render
            center={hospitalLocation}
            zoom={16}
            style={{ height: "700px", width: "100%" }}
            className="leaflet-container"
            whenCreated={(map) => {
              window.mapInstance = map; // Save the map instance globally
            }}
          >
            <LeafletGeocoder setDestination={setDestination} />
            <LeafletRoutingMachine
              hospitalLocation={hospitalLocation}
              destination={destination}
            />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Hospital Marker */}
            <Marker position={hospitalLocation} icon={hospitalIcon}>
              <Popup>
                <b>Hospital</b>
              </Popup>
            </Marker>
            {/* Static Ambulance Markers */}
            {ambulancePositions
              .filter((ambulance) => ambulance.id !== selectedAmbulance?.id) // Exclude the moving ambulance
              .map((ambulance) => (
                <Marker
                  key={ambulance.id}
                  position={ambulance.position}
                  icon={ambulanceIcon}
                >
                  <Popup>
                    <b>Matricule:</b> {ambulance.matricule}
                    <br />
                    <button
                      onClick={() => handleSelectAmbulance(ambulance.id)}
                      style={{
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        padding: "5px",
                        cursor: "pointer",
                        marginTop: "5px",
                      }}
                    >
                      Select
                    </button>
                  </Popup>
                </Marker>
              ))}
            {/* Moving Ambulance Marker */}
            {currentPosition && (
              <Marker position={currentPosition} icon={ambulanceIcon}>
                {/* No popup for the moving ambulance */}
              </Marker>
            )}
          </MapContainer>
          {/* Context Menu */}
          {contextMenu && (
            <div
              style={{
                position: "absolute",
                top: contextMenu.position.y,
                left: contextMenu.position.x,
                backgroundColor: "white",
                border: "1px solid gray",
                borderRadius: "4px",
                zIndex: 1000,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <button
                onClick={handleSetDestination}
                style={{
                  display: "block",
                  padding: "8px 12px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Set as Destination
              </button>
              <button
                onClick={handleCancelContextMenu}
                style={{
                  display: "block",
                  padding: "8px 12px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {/* Add Ambulance Popup */}
        {showPopup && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
          >
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Add Ambulance</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Driver
                  </label>
                  <select
                    value={formData.id_driver}
                    onChange={(e) =>
                      setFormData({ ...formData, id_driver: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} {/* Display the driver's name */}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Matricule
                  </label>
                  <input
                    type="text"
                    value={formData.matricule}
                    onChange={(e) =>
                      setFormData({ ...formData, matricule: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    value={formData.admission_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admission_date: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    value={formData.plate_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plate_number: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Ambulance Type
                  </label>
                  <select
                    value={formData.ambulance_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ambulance_type: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="Standard">Standard</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Very Urgent">Very Urgent</option>
                    <option value="Immediate">Immediate</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Details Popup */}
        {detailsPopup && popupAmbulance && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Ambulance Details</h2>
              <p><strong>Matricule:</strong> {popupAmbulance.matricule}</p>
              <p><strong>Plate Number:</strong> {popupAmbulance.plate_number}</p>
              <p><strong>Brand:</strong> {popupAmbulance.brand}</p>
              <p><strong>Admission Date:</strong> {formatDate(popupAmbulance.admission_date)}</p>
              <p><strong>Ambulance Type:</strong> {popupAmbulance.ambulance_type}</p>
              <p><strong>Status:</strong> {popupAmbulance.status}</p>
              <p><strong>Driver ID:</strong> {popupAmbulance.id_driver}</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCloseDetailsPopup}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ambulance;