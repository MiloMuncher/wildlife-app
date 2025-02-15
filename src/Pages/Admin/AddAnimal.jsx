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
  Select,
  FormControl,
  InputLabel,
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
    "Other",
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

  const [transcriptList, setTranscriptList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [medicationList, setMedicationList] = useState([]);
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
  }, []);

  const formik = useFormik({
    initialValues: {
      species: "",
      weight: "",
      age_class: "",
      date_of_rescue: "",
      initial_condition: "",
      location_found: "",
      outcome_type: "",
      case_status: "Open",
      required_food_amount: "",
      vet_ID: "",
      medication_ID: "",
      food_ID: "",
      profile_pic: "",
    },
    validationSchema: yup.object({
      species: yup
        .string()
        .trim()
        .min(2, "Species name must be at least 2 characters")
        .max(50, "Species name must be at most 50 characters")
        .required("Species is required"),
      weight: yup
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
      vet_ID: yup.number().required("Vet transcript is required"),
      medication_ID: yup.number().required("Medication is required"),
      food_ID: yup.number().required("Food is required"),
    }),
    onSubmit: (data) => {
      // Set current_health_status to initial_condition
      data.current_health_status = data.initial_condition;

      // Perform the POST request
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
                  onChange={formik.handleChange}
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
                  label="Weight (g)"
                  name="weight"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.weight}
                  error={formik.touched.weight && Boolean(formik.errors.weight)}
                  helperText={formik.touched.weight && formik.errors.weight}
                />
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
                />
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Required Food Amount (g)"
                  name="required_food_amount"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.required_food_amount}
                  error={
                    formik.touched.required_food_amount &&
                    Boolean(formik.errors.required_food_amount)
                  }
                  helperText={
                    formik.touched.required_food_amount &&
                    formik.errors.required_food_amount
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Assign Vet Transcript"
                  name="vet_ID"
                  onChange={formik.handleChange}
                  value={formik.values.vet_ID}
                  error={formik.touched.vet_ID && Boolean(formik.errors.vet_ID)}
                  helperText={formik.touched.vet_ID && formik.errors.vet_ID}
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
                  {transcriptList.map((vet) => (
                    <MenuItem key={vet.vet_ID} value={vet.vet_ID}>
                      Transcript:&nbsp;<strong>{vet.description}</strong>
                      &nbsp;|&nbsp;Vet Name:&nbsp;<strong>{vet.name}</strong>
                    </MenuItem>
                  ))}
                </TextField>
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
