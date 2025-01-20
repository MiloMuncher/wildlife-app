import React, { useEffect, useState } from 'react'
import { Container, Box, Paper, Grid, Typography, Button, TextField, Divider, Card, CardContent } from '@mui/material'
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton';
import { Menu } from '@mui/base/Menu';
import { MenuItem } from '@mui/base/MenuItem'
import { useNavigate, Link } from 'react-router-dom'
import * as yup from 'yup';
import { useFormik } from 'formik';
import http from '../http.js';
import Chatbot from './Chatbot.jsx';


function ContactUs() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };

    const [showChatbot, setShowChatbot] = useState(false);

    const toggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            title: '',
            description: '',
            category: 'Feedback',
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
            data.category = "Feedback"
            http.post('/Ticket', data)
                .then((res) => {
                    console.log(res.data)
                    formik.resetForm();
                })
        },
    });

    return (
        <Container maxWidth="xl" >
            <Box style={{ backgroundImage: 'url("../Images/contactusbgimage.png")', backgroundSize: 'cover', borderRadius: 15 }} display={'flex'} flexDirection={'column'}>
                <Typography variant="h4" style={{ textAlign: "left", fontWeight: "bold", paddingTop: 100, fontSize: '60px' }}>
                    Contact Us!
                </Typography>
                <Typography variant="h6" style={{ textAlign: "left", paddingTop: 20, }}>
                    Address:
                </Typography>
                <Typography variant="h6" style={{ textAlign: "left" }}>
                    NTUC Club -
                </Typography>
                <Typography variant="h6" style={{ textAlign: "left" }}>
                    UPlayMarket Square @ Downtown
                </Typography>
                <Typography variant="h6" style={{ textAlign: "left" }}>
                    EastE!Avenue,
                </Typography>
                <Typography variant="h6" style={{ textAlign: "left" }}>
                    Level 31 Pasir Ris Close
                </Typography>
                <Typography variant="h6" style={{ textAlign: "left" }}>
                    Singapore 519599
                </Typography>
                <Box display={'flex'} flexDirection={'column'}>
                    <Grid container spacing={15} marginTop={5} justifyContent="center">
                        <Grid item xs={12} md={4} >
                            <Box style={{ backgroundSize: 'cover', borderRadius: 15, backgroundColor: 'white' }} display={'flex'} flexDirection={'column'}>
                                <Box style={{ justifyContent: "center", paddingTop: 30 }} display={'flex'} >
                                    <img src="../images/ContactUsLogo1.png" style={{ width: '20%', borderRadius: '10px' }} />
                                </Box>
                                <Typography variant="h5" style={{ textAlign: "center", fontWeight: "bold", paddingTop: 60, color: "black", paddingLeft: 20, paddingRight: 20, }}>
                                    Talk to a member of our Sales team
                                </Typography>
                                <Typography variant="h7" style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, color: "black" }}>
                                    You can raise a request to our sales team about any enquires
                                    and we will get back to you as soon as possible
                                </Typography>
                                <Link to="/contactus/raisedrequest" style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" color="btn" style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', fontWeight: "bold", color: 'white', padding: 15, }}>
                                        Send an Enquiry
                                    </Button>
                                </Link>
                                <Typography variant="h6" style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, color: "black" }}>
                                </Typography> {/* paddingbottom for button (temporary) */}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4} >
                            <Box style={{ backgroundSize: 'cover', borderRadius: 15, backgroundColor: 'white' }} display={'flex'} flexDirection={'column'}>
                                <Box style={{ justifyContent: "center", paddingTop: 30 }} display={'flex'} >
                                    <img src="../images/ContactUsLogo2.png" style={{ width: '20%', borderRadius: '10px' }} />
                                </Box>
                                <Typography variant="h5" style={{ textAlign: "center", fontWeight: "bold", paddingTop: 60, color: "black", paddingLeft: 20, paddingRight: 20, }}>
                                    Chat with Annie
                                </Typography>
                                <Typography variant="h7" style={{ textAlign: "center", paddingTop: 20, paddingBottom: 73, paddingLeft: 20, paddingRight: 20, color: "black" }}>
                                    Chat with Annie to get answers for frequently asked questions
                                </Typography>
                                <Button variant="contained" color="btn" style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', fontWeight: "bold", color: 'white', padding: 15, }} onClick={() => setShowChatbot(!showChatbot)}>
                                    Chat with Annie
                                </Button>
                                <Typography variant="h6" style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, color: "black" }}>
                                </Typography> {/* paddingbottom for button (temporary) */}
                            </Box>
                        </Grid>
                    </Grid>
                    {showChatbot && <Chatbot setShowChatbot={setShowChatbot} />}
                </Box>
                <Box display={'flex'} flexDirection={'column'}>
                    <Grid container spacing={0} marginTop={5} justifyContent="center">
                        <Grid item xs={12} md={5} >
                            <Box style={{ backgroundSize: 'cover', borderRadius: 15, backgroundColor: 'white' }} display={'flex'} flexDirection={'column'}>
                                <Typography variant="h5" style={{ textAlign: "center", fontWeight: "bold", paddingTop: 60, color: "black", paddingLeft: 20, paddingRight: 20, }}>
                                    Leave us some Feedback!
                                </Typography>
                                <Box component="form" onSubmit={formik.handleSubmit} display={'flex'} flexDirection={'column'}>
                                    <Card>
                                        <CardContent>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        label="Name"
                                                        name='name'
                                                        fullWidth
                                                        onChange={formik.handleChange}
                                                        value={formik.values.name}
                                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                                        helperText={formik.touched.name && formik.errors.name}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        label="Email"
                                                        name='email'
                                                        fullWidth
                                                        onChange={formik.handleChange}
                                                        value={formik.values.email}
                                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                                        helperText={formik.touched.email && formik.errors.email}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={12}>
                                                    <TextField
                                                        label="Title"
                                                        name='title'
                                                        fullWidth
                                                        onChange={formik.handleChange}
                                                        value={formik.values.title}
                                                        error={formik.touched.title && Boolean(formik.errors.title)}
                                                        helperText={formik.touched.title && formik.errors.title}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={12}>
                                                    <TextField
                                                        label="Description"
                                                        name='description'
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        onChange={formik.handleChange}
                                                        value={formik.values.description}
                                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                                        helperText={formik.touched.description && formik.errors.description}
                                                    />
                                                </Grid>
                                            </Grid>


                                        </CardContent>
                                    </Card>
                                    <Button type='submit' color='btn' variant="contained" style={btnstyle} justifyContent="center">
                                        Send your feedback
                                    </Button>
                                </Box>
                                <Typography variant="h6" style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, color: "white" }}>
                                </Typography> {/* paddingbottom for button (temporary) */}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

            </Box>


        </Container>

    )
}
export default ContactUs