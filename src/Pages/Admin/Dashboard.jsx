import React, { useState, useEffect } from "react";
import { Typography, Grid, Container, Card, CardContent } from "@mui/material";
import OrdersChart from "../Charts/OrdersChart";
import UserChart from "../Charts/UserChart";
import EventChart from "../Charts/EventChart";
import "@aws-amplify/ui-react/styles.css";
import { fetchAuthSession } from "aws-amplify/auth";
import { list } from "aws-amplify/storage";
import http from "../../http";
import GraphDisplay from "./GraphDisplay";
import LocationDistributionMap from "./LocationDistributionMap";

function Dashboard() {
  const itemcolor = { backgroundColor: "white" };
  const [animalList, setAnimalList] = useState([]);

  const getAnimals = () => {
    http
      .get(
        `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD`
      )
      .then((res) => {
        setAnimalList(res.data);
      });
  };

  const currentYear = new Date().getFullYear(); // Get current year
  const getIntakeCount = () => {
    const filteredAnimals = animalList.filter((animal) => {
      const rescueYear = new Date(animal.date_of_rescue).getFullYear(); // Extract the year from the rescue date
      return rescueYear === currentYear; // Check if the rescue year matches the current year
    });

    return filteredAnimals.length; // Return the count of animals rescued in the current year
  };

  useEffect(() => {
    getAnimals();
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12}>
          <Card style={itemcolor}>
            <CardContent align="center">
              <LocationDistributionMap />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card sx={{ height: "100%" }} style={itemcolor}>
            <CardContent align="center">
              <GraphDisplay graph="monthlyIntakeGraph" />
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          md={3}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Card sx={{ height: "30%" }} style={itemcolor}>
            <CardContent align="center">
              <Typography fontSize={{ md: 14, xl: 18 }} fontWeight="800">
                Total Intake Count for {currentYear}
              </Typography>
              <Typography
                fontSize={{ md: 26, xl: 30 }}
                style={{
                  paddingTop: "5px",
                  color: "skyblue",
                  fontWeight: "600",
                }}
              >
                {getIntakeCount()}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ height: "30%" }} style={itemcolor}>
            <CardContent align="center">
              <Typography fontSize={{ md: 14, xl: 18 }} fontWeight="800">
                Current Active Cases for {currentYear}
              </Typography>
              <Typography
                fontSize={{ md: 26, xl: 30 }}
                style={{
                  paddingTop: "5px",
                  color: "red",
                  fontWeight: "600",
                }}
              >
                9
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ height: "30%" }} style={itemcolor}>
            <CardContent align="center">
              <Typography fontSize={{ md: 14, xl: 18 }} fontWeight="800">
                Random Number Count for {currentYear}
              </Typography>
              <Typography
                fontSize={{ md: 26, xl: 30 }}
                style={{
                  paddingTop: "5px",
                  color: "green",
                  fontWeight: "600",
                }}
              >
                34
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }} style={itemcolor}>
            <CardContent align="center">
              Pie Chart - Case Status 2025
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }} style={itemcolor}>
            <CardContent align="center">
              <GraphDisplay graph="speciesDistributionGraph" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
