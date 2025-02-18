import React from 'react';
import { Container, Box, Paper, Grid, Typography, Button, TextField, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import http from '../../http.js';

function AddFood() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };

    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            expiration_date: ' ',
            available_quantity: '',
            weight_per_quantity: '',
            price: '', // New field for price
        },
        validationSchema: yup.object({
            name: yup.string().trim().min(2).max(50).required('Food name is required'),
            description: yup.string().trim().min(2).max(150).required('Description is required'),
            expiration_date: yup
                .string()
                .required('Expiration date is required'),
            available_quantity: yup
                .number()
                .positive('Available quantity must be a number greater than 0')
                .required('Available quantity is required'),
            weight_per_quantity: yup
            .number()
            .positive('Weight per quantity must be a number greater than 0')
            .required('Weight per quantity is required'),
            price: yup
                .number()
                .positive('Price must be a positive number')
                .required('Price is required'), // Validation for price
        }),
        onSubmit: (data) => {
            http.post('https://kvhdoqjcua.execute-api.us-east-1.amazonaws.com/dev/food', data) // Corrected endpoint for Food
                .then((res) => {
                    console.log(res.data);
                    navigate("/admin/viewfood"); // Assuming the view page is for foods
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    });

    return (
        <Container maxWidth="xl">
            <Typography variant="h6">New Food Variety</Typography>
            <Card>
                <CardContent>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} direction="column">
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Food Name"
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
                                    label="Expiration Date"
                                    name="expiration_date"
                                    type="date" // Assuming the expiration_date is a date field
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
                                    label="Weight Per Quantity (grams)"
                                    name="weight_per_quantity"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.weight_per_quantity}
                                    error={formik.touched.weight_per_quantity && Boolean(formik.errors.weight_per_quantity)}
                                    helperText={formik.touched.weight_per_quantity && formik.errors.weight_per_quantity}
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
                            Add Food
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

export default AddFood;
