import React, { useState, useEffect } from "react";
import http from "../../http";
import Plot from "react-plotly.js";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const LocationDistributionMap = () => {
  const [animalList, setAnimalList] = useState([]);
  const [townCoordinates, setTownCoordinates] = useState({});
  const currentYear = new Date().getFullYear(); // Get current year
  const [selectedYear, setSelectedYear] = useState(currentYear.toString()); // Default: Current Year

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
    fetch("/SpeciesDistributionMap/singapore_town_coordinates.json")
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

  // Extract unique years from animalList
  const availableYears = [
    "All",
    ...new Set(animalList.map((animal) => animal.date_of_rescue?.split("-")[0])),
  ].filter(Boolean); // Removes undefined/null values

  // Ensure currentYear exists in availableYears, otherwise default to "All"
  const defaultYear = availableYears.includes(currentYear.toString())
    ? currentYear.toString()
    : "All";

  useEffect(() => {
    setSelectedYear(defaultYear); // Set default year after fetching data
  }, [animalList]);

  // Filter animals based on selected year
  const filteredAnimals =
    selectedYear === "All"
      ? animalList
      : animalList.filter(
          (animal) => animal.date_of_rescue?.startsWith(selectedYear)
        );

  // Count occurrences of each species per location
  const locationCount = filteredAnimals.reduce((acc, animal) => {
    const location = animal.location_found;
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the map
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
    .filter(Boolean); // Remove null values

  return (
    <div>
      {/* Dropdown for selecting year */}
      <FormControl style={{ minWidth: 120, marginBottom: "10px" }}>
        <InputLabel>Year</InputLabel>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map((year, index) => (
            <MenuItem key={index} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Plot the map */}
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
