import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Typography, Grid, Container, TextField, Box, Button, Card, CardContent } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../../contexts/UserContext.js';
import http from '../../http.js';
import * as Yup from 'yup';
import { useFormik } from 'formik';

function UserEdit() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };

    const { id } = useParams();
    const [u, setU] = useState({
        fname: "",
        lname: "",  
        email: "",
        phone_number: "",
    });

    useEffect(() => {
        http.get(`https://v9c358horj.execute-api.us-east-1.amazonaws.com/dev/employees/${id}`).then((res) => {
            setU(res.data);
        });
    }, [id]);

    const navigate = useNavigate();

    const regEx = /^[89]{1}\d{7}$/;
    const formik = useFormik({
        initialValues: u,
        enableReinitialize: true,
        validationSchema: Yup.object({
            fname: Yup.string().trim().min(3, 'Minimum 3 characters').required('Required'),
            lname: Yup.string().trim().min(3, 'Minimum 3 characters').required('Required'),  // Added lname validation
            email: Yup.string().trim().email('Invalid email format').required('Required'),
            phone_number: Yup.string().trim().min(8).max(8).matches(regEx, "Phone is Invalid").required('Required'),
        }),
        onSubmit: (data) => {
            data.fname = data.fname.trim();
            data.lname = data.lname.trim();  // Trim the last name
            data.email = data.email.trim();
            data.phone_number = data.phone_number.trim();
            http.put(`https://v9c358horj.execute-api.us-east-1.amazonaws.com/dev/employees/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate(`/admin/viewusers`);
                }).catch((error) => {
                    console.log(error);
                    if (error.response && error.response.status === 400) {
                        const errorMessages = error.response.data.errors;
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
            <Typography variant='h6' color="black" marginBottom={2}>
                Edit User details
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="First Name"  // Updated label
                                    name="fname"
                                    value={formik.values.fname}
                                    onChange={formik.handleChange}
                                    error={formik.touched.fname && Boolean(formik.errors.fname)}
                                    helperText={formik.touched.fname && formik.errors.fname}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Last Name"  // New field for last name
                                    name="lname"
                                    value={formik.values.lname}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lname && Boolean(formik.errors.lname)}
                                    helperText={formik.touched.lname && formik.errors.lname}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Phone"
                                    name="phone_number"
                                    value={formik.values.phone_number}
                                    onChange={formik.handleChange}
                                    error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                                    helperText={formik.touched.phone_number && formik.errors.phone_number}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Button type="submit" variant='contained' style={btnstyle}>Save Details</Button>
            </Box>
        </Container>
    );
}

export default UserEdit