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

  const [fileName, setFileName] = useState("");
  const [base64, setBase64] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);

      // Convert image to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Remove the prefix
        setBase64(base64String);
      };
    }
  };

  const formik = useFormik({
    initialValues: {
      species: "",
      weight: "",
      age_class: "",
      date_of_rescue: new Date().toISOString().split("T")[0],
      initial_condition: "To be updated",
      current_health_status: "To be updated",
      location_found: "",
      outcome_type: "To be updated",
      case_status: "Open",
      required_food_amount: "",
      profile_pic: "",
      transcript_ID: "",
      medication_ID: "",
      required_dosage: "",
      food_ID: "",
      weight_kg: 0,
      weight_g: 0,
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
        .min(0, "Weight cannot be negative")
        .test(
          "at-least-one",
          "Either weight (kg) or weight (g) must be greater than 0",
          function (value) {
            const weight_g = this.parent.weight_g;
            return value > 0 || weight_g > 0;
          }
        )
        .required("Weight is required"),
      weight_g: yup
        .number()
        .typeError("Weight must be a number")
        .min(0, "Weight cannot be negative")
        .test(
          "at-least-one",
          "Either weight (kg) or weight (g) must be greater than 0",
          function (value) {
            const weight_kg = this.parent.weight_kg;
            return value > 0 || weight_kg > 0;
          }
        )
        .required("Weight is required"),
      age_class: yup
        .string()
        .oneOf(
          ["Infant", "Juvenile", "Subadult", "Adult", "Elderly"],
          "Invalid age class selected"
        )
        .required("Age class is required"),
      date_of_rescue: yup.date().required("Date of rescue is required"),
      location_found: yup
        .string()
        .trim()
        .min(2, "Location found must be at least 2 characters")
        .max(100, "Location found must be at most 100 characters")
        .required("Location found is required"),
    }),
    onSubmit: (data) => {
      data.profile_pic = base64;
      data.initial_condition = "To be updated";
      data.current_health_status = "To be updated";
      data.outcome_type = "To be updated";
      data.case_status = "Open";
      data.required_food_amount = 0;
      data.transcript_ID = null;
      data.food_ID = null;
      data.medication_ID = null;
      data.required_dosage = null;

      console.log(data);
      http
        .post(
          "https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD",
          data
        )
        .then((res) => {
          console.log("Form submitted successfully:", res);
          navigate("/admin/viewanimals");
        })
        .catch((err) => {
          console.error("Submission error:", err);
          alert("There was an error submitting the form.");
        });
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

  useEffect(() => {
    calculateTotalWeight();
  }, [formik.values.weight_kg, formik.values.weight_g]);

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
                  {["Infant", "Juvenile", "Subadult", "Adult", "Elderly"].map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                {/* Hidden File Input */}
                <input
                  type="file"
                  id="profile-pic-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                {/* Styled TextField to display file name */}
                <TextField
                  fullWidth
                  label="Upload Profile Picture"
                  value={fileName} // Shows the file name when selected
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Button
                        variant="contained"
                        component="label"
                        htmlFor="profile-pic-upload"
                        sx={{
                          width: "25%",
                          backgroundColor: "rgb(255, 78, 0)",
                        }}
                      >
                        Choose File
                      </Button>
                    ),
                  }}
                />
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
