import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import http from "../../../http";

const SpeciesDistributionGraph = ({ selectedYears }) => {
  const [animalList, setAnimalList] = useState([]);
  const [speciesDistribution, setSpeciesDistribution] = useState([]);

  // Color palette for species
  const colorPalette = [
    "skyblue", // 1st species
    "orange", // 2nd species
    "green", // 3rd species
    "red", // 4th species
    "purple", // 5th species
    "yellow", // 6th species
    "pink", // 7th species
    "brown", // 8th species
    "cyan", // 9th species
    "lime", // 10th species
    "magenta", // 11th species
    "blue", // 12th species
  ];

  // Fetch animal data and process it
  useEffect(() => {
    http
      .get(
        `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD`
      )
      .then((res) => {
        setAnimalList(res.data);

        const speciesCounts = {};

        // Filter animals based on selected years
        const filteredAnimals = res.data.filter((animal) => {
          const animalYear = animal.date_of_rescue?.split("-")[0];
          return selectedYears.includes(parseInt(animalYear));
        });

        // Count the animals by species
        filteredAnimals.forEach((animal) => {
          const species = animal.species; // Assuming 'species' field exists in the animal data
          if (species) {
            speciesCounts[species] = (speciesCounts[species] || 0) + 1;
          }
        });

        setSpeciesDistribution(Object.entries(speciesCounts)); // Convert to an array of [species, count] pairs
      });
  }, [selectedYears]);

  // Prepare data for the graph
  const speciesNames = speciesDistribution.map(([species]) => species);
  const speciesCounts = speciesDistribution.map(([_, count]) => count);

  // Generate a color for each species using the colorPalette
  const barColors = speciesNames.map(
    (_, index) => colorPalette[index % colorPalette.length]
  );

  return (
    <div>
      <h2 style={{ fontFamily: "Montserrat" }}>
        Species Distribution {selectedYears.join(", ")}
      </h2>
      <Plot
        data={[
          {
            x: speciesNames,
            y: speciesCounts,
            type: "bar", // Bar chart
            marker: { color: barColors }, // Use the color palette for each species
          },
        ]}
        layout={{
          title: `Species Distribution (${selectedYears.join(", ")})`,
          xaxis: { title: "Species" },
          yaxis: { title: "Number of Animals Rescued" },
          width: 800, // Adjust width as needed
          height: 400, // Adjust height as needed
        }}
      />
    </div>
  );
};

export default SpeciesDistributionGraph;
