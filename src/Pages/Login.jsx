import React, { useState, useContext } from 'react'
import { Container, Box, Paper, Grid, Typography, Button, Divider, Card, CardContent, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http.js';
import UserContext from '../contexts/UserContext.js';

function SignIn() {
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
        },
        validationSchema: yup.object().shape({
            email: yup.string().trim().email('Email must be valid')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required'),
        }),
        onSubmit: (data) => {
            data.email = data.email.trim();
            data.password = data.password.trim();
            http.post('/User/login', data)
                .then((res) => {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    setUser(res.data.user);
                    if (res.data.user.role == "Admin") {
                        navigate("/admin/dashboard")
                    } else if (res.data.user.role == "Merchant") {
                        navigate("/merchant/viewevent")
                    } else {
                        navigate("/")
                    }
                }).catch((error) => {
                    if (error.response && error.response.status === 400) {
                        const errorMessage = error.response.data.message;
                        formik.setErrors({
                            ...formik.errors,
                            email: errorMessage,
                            password: errorMessage,
                        });
                    }
                })
        },
    });


    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <Paper elevation={3} sx={{ padding: '2rem', maxWidth: '400px', height: '354px', backgroundImage: 'url("../Images/background 2.png")', backgroundSize: 'cover' }}>
                    <Typography variant="h5" align="center" gutterBottom fontWeight={'bold'}>
                        New Here?
                    </Typography>
                    <Typography variant="body1" align="center" gutterBottom fontWeight={'bold'} >
                        Create an account to get started!
                    </Typography>
                    <Link to='/signup'>
                        <Button variant='contained' color='btn' style={btnstyle} fullWidth>
                            Sign Up
                        </Button>
                    </Link>
                </Paper>

                <Paper elevation={3} sx={{ padding: '2rem', maxWidth: '400px' }}>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Login
                        </Typography>
                        <Divider sx={{ margin: '1rem 0' }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name='email'
                                    label="Email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name='password'
                                    label="Password"
                                    type='password'
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" fullWidth style={loginbtnstyle}>
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                        <Typography marginTop={'15px'}>
                            Forgot password ?
                        </Typography>
                        <Divider sx={{ margin: '1rem 0' }} />
                        <Link to='/merchantlogin'>
                            <Button variant="contained" fullWidth style={loginbtnstyle}>
                                Merchant Login
                            </Button>
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}


export default SignIn