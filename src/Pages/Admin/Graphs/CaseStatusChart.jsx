import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import http from "../../../http";

const CaseStatusChart = () => {
  const [animalList, setAnimalList] = useState([]);
  const [caseStatusCount, setCaseStatusCount] = useState({
    Open: 0,
    Closed: 0,
  });

  const getAnimals = () => {
    http
      .get(
        `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD`
      )
      .then((res) => {
        setAnimalList(res.data);
        processData(res.data); // Process data after fetching
      });
  };

  useEffect(() => {
    getAnimals();
  }, []);

  const processData = (data) => {
    const statusCount = { Open: 0, Closed: 0 };

    // Count the case statuses
    data.forEach((animal) => {
      if (animal.case_status === "Open") {
        statusCount.Open += 1;
      } else if (animal.case_status === "Closed") {
        statusCount.Closed += 1;
      }
    });

    setCaseStatusCount(statusCount); // Update the case status counts
  };

  return (
    <div>
      <h2 style={{ fontFamily: "Montserrat" }}>Case Status Chart</h2>
      <Plot
        data={[
          {
            type: "pie",
            labels: ["Open", "Closed"],
            values: [caseStatusCount.Open, caseStatusCount.Closed],
            marker: {
              colors: ["orange", "#B0B0B0"], // Customize colors if needed
            },
            textinfo: "label+percent", // Show label and percentage on the pie chart
          },
        ]}
        layout={{
          title: "Case Status Distribution",
          height: 500, // Adjust height as needed
          width: 500, // Adjust width as needed
        }}
      />
    </div>
  );
};

export default CaseStatusChart;
