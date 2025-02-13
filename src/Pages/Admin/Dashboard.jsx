import React, { useState, useEffect } from "react";
import { Typography, Grid, Container, Card, CardContent } from "@mui/material";
import OrdersChart from "../Charts/OrdersChart";
import UserChart from "../Charts/UserChart";
import EventChart from "../Charts/EventChart";
import "@aws-amplify/ui-react/styles.css";
import { fetchAuthSession } from "aws-amplify/auth";
import { list } from "aws-amplify/storage";
import GraphDisplay from "./GraphDisplay";

function Dashboard() {
  const itemcolor = { backgroundColor: "white" };
  const [latestImage, setLatestImage] = useState(null); // Store the latest image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(null);
  useEffect(() => {
    // Function to list files from the S3 bucket
    const fetchFiles = async () => {
      try {
        const result = await list({
          path: `private/monthly-intake/`,
          level: "private",
        });
        console.log(result);

        const allFiles = result["items"]; // Get all files from the result
        console.log(allFiles);

        console.log(allFiles["lastModified"]);

        const sortedFiles = allFiles.sort(
          (a, b) => b.lastModified - a.lastModified
        );

        console.log("Sorted", sortedFiles);

        // const latestImageFile = sortedFiles.find(file => file.key.match(/\.(jpg|jpeg|png|gif)$/i));

        setLatestImage(sortedFiles[3]); // Set the latest image to the first file in the sorted array
      } catch (err) {
        setError("Error fetching files: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles(); // Call the listFiles function
  }, []); // Empty dependency array means it runs once when the component mounts

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={4.8} md={12}>
          <Card style={itemcolor}>
            <CardContent align="center">
              <GraphDisplay bucket_folder="monthly-intake" set_width="900px" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card style={itemcolor}>
            <CardContent align="center">
              <GraphDisplay
                bucket_folder="outcome-type-distribution"
                set_width="900px"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4.8} md={12}>
          <Card style={itemcolor}>
            <CardContent align="center">
              <GraphDisplay
                bucket_folder="species-distribution"
                set_width="900px"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
