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
import BackButton from "./BackButton.jsx";

function EditAnimalInSanctuary() {
  const btnstyle = {
    margin: "30px 0",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#FF4E00",
  };

  const { id } = useParams();
  const [u, setU] = useState({
    animal_name: "",
    description: "",
  });

  useEffect(() => {
    http
      .get(
        `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/sanctuary/id?id=${id}`
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
      animal_name: yup
        .string()
        .trim()
        .min(2, "Animal name must be at least 2 characters")
        .max(50, "Animal name must be at most 50 characters")
        .required("Animal name is required"),
      description: yup
        .string()
        .trim()
        .min(2, "Description must be at least 2 characters")
        .required("Description is required"),
    }),
    onSubmit: (data) => {
      http
        .put(
          `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/sanctuary/id?id=${id}`,
          data
        )
        .then((res) => {
          console.log(res.data);
          navigate("/admin/viewsanctuary");
        })
        .catch((err) => console.log(err));
    },
  });

  return (
    <Container maxWidth="lg">
      <BackButton />
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="animal_name"
                  onChange={(e) => {
                    const capitalizedValue =
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1);
                    formik.setFieldValue("animal_name", capitalizedValue);
                  }}
                  value={formik.values.animal_name}
                  error={
                    formik.touched.animal_name &&
                    Boolean(formik.errors.animal_name)
                  }
                  helperText={
                    formik.touched.animal_name && formik.errors.animal_name
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4} // Number of visible rows
                  onChange={(e) =>
                    formik.setFieldValue("description", e.target.value)
                  }
                  value={formik.values.description}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
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

export default EditAnimalInSanctuary;
