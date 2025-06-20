import React, { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const LeafletGeocoder = ({ setDestination }) => {
  const map = useMap();

  // Define the custom icon for the destination marker
  const destinationIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2991/2991174.png", // Custom icon URL
    iconSize: [40, 40], // Adjust the size of the icon
  });

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false, // Prevent the default marker from being added
    })
      .on("markgeocode", function (e) {
        const latlng = e.geocode.center;
        L.marker(latlng, { icon: destinationIcon }) // Use the custom icon
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();
        console.log("Destination selected:", latlng); // Log the destination
        setDestination(latlng); // Pass the destination to the parent component
      })
      .addTo(map);

    return () => {
      map.removeControl(geocoder); // Remove geocoder when component unmounts
    };
  }, [map, setDestination, destinationIcon]);

  return null;
};

export default LeafletGeocoder;