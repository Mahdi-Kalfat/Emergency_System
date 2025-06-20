import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";

const LeafletRoutingMachine = ({ hospitalLocation, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (!destination) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(hospitalLocation),
        L.latLng(destination),
      ],
      lineOptions: {
        styles: [{ color: "blue", weight: 4, opacity: 0.7 }],
      },
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null, // Prevent routing control from adding any markers
    }).addTo(map);

    return () => {
      map.removeControl(control); // Remove routing control when component unmounts
    };
  }, [hospitalLocation, destination, map]);

  return null;
};

export default LeafletRoutingMachine;