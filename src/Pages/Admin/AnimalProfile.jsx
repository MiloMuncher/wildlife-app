import React from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import http from "../../http.js";
import { color } from "framer-motion";

const AnimalProfile = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState([]);
  const [transcriptList, setTranscriptList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [medicationList, setMedicationList] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [food, setFood] = useState([]);
  const [medication, setMedication] = useState([]);

  const getTranscripts = () => {
    http
      .get(
        "https://0ylgzr9mv6.execute-api.us-east-1.amazonaws.com/dev/gettranscripts"
      )
      .then((res) => {
        setTranscriptList(res.data); // Update state
      });
  };
  const getFood = () => {
    http
      .get(`https://kvhdoqjcua.execute-api.us-east-1.amazonaws.com/dev/food`)
      .then((res) => {
        setFoodList(res.data);
      });
  };
  const getMedication = () => {
    http
      .get(
        `https://z40lajab6h.execute-api.us-east-1.amazonaws.com/dev/medications`
      )
      .then((res) => {
        setMedicationList(res.data);
      });
  };

  useEffect(() => {
    getTranscripts();
    getFood();
    getMedication();
    http
      .get(
        `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD/animals?animal_ID=${id}`
      )
      .then((res) => {
        setAnimal(res.data);
      });
  }, [id]);

  useEffect(() => {
    if (animal && transcriptList.length > 0) {
      const foundTranscript = transcriptList.find(
        (t) => t.transcript_ID === animal.transcript_ID
      );
      if (foundTranscript) setTranscript(foundTranscript);
    }
  }, [animal, transcriptList]);

  useEffect(() => {
    if (animal && medicationList.length > 0) {
      const foundMedication = medicationList.find(
        (m) => m.medication_ID === animal.medication_ID
      );
      if (foundMedication) setMedication(foundMedication);
    }
  }, [animal, medicationList]);

  useEffect(() => {
    if (animal && foodList.length > 0) {
      const foundFood = foodList.find((f) => f.food_ID === animal.food_ID);
      if (foundFood) setFood(foundFood);
    }
  }, [animal, foodList]);

  const fieldsText = {
    fontSize: "19px",
    paddingBottom: "8px",
    color: "#3b5f78",
    fontWeight: 700,
  };

  const textStyle = {
    fontSize: "19px",
    paddingBottom: "8px",
  };
  console.log(animal.profile_pic);
  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Box padding={5}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={6}
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2 }}
              >
                <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                  Animal Profile ID: <u>{animal.animal_ID}</u>
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end", // Align content to the right
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ mb: 1, fontWeight: "bold", textAlign: "right" }}
                >
                  <span
                    style={{
                      color: animal.case_status === "Closed" ? "gray" : "red", // Gray if Closed, Red if Open
                    }}
                  >
                    {animal.case_status}
                  </span>
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                style={textStyle}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <div>
                  <Typography variant="h4" style={{ fontWeight: "bold" }}>
                    {animal.species}
                  </Typography>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <div
                  style={{
                    width: "auto",
                    maxWidth: "550px", // Maximum width constraint
                    height: "auto",
                    maxHeight: "300px", // Maximum height constraint
                    overflow: "hidden",
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  {animal.profile_pic ? (
                    <img
                      src={animal.profile_pic}
                      alt="Animal Profile"
                      style={{
                        width: "auto",
                        height: "100%", // Ensures image stays within maxHeight
                        maxHeight: "300px",
                        objectFit: "contain", // Keeps entire image visible
                        display: "block",
                      }}
                    />
                  ) : (
                    <Typography>No Image Available</Typography> // Fallback text when no image is available
                  )}
                </div>
              </Grid>

              <Grid item xs={6} style={fieldsText}>
                <div>
                  <Typography style={fieldsText}>
                    Current Health Status:
                  </Typography>
                  <Typography style={fieldsText}>
                    Prescribed Medication:
                  </Typography>
                  <Typography style={fieldsText}>Required Dosage:</Typography>
                  <Typography style={fieldsText}>Food:</Typography>
                  <Typography style={fieldsText}>
                    Required Food Amount:
                  </Typography>
                  <Typography style={fieldsText}>
                    Assigned Transcript:
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div>
                  <Typography style={textStyle}>
                    {animal.current_health_status}
                  </Typography>
                  <Typography style={textStyle}>
                    {medication?.name || "Not Assigned"}
                  </Typography>
                  <Typography style={textStyle}>
                    {animal.required_dosage
                      ? animal.required_dosage
                      : "Not Assigned"}
                    mg
                  </Typography>
                  <Typography style={textStyle}>
                    {food?.name || "Not Assigned"}
                  </Typography>
                  <Typography style={textStyle}>
                    {animal.required_food_amount > 1000
                      ? `${(animal.required_food_amount / 1000).toFixed(2)} kg`
                      : `${animal.required_food_amount} g`}
                  </Typography>
                  <Typography style={textStyle}>
                    {transcript?.description || "Not Assigned"}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={6} style={textStyle}>
                <div>
                  <Typography style={fieldsText}>Initial Condition:</Typography>
                  <Typography style={fieldsText}>Weight:</Typography>
                  <Typography style={fieldsText}>Age Class:</Typography>
                  <Typography style={fieldsText}>Date of Rescue:</Typography>
                  <Typography style={fieldsText}>Location Found:</Typography>
                </div>
              </Grid>
              <Grid item xs={6} style={textStyle}>
                <div>
                  <Typography style={textStyle}>
                    {animal.initial_condition}
                  </Typography>
                  <Typography style={textStyle}>
                    {animal.weight > 1000
                      ? `${(animal.weight / 1000).toFixed(2)} kg`
                      : `${animal.weight} g`}
                  </Typography>

                  <Typography style={textStyle}>{animal.age_class}</Typography>
                  <Typography style={textStyle}>
                    {animal.date_of_rescue}
                  </Typography>
                  <Typography style={textStyle}>
                    {animal.location_found}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AnimalProfile;
