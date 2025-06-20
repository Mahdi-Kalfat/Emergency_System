import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ChartTwo = () => {
  const [chartData, setChartData] = useState({
    series: [],
    labels: [],
  });

  useEffect(() => {
    const fetchPersonnelData = async () => {
      try {
        const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

        const response = await fetch("http://localhost:3001/users/display", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch personnel data");
        }

        const data = await response.json();

        // Count personnel by role
        const roleCounts = data.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        // Prepare series and labels for the chart
        const series = Object.values(roleCounts);
        const labels = Object.keys(roleCounts);

        setChartData({ series, labels });
      } catch (error) {
        console.error("Error fetching personnel data:", error);
      }
    };

    fetchPersonnelData();
  }, []);

  const chartOptions = {
    chart: {
      type: "pie",
      height: 250,
    },
    series: chartData.series,
    labels: chartData.labels,
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 xl:col-span-5">
      {/* Chart Two Start */}
      <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="shadow-default rounded-2xl bg-white px-5 pb-11 pt-5 dark:bg-gray-900 sm:px-6 sm:pt-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Personnel Distribution
              </h3>
              <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
                Distribution of personnel by roles
              </p>
            </div>
          </div>

          <div className="relative max-h-[195px]">
            <div id="chartTwo" className="h-full" style={{ minHeight: "250px" }}>
              <Chart
                options={chartOptions}
                series={chartOptions.series}
                type="pie"
                height={230}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Chart Two End */}
    </div>
  );
};

export default ChartTwo;
