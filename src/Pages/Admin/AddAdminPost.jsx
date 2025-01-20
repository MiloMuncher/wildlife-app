import React from 'react'
import { Container, Box, Paper, Grid, Typography, Button, TextField, Card, CardContent } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import * as yup from 'yup';
import { useFormik } from 'formik';
import http from '../../http.js';

function AddAdminPost() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };

    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
        },
        validationSchema: yup.object({
            title: yup.string().trim().min(3).max(100).required(),
            description: yup.string().trim().min(3).max(500).required()
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.post('/Post', data)
                .then((res) => {
                    console.log(res.data)
                    navigate("/admin/viewposts")
                })
        },
    });

    return (
        <Container maxWidth="x1">
            <Typography variant="h6">
                Create Admin Post
            </Typography>
            <Card>
                <CardContent>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} direction="column">
                            <Grid item xs={12} md={6} >
                                <TextField
                                    fullWidth
                                    label='Enter Title'
                                    name='title'
                                    onChange={formik.handleChange}
                                    value={formik.values.title}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
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
                        </Grid>
                        <Button type='submit' variant="contained" style={btnstyle}>
                            Post
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    )
}

export default AddAdminPost