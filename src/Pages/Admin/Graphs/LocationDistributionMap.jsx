import React, { useState, useEffect } from "react";
import http from "../../../http";
import Plot from "react-plotly.js";
import { MenuItem, Select, FormControl } from "@mui/material";

const LocationDistributionMap = ({ selectedYears }) => {
  const [animalList, setAnimalList] = useState([]);
  const [townCoordinates, setTownCoordinates] = useState({});
  const [view, setView] = useState("map");

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
    const year = animal.date_of_rescue?.split("-")[0];
    const location = animal.location_found;
    const key = `${year} - ${location}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the map
  const mapData = Object.keys(locationCount)
    .flatMap((yearLocation) => {
      const [year, location] = yearLocation.split(" - ");
      if (townCoordinates[location]) {
        return {
          location,
          latitude: townCoordinates[location].latitude,
          longitude: townCoordinates[location].longitude,
          count: locationCount[yearLocation],
          year,
        };
      }
      return null;
    })
    .filter(Boolean);

  // Prepare data for the bar graph
  const groupedBarData = selectedYears.map((year) => {
    return {
      x: Object.keys(locationCount)
        .filter((key) => key.startsWith(`${year} -`))
        .map((key) => key.split(" - ")[1]),
      y: Object.keys(locationCount)
        .filter((key) => key.startsWith(`${year} -`))
        .map((key) => locationCount[key]),
      name: year,
    };
  });

  // Color mapping for years
  const yearColors = {
    "2021": "purple",
    "2022": "orange",
    "2023": "green",
    "2024": "blue",
    "2025": "red",
  };

  return (
    <div>
      <h2
        style={{
          fontFamily: "Montserrat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "8px",
        }}
      >
        Location Distribution
        <FormControl>
          <Select value={view} onChange={(e) => setView(e.target.value)}>
            <MenuItem value="map">
              <strong>Map</strong>
            </MenuItem>
            <MenuItem value="bar">
              <strong>Bar Graph</strong>
            </MenuItem>
          </Select>
        </FormControl>
        for {selectedYears.join(", ")}
      </h2>

      {view === "map" ? (
        <Plot
        data={[
          {
            type: "scattermap",
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
          map: {
            style: "carto-positron",
            center: { lat: 1.3521, lon: 103.8198 }, // Center on Singapore
            zoom: 10.8,
          },
          margin: { t: 0, b: 0, l: 0, r: 0 },
          width: 1000,
          height: 600,
        }}
      />
      ) : (
        <Plot
          data={groupedBarData.map((data, index) => ({
            type: "bar",
            x: data.x,
            y: data.y,
            name: data.name,
            marker: {
              color: yearColors[data.name] || "#888888",
            },
          }))}
          layout={{
            title: "Animal Location Distribution",
            xaxis: {
              title: "Location",
            },
            yaxis: {
              title: "Count",
            },
            width: 800,
            height: 600,
            barmode: "group",
            bargroupgap: 0,
          }}
        />
      )}
    </div>
  );
};

export default LocationDistributionMap;
