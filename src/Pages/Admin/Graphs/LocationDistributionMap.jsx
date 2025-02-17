import React, { useState, useEffect } from "react";
import http from "../../../http";
import Plot from "react-plotly.js";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const LocationDistributionMap = ({ selectedYears }) => {
  const [animalList, setAnimalList] = useState([]);
  const [townCoordinates, setTownCoordinates] = useState({});

  // Fetch animal data
  const getAnimals = () => {
    http
      .get(
        `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD`
      )
      .then((res) => {
        setAnimalList(res.data);
      });
  };

  // Fetch town coordinates from JSON
  const getLocationCoordinates = () => {
    fetch("/LocationDistributionMap/singapore_town_coordinates.json")
      .then((response) => response.json())
      .then((data) => setTownCoordinates(data))
      .catch((error) =>
        console.error("Error loading town coordinates:", error)
      );
  };

  useEffect(() => {
    getAnimals();
    getLocationCoordinates();
  }, []);

  const filteredAnimals = animalList.filter((animal) => {
    const animalYear = animal.date_of_rescue?.split("-")[0];
    return selectedYears.includes(parseInt(animalYear));
  });

  const locationCount = filteredAnimals.reduce((acc, animal) => {
    const location = animal.location_found;
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const mapData = Object.keys(locationCount)
    .map((location) => {
      if (townCoordinates[location]) {
        return {
          location,
          latitude: townCoordinates[location].latitude,
          longitude: townCoordinates[location].longitude,
          count: locationCount[location],
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div>
      <h2 style={{ fontFamily: "Montserrat" }}>
        Location Distribution for {selectedYears.join(", ")}
      </h2>
      <Plot
        data={[
          {
            type: "scattermapbox",
            mode: "markers",
            lat: mapData.map((d) => d.latitude),
            lon: mapData.map((d) => d.longitude),
            text: mapData.map((d) => `${d.location}: ${d.count} animal(s)`),
            marker: {
              size: mapData.map((d) => d.count * 6), // Adjust size based on count
              color: "red",
            },
          },
        ]}
        layout={{
          mapbox: {
            style: "carto-positron",
            center: { lat: 1.3521, lon: 103.8198 }, // Center on Singapore
            zoom: 10.8,
          },
          margin: { t: 0, b: 0, l: 0, r: 0 },
          width: 1000,
          height: 600,
        }}
      />
    </div>
  );
};

export default LocationDistributionMap;
