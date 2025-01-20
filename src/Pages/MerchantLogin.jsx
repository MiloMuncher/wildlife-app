import React, { useState, useContext } from 'react'
import { Container, Box, Paper, Grid, Typography, Button, Divider, Card, CardContent, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http.js';
import UserContext from '../contexts/UserContext.js';

function MerchantLogin() {
    // style
    const btnstyle = { backgroundColor: 'black', fontWeight: 'bold', color: 'white', marginTop: '50px' }
    const loginbtnstyle = { backgroundColor: '#FF4E00', fontWeight: 'bold', color: 'white' }

    //validation schema
    const navigate = useNavigate();

    const { setUser } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            companyid: '',
        },
        validationSchema: yup.object().shape({
            email: yup.string().trim().email('Email must be valid')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required'),
            companyid: yup.string().trim()
                .max(50, 'Password must be at most 50 characters')
                .required('Company Id is required'),
        }),
        onSubmit: (data) => {
            data.email = data.email.trim();
            data.password = data.password.trim();
            data.companyid = data.companyid.trim();
            http.post('/User/merchantlogin', data)
                .then((res) => {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    setUser(res.data.user);
                    navigate("/merchant/viewevent")
                }).catch((error) => {
                    if (error.response && error.response.status === 400) {
                        const errorMessage = error.response.data.message;
                        formik.setErrors({
                            ...formik.errors,
                            email: errorMessage,
                            password: errorMessage,
                            companyid: errorMessage,
                        });
                    }
                })
        },
    });



    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <Paper elevation={3} sx={{ padding: '2rem', maxWidth: '400px', height: '317px', backgroundImage: 'url("../Images/background 2.png")', backgroundSize: 'cover' }}>
                    <Typography variant="h5" align="center" gutterBottom fontWeight={'bold'}>
                        Just a user?
                    </Typography>
                    <Typography variant="body1" align="center" gutterBottom fontWeight={'bold'} >
                        Go back to user login here
                    </Typography>
                    <Link to='/login'>
                        <Button variant='contained' color='btn' style={btnstyle} fullWidth>
                            Go Back
                        </Button>
                    </Link>
                </Paper>

                <Paper elevation={3} sx={{ padding: '2rem', maxWidth: '400px' }}>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Merchant Log in
                        </Typography>
                        <Divider sx={{ margin: '1rem 0' }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name='email'
                                    label="Email"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name='password'
                                    label="Password"
                                    type='password'
                                    fullWidth
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name='companyid'
                                    label="Company ID"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    value={formik.values.companyid}
                                    error={formik.touched.companyid && Boolean(formik.errors.companyid)}
                                    helperText={formik.touched.companyid && formik.errors.companyid}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type='submit' variant="contained" fullWidth style={loginbtnstyle}>
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}


export default MerchantLogin