import React, { useState, useEffect } from "react";
import http from "../../../http";
import Plot from "react-plotly.js";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const LocationDistributionMap = ({ selectedYears }) => {
  const [animalList, setAnimalList] = useState([]);
  const [townCoordinates, setTownCoordinates] = useState({});
  const [view, setView] = useState("map"); // "map" or "bar"

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

    const key = `${year} - ${location}`; // Group by year and location
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
        .map((key) => key.split(" - ")[1]), // Extract location from 'year - location'
      y: Object.keys(locationCount)
        .filter((key) => key.startsWith(`${year} -`))
        .map((key) => locationCount[key]),
      name: year,
    };
  });

  // Create a color scale based on the year
  const colors = [
    "#FF6347",
    "#4682B4",
    "#32CD32",
    "#FFD700",
    "#8A2BE2",
    "#FF1493",
  ];

  return (
    <div>
      <h2
        style={{
          fontFamily: "Montserrat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // Centers both the text and the dropdown
          textAlign: "center", // Ensures text is centered
          gap: "8px", // Adds space between the elements
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

      {/* Dropdown for view selection */}
      {view === "map" ? (
        // Map View
        <Plot
          data={[
            {
              type: "scattermapbox",
              mode: "markers",
              lat: mapData.map((d) => d.latitude),
              lon: mapData.map((d) => d.longitude),
              text: mapData.map(
                (d) => `${d.year} - ${d.location}: ${d.count} animal(s)`
              ),
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
            width: 900,
            height: 600,
          }}
        />
      ) : (
        // Bar Graph View
        <Plot
          data={groupedBarData.map((data, index) => ({
            type: "bar",
            x: data.x,
            y: data.y,
            name: data.name,
            marker: {
              color: colors[index % colors.length], // Color each year's bars differently
            },
             // Bar width
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
            barmode: "group", // Group bars by year-location combination
            bargroupgap: 0, // Remove the gap between grouped bars
          }}
        />
      )}
    </div>
  );
};

export default LocationDistributionMap;
