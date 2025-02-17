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
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import http from "../../http.js";
import { useState, useEffect, useContext } from "react";

function EditAnimal() {
  const btnstyle = {
    margin: "30px 0",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#FF4E00",
  };

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
    "Malnourished",
    "Dehydrated",
    "Healthy",
    "Recovering",
    "Critical Condition",
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

  const { id } = useParams();
  const [u, setU] = useState({
    weight: "",
    age_class: "",
    outcome_type: "",
    current_health_status: "",
    case_status: "",
    required_food_amount: "",
    profile_pic: "",
    transcript_ID: "",
    medication_ID: "",
    food_ID: "",
    profile_pic: "",
  });

  const [transcriptList, setTranscriptList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [medicationList, setMedicationList] = useState([]);

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
        setU(res.data);
      });
  }, [id]);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: u,
    enableReinitialize: true,
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
          ["Infant", "Juvenile", "Subadult", "Adult", "Elderly"],
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
      transcript_ID: yup.number().required("Vet transcript is required"),
      medication_ID: yup.number().required("Medication is required"),
      food_ID: yup.number().required("Food is required"),
      case_status: yup
        .string()
        .oneOf(["Open", "Closed"], "Invalid age class selected")
        .required("Case Status is required"),
    }),
    onSubmit: (data) => {
      console.log(data);
      data.profile_pic = base64;
      http
        .put(
          `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD/animals?animal_ID=${id}`,
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
      <Card>
        <CardContent>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2 }}
              >
                <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                  Update Animal Details
                </Typography>

                <Typography style={{ marginBottom: "5px" }}>
                  <strong>Species:</strong> &nbsp;{formik.values.species}
                </Typography>

                <Typography style={{ marginBottom: "5px" }}>
                  <strong>Date of Rescue:</strong> &nbsp;
                  {formik.values.date_of_rescue}
                </Typography>

                <Typography style={{ marginBottom: "5px" }}>
                  <strong>Initial Condition:</strong> &nbsp;
                  {formik.values.initial_condition}
                </Typography>

                <Typography style={{ marginBottom: "5px" }}>
                  <strong>Location Found:</strong> &nbsp;
                  {formik.values.location_found}
                </Typography>
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
                  label="Assign Vet Transcript"
                  name="transcript_ID"
                  onChange={(e) =>
                    formik.setFieldValue("transcript_ID", e.target.value)
                  }
                  value={formik.values.transcript_ID}
                  error={
                    formik.touched.transcript_ID &&
                    Boolean(formik.errors.transcript_ID)
                  }
                  helperText={
                    formik.touched.transcript_ID && formik.errors.transcript_ID
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
                  {transcriptList.map((vet) => (
                    <MenuItem key={vet.transcript_ID} value={vet.transcript_ID}>
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
                  onChange={(e) =>
                    formik.setFieldValue("food_ID", e.target.value)
                  }
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

              <Grid item xs={6}>
                <Typography variant="h6">Case Status</Typography>
                <RadioGroup
                  row
                  aria-label="case-status"
                  name="case_status"
                  value={formik.values.case_status}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Open"
                    control={<Radio />}
                    label="Open"
                  />
                  <FormControlLabel
                    value="Closed"
                    control={<Radio />}
                    label="Closed"
                  />
                </RadioGroup>
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
              Update Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default EditAnimal;
