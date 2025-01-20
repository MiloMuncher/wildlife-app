import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Typography, Grid, Container, TextField, Box, Button, Card, CardContent } from '@mui/material'
import UserContext from '../../contexts/UserContext.js';
import http from '../../http.js';
import * as Yup from 'yup';
import { useFormik } from 'formik';

//icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function ChangePassword() {
  const btnstyle = { margin: '8px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const formik = useFormik({
    initialValues: {
      password: "",
      newpassword: "",
      confirmpassword: ""
    },
    validationSchema: Yup.object({
      password: Yup.string().trim().min(8, 'Minimum 8 characters').required('Required'),
      newpassword: Yup.string().trim().min(8, 'Minimum 8 characters').required('Required'),
      confirmpassword: Yup.string().trim().min(8, 'Minimum 8 characters').required('Required'),
    }),
    onSubmit: (data) => {
      data.password = data.password.trim();
      data.newpassword = data.newpassword.trim();
      data.confirmpassword = data.confirmpassword.trim();
      http.post(`/User/password/${user.id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate(`/profile/profile`);
        }).catch((error) => {
          if (error.response && error.response.status === 400) {
            const errorMessages = error.response.data.errors;
            console.log(errorMessages)
            const formikErrors = {};
            for (const field in errorMessages) {
              const lowercaseField = field.toLowerCase();
              formikErrors[lowercaseField] = errorMessages[field];
            }
            const combinedErrors = { ...formikErrors };
            formik.setErrors(combinedErrors);
          }
        });
    },
  });
  return (
    <Container maxWidth='xl'>
      <Typography variant='h4' color="#000000" marginBottom={2}>
        Change your password
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  name="password"
                  label="Old Password"
                  type='password'
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="newpassword"
                  label="New Password"
                  type='password'
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.newpassword}
                  error={formik.touched.newpassword && Boolean(formik.errors.newpassword)}
                  helperText={formik.touched.newpassword && formik.errors.newpassword}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="confirmpassword"
                  label="Confirm Password"
                  type='password'
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.confirmpassword}
                  error={formik.touched.confirmpassword && Boolean(formik.errors.confirmpassword)}
                  helperText={formik.touched.confirmpassword && formik.errors.confirmpassword}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  type="submit"
                  variant='contained'
                  color='btn'
                  style={btnstyle}
                >
                  Save Password
                </Button>
              </Grid>
            </Grid>
            <Button
              variant='contained'
              endIcon={<ArrowBackIcon />}
              LinkComponent={Link} to={`/profile/profile`}
              style={btnstyle}
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </Box>

    </Container>
  )
}

export default ChangePassword