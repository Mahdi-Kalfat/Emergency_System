import React from "react";
import MetricGroupOne from "./charts/MetricGroupOne";
import ChartOne from "./charts/ChartOne";
import ChartTwo from "./charts/ChartTwo";
import Calendrier from "./charts/Calendrier";
import Map from "../components/Map"; // Importer le composant Map

const Dashboard = () => {
  return (
    <main className="p-4 w-full dashboard-container">
      <div className="grid grid-cols-12 gap-6 w-full">
        {/* MetricGroupOne (Two Cards) on the left */}
        <div className="col-span-12 md:col-span-6">
          <MetricGroupOne />
          {/* ChartOne below MetricGroupOne */}
          <div className="mt-6">
            <ChartOne />
          </div>
          {/* Map below ChartOne */}
          <div
            className="mt-6 shadow-lg rounded-lg p-4 bg-white relative"
            style={{ overflow: "hidden" }} // Ensure no overflow
          >
            <h2 className="text-xl font-semibold mb-4 text-center">Map</h2>
            <div
              style={{
                height: "100%",
                position: "relative", // Ensure proper positioning
                zIndex: 0, // Lower z-index for the map
              }}
            >
              <Map /> {/* Add the Map component here */}
            </div>
          </div>
        </div>

        {/* ChartTwo on the right */}
        <div className="col-span-12 md:col-span-6">
          <ChartTwo />
          {/* Section pour le calendrier */}
          <div className="mt-6 shadow-lg rounded-lg p-4 bg-white">
            <div className="flex justify-center">
              <div style={{ width: "100%" }}>
                <Calendrier /> {/* Intégrer le composant Calendrier ici */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
