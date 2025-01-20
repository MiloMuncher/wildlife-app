import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Container, Box, Paper, Grid, Typography, Button, Divider, Card, CardContent, TextField } from '@mui/material'
import * as yup from 'yup';
import { useFormik } from 'formik';
import http from '../http.js';
import { useNavigate, Link, useParams } from 'react-router-dom'


function ViewPost() {
    const btnstyle = { fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' }
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [post, setPost] = useState([]);
    useEffect(() => {
        http.get(`/Post/${id}`).then((res) => {
            setPost(res.data);
            console.log(res.data)
        })
    }, [])

    //validation schema
    const formik = useFormik({
        initialValues: {
            comment: '',
        },
        validationSchema: yup.object({
            comment: yup.string().trim().min(3).max(500).required()
        }),
        onSubmit: (data) => {
            data.comment = data.comment.trim();
            http.post('/forum', data)
                .then((res) => {
                    console.log(res.data)
                    navigate("/forum")
                    formik.resetForm();
                })
        },
    });
    return (
        <Container maxWidth="x1">
            <Grid container justifyContent='center' spacing={4}>
                <Grid item xs={6}>
                    <Typography variant="h4" style={{ textAlign: "left", fontWeight: "bold", paddingTop: 100,fontSize: '50px' }}>
                        {post.title}
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: "left",paddingBottom: 50, paddingTop: 25, fontSize: '18px' }}>
                        {post.description}
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container justifyContent='center' spacing={2} direction="column">
                            <Grid item xs={7} style={{ maxWidth: 800 }}>
                                <TextField
                                    inputProps={{
                                        style: {
                                            height: "90px",
                                        },
                                    }}
                                    multiline
                                    fullWidth
                                    label='Comment'
                                    name='comment'
                                    onChange={formik.handleChange}
                                    value={formik.values.comment}
                                    error={formik.touched.comment && Boolean(formik.errors.comment)}
                                    helperText={formik.touched.comment && formik.errors.comment}
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
                <Grid item xs={4} marginTop={20}>
                    <Paper elevation={5} square={false}>
                        <Typography variant="h6" style={{ textAlign: "left", fontWeight: "bold",fontSize: '25px', marginLeft:20, paddingBottom: 10, paddingTop: 10 }}>
                            Rules On Posting:
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: "left", fontWeight: "bold",fontSize: '15px', marginLeft:20, paddingBottom: 10  }}>
                            1. No vulgarity or  inappropriate words are to be used 
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: "left", fontWeight: "bold",fontSize: '15px', marginLeft:20, paddingBottom: 10  }}>
                            2. No policies prohibiting coordination of harm 
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: "left", fontWeight: "bold",fontSize: '15px', marginLeft:20, paddingBottom: 10  }}>
                            3. No hate speech, bullying harassment  misinformation 
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: "left", fontWeight: "bold",fontSize: '15px', marginLeft:20, paddingBottom: 15 }}>
                            4. No that contributes to the risk of imminent violence or physical harm.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container >
    )
}
export default ViewPost