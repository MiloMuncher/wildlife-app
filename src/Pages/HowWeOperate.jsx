import React, { useRef } from 'react';
import { Container, Box, Typography, Grid, Button, Card, CardContent, Divider } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer.jsx';
import Navbar from '../Components/Navbar.jsx';
import Map from '../Components/Map.jsx';  // New Component for Interactive Map

function HowWeOperate() {
    const contentRef = useRef(null);
    const contentInView = useInView(contentRef, { triggerOnce: true, margin: "-100px" });

    return (
        <Box sx={{ padding: '0' }}>
            <Navbar />
            <Container maxWidth="x2">
                {/* Hero Section */}
                <Box sx={{
                    backgroundImage: "url('/bg2.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 500,
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                    position: 'relative',
                    width: '100%',
                }}>
                    <motion.div initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%",
                        }}>
                        <Typography variant="h3" fontWeight="bold" color="white" sx={{ maxWidth: "80%" }}>
                            How We Operate
                        </Typography>
                    </motion.div>
                </Box>

                {/* Our Team Section */}
                <Box sx={{ my: 6, textAlign: "center", color: "black" }}>
                    <Typography variant="h4" fontWeight="bold">Meet Our Team</Typography>
                    <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
                        {[{ name: "Maryam", role: "Founder", img: "team1.jpg" }, { name: "Chong Xie Hong", role: "Veterinarian", img: "team.png" }, { name: "Rhaylene", role: "Operations Manager", img: "team2.jpg" }].map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
                                    <img src={item.img} alt={item.name} style={{ width: "100%", maxHeight:'700px', objectFit: "cover" }} />
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <Typography variant="h5" fontWeight="bold">{item.name}</Typography>
                                        <Typography variant="body1" color="textSecondary">{item.role}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Partners and Sponsors */}
                <Box sx={{ my: 6, textAlign: "center", color: "black" }}>
                    <Typography variant="h4" fontWeight="bold">Our Partners and Sponsors</Typography>
                    <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
                        {[{ name: "Wildlife Org", img: "7794285-logo.jpg" }, { name: "Eco Foundation", img: "Picture1-1.png" }].map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <img src={item.img} alt={item.name} style={{ maxWidth: "150px", margin: "0 auto", display: "block" }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Our Process */}
                <Box sx={{ my: 6, textAlign: "center", color: "black" }}>
                    <Typography variant="h4" fontWeight="bold">Our Process</Typography>
                    <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
                        {[{ step: "Step 1: Rescue", description: "We provide emergency response." }, { step: "Step 2: Rehabilitate", description: "We offer medical care and recovery." }, { step: "Step 3: Release", description: "Animals are safely returned to their habitat." }].map((item, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <Card sx={{ boxShadow: 3, p: 3, textAlign: "center" }}>
                                    <Typography variant="h6" fontWeight="bold">{item.step}</Typography>
                                    <Typography variant="body2" sx={{ mt: 2 }}>{item.description}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Impact Stories */}
                <Box sx={{ my: 6, textAlign: "center", color: "black" }}>
                    <Typography variant="h4" fontWeight="bold">Impact Stories</Typography>
                    <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
                        {[{ title: "Rescue of a baby owl", story: "This is a success story of an owl saved from a storm." }, { title: "Rehabilitation of a tortoise", story: "A story of recovery after an injury." }].map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ boxShadow: 3, p: 3, textAlign: "center" }}>
                                    <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
                                    <Typography variant="body2" sx={{ mt: 2 }}>{item.story}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Sustainability & Ethical Practices */}
                <Box sx={{ my: 6, textAlign: "center", color: "black" }}>
                    <Typography variant="h4" fontWeight="bold">Sustainability & Ethical Practices</Typography>
                    <Typography variant="body1" paragraph>
                        We are committed to sustainability by using eco-friendly materials and practices in all of our operations.
                    </Typography>
                </Box>

                {/* FAQ Section */}
                <Box sx={{ my: 6, textAlign: "center", color: "black" }}>
                    <Typography variant="h4" fontWeight="bold">FAQs</Typography>
                    <Typography variant="body1" paragraph>
                        Have questions? We have answers to the most common queries about our operations.
                    </Typography>
                    <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
                        {[{ question: "How can I volunteer?", answer: "You can sign up through our website." }, { question: "How do I donate?", answer: "We accept donations online." }].map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ boxShadow: 3, p: 3, textAlign: "center" }}>
                                    <Typography variant="h6" fontWeight="bold">{item.question}</Typography>
                                    <Typography variant="body2" sx={{ mt: 2 }}>{item.answer}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Interactive Map */}
                <Box sx={{ my: 6 }}>
                    <Typography variant="h4" fontWeight="bold" textAlign="center">Where We Operate</Typography>
                    <Map /> {/* Add Map Component here */}
                </Box>

                {/* Educational Resources */}
                <Box sx={{ my: 6, textAlign: "center" }}>
                    <Typography variant="h4" fontWeight="bold">Educational Resources</Typography>
                    <Typography variant="body1" paragraph>
                        Explore resources about wildlife conservation and animal care.
                    </Typography>
                    <Button variant="contained" color="primary" component={Link} to="/resources">Explore Resources</Button>
                </Box>

                {/* Footer */}
                <Footer />
            </Container>
        </Box>
    );
}

export default HowWeOperate;
