import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ChartOne = () => {
  const [chartData, setChartData] = useState({
    series: [],
    categories: [],
  });

  useEffect(() => {
    const fetchPatientsPerMonth = async () => {
      try {
        const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

        const response = await fetch("http://localhost:3001/users/patients-per-month", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch patients per month");
        }

        const data = await response.json();

        // Préparer les données pour le graphique
        const series = data.map(item => item.count);
        const categories = data.map(item => `Month ${item._id}`);

        setChartData({ series, categories });
      } catch (error) {
        console.error("Error fetching patients per month:", error);
      }
    };

    fetchPatientsPerMonth();
  }, []);

  const chartOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: "Patients Created",
        data: chartData.series,
      },
    ],
    xaxis: {
      categories: chartData.categories,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    fill: {
      opacity: 1,
    },
    grid: {
      show: true,
      borderColor: "#EAEAEA",
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Patients Created Per Month
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
          <div
            id="chartOne"
            className="-ml-5 h-full min-w-[650px] pl-2 xl:min-w-full"
            style={{ minHeight: "300px" }}
          >
            <Chart
              options={chartOptions}
              series={chartOptions.series}
              type="bar"
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartOne;