import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Container, Box, Paper, Grid, Typography, Button, Divider, Card, CardContent, TextField } from '@mui/material'
import * as yup from 'yup';
import { useFormik } from 'formik';
import http from '../http.js';
import { useNavigate, Link, useParams } from 'react-router-dom'


function EditPost() {
    const btnstyle = { fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' }
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        http.get(`/Post/${id}`).then((res) => {
            const initialValues = {
                title: res.data.title,
                description: res.data.description,
            };
            formik.setValues({ ...initialValues });
            console.log(res.data);
        });
    }, []);

    //validation schema
    const formik = useFormik({
        initialValues: {
            title: "",
            description: ""
        },
        validationSchema: yup.object({
            title: yup.string().trim().min(3).max(100).required(),
            description: yup.string().trim().min(3).max(500).required()
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.put(`/Post/${id}`, data)
                .then((res) => {
                    console.log(res.data)
                    navigate("/profile/posts")
                    formik.resetForm();
                })
        },
    });
    return (
        <Container maxWidth="x1">
            <Grid container justifyContent='center' spacing={3}>
                <Grid item md={6}>
                    <Typography variant="h4" style={{ textAlign: "left", fontWeight: "bold", paddingBottom: 50, fontSize: '50px' }}>
                        Edit Your Posts
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container justifyContent='center' spacing={2} direction="column">
                            <Grid item md={4} style={{ maxWidth: 596 }}>
                                <TextField
                                    fullWidth
                                    label="Enter Title"
                                    name='title'
                                    onChange={formik.handleChange}
                                    value={formik.values.title}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}

                                />
                            </Grid>
                            <Grid item md={7} style={{ maxWidth: 800 }}>
                                <TextField
                                    inputProps={{
                                        style: {
                                            height: "90px",
                                        },
                                    }}
                                    multiline
                                    fullWidth
                                    label="Enter Description"
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
                <Grid item md={4} marginLeft={10}>
                    <Paper elevation={5} square={false}>
                        <Typography variant="h6" style={{ textAlign: "left", fontWeight: "bold", fontSize: '25px', marginLeft: 20, paddingBottom: 10, paddingTop: 10 }}>
                            Rules On Posting:
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: "left", fontWeight: "bold", fontSize: '15px', marginLeft: 20, paddingBottom: 10 }}>
                            1. No vulgarity or  inappropriate words are to be used
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: "left", fontWeight: "bold", fontSize: '15px', marginLeft: 20, paddingBottom: 10 }}>
                            2. No policies prohibiting coordination of harm
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: "left", fontWeight: "bold", fontSize: '15px', marginLeft: 20, paddingBottom: 10 }}>
                            3. No hate speech, bullying harassment  misinformation
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: "left", fontWeight: "bold", fontSize: '15px', marginLeft: 20, paddingBottom: 15 }}>
                            4. No that contributes to the risk of imminent violence or physical harm.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container >
    )
}
export default EditPost