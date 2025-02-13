import React from 'react';
import { Container, Box, Typography, Link, Grid, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material';

function Footer() {
    return (
        <Box sx={{ backgroundColor: '#1000', color: 'black', py: 4, mt: 5 }}>
            <Container>
                <Grid container spacing={4} justifyContent="space-between">
                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Quick Links</Typography>
                        <Box>
                            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}><Typography>Home</Typography></Link>
                            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}><Typography>How We Help</Typography></Link>
                            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}><Typography>Get Involved</Typography></Link>
                            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}><Typography>Contact</Typography></Link>
                        </Box>
                    </Grid>

                    {/* Social Media Icons */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Follow Us</Typography>
                        <Box>
                            <IconButton color="inherit" sx={{ mx: 1 }}>
                                <Facebook />
                            </IconButton>
                            <IconButton color="inherit" sx={{ mx: 1 }}>
                                <Instagram />
                            </IconButton>
                            <IconButton color="inherit" sx={{ mx: 1 }}>
                                <Twitter />
                            </IconButton>
                            <IconButton color="inherit" sx={{ mx: 1 }}>
                                <YouTube />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Contact</Typography>
                        <Typography variant="body2">Email: info@wildlife.org</Typography>
                        <Typography variant="body2">Phone: (123) 456-7890</Typography>
                    </Grid>
                </Grid>

                {/* Copyright */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">© 2025 Wildlife Rescue Organization. All Rights Reserved.</Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
