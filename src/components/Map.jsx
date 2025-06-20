import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  useEffect(() => {
    // Initialize the map centered on Tunisia
    const map = L.map("map").setView([33.8869, 9.5375], 7); // Latitude and longitude of Tunisia

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom hospital marker icon
    const hospitalIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448513.png", // Hospital icon from Flaticon
      iconSize: [30, 30], // Size of the icon
      iconAnchor: [15, 30], // Anchor point of the icon
      popupAnchor: [0, -30], // Position of the popup relative to the icon
    });

    // List of hospitals in Tunisia with their coordinates
    const hospitals = [
      { name: "Hospital La Rabta", coords: [36.8065, 10.1815] },
      { name: "Hospital Charles Nicolle", coords: [36.8111, 10.1658] },
      { name: "Hospital Habib Bourguiba", coords: [34.7326, 10.7593] },
      { name: "Hospital Fattouma Bourguiba", coords: [35.6781, 10.0963] },
      { name: "Hospital Farhat Hached", coords: [35.8288, 10.6409] },
      { name: "Hospital Sahloul", coords: [35.8256, 10.6084] },
      { name: "Hospital Mohamed Taher Maamouri", coords: [36.4516, 10.7367] },
      { name: "Hospital Regional de Gabes", coords: [33.8815, 10.0982] },
      { name: "Hospital Regional de Gafsa", coords: [34.425, 8.7842] },
      { name: "Hospital Regional de Kairouan", coords: [35.6781, 10.0963] },
      { name: "Hospital Regional de Sidi Bouzid", coords: [35.0382, 9.4849] },
      { name: "Hospital Regional de Medenine", coords: [33.3549, 10.5055] },
      { name: "Hospital Regional de Tataouine", coords: [32.9297, 10.4518] },
      { name: "Hospital Regional de Kef", coords: [36.1742, 8.7049] },
      { name: "Hospital Regional de Beja", coords: [36.7256, 9.1817] },
      { name: "Hospital Mongi Slim", coords: [36.8688, 10.3093] }, // Tunis center
      { name: "Hospital Militaire de Tunis", coords: [36.8188, 10.1651] }, // Tunis center
      { name: "Hospital Aziza Othmana", coords: [36.8008, 10.1796] }, // Tunis center
      { name: "Hospital Institut Salah Azaiez", coords: [36.8064, 10.1733] }, // Tunis center
    ];

    // Add markers for each hospital
    const bounds = L.latLngBounds([]);
    hospitals.forEach((hospital) => {
      L.marker(hospital.coords, { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(`<b>${hospital.name}</b>`);
      bounds.extend(hospital.coords); // Extend bounds to include the marker
    });

    // Fit the map to the bounds of all markers
    map.fitBounds(bounds);

    return () => {
      map.remove(); // Clean up the map on component unmount
    };
  }, []);

  return <div id="map" style={{ height: "800px", width: "100%" }}></div>; // Increased height to 800px
};

export default Map;
