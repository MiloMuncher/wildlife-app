import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Typography, Grid, Container, TextField, Box, Button, Card, CardContent, Avatar } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import UserContext from '../../contexts/UserContext.js';
import http from '../../http.js';
import * as Yup from 'yup';
import { useFormik } from 'formik';

function ProfileEdit() {
    const btnstyle = { margin: '20px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' }
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate();

    const [u, setU] = useState({
        name: "",
        email: "",
        contact: "",
    });

    useEffect(() => {
        http.get(`/user/${user.id}`).then((res) => {
            setU(res.data);
        });
    }, []);

    const regEx = /^[89]{1}\d{7}$/
    const formik = useFormik({
        initialValues: u,
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().trim().min(5, 'Minimum 5 characters').required('Required'),
            email: Yup.string().trim().email('Invalid email format').required('Required'),
            contact: Yup.string().trim().min(8).max(8).matches(regEx, "Phone is Invalid").required('Required'),
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.contact = data.contact.trim();
            http.put(`/User/${user.id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate(`/profile/profile`);
                }).catch((error) => {
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
            <Typography variant='h4' color="#000000" marginBottom={2}>
                Edit your details
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
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
                                    name="contact"
                                    value={formik.values.contact}
                                    onChange={formik.handleChange}
                                    error={formik.touched.contact && Boolean(formik.errors.contact)}
                                    helperText={formik.touched.contact && formik.errors.contact}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Button type="submit" variant='contained' style={btnstyle}>Save Details</Button>
            </Box>
        </Container>
    )
}

export default ProfileEdit