import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import http from "../../http";
import { Card, CardContent, Grid } from "@mui/material";

function Graph({ graph }) {
  const [graphList, setGraphList] = useState([]); // Store the latest image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    http
      .get(`https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/graph_CRUD`)
      .then((res) => {
        setGraphList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching graphs");
        setLoading(false);
        console.error(err);
      });
  }, []);

  const currentYear = new Date().getFullYear(); // Get current year
  const getMonthlyIntakeGraph = graphList.find(
    (item) => item.graph_name === `Monthly Intake Graph ${currentYear}`
  );
  const getSpeciesDistributionGraph = graphList.find(
    (item) => item.graph_name === `Species Distribution Graph ${currentYear}`
  );

  // Define graph URLs
  const monthlyIntakeGraphUrl = getMonthlyIntakeGraph?.graph_url || "";
  const speciesDistributionGraphUrl = getSpeciesDistributionGraph?.graph_url || "";

  // If `graph` is already a URL, use it. Otherwise, find the correct graph based on `graph` type.
  let graphUrl = graph.startsWith("http")
    ? graph
    : graph === "monthlyIntakeGraph"
    ? monthlyIntakeGraphUrl
    : graph === "speciesDistributionGraph"
    ? speciesDistributionGraphUrl
    : "";

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : graphUrl ? (
        <img
          src={graphUrl}
          alt="Graph"
          style={{
            width: "100%",
          }}
        />
      ) : (
        <p>No graph found for {currentYear}</p>
      )}
    </div>
  );
}

export default Graph;
