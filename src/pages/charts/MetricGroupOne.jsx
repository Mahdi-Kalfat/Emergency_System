import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserInjured ,faUserDoctor } from "@fortawesome/free-solid-svg-icons"; // Patient icon

export default function MetricGroupOne() {
  const [patientCount, setPatientCount] = useState(null); // State to store the patient count
  const [personelCount, setPersonelCount] = useState(null);
  const fetchNbPatient = async () => {
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

      const response = await fetch("http://localhost:3001/users/countPatient", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patient count");
      }

      const data = await response.json();
      setPatientCount(data); // Update the state with the fetched count
    } catch (error) {
      console.error("Error fetching patient count:", error);
    }
  };
  const fetchNbPersonel = async () => {
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

      const response = await fetch("http://localhost:3001/users/countPersonel", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch personel count");
      }

      const data = await response.json();
      setPersonelCount(data); // Update the state with the fetched count
    } catch (error) {
      console.error("Error fetching personel count:", error);
    }
  };

  // Fetch the patient count when the component mounts
  useEffect(() => {
    fetchNbPatient();
    fetchNbPersonel();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {[
        {
          title: "Patients",
           // Display the fetched count or "Loading..."
          change: patientCount !== null ? patientCount : "Loading...",
          changeColor: "text-green-600",
          icon: (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              {/* Patient icon */}
              <FontAwesomeIcon
                icon={faUserInjured}
                className="h-6 w-6 text-gray-800 dark:text-white/90"
              />
            </div>
          ),
        },
        {
          title: "Personels", // Display the fetched count or "Loading..."
          change: personelCount !== null ? personelCount : "Loading...",
          changeColor: "text-red-600",
          icon: (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              {/* Medical personnel icon */}
              <FontAwesomeIcon
                icon={faUserDoctor}
                className="h-6 w-6 text-gray-800 dark:text-white/90"
              />
            </div>
          ),
        },
      ].map((metric, index) => (
        <div
          key={index}
          className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          {metric.icon}
          <div className="mt-5">
            <span className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</span>
            <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">{metric.count}</h4>
          </div>
          <span
            className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${metric.bgColor} ${metric.changeColor}`}
          >
            {metric.change}
          </span>
        </div>
      ))}
    </div>
  );
}