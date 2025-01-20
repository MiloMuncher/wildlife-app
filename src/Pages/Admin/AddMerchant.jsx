import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Container, Box, Paper, Grid, Typography, Button, TextField, Card, CardContent } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import http from '../../http.js';
import * as Yup from 'yup';
import { useFormik } from 'formik';

function AddMerchant() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };
    
    const navigate = useNavigate()

    const regEx = /^[89]{1}\d{7}$/
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            contact: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().min(5, 'Minimum 5 characters').required('Required'),
            email: Yup.string().trim().email('Invalid email format').required('Required'),
            contact: Yup.string().trim().min(8).max(8).matches(regEx, "Phone is Invalid").required('Required'),
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.contact = data.contact.trim();
            http.post('/User/merchantregister', data)
                .then((res) => {
                    console.log(res.data)
                    navigate("/admin/viewmerchant")
                })
        },
    });

    return (
        <Container maxWidth="x1">
            <Typography variant="h6">
                Create Merchant
            </Typography>
            <Card>
                <CardContent>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4} >
                                <TextField
                                    label='Merchant Name'
                                    name='name'
                                    fullWidth
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} >
                                <TextField
                                    label='Enter Email'
                                    name='email'
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4} >
                                <TextField
                                    label='Enter Phone Number'
                                    name='contact'
                                    value={formik.values.contact}
                                    onChange={formik.handleChange}
                                    error={formik.touched.contact && Boolean(formik.errors.contact)}
                                    helperText={formik.touched.contact && formik.errors.contact}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Button type='submit' variant="contained" style={btnstyle}>
                            Create Merchant
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    )
}

export default AddMerchant