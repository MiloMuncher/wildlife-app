import React, { useRef } from 'react';
import { Container, Box, Typography, Grid, Button, Card, CardContent, Divider, collapseClasses } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Home() {
    // Testimonials Data
    const testimonials = [
        { name: "Sarah M.", text: "This organization changed my life! Seeing wildlife recover is truly rewarding." },
        { name: "John D.", text: "Amazing work! The team is passionate and committed to every rescue." },
        { name: "Emily R.", text: "Volunteering here was the best decision I ever made!" },
    ];

    // Create references for sections
    const contentRef = useRef(null);
    const contentInView = useInView(contentRef, { triggerOnce: true, margin: "-100px" });

    return (
        <Box sx={{ backgroundImage: "url('/Paw Print Background Pattern.jpg')" }}>
            <Container maxWidth="xl" >
                {/* Hero Section with Parallax Effect */}
                <Box sx={{
                    backgroundImage: "url('/background.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 500,
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                    position: 'relative',
                    width: '100%',
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%",
                        }}
                    >
                        <Typography variant="h3" fontWeight="bold" color="white" sx={{ maxWidth: "80%" }}>
                            Rescuing and rehabilitating wildlife for a better tomorrow.
                        </Typography>
                    </motion.div>

                    {/* Decorative Background Stripes */}
                    <Box />
                </Box>

                {/* Impact Numbers Section */}
                <Box sx={{ my: 6, textAlign: "center", py: 5, borderRadius: 5, backgroundColor: '#fff', boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                    <Typography variant="h4" fontWeight="bold">Our Impact</Typography>
                    <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
                        {[
                            { number: "1,500+", label: "Animals Rescued" },
                            { number: "800+", label: "Rehabilitated & Released" },
                            { number: "200+", label: "Volunteers Engaged" }
                        ].map((item, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Typography variant="h3" fontWeight="bold" color="primary">{item.number}</Typography>
                                    <Typography variant="body1">{item.label}</Typography>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Divider sx={{ my: 10 }} />

                {/* How We Help Section */}
                <Container sx={{ mt: 5, textAlign: "center" }} ref={contentRef}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            How We Help
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph mb={5}>
                            Our team is dedicated to rescuing, rehabilitating, and releasing wildlife back into their natural habitats.
                        </Typography>

                        {/* Grid for How We Help Cards */}
                        <Grid container spacing={4} justifyContent="center">
                            {[
                                { title: "Rescue", text: "Providing emergency response for injured and orphaned wildlife.", img: "rescue.jpg" },
                                { title: "Rehabilitate", text: "Caring for wildlife with expert medical attention and nurturing.", img: "rehabilitation.jpg" },
                                { title: "Release", text: "Returning animals to their natural environment safely.", img: "release.jpg" }
                            ].map((item, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Card sx={{ boxShadow: 5, borderRadius: 3, height: 320 }}>
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                style={{ width: "100%", height: "200px", objectFit: "cover", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
                                            />
                                            <CardContent sx={{ p: 3 }}>
                                                <Typography variant="h5" fontWeight="bold">{item.title}</Typography>
                                                <Typography variant="body1" color="textSecondary">{item.text}</Typography>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
                <Divider sx={{ my: 10 }} />

                {/* Testimonials Section */}
                <Box sx={{ my: 6, textAlign: "center", color: "black", py: 5, backgroundColor: "#fff", borderRadius:5 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>What People Say</Typography>
                    <Slider dots infinite autoplay speed={2000} slidesToShow={1} slidesToScroll={1}>
                        {testimonials.map((item, index) => (
                            <div key={index}>
                                <Typography variant="h6" sx={{ fontStyle: "italic", px: 3 }}>
                                    "{item.text}"
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>- {item.name}</Typography>
                            </div>
                        ))}
                    </Slider>
                </Box>
                <Divider sx={{ my: 10 }} />

                {/* Call to Action Section */}
                <Box sx={{ mt: 5, textAlign: "center", backgroundColor: "#f9f9f9", padding: "40px 0", borderRadius: '5' }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Get Involved
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Join us in making a difference. Whether you want to volunteer, donate, or spread awareness, your support matters!
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Button variant="outlined" color="secondary" size="large" sx={{ mx: 2 }} component={Link} to="/supportus">Donate</Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Home;
