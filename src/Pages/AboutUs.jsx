import React, { useRef } from 'react';
import { Container, Box, Grid, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { motion, useInView } from 'framer-motion';

function AboutUs() {
    // Create references for sections
    const infoRef = useRef(null);
    const contentRef = useRef(null);

    // Detect if sections are in view
    const infoInView = useInView(infoRef, { triggerOnce: true, margin: "-100px" });
    const contentInView = useInView(contentRef, { triggerOnce: true, margin: "-100px" });

    return (
        <Container maxWidth="x2">
            {/* Hero Section */}
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
            >
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%" }}
                >
                    <Typography variant="h2" fontWeight="bold" sx={{ textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>
                        About Us
                    </Typography>
                </motion.div>
            </Box>

            {/* Info Sections (Appear on Scroll) */}
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

            {/* About Section (Appears on Scroll) */}
            <div ref={contentRef}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                >
                    <Box sx={{ mt: 14, px: { xs: 2, md: 6 } }}>
                        <Grid container spacing={10} alignItems="center">
                            {/* Image Section */}
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

                            {/* Content Section */}
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

        </Container>
    );
}

export default AboutUs;
