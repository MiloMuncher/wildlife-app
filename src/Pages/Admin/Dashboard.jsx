import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import MonthlyIntakeGraph from "./Graphs/MonthlyIntakeGraph";
import LocationDistributionMap from "./Graphs/LocationDistributionMap";
import http from "../../http.js";
import SpeciesDistributionGraph from "./Graphs/SpeciesDistributionGraph";
import CaseStatusChart from "./Graphs/CaseStatusChart";

function Dashboard() {
  const itemcolor = { backgroundColor: "white" };
  const [animalList, setAnimalList] = useState([]);
  const currentYear = new Date().getFullYear(); // Get current year
  const [selectedYears, setSelectedYears] = useState([]); // Store selected years

  // Fetching animal data
  const getAnimals = () => {
    http
      .get(
        `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD`
      )
      .then((res) => {
        setAnimalList(res.data);
      });
  };

  // Extract unique years from the animals' rescue date
  const extractYears = (animals) => {
    const years = animals.map((animal) =>
      new Date(animal.date_of_rescue).getFullYear()
    );
    return [...new Set(years)]; // Get unique years
  };

  // Handling year selection
  const handleYearChange = (event) => {
    const { value, checked } = event.target;
    setSelectedYears((prevYears) =>
      checked
        ? [...prevYears, parseInt(value)]
        : prevYears.filter((year) => year !== parseInt(value))
    );
  };

  // Get intake count based on selected years
  const getIntakeCount = () => {
    return animalList.filter((animal) =>
      selectedYears.includes(new Date(animal.date_of_rescue).getFullYear())
    ).length;
  };

  // Get open cases count based on selected years
  const getOpenCount = () => {
    return animalList.filter((animal) => animal.case_status === "Open").length;
  };

  useEffect(() => {
    getAnimals();
  }, []);

  useEffect(() => {
    if (animalList.length > 0) {
      const years = extractYears(animalList);
      setSelectedYears([currentYear]); // Set default to all available years
    }
  }, [animalList]);

  const filteredAnimals = animalList.filter((animal) => {
    const animalYear = animal.date_of_rescue?.split("-")[0];
    return selectedYears.includes(parseInt(animalYear));
  });

  const locationCount = filteredAnimals.reduce((acc, animal) => {
    const location = animal.location_found;
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} alignItems="stretch">
        {/* Dropdown of years */}
        <Grid item xs={12}>
          <Card style={itemcolor}>
            <CardContent>
              <Typography
                fontSize={{ md: 16, xl: 18 }}
                fontWeight="800"
                align="center"
              >
                Select Year(s) for Data
              </Typography>
              <FormGroup row>
                {extractYears(animalList).map((year) => (
                  <FormControlLabel
                    key={year}
                    control={
                      <Checkbox
                        value={year}
                        checked={selectedYears.includes(year)}
                        onChange={handleYearChange}
                      />
                    }
                    label={year}
                  />
                ))}
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Displaying the map */}
        <Grid item xs={12}>
          <Card style={itemcolor}>
            <CardContent align="center">
              <LocationDistributionMap selectedYears={selectedYears} />
            </CardContent>
          </Card>
        </Grid>

        {/* Displaying Total Intake Count and Current Open Cases */}
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Card sx={{ height: "30%", overflowY: "scroll" }} style={itemcolor}>
            <CardContent align="center">
              <Typography fontSize={{ md: 16, xl: 18 }} fontWeight="800">
                Total Animals Rescued Across Locations
              </Typography>
              {/* List each location with its respective number of animals */}
              <div
                style={{
                  paddingTop: "10px",
                }}
              >
                {Object.keys(locationCount).map((location) => (
                  <div key={location} style={{ paddingBottom: "10px" }}>
                    <Typography variant="body1">
                      <strong>{location}</strong>&nbsp; - &nbsp;
                      {locationCount[location]} animal(s) rescued
                    </Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card sx={{ height: "30%" }} style={itemcolor}>
            <CardContent align="center">
              <Typography fontSize={{ md: 16, xl: 18 }} fontWeight="800">
                Current Open Cases
              </Typography>
              <Typography
                fontSize={{ md: 30, xl: 34 }}
                padding={{ md: 5, xl: 4 }}
                style={{ color: "red", fontWeight: "600" }}
              >
                {getOpenCount()}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ height: "30%" }} style={itemcolor}>
            <CardContent align="center">
              <Typography fontSize={{ md: 16, xl: 18 }} fontWeight="800">
                Total Intake Count for {selectedYears.join(", ")}
              </Typography>
              <Typography
                fontSize={{ md: 30, xl: 34 }}
                padding={{ md: 5, xl: 4 }}
                style={{
                  color: "skyblue",
                  fontWeight: "600",
                }}
              >
                {getIntakeCount()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Placeholder for Pie Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }} style={itemcolor}>
            <CardContent align="center">
              <CaseStatusChart />
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Intake Graph */}
        <Grid item xs={12} md={12}>
          <Card sx={{ height: "100%" }} style={itemcolor}>
            <CardContent align="center">
              <MonthlyIntakeGraph selectedYears={selectedYears} />{" "}
              {/* Pass the selected years to the graph */}
            </CardContent>
          </Card>
        </Grid>

        {/* Species Distribution Graph */}
        <Grid item xs={12} md={12}>
          <Card sx={{ height: "100%" }} style={itemcolor}>
            <CardContent align="center">
              <SpeciesDistributionGraph selectedYears={selectedYears} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
