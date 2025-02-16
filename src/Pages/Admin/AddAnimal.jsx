import React, { useEffect } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import http from "../../http.js";
import { useState } from "react";

function AddAnimal() {
  const btnstyle = {
    margin: "30px 0",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#FF4E00",
  };

  const navigate = useNavigate();

  const singaporeTowns = [
    "Ang Mo Kio",
    "Bedok",
    "Bukit Batok",
    "Bukit Panjang",
    "Bukit Timah",
    "Clementi",
    "Dover",
    "Hougang",
    "Jurong East",
    "Jurong West",
    "Kallang",
    "Marina Bay",
    "Marine Parade",
    "Novena",
    "Orchard",
    "Pasir Ris",
    "Punggol",
    "Queenstown",
    "Sengkang",
    "Serangoon",
    "Tampines",
    "Toa Payoh",
    "Woodlands",
    "Yishun",
  ];

  const initialConditions = [
    "Injured",
    "Sick",
    "Orphaned",
    "Abandoned",
    "Confined",
    "Starved",
    "Dehydrated",
  ];

  const outcomeTypes = [
    "To be released",
    "To be rehabilitated",
    "To be euthanized",
    "To be released to sanctuary",
    "To be evaluated",
    "To be treated",
    "To be monitored",
    "To be quarantined",
    "Released",
    "Deceased",
  ];

  const currentHealthStatus = [
    "Healthy",
    "Recovering",
    "Critical Condition",
    "Stable",
    "Improving",
    "Deteriorating",
    "In Treatment",
  ];

  const [foodList, setFoodList] = useState([]);
  const [medicationList, setMedicationList] = useState([]);

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

  const formik = useFormik({
    initialValues: {
      species: "",
      weight: "",
      age_class: "",
      date_of_rescue: new Date().toISOString().split("T")[0],
      initial_condition: "",
      current_health_status: "",
      location_found: "",
      outcome_type: "",
      case_status: "Open",
      required_food_amount: "",
      profile_pic: "",
      transcript_ID: "",
      medication_ID: "",
      food_ID: "",
      weight_kg: 0,
      weight_g: 0,
      food_kg: 0,
      food_g: 0,
    },
    validationSchema: yup.object({
      species: yup
        .string()
        .trim()
        .min(2, "Species name must be at least 2 characters")
        .max(50, "Species name must be at most 50 characters")
        .required("Species is required"),
      weight_kg: yup
        .number()
        .typeError("Weight must be a number")
        .positive("Weight must be positive")
        .required("Weight is required"),
      weight_g: yup
        .number()
        .typeError("Weight must be a number")
        .positive("Weight must be positive")
        .required("Weight is required"),
      food_kg: yup
        .number()
        .typeError("Weight must be a number")
        .positive("Weight must be positive")
        .required("Weight is required"),
      food_g: yup
        .number()
        .typeError("Weight must be a number")
        .positive("Weight must be positive")
        .required("Weight is required"),
      age_class: yup
        .string()
        .oneOf(
          ["Infant", "Juvenile", "Adult", "Elderly"],
          "Invalid age class selected"
        )
        .required("Age class is required"),
      date_of_rescue: yup.date().required("Date of rescue is required"),
      initial_condition: yup
        .string()
        .trim()
        .min(2, "Initial condition must be at least 2 characters")
        .max(100, "Initial condition must be at most 100 characters")
        .required("Initial condition is required"),
      current_health_status: yup
        .string()
        .trim()
        .min(2, "Initial condition must be at least 2 characters")
        .max(100, "Initial condition must be at most 100 characters")
        .required("Initial condition is required"),
      location_found: yup
        .string()
        .trim()
        .min(2, "Location found must be at least 2 characters")
        .max(100, "Location found must be at most 100 characters")
        .required("Location found is required"),
      outcome_type: yup
        .string()
        .trim()
        .min(2, "Outcome type must be at least 2 characters")
        .max(50, "Outcome type must be at most 50 characters")
        .required("Outcome type is required"),
      required_food_amount: yup
        .number()
        .typeError("Required food amount must be a number")
        .positive("Required food amount must be positive")
        .required("Required food amount is required"),
      medication_ID: yup.number().required("Medication is required"),
      food_ID: yup.number().required("Food is required"),
    }),
    onSubmit: (data) => {
      // Perform the POST request
      data.transcript_ID = null;
      console.log(data);
      http
        .post(
          "https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD",
          data
        )
        .then((res) => {
          navigate("/admin/viewanimals");
        })
        .catch((err) => console.log(err));
    },
  });

  const calculateTotalWeight = (e) => {
    // const { name, value } = e.target;

    // Get kilogram and gram values from formik state
    const kg = parseFloat(formik.values.weight_kg) || 0;
    const g = parseFloat(formik.values.weight_g) || 0;

    // Calculate total weight in grams
    const totalWeight = kg * 1000 + g;

    // Set the total weight into the formik state 'weight'
    formik.setFieldValue("weight", totalWeight);
    console.log(formik.values.weight);
  };

  const calculateFoodAmount = (e) => {
    // const { name, value } = e.target;

    // Get kilogram and gram values from formik state
    const kg = parseFloat(formik.values.kg) || 0;
    const g = parseFloat(formik.values.g) || 0;

    // Calculate total weight in grams
    const totalWeight = kg * 1000 + g;

    // Set the total weight into the formik state 'weight'
    formik.setFieldValue("required_food_amount", totalWeight);
    console.log(formik.values.required_food_amount);
  };

  useEffect(() => {
    getFood();
    getMedication();
    calculateTotalWeight();
    calculateFoodAmount();
  }, [
    formik.values.weight_kg,
    formik.values.weight_g,
    formik.values.food_kg,
    formik.values.food_g,
  ]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h6">Add New Animal Rescue</Typography>
      <Card>
        <CardContent>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Species"
                  name="species"
                  onChange={(e) => {
                    const capitalizedValue =
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1);
                    formik.setFieldValue("species", capitalizedValue);
                  }}
                  value={formik.values.species}
                  error={
                    formik.touched.species && Boolean(formik.errors.species)
                  }
                  helperText={formik.touched.species && formik.errors.species}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date of Rescue"
                  name="date_of_rescue"
                  type="date"
                  onChange={formik.handleChange}
                  value={formik.values.date_of_rescue}
                  error={
                    formik.touched.date_of_rescue &&
                    Boolean(formik.errors.date_of_rescue)
                  }
                  helperText={
                    formik.touched.date_of_rescue &&
                    formik.errors.date_of_rescue
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: new Date().toISOString().split("T")[0], // Prevent future dates
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Location Found"
                  name="location_found"
                  onChange={formik.handleChange}
                  value={formik.values.location_found}
                  error={
                    formik.touched.location_found &&
                    Boolean(formik.errors.location_found)
                  }
                  helperText={
                    formik.touched.location_found &&
                    formik.errors.location_found
                  }
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      disablePortal: true, // Ensures the dropdown remains within the form structure
                      PaperProps: {
                        style: {
                          maxHeight: 200, // Set the max height for the dropdown
                          overflowY: "auto", // Enables scrolling when content overflows
                        },
                      },
                    },
                  }}
                >
                  {singaporeTowns.map((town) => (
                    <MenuItem key={town} value={town}>
                      {town}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2.5}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      name="weight_kg"
                      type="number"
                      onChange={(e) => {
                        formik.handleChange(e);
                        calculateTotalWeight(e);
                      }}
                      value={formik.values.weight_kg}
                      error={
                        formik.touched.weight_kg &&
                        Boolean(formik.errors.weight_kg)
                      }
                      helperText={
                        formik.touched.weight_kg && formik.errors.weight_kg
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={0.5}
                    style={{ textAlign: "center", alignSelf: "center" }}
                  >
                    <Typography variant="body1">kg</Typography>
                  </Grid>
                  <Grid item xs={2.5}>
                    <TextField
                      fullWidth
                      label="Weight (g)"
                      name="weight_g"
                      type="number"
                      onChange={(e) => {
                        formik.handleChange(e);
                        calculateTotalWeight(e);
                      }}
                      value={formik.values.weight_g}
                      error={
                        formik.touched.weight_g &&
                        Boolean(formik.errors.weight_g)
                      }
                      helperText={
                        formik.touched.weight_g && formik.errors.weight_g
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={0.5}
                    style={{ textAlign: "center", alignSelf: "center" }}
                  >
                    <Typography variant="body1">g</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Age Class"
                  name="age_class"
                  onChange={formik.handleChange}
                  value={formik.values.age_class}
                  error={
                    formik.touched.age_class && Boolean(formik.errors.age_class)
                  }
                  helperText={
                    formik.touched.age_class && formik.errors.age_class
                  }
                >
                  {["Infant", "Juvenile", "Adult", "Elderly"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Initial Condition"
                  name="initial_condition"
                  onChange={formik.handleChange}
                  value={formik.values.initial_condition}
                  error={
                    formik.touched.initial_condition &&
                    Boolean(formik.errors.initial_condition)
                  }
                  helperText={
                    formik.touched.initial_condition &&
                    formik.errors.initial_condition
                  }
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      disablePortal: true, // Ensures the dropdown remains within the form structure
                      PaperProps: {
                        style: {
                          maxHeight: 200, // Set the max height for the dropdown
                          overflowY: "auto", // Enables scrolling when content overflows
                        },
                      },
                    },
                  }}
                >
                  {initialConditions.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Current Health Status"
                  name="current_health_status"
                  onChange={formik.handleChange}
                  value={formik.values.current_health_status}
                  error={
                    formik.touched.current_health_status &&
                    Boolean(formik.errors.current_health_status)
                  }
                  helperText={
                    formik.touched.current_health_status &&
                    formik.errors.current_health_status
                  }
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      disablePortal: true, // Ensures the dropdown remains within the form structure
                      PaperProps: {
                        style: {
                          maxHeight: 200, // Set the max height for the dropdown
                          overflowY: "auto", // Enables scrolling when content overflows
                        },
                      },
                    },
                  }}
                >
                  {currentHealthStatus.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Outcome Type"
                  name="outcome_type"
                  onChange={formik.handleChange}
                  value={formik.values.outcome_type}
                  error={
                    formik.touched.outcome_type &&
                    Boolean(formik.errors.outcome_type)
                  }
                  helperText={
                    formik.touched.outcome_type && formik.errors.outcome_type
                  }
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      disablePortal: true, // Ensures the dropdown remains within the form structure
                      PaperProps: {
                        style: {
                          maxHeight: 200, // Set the max height for the dropdown
                          overflowY: "auto", // Enables scrolling when content overflows
                        },
                      },
                    },
                  }}
                >
                  {outcomeTypes.map((outcome) => (
                    <MenuItem key={outcome} value={outcome}>
                      {outcome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Assign Food"
                  name="food_ID"
                  onChange={formik.handleChange}
                  value={formik.values.food_ID}
                  error={
                    formik.touched.food_ID && Boolean(formik.errors.food_ID)
                  }
                  helperText={formik.touched.food_ID && formik.errors.food_ID}
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      disablePortal: true, // Ensures the dropdown remains within the form structure
                      PaperProps: {
                        style: {
                          maxHeight: 200, // Set the max height for the dropdown
                          overflowY: "auto", // Enables scrolling when content overflows
                        },
                      },
                    },
                  }}
                >
                  {foodList.map((food) => (
                    <MenuItem key={food.food_ID} value={food.food_ID}>
                      {food.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Food Amount (kg)"
                      name="food_kg"
                      type="number"
                      onChange={(e) => {
                        formik.handleChange(e);
                        calculateTotalWeight(e);
                      }}
                      value={formik.values.food_kg}
                      error={
                        formik.touched.food_kg && Boolean(formik.errors.food_kg)
                      }
                      helperText={
                        formik.touched.food_kg && formik.errors.food_kg
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    style={{ textAlign: "center", alignSelf: "center" }}
                  >
                    <Typography variant="body1">kg</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Food Amount (g)"
                      name="food_g"
                      type="number"
                      onChange={(e) => {
                        formik.handleChange(e);
                        calculateTotalWeight(e);
                      }}
                      value={formik.values.food_g}
                      error={
                        formik.touched.food_g && Boolean(formik.errors.food_g)
                      }
                      helperText={formik.touched.food_g && formik.errors.food_g}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    style={{ textAlign: "center", alignSelf: "center" }}
                  >
                    <Typography variant="body1">g</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Assign Medication"
                  name="medication_ID"
                  onChange={(e) =>
                    formik.setFieldValue("medication_ID", e.target.value)
                  }
                  value={formik.values.medication_ID}
                  error={
                    formik.touched.medication_ID &&
                    Boolean(formik.errors.medication_ID)
                  }
                  helperText={
                    formik.touched.medication_ID && formik.errors.medication_ID
                  }
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      disablePortal: true, // Ensures the dropdown remains within the form structure
                      PaperProps: {
                        style: {
                          maxHeight: 200, // Set the max height for the dropdown
                          overflowY: "auto", // Enables scrolling when content overflows
                        },
                      },
                    },
                  }}
                >
                  {medicationList.map((medication) => (
                    <MenuItem
                      key={medication.medication_ID}
                      value={medication.medication_ID}
                    >
                      {medication.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" style={btnstyle}>
              Add Animal
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AddAnimal;
