import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../http.js";

function AnimalData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  
  const [animalData, setAnimalData] = useState({
    food: null,
    medication: null,
    fed: false,
    medicated: false,
    surgeryTranscript: "",  // Added this
  });

  useEffect(() => {
    console.log(id);
    http.get(`https://8zjp8vpeub.execute-api.us-east-1.amazonaws.com/dev/animal/${id}`)
      .then((res) => {
        const responseData = res.data;
        setAnimalData({
          food: responseData.food,
          medication: responseData.medication,
          fed: false,
          medicated: false,
          surgeryTranscript: responseData.surgeryTranscript || "", 
        });
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [id]);

  const handleChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;
    setAnimalData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    http.put(`https://api.example.com/animals/${id}`, {
      fed: animalData.fed,
      medicated: animalData.medicated,
      surgeryTranscript: animalData.surgeryTranscript,  // Include transcript in the request
    })
    .then(() => navigate(-1))
    .catch((err) => console.error("Error updating data:", err));
  };

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <Tabs value={tabIndex} onChange={handleChange} centered>
            <Tab label="Food" />
            <Tab label="Medication" />
            <Tab label="Surgery Transcript" />  {/* New tab */}
          </Tabs>

          {tabIndex === 0 && animalData.food && (
            <Box>
              <Typography variant="h6">{animalData.food.name}</Typography>
              <Typography>Available: {animalData.food.available_quantity}</Typography>
              <Typography>Expires on: {animalData.food.expiration_date}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={animalData.fed}
                    onChange={handleInputChange}
                    name="fed"
                  />
                }
                label="Fed the animal"
              />
            </Box>
          )}

          {tabIndex === 1 && animalData.medication && (
            <Box>
              <Typography variant="h6">{animalData.medication.name}</Typography>
              <Typography>{animalData.medication.description}</Typography>
              <Typography>Dosage: {animalData.medication.dosage}</Typography>
              <Typography>Available: {animalData.medication.available_quantity}</Typography>
              <Typography>Batch: {animalData.medication.batch_number}</Typography>
              <Typography>Expires on: {animalData.medication.expiration_date}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={animalData.medicated}
                    onChange={handleInputChange}
                    name="medicated"
                  />
                }
                label="Gave medicine"
              />
            </Box>
          )}

          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6">Surgery Transcript</Typography>
              <TextField
                label="Transcript"
                name="surgeryTranscript"
                multiline
                rows={4}
                fullWidth
                value={animalData.surgeryTranscript}
                onChange={handleInputChange}
                margin="normal"
              />
            </Box>
          )}

          <Box mt={2} textAlign="center">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AnimalData;
