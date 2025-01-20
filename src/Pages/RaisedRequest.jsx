import React from 'react'
import { Container, Box, Paper, Grid, Typography, Button, Divider, Card, CardContent, TextField } from '@mui/material'
import { MarginTwoTone } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup';
import { useFormik } from 'formik';
import http from '../http.js';

function RaisedRequest() {
    const btnstyle = { fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' }
    const navigate = useNavigate();

    //validation schema
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            title: '',
            description: '',
            category: 'Enquiry',
        },
        validationSchema: yup.object({
            name: yup.string().trim().min(3).max(100).required(),
            email: yup.string().trim().email('Email must be valid')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            title: yup.string().trim().min(3).max(100).required(),
            description: yup.string().trim().min(3).max(500).required()
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.title = data.title.trim();
            data.description = data.description.trim();
            data.category = "Enquiry"
            http.post('/Ticket', data)
                .then((res) => {
                    console.log(res.data)
                    navigate("/")
                })
        },
    });
    return (
        <Container maxWidth="x1">

            <Box sx={{ flexGrow: 1 }} display={'flex'} justifyContent='left' marginTop={10}>
                <Link to="/contactus" style={{ textDecoration: 'none' }}>
                    <Button variant='contained' color='btn' style={btnstyle}>
                        Go Back
                    </Button>
                </Link>
            </Box>
            <Grid container spacing={5} marginTop={5} justifyContent={"center"}>
                <Grid item xs={12} md={5} justifyContent={'center'}>
                    <img src="../images/raisedrequest.png" style={{ width: '100%', borderRadius: '10px' }} />

                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h4" style={{ textAlign: "left", fontWeight: "bold", paddingTop: 50, paddingBottom: 20, fontSize: '30px' }}>
                        Submit Your Enquiry
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container justifyContent='center' spacing={2} direction="column">
                            <Grid item xs={2} style={{ maxWidth: 596 }}>
                                <TextField
                                    paddingBottom='10'
                                    fullWidth
                                    label='Name'
                                    name='name'
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}

                                />
                            </Grid>
                            <Grid item xs={4} style={{ maxWidth: 596 }}>
                                <TextField
                                    fullWidth
                                    label='Email'
                                    name='email'
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}

                                />
                            </Grid>    
                            <Grid item xs={4} style={{ maxWidth: 596 }}>
                                <TextField
                                    fullWidth
                                    label='Title'
                                    name='title'
                                    onChange={formik.handleChange}
                                    value={formik.values.title}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}

                                />
                            </Grid>    
                            <Grid item xs={4} style={{ maxWidth: 596 }}>
                                <TextField
                                    inputProps={{
                                        style: {
                                            height: "90px",
                                        },
                                    }}
                                    multiline
                                    fullWidth
                                    label='Enter Description'
                                    name='description'
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <Button type='submit' color='btnYellow' variant="contained" style={btnstyle} fullWidth sx={{ height: '50px', width: '200px', borderRadius: 15 }}>
                                    Post
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}
export default RaisedRequest