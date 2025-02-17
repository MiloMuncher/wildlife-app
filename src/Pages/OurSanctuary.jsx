import React, { useRef, useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Button, Card, CardContent, Divider } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer.jsx';
import Navbar from '../Components/Navbar.jsx';
import Map from '../Components/Map.jsx';  // New Component for Interactive Map
import http from "../http";

function OurSanctuary() {
    const contentRef = useRef(null);
    const contentInView = useInView(contentRef, { triggerOnce: true, margin: "-100px" });

    const [animalList, setAnimalList] = useState([]);
    const getAnimals = () => {
        http
          .get(
            `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/sanctuary`
          )
          .then((res) => {
            console.log("Data: ", res.data);
            setAnimalList(res.data);
          });
      };
    
      useEffect(() => {
        getAnimals();
      }, []);

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
                            Our Sanctuary
                        </Typography>
                    </motion.div>
                </Box>

                {/* Our Team Section */}
                <Box sx={{ my: 6, textAlign: "center", color: "black" }}>
                    <Typography variant="h4" fontWeight="bold">Meet Our Residents</Typography>
                    <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
                        {[{ name: "Maryam", role: "Founder", img: "team1.jpg" }, { name: "Chong Xie Hong", role: "Veterinarian", img: "team2.jpg" }, { name: "Rhaylene", role: "Operations Manager", img: "team2.jpg" }].map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
                                    <img src={item.img} alt={item.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <Typography variant="h5" fontWeight="bold">{item.name}</Typography>
                                        <Typography variant="body1" color="textSecondary">{item.role}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                
                {/* Footer */}
                <Footer />
            </Container>
        </Box>
    );
}

export default OurSanctuary;
