import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { motion, useInView } from "framer-motion";
import Footer from "../Components/Footer.jsx";
import Navbar from "../Components/Navbar.jsx";
import http from "../http";
import { fetchAuthSession } from "aws-amplify/auth";
import SponsorWrapper from "./Sponsor.jsx";

function OurSanctuary() {
  const contentRef = useRef(null);
  const contentInView = useInView(contentRef, {
    triggerOnce: true,
    margin: "-100px",
  });

  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSponsorModal, setOpenSponsorModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const checkAuthSession = async () => {
    try {
      const session = await fetchAuthSession();
      if (!session || !session.tokens) {
        console.log("No session found. Continuing without session.");
        return; // If there's no valid session, just continue
      }

      const { tokens } = session;
      const userEmail = tokens.idToken.payload["email"];
      setUserEmail(userEmail);
      console.log(userEmail);
      setIsLoggedIn(true);
    } catch (error) {
      if (error.name === "NotAuthorizedException") {
        console.log("User is unauthenticated. Continuing without session.");
      } else {
        console.error("Error fetching the session or user data", error);
      }
    }
  };

  // Check session on mount
  useEffect(() => {
    const getAuthSession = async () => {
      const isAuthenticated = await checkAuthSession();
      if (isAuthenticated) {
        setIsLoggedIn(true);
      }
      console.log(isLoggedIn);
    };

    getAuthSession();
  }, []);

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

  const handleOpenSponsorModal = (animal) => {
    setSelectedAnimal(animal);
    setOpenSponsorModal(true);
  };

  return (
    <Box sx={{ padding: "0" }}>
      <Navbar />
      <Container maxWidth="x2">
        {/* Hero Section */}
        <Box
          sx={{
            backgroundImage: "url('/bg2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: 500,
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
            position: "relative",
            width: "100%",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              color="white"
              sx={{ maxWidth: "80%" }}
            >
              Our Sanctuary
            </Typography>
          </motion.div>
        </Box>

        {/* Animals Section */}
        <Box sx={{ my: 6, textAlign: "center", color: "black" }}>
          <Typography variant="h4" fontWeight="bold" paddingTop={5}>
            Meet Our Residents
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 1 }}>
            {animalList.length > 0 ? (
              animalList.map((animal, index) => (
                <div ref={contentRef} key={index}>
                  <Box sx={{ mt: 14, px: { xs: 2, md: 6 } }}>
                    <Grid container spacing={10} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Box
                          component="img"
                          src={animal.profile_pic}
                          alt="White Wolf"
                          sx={{
                            width: "500px",
                            height: "320px",
                            maxHeight: 450,
                            borderRadius: 3,
                            objectFit: "cover",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: "left", maxWidth: 500 }}>
                          <Typography variant="h5" fontWeight="bold">
                            <span
                              style={{ color: "green", fontStyle: "italic" }}
                            >
                              Meet &nbsp;
                            </span>
                            <span style={{ color: "black" }}>
                              {animal.animal_name}
                            </span>
                          </Typography>
                          <Typography
                            variant="body1"
                            mt={2}
                            color="text.secondary"
                          >
                            <span>{animal.description}</span>
                          </Typography>
                          <Typography
                            variant="body1"
                            mt={2}
                            color="text.primary"
                            fontStyle={"italic"}
                          >
                            {isLoggedIn ? (
                              <span>
                                Would you like to{" "}
                                <span
                                  style={{
                                    textDecoration: "underline",
                                    color: "purple",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleOpenSponsorModal(animal)}
                                >
                                  sponsor {animal.animal_name}
                                </span>
                                ?
                              </span>
                            ) : (
                              <span>
                                <a href="/login">Login</a> to sponsor{" "}
                                {animal.animal_name}.
                              </span>
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              ))
            ) : (
              <Typography variant="body1">
                No animals available at the moment.
              </Typography>
            )}
          </Grid>
        </Box>

        <SponsorWrapper
          openModal={openSponsorModal}
          setOpenModal={setOpenSponsorModal}
          animal={selectedAnimal}
        />

        {/* Footer */}
        <Footer />
      </Container>
    </Box>
  );
}

export default OurSanctuary;
