import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import http from "../../../http";

const MonthlyIntakeGraph = ({ selectedYears }) => {
  const [animalList, setAnimalList] = useState([]);
  const [monthlyIntakes, setMonthlyIntakes] = useState({}); // To store intake data per year

  const getAnimals = () => {
    http
      .get(
        `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD`
      )
      .then((res) => {
        setAnimalList(res.data);
      });
  };

  useEffect(() => {
    getAnimals();
  }, []);

  useEffect(() => {
    processData();
  }, [selectedYears, animalList]);

  const processData = () => {
    const monthlyData = {}; // To hold the intake count for each year

    // Loop through each year in selectedYears
    selectedYears.forEach((year) => {
      const monthCounts = Array(12).fill(0); // Initialize count for the 12 months

      // Filter animals based on the current year
      const filteredAnimals = animalList.filter((animal) => {
        const animalYear = animal.date_of_rescue?.split("-")[0];
        return parseInt(animalYear) === year;
      });

      // Count the animals for each month in the current year
      filteredAnimals.forEach((animal) => {
        if (animal.date_of_rescue) {
          const date = new Date(animal.date_of_rescue);
          const monthIndex = date.getMonth(); // Get month (0 = Jan, 11 = Dec)
          monthCounts[monthIndex] += 1;
        }
      });

      monthlyData[year] = monthCounts; // Store the monthly counts for the year
    });

    setMonthlyIntakes(monthlyData);
  };

  // Define an array of colors for each year
  const colorPalette = [
    "skyblue", // 1st year
    "orange", // 2nd year
    "green", // 3rd year
    "red", // 4th year
    "purple", // 5th year
    "yellow", // 6th year
    "pink", // 7th year
  ];

  // Create plot data for each year
  const plotData = selectedYears.map((year, index) => ({
    x: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    y: monthlyIntakes[year] || Array(12).fill(0),
    type: "scatter", // Line graph
    mode: "lines+markers",
    name: `Year ${year}`, // Label for each year
    marker: { color: colorPalette[index % colorPalette.length] }, // Cycle through colors
  }));

  return (
    <div>
      <h2>Monthly Animal Intake {selectedYears.join(", ")}</h2>
      <Plot
        data={plotData}
        layout={{
          title: `Monthly Animal Intake (${selectedYears.join(", ")})`,
          xaxis: { title: "Month" },
          yaxis: { title: "Number of Animals Rescued" },
          height: 500,
          width: 800,
        }}
      />
    </div>
  );
};

export default MonthlyIntakeGraph;
