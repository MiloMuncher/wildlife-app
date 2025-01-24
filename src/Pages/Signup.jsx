import React from 'react'
import { Container, Box, Paper, Grid, Typography, Button, Divider, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signUp } from 'aws-amplify/auth';

function Signup() {

    const btnstyle = { backgroundColor: 'black', fontWeight: 'bold', color: 'white', marginTop: '50px' }
    const loginbtnstyle = { backgroundColor: '#FF4E00', fontWeight: 'bold', color: 'white' }

    const navigate = useNavigate();
    const regEx = /^[89]{1}\d{7}$/;
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            contact: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().min(5, 'Minimum 5 characters').required('Required'),
            email: Yup.string().trim().email('Invalid email format').required('Required'),
            password: Yup.string().trim().min(8, 'Minimum 8 characters').required('Required'),
            contact: Yup.string().trim().min(8).max(8).matches(regEx, "Contact is Invalid").required('Required'),
        }),
        onSubmit: async (data) => {
            // Clean up the input data
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.password = data.password.trim();
            data.contact = data.contact.trim();

            try {
                // Call AWS Amplify signUp API
                await signUp({
                    username: data.email,
                    password: data.password,
                    attributes: {
                        email: data.email,
                        phone_number: data.contact,
                    }
                });
                
                navigate("/login");
            } catch (error) {
                console.error('Error signing up:', error);
                if (error.code === 'UsernameExistsException') {
                    // Handle username already exists error
                    formik.setFieldError('email', 'Email is already in use');
                } else {
                    // Handle other errors
                    formik.setFieldError('email', 'An error occurred, please try again later');
                }
            }
        },
    })

    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <Paper elevation={3} sx={{ padding: '2rem', maxWidth: '400px', height: '389px', backgroundImage: 'url("../Images/background 2.png")', backgroundSize: 'cover' }}>
                    <Typography variant="h5" align="center" gutterBottom fontWeight={'bold'}>
                        Already a Member?
                    </Typography>
                    <Typography variant="body1" align="center" gutterBottom fontWeight={'bold'} >
                        Head over to the login page to sign in!
                    </Typography>

                    <Link to='/login'>
                        <Button variant='contained' color='btn' style={btnstyle} fullWidth>
                            Login
                        </Button>
                    </Link>
                </Paper>

                <Paper elevation={3} sx={{ padding: '2rem', maxWidth: '400px' }}>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Sign Up
                        </Typography>
                        <Divider sx={{ margin: '1rem 0' }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name='name'
                                    label="Name"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name='email'
                                    label="Email"
                                    fullWidth
                                    type='email'
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
                                    fullWidth
                                    type='password'
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name='contact'
                                    label="Contact Number"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    value={formik.values.contact}
                                    error={formik.touched.contact && Boolean(formik.errors.contact)}
                                    helperText={formik.touched.contact && formik.errors.contact}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" fullWidth style={loginbtnstyle}>
                                    Sign Up
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default Signup;
