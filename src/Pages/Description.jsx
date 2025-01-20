import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Container, Box, Paper, Grid, Typography, Button, Divider, Card, CardContent, CardMedia, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useParams } from 'react-router-dom'
import http from '../http.js';
import * as yup from 'yup';
import { useFormik } from 'formik';
import dayjs from 'dayjs';

function Description() {
    const { id } = useParams();
    const [event, setEvent] = useState([]);
    useEffect(() => {
        http.get(`/Event/${id}`).then((res) => {
            setEvent(res.data);
            console.log(res.data)
        })
    }, [])
    const formik = useFormik({
        initialValues: {
            date: dayjs(),
            quantity: "",
        },
        validationSchema: yup.object({
            date: yup.date().required('Date is required'),
            quantity: yup.number().required('Quantity is required').positive('Quantity must be greater than 0'),
        }),
        onSubmit: (data) => {
            data.eventid = id
            http.post('/Cart', data)
                .then((res) => {
                    console.log(res.data)
                    formik.resetForm();
                }).catch((error) => {
                    if (error.response && error.response.status === 400) {
                        console.log(error.response.data.message2)
                        formik.setErrors({
                            ...formik.errors,
                            date: error.response.data.message2,
                            quantity: error.response.data.message1,
                        });
                    }
                })
        },
    });
    return (
        <Container maxWidth='xl'>
            <Card>
                <CardMedia
                    component="img"
                    height="500"
                    image={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                    alt="Product Image"
                />
            </Card>
            <Grid container spacing={1} marginTop={5}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3}>
                        <Typography variant="h4" style={{ fontWeight: "bold", paddingTop: 20 }}>
                            {event.title}
                        </Typography>
                        <Typography variant="h6" style={{ paddingTop: 20 }}>
                            Price: ${event.price}
                        </Typography>
                        <Typography variant="h6" style={{ paddingTop: 20 }}>
                            Date: {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="h6" style={{ paddingTop: 20 }}>
                            Location: {event.address}
                        </Typography>
                        <Typography variant="h6" style={{ paddingTop: 20 }}>
                            Capacity: {event.capacity}
                        </Typography>
                        <Typography variant="h5" style={{ paddingTop: 20, fontWeight: 'bold' }}>
                           Description
                        </Typography>
                        <Typography variant="h6" style={{ paddingTop: 20 }}>
                            {event.description}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box component="form" onSubmit={formik.handleSubmit} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                        <Paper elevation={3} sx={{ padding: '2rem', justifyContent: 'center' }}>
                            <Typography variant="h5" align="center" padding={5} fontWeight={'bold'}>
                                Book Now!
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            name='date'
                                            label="Pick your date"
                                            value={formik.values.date}
                                            onChange={(value) => formik.setFieldValue('date', value)}
                                            error={formik.touched.date && Boolean(formik.errors.date)}
                                        />
                                    </LocalizationProvider>
                                    {formik.touched.date && formik.errors.date && (
                                        <Typography variant="caption" color="error">
                                            <br />
                                            {formik.errors.date}
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    
                                    <TextField
                                        name='quantity'
                                        label="Quantity"
                                        fullWidth
                                        onChange={formik.handleChange}
                                        value={formik.values.quantity}
                                        error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                                        helperText={formik.touched.quantity && formik.errors.quantity}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type='submit' variant="contained" fullWidth style={{ backgroundColor: '#FF4E00', fontWeight: 'bold', color: 'white' }}>
                                        Book Now
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Description