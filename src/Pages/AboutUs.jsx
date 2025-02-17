import React, { useRef } from 'react';
import { Container, Box, Grid, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { motion, useInView, useScroll, useTransform  } from 'framer-motion';
import Footer  from '../Components/Footer.jsx';
import Navbar from '../Components/Navbar.jsx';

function AboutUs() {
    const infoRef = useRef(null);
    const contentRef = useRef(null);
    const valuesRef = useRef(null);
    const heroRef = useRef(null);

    const infoInView = useInView(infoRef, { triggerOnce: true, margin: "-100px" });
    const contentInView = useInView(contentRef, { triggerOnce: true, margin: "-100px" });
    const valuesInView = useInView(valuesRef, { triggerOnce: true, margin: "-100px" });
    const heroView = useInView(heroRef, { margin: "-50px 0px 0px 0px" }); // Detect when it's in view


    return (
        <Container maxWidth="x2">
            <Navbar />
            <Box
                sx={{
                    backgroundImage: "url('/wallpaperflare.com_wallpaper.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 500,
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                }}
                ref={heroRef}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={heroView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        width: "100%",
                    }}
                >
                    <Typography variant="h2" fontWeight="bold" sx={{ textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>
                        About Us
                    </Typography>
                </motion.div>
            </Box>

            <div ref={infoRef}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={infoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                >
                    <Grid container spacing={4} justifyContent="center" mt={14}>
                        {[
                            { icon: <LocationOnIcon fontSize="large" color="primary" />, title: "Where We Are Located", text: "573 Community Street, Isiolo, Kenya" },
                            { icon: <AccessTimeIcon fontSize="large" color="primary" />, title: "Operation Hours", text: "Open 24/7 for animal queries" },
                            { icon: <HelpOutlineIcon fontSize="large" color="primary" />, title: "FAQs", text: "Have questions? We have answers!" }
                        ].map((item, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {item.icon}
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">{item.title}</Typography>
                                        <Typography variant="h6">{item.text}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </div>

            <div ref={contentRef}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                >
                    <Box sx={{ mt: 14, px: { xs: 2, md: 6 } }}>
                        <Grid container spacing={10} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Box
                                    component="img"
                                    src="/autumn-wolf-7680x4320.jpg"
                                    alt="White Wolf"
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: 450,
                                        borderRadius: 3,
                                        objectFit: 'cover',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ textAlign: 'left', maxWidth: 500 }}>
                                    <Typography variant="h5" fontWeight="bold">
                                        <span style={{ color: 'green', fontStyle: 'italic' }}>About</span>{' '}
                                        <span style={{ color: 'black' }}>Isiolo Wildlife Rehab Centre</span>
                                    </Typography>
                                    <Typography variant="body1" mt={2} color="text.secondary">
                                        Our core mission here at Isiolo Wildlife Rehab Centre is
                                        to provide compassionate care and rehabilitation for injured,
                                        sick, and orphaned wildlife, ensuring their safe return to their
                                        natural habitats while promoting conservation and environmental education.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </motion.div>
            </div>

            <div ref={valuesRef}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                >
                    <Box sx={{ mt: 14, px: { xs: 2, md: 6 } }}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Box sx={{ textAlign: { xs: 'center', md: 'right' }, maxWidth: 800 }}>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        <span style={{ color: 'black' }}>Our</span>{' '}
                                        <span style={{ color: 'green', fontStyle: 'italic' }}>Values</span>
                                        
                                    </Typography>
                                    <Typography variant="body1" mt={2} color="text.secondary">
                                        We believe in the ethical treatment of animals, promoting environmental stewardship, and
                                        fostering a community of care and respect for all living beings. Our center thrives on
                                        compassion, dedication, and the shared goal of protecting wildlife and their habitats.
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box
                                    component="img"
                                    src="/values.jpg"
                                    alt="White Wolf"
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: 450,
                                        borderRadius: 3,
                                        objectFit: 'cover',
                                    }}
                                />
                            </Grid>

                        </Grid>
                    </Box>
                </motion.div>
            </div>
            <Footer />
        </Container>
    );
}

export default AboutUs;
