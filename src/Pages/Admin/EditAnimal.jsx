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
    "To be updated",
  ];

  const currentHealthStatus = [
    "Healthy",
    "Recovering",
    "Critical Condition",
    "Stable",
    "Improving",
    "Deteriorating",
    "In Treatment",
    "To be updated",
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
    "To be updated",
  ];

  const { id } = useParams();
  const [u, setU] = useState({
    species: "",
    weight: "",
    age_class: "",
    date_of_rescue: "",
    initial_condition: "",
    location_found: "",
    outcome_type: "",
    current_health_status: "",
    case_status: "",
    required_food_amount: "",
    profile_pic: "",
    required_dosage: "",
    transcript_ID: "",
    medication_ID: "",
    food_ID: "",
    weight_kg: 0,
    weight_g: 0,
    food_kg: 0,
    food_g: 0,
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
        console.log("food", res.data);
        const filteredFood = res.data.filter(
          (item) => item.batch_number !== "INTAKE"
        );
        setFoodList(filteredFood);
        console.log(filteredFood);
      });
  };

  const getMedication = () => {
    http
      .get(
        `https://z40lajab6h.execute-api.us-east-1.amazonaws.com/dev/medications`
      )
      .then((res) => {
        console.log("meds", res.data);
        const filteredMedications = res.data.filter(
          (item) => item.batch_number !== "INTAKE"
        );
        setMedicationList(filteredMedications);
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
        const animalData = res.data;
        const weight = parseInt(animalData.weight, 10) || 0;
        const food_amount = parseInt(animalData.required_food_amount, 10) || 0;

        setU({
          ...animalData,
          weight_kg: weight >= 1000 ? Math.floor(weight / 1000) : 0,
          weight_g: weight >= 1000 ? weight % 1000 : weight,
          food_kg: food_amount >= 1000 ? Math.floor(food_amount / 1000) : 0,
          food_g: food_amount >= 1000 ? food_amount % 1000 : food_amount,
          medication_ID: animalData.medication_ID ?? "To be assigned",
          food_ID: animalData.food_ID ?? "To be assigned",
          transcript_ID: animalData.transcript_ID ?? "To be assigned",
        });
      });
  }, [id]);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: u,
    enableReinitialize: true,
    validationSchema: yup.object({
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
        ),
      food_kg: yup
        .number()
        .typeError("Weight must be a number")
        .min(0, "Weight cannot be negative")
        .required("Weight is required"),
      food_g: yup
        .number()
        .typeError("Weight must be a number")
        .min(0, "Weight cannot be negative")
        .required("Weight is required"),
      age_class: yup
        .string()
        .oneOf(
          ["Infant", "Juvenile", "Subadult", "Adult", "Elderly"],
          "Invalid age class selected"
        )
        .required("Age class is required"),
      initial_condition: yup
        .string()
        .trim()
        .min(2, "Initial condition must be at least 2 characters")
        .max(100, "Initial condition must be at most 100 characters")
        .required("Initial condition is required"),
      outcome_type: yup
        .string()
        .trim()
        .min(2, "Outcome type must be at least 2 characters")
        .max(50, "Outcome type must be at most 50 characters")
        .required("Outcome type is required"),
      case_status: yup
        .string()
        .oneOf(["Open", "Closed"], "Invalid age class selected")
        .required("Case Status is required"),
    }),
    onSubmit: (data) => {
      if (data.transcript_ID == "To be assigned") {
        data.transcript_ID = null;
      }

      if (data.food_ID == "To be assigned") {
        data.food_ID = null;
        data.required_food_amount = 0;
      }

      if (data.medication_ID == "To be assigned") {
        data.medication_ID = null;
        data.required_dosage = null;
      }
      data.profile_pic = base64;

      const { weight_kg, weight_g, food_kg, food_g, ...filteredData } = data;

      http
        .put(
          `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD/animals?animal_ID=${id}`,
          filteredData
        )
        .then((res) => {
          console.log(res.data);
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
    const kg = parseFloat(formik.values.food_kg) || 0;
    const g = parseFloat(formik.values.food_g) || 0;

    // Calculate total weight in grams
    const totalWeight = kg * 1000 + g;

    // Set the total weight into the formik state 'weight'
    formik.setFieldValue("required_food_amount", totalWeight);
    console.log(formik.values.required_food_amount);
  };

  const calculateDosage = () => {
    const kg = parseFloat(formik.values.weight_kg) || 0;
    const g = parseFloat(formik.values.weight_g) || 0;

    // Calculate total weight in kg
    const totalWeight = kg + g / 1000;

    const medicationId = formik.values.medication_ID; // Get the selected medication ID
    console.log("id", medicationId);
    const selectedMedication = medicationList.find(
      (med) => med.medication_ID === medicationId
    ); // Find the selected medication

    if (selectedMedication) {
      // Remove 'mg' from the dosage and convert to number
      const dosageString = selectedMedication.dosage.replace("mg", "").trim(); // Remove 'mg' and trim any extra spaces
      console.log(dosageString);
      const dosage = parseFloat(dosageString); // Convert the string to a number

      if (isNaN(dosage)) {
        // Handle the case where the dosage is not a valid number
        console.error("Invalid dosage value");
        return;
      }
      const calculation = totalWeight * dosage; // Calculate the required dosage in mg
      console.log(totalWeight);
      console.log(calculation);
      formik.setFieldValue("required_dosage", calculation); // Update formik state with calculated dosage
    } else {
      formik.setFieldValue("required_dosage", null);
    }
  };

  useEffect(() => {
    calculateTotalWeight();
    calculateFoodAmount();
    calculateDosage();
  }, [
    formik.values.weight_kg,
    formik.values.weight_g,
    formik.values.food_kg,
    formik.values.food_g,
    formik.values.medication_ID,
  ]);

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
                  <strong>Location Found:</strong> &nbsp;
                  {formik.values.location_found}
                </Typography>
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
                        calculateDosage(e);
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
                        calculateDosage(e);
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
                  {initialConditions.map((initial_condition) => (
                    <MenuItem key={initial_condition} value={initial_condition}>
                      {initial_condition}
                    </MenuItem>
                  ))}
                </TextField>
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
                  {/* Option to return null */}
                  <MenuItem value="To be assigned">To be assigned</MenuItem>

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
                  {/* Option to return null */}
                  <MenuItem value="To be assigned">To be assigned</MenuItem>
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

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Assign Medication"
                  name="medication_ID"
                  onChange={(e) => {
                    formik.setFieldValue("medication_ID", e.target.value);
                    calculateDosage(e);
                  }}
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
                  {/* Option to return null */}
                  <MenuItem value="To be assigned">To be assigned</MenuItem>
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
                <TextField
                  fullWidth
                  label="Calculated Dosage in milligrams"
                  name="required_dosage"
                  type="number"
                  value={formik.values.required_dosage}
                  error={
                    formik.touched.required_dosage &&
                    Boolean(formik.errors.required_dosage)
                  }
                  helperText={
                    formik.touched.required_dosage &&
                    formik.errors.required_dosage
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
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
