import React, { useState, useEffect } from 'react';
import { Typography, Grid, Container, TextField, Box, Button, Card, CardContent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../http.js';
import * as Yup from 'yup';
import { useFormik } from 'formik';

function MedicationEdit() {
    const btnStyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };
    const { id } = useParams();
    const navigate = useNavigate();

    const [medication, setMedication] = useState({
        name: "",
        description: "",
        dosage: "",
        expiration_date: "",
        available_quantity: "",
        batch_number: "",
        price: ""
    });

    useEffect(() => {
        http.get(`https://z40lajab6h.execute-api.us-east-1.amazonaws.com/dev/medications/${id}`)
            .then((res) => {
                setMedication(res.data);
            })
            .catch((error) => console.error("Error fetching medication data:", error));
    }, [id]);

    const formik = useFormik({
        initialValues: medication,
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().trim().min(3, 'Minimum 3 characters').required('Required'),
            description: Yup.string().trim().min(10, 'Minimum 10 characters').required('Required'),
            dosage: Yup.string().trim().min(1, 'Required').required('Required'),
            expiration_date: Yup.date().required('Required'),
            available_quantity: Yup.number().min(1, 'Must be at least 1').required('Required'),
            batch_number: Yup.string().trim().min(3, 'Minimum 3 characters').required('Required'),
            price: Yup.number().min(0, 'Must be 0 or greater').required('Required'),
        }),
        onSubmit: (data) => {
            console.log(data);
            http.put(`https://z40lajab6h.execute-api.us-east-1.amazonaws.com/dev/medications/${id}`, data)
                .then(() => {
                    navigate(`/admin/viewmedications`);
                })
                .catch((error) => {
                    console.error("Error updating medication:", error);
                });
        },
    });

    return (
        <Container maxWidth='xl'>
            <Typography variant='h6' color="black" marginBottom={2}>
                Edit Medication Details
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Batch Number"
                                    name="batch_number"
                                    value={formik.values.batch_number}
                                    onChange={formik.handleChange}
                                    error={formik.touched.batch_number && Boolean(formik.errors.batch_number)}
                                    helperText={formik.touched.batch_number && formik.errors.batch_number}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Dosage"
                                    name="dosage"
                                    value={formik.values.dosage}
                                    onChange={formik.handleChange}
                                    error={formik.touched.dosage && Boolean(formik.errors.dosage)}
                                    helperText={formik.touched.dosage && formik.errors.dosage}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Expiration Date"
                                    name="expiration_date"
                                    type="date"
                                    value={formik.values.expiration_date}
                                    onChange={formik.handleChange}
                                    error={formik.touched.expiration_date && Boolean(formik.errors.expiration_date)}
                                    helperText={formik.touched.expiration_date && formik.errors.expiration_date}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Available Quantity"
                                    name="available_quantity"
                                    type="number"
                                    value={formik.values.available_quantity}
                                    onChange={formik.handleChange}
                                    error={formik.touched.available_quantity && Boolean(formik.errors.available_quantity)}
                                    helperText={formik.touched.available_quantity && formik.errors.available_quantity}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Price (SGD)"
                                    name="price"
                                    type="number"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Button type="submit" variant='contained' style={btnStyle}>Save Details</Button>
            </Box>
        </Container>
    );
}

export default MedicationEdit;
