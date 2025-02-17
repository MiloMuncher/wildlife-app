import React from 'react';
import { Container, Box, Grid, Typography, Button, TextField, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import http from '../../http.js';

function AddMedication() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };

    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            dosage: '',
            expiration_date: '',
            available_quantity: '',
            batch_number: '',
            price: '',
        },
        validationSchema: yup.object({
            name: yup.string().trim().min(2).max(50).required('Medication name is required'),
            description: yup.string().trim().min(2).max(500).required('Description is required'),
            dosage: yup.string().trim().min(1).max(50).required('Dosage is required'),
            expiration_date: yup.string().required('Expiration date is required'),
            available_quantity: yup.number().positive('Available quantity must be greater than 0').required('Available quantity is required'),
            batch_number: yup.string().trim().min(1).max(50).required('Batch number is required'),
            price: yup.number().positive('Price must be a positive number').required('Price is required'),
        }),
        onSubmit: (data) => {
            http.post('https://kvhdoqjcua.execute-api.us-east-1.amazonaws.com/dev/medication', data) // Corrected endpoint for Medication
                .then((res) => {
                    console.log(res.data);
                    navigate("/admin/viewmedications"); // Assuming the view page is for medications
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    });

    return (
        <Container maxWidth="xl">
            <Typography variant="h6">New Medication</Typography>
            <Card>
                <CardContent>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} direction="column">
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Medication Name"
                                    name="name"
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Dosage"
                                    name="dosage"
                                    onChange={formik.handleChange}
                                    value={formik.values.dosage}
                                    error={formik.touched.dosage && Boolean(formik.errors.dosage)}
                                    helperText={formik.touched.dosage && formik.errors.dosage}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Expiration Date"
                                    name="expiration_date"
                                    type="date"
                                    onChange={formik.handleChange}
                                    value={formik.values.expiration_date}
                                    error={formik.touched.expiration_date && Boolean(formik.errors.expiration_date)}
                                    helperText={formik.touched.expiration_date && formik.errors.expiration_date}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Available Quantity"
                                    name="available_quantity"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.available_quantity}
                                    error={formik.touched.available_quantity && Boolean(formik.errors.available_quantity)}
                                    helperText={formik.touched.available_quantity && formik.errors.available_quantity}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Batch Number"
                                    name="batch_number"
                                    onChange={formik.handleChange}
                                    value={formik.values.batch_number}
                                    error={formik.touched.batch_number && Boolean(formik.errors.batch_number)}
                                    helperText={formik.touched.batch_number && formik.errors.batch_number}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    name="price"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.price}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" style={btnstyle}>
                            Add Medication
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

export default AddMedication;
