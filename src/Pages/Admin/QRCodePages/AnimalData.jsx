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
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../http.js";

function AnimalData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [animalData, setAnimalData] = useState({
    food: null,
    required_food_amount: null,
    required_dosage: null,
    medication: null,
    surgeryTranscript: "",
  });

  useEffect(() => {
    http.get(`https://8zjp8vpeub.execute-api.us-east-1.amazonaws.com/dev/animal/${id}`)
      .then((res) => {
        const responseData = res.data;
        setAnimalData({
          food: responseData.food,
          required_food_amount: responseData.required_food_medication.required_food_amount,
          initial_quantity: responseData.intake_food.available_quantity,
          required_dosage: responseData.required_food_medication.required_dosage,
          medication: responseData.medication,
          surgeryTranscript: responseData.surgeryTranscript || "",
          fed: false,
          medicated: false,
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

  const extractDosageNumber = (dosageString) => {
    const number = parseFloat(dosageString);
    console.log("Extracted Dosage Number:", number);
    return isNaN(number) ? 0 : number;
  };

  const calculateRemainingMedication = (requiredDosage, dosagePerAdmin, availableQuantity) => {
    const dosesRequired = Math.ceil(requiredDosage / dosagePerAdmin);
    console.log("Total doses required:", dosesRequired);
    const remainingQuantity = availableQuantity - dosesRequired;
    console.log("Remaining quantity after given doses:", remainingQuantity);
    return remainingQuantity >= 0 ? remainingQuantity : 0;
  };

  const calculateRemainingFood = (requiredFoodAmount, weightPerQuantity, availableFoodQuantity) => {
    let remainingWeight = weightPerQuantity - requiredFoodAmount;
    let remainingQuantity = availableFoodQuantity;

    if (remainingWeight < 0) {
      remainingQuantity -= 1;
      remainingWeight = animalData.initial_quantity + remainingWeight; // Assuming initial_quantity is in animalData
    }

    console.log("Remaining food weight:", remainingWeight);
    console.log("Remaining food quantity:", remainingQuantity);

    return { final_weight_per_quantity: remainingWeight, final_food_quantity: remainingQuantity >= 0 ? remainingQuantity : 0 };
  };

  const calculateFood = () => {
    const requiredFoodAmount = animalData.required_food_amount;
    const weightPerQuantity = animalData.food.weight_per_quantity;
    const availableFoodQuantity = animalData.food.available_quantity;

    console.log("Required Food Amount:", requiredFoodAmount);
    console.log("Weight Per Quantity:", weightPerQuantity);
    console.log("Available Food Quantity:", availableFoodQuantity);

    return calculateRemainingFood(requiredFoodAmount, weightPerQuantity, availableFoodQuantity);
  };

  const calculateMedication = () => {
    const requiredDosage = animalData.required_dosage;
    const dosagePerAdmin = extractDosageNumber(animalData.medication.dosage);
    const availableQuantity = animalData.medication.available_quantity;

    console.log("Required Dosage:", requiredDosage);
    console.log("Dosage Per Administration:", dosagePerAdmin);
    console.log("Available Medication Quantity:", availableQuantity);

    return calculateRemainingMedication(requiredDosage, dosagePerAdmin, availableQuantity);
  };

  const handleSubmit = () => {
    // Initialize the object for final quantities
    let finalQuantities = {
      final_weight_per_quantity: animalData.food?.weight_per_quantity,
      final_food_quantity: animalData.food?.available_quantity,
      final_medication_quantity: animalData.medication?.available_quantity,
    };

    console.log("Initial Final Quantities:", finalQuantities);

    // If food checkbox is checked, perform food calculation
    if (animalData.fed) {
      const foodValues = calculateFood();
      finalQuantities.final_weight_per_quantity = foodValues.final_weight_per_quantity;
      finalQuantities.final_food_quantity = foodValues.final_food_quantity;
      console.log("Updated Final Quantities after Food Calculation:", finalQuantities);
    }

    // If medication checkbox is checked, perform medication calculation
    if (animalData.medicated) {
      const medicationValue = calculateMedication();
      finalQuantities.final_medication_quantity = medicationValue;
      console.log("Updated Final Quantities after Medication Calculation:", finalQuantities);
    }

    // Proceed with PUT request only if the calculations are made
    http.put(`https://8zjp8vpeub.execute-api.us-east-1.amazonaws.com/dev/animal/${id}`, {
      updated_weight_per_quantity: finalQuantities.final_weight_per_quantity,
      updated_food_quantity: finalQuantities.final_food_quantity,
      updated_medication_quantity: finalQuantities.final_medication_quantity
    })
      .then(() => {
        setSuccessMessage("Animal data successfully saved!");
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error("Error updating data:", err);
        setSuccessMessage("Failed to save animal data. Please try again.");
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <Tabs value={tabIndex} onChange={handleChange} centered>
            <Tab label="Food" />
            <Tab label="Medication" />
            <Tab label="Surgery Transcript" />
          </Tabs>

          {tabIndex === 0 && animalData.food && (
            <Box>
              <Typography variant="h6">
                {animalData.food.name} <Typography variant="body2" component="span">({animalData.food.batch_number})</Typography>
              </Typography>
              <Typography>{animalData.food.description}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>Available Quantity: {animalData.food.available_quantity}</Typography>
              <Typography>Batch Expiry: {animalData.food.expiration_date}</Typography>
              <Typography sx={{ fontWeight: "bold", color: "#d32f2f" }} >
                Required Amount: {animalData.required_food_amount}g
              </Typography>
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
              <Typography variant="h6">
                {animalData.medication.name} <Typography variant="body2" component="span">({animalData.medication.batch_number})</Typography>
              </Typography>
              <Typography>{animalData.medication.description}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>Available Quantity: {animalData.medication.available_quantity}</Typography>
              <Typography>Dosage: {animalData.medication.dosage}</Typography>
              <Typography>Batch Expiry: {animalData.medication.expiration_date}</Typography>
              <Typography sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                Required Dosage: {animalData.required_dosage} {animalData.medication.dosage.replace(/[^a-zA-Z]/g, '')}
              </Typography>
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

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default AnimalData;
