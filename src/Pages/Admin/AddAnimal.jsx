import React from "react";
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

function AddAnimal() {
  const btnstyle = {
    margin: "30px 0",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#FF4E00",
  };

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      species: "",
      weight: "",
      age_class: "",
      date_of_rescue: "",
      initial_condition: "",
      current_health_status: "",
      location_found: "",
      outcome_type: "",
      required_food_amount: "",
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
          ["infant", "juvenile", "adult", "elderly"],
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
        .min(2, "Current health status must be at least 2 characters")
        .max(100, "Current health status must be at most 100 characters")
        .required("Current health status is required"),
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
    }),
    onSubmit: (data) => {
      http
        .post(
          "https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animals",
          data
        )
        .then((res) => {
          console.log(res.data);
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
                  error={formik.touched.species && Boolean(formik.errors.species)}
                  helperText={formik.touched.species && formik.errors.species}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Weight"
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
                  helperText={formik.touched.age_class && formik.errors.age_class}
                >
                  {["infant", "juvenile", "adult", "elderly"].map((option) => (
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Outcome Type"
                  name="outcome_type"
                  onChange={formik.handleChange}
                  value={formik.values.outcome_type}
                  error={
                    formik.touched.outcome_type &&
                    Boolean(formik.errors.outcome_type)
                  }
                  helperText={
                    formik.touched.outcome_type &&
                    formik.errors.outcome_type
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Required Food Amount"
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
