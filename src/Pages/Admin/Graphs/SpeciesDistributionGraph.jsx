import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import http from "../../../http";

const SpeciesDistributionGraph = ({ selectedYears }) => {
  const [speciesData, setSpeciesData] = useState({});

  // Color palette for different years
  const colorPalette = [
    "skyblue", "orange", "green", "red", "purple", "yellow", "pink",
    "brown", "cyan", "lime", "magenta", "blue",
  ];

  useEffect(() => {
    http
      .get(`https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD`)
      .then((res) => {
        const data = res.data;
        const speciesYearCounts = {};

        // Initialize structure for each year
        selectedYears.forEach((year) => {
          speciesYearCounts[year] = {};
        });

        // Count species per year
        data.forEach((animal) => {
          const animalYear = animal.date_of_rescue?.split("-")[0];
          const species = animal.species;
          if (species && selectedYears.includes(parseInt(animalYear))) {
            speciesYearCounts[animalYear][species] = 
              (speciesYearCounts[animalYear][species] || 0) + 1;
          }
        });

        setSpeciesData(speciesYearCounts);
      });
  }, [selectedYears]);

  // Extract all unique species names
  const allSpecies = Array.from(
    new Set(
      Object.values(speciesData)
        .flatMap((yearData) => Object.keys(yearData))
    )
  );

  // Create traces (bars) for each year
  const traces = selectedYears.map((year, index) => ({
    x: allSpecies,
    y: allSpecies.map((species) => speciesData[year]?.[species] || 0),
    type: "bar",
    name: `${year}`,
    marker: { color: colorPalette[index % colorPalette.length] },
  }));

  return (
    <div>
      <h2 style={{ fontFamily: "Montserrat" }}>
        Species Distribution {selectedYears.join(", ")}
      </h2>
      <Plot
        data={traces}
        layout={{
          title: `Species Distribution (${selectedYears.join(", ")})`,
          xaxis: { title: "Species", tickangle: -45 },
          yaxis: { title: "Number of Animals Rescued" },
          barmode: "group", // Grouped bars
          width: 800,
          height: 400,
        }}
      />
    </div>
  );
};

export default SpeciesDistributionGraph;
