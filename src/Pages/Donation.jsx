import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Components/Footer.jsx";
import Navbar from "../Components/Navbar.jsx";
import { fetchAuthSession } from "aws-amplify/auth";

const stripePromise = loadStripe(
  "pk_test_51Qrdhu2N2ApkaYzFWgke5qVVDsFaUkSywPRo1pdV8dcgbQ94HzPmVz9JjWMSzcANlTPVWqZwknTSI67RFi43pXK700EkYL6JuM"
);

const CheckoutForm = () => {
  const btnstyle = {
    margin: "30px 0",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#FF4E00",
  };

  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in

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

  const stripe = useStripe();
  const elements = useElements();

  const [customAmount, setCustomAmount] = useState("");
  const [openModal, setOpenModal] = useState(false); // State for controlling modal visibility
  const [loadingMessage, setLoadingMessage] = useState(
    "Processing your donation..."
  );
  const [donationStatus, setDonationStatus] = useState(null); // Track donation status
  const navigate = useNavigate(); // Initialize useNavigate

  const formik = useFormik({
    initialValues: {
      email: userEmail || "",
      donationAmount: "",
      auth: "",
    },
    validationSchema: yup.object({
      email: isLoggedIn
        ? yup
            .string()
            .email("Email must be valid")
            .max(50, "Email must be at most 50 characters")
        : yup
            .string()
            .trim()
            .required("Email is required")
            .email("Email must be valid")
            .max(50, "Email must be at most 50 characters"),
      donationAmount: yup.string().required("Please select a donation amount"),
    }),

    onSubmit: async (values) => {
      console.log("log", isLoggedIn);
      values.email = isLoggedIn ? userEmail : values.email.trim();
      values.donationAmount = values.donationAmount.trim();
      values.auth = isLoggedIn;
      // Handle custom amount
      if (values.donationAmount === "custom") {
        values.donationAmount = customAmount.trim();
        values.donationAmount = parseInt(values.donationAmount) * 100;
      } else {
        values.donationAmount =
          parseInt(values.donationAmount.replace("$", ""), 10) * 100;
      }

      if (!stripe || !elements) {
        return; // Make sure Stripe and Elements are loaded
      }

      const cardElement = elements.getElement(CardElement);
      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        console.log(error.message);
        return;
      }

      setOpenModal(true);
      setLoadingMessage("Processing your donation...");

      // Send payment method and donation info to the backend (API Gateway URL)
      const paymentData = {
        payment_method_data: {
          type: "card",
          card: {
            token: token.id,
          },
        }, // Get payment method from token
        email: values.email,
        amount: values.donationAmount, // Stripe requires amount in cents
        auth: values.auth,
      };

      console.log("Payment data:", paymentData);

      setTimeout(async () => {
        const response = await fetch(
          "https://pn0ridlp81.execute-api.us-east-1.amazonaws.com/dev/stripe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
          }
        );

        if (response.ok) {
          setLoadingMessage("Donation successful!");
          setDonationStatus("success");
        } else {
          setLoadingMessage("Donation failed. Please try again later.");
          setDonationStatus("failure");
        }
      }, 2000); // Simulating delay for loading
    },
  });

  const donationAmounts = ["$10", "$25", "$50", "$100", "$250", "$500"];

  const handleCloseModal = () => {
    setOpenModal(false);
    formik.resetForm();
    if (donationStatus === "success") {
      toast.success("Thank you for your donation! 🎉", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      navigate("/");
    } else if (donationStatus === "failure") {
      // Optional: Redirect after failure
      window.location.reload();
    }
  };

  return (
    <Container maxWidth="x2">
      <Navbar />
      <ToastContainer /> {/* Add this line to render toast notifications */}
      <Box
        style={{ backgroundSize: "cover", borderRadius: 15 }}
        display={"flex"}
        flexDirection={"column"}
      >
        <Typography
          variant="h4"
          style={{
            textAlign: "left",
            fontWeight: "bold",
            paddingTop: 100,
            fontSize: "60px",
            marginLeft: "100px",
          }}
        >
          Donate To Wildlife Rehab
        </Typography>
        <Typography
          variant="h6"
          style={{ textAlign: "left", paddingTop: 20, marginLeft: "100px" }}
        >
          Together, we can protect vulnerable wildlife,
        </Typography>
        <Typography
          variant="h6"
          style={{ textAlign: "left", marginLeft: "100px" }}
        >
          conserve vital habitats, and build a future where
        </Typography>
        <Typography
          variant="h6"
          style={{ textAlign: "left", marginLeft: "100px" }}
        >
          people live in harmony with nature.
        </Typography>

        <Box display={"flex"} flexDirection={"column"}>
          <Grid container spacing={0} marginTop={5} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Box
                style={{
                  backgroundSize: "cover",
                  borderRadius: 15,
                  backgroundColor: "white",
                }}
                display={"flex"}
                flexDirection={"column"}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  flexWrap="wrap"
                  gap={2}
                  paddingTop={2}
                >
                  {donationAmounts.map((amount, index) => (
                    <Button
                      key={index}
                      variant={
                        formik.values.donationAmount === amount
                          ? "contained"
                          : "outlined"
                      }
                      style={{
                        fontWeight: "bold",
                        borderColor: "#FF4E00",
                        color:
                          formik.values.donationAmount === amount
                            ? "white"
                            : "#FF4E00",
                        backgroundColor:
                          formik.values.donationAmount === amount
                            ? "#FF4E00"
                            : "transparent",
                      }}
                      onClick={() =>
                        formik.setFieldValue("donationAmount", amount)
                      }
                    >
                      {amount}
                    </Button>
                  ))}
                  <Button
                    variant={
                      formik.values.donationAmount === "custom"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      formik.setFieldValue("donationAmount", "custom")
                    }
                    style={{
                      fontWeight: "bold",
                      borderColor: "#FF4E00",
                      color:
                        formik.values.donationAmount === "custom"
                          ? "white"
                          : "#FF4E00",
                      backgroundColor:
                        formik.values.donationAmount === "custom"
                          ? "#FF4E00"
                          : "transparent",
                    }}
                  >
                    Custom Amount
                  </Button>
                </Box>
                {formik.values.donationAmount === "custom" && (
                  <div
                    style={{
                      paddingTop: 30,
                      width: "50%",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      margin: "auto",
                      flexDirection: "column",
                    }}
                  >
                    <TextField
                      label="Custom Donation Amount"
                      name="customAmount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      error={
                        formik.touched.donationAmount &&
                        Boolean(formik.errors.donationAmount)
                      }
                      helperText={
                        formik.touched.donationAmount &&
                        formik.errors.donationAmount
                      }
                      type="number"
                      InputProps={{
                        startAdornment: <span>$&nbsp;</span>,
                      }}
                    />
                    <div>
                      {customAmount && customAmount < 1 && (
                        <Typography
                          color="error"
                          variant="body2"
                          align="center"
                          paddingTop={1}
                          fontWeight={600}
                        >
                          Min. donation amount is $1
                        </Typography>
                      )}
                    </div>
                  </div>
                )}

                {formik.touched.donationAmount &&
                  formik.errors.donationAmount && (
                    <Typography
                      color="error"
                      variant="body2"
                      align="center"
                      paddingTop={1}
                    >
                      {formik.errors.donationAmount}
                    </Typography>
                  )}
                <Typography
                  variant="h5"
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    paddingTop: 30,
                    color: "black",
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 20,
                  }}
                >
                  Your Information
                </Typography>
                <Box
                  component="form"
                  onSubmit={formik.handleSubmit}
                  display={"flex"}
                  flexDirection={"column"}
                >
                  <Card>
                    <CardContent>
                      <Grid container spacing={1}>
                        {!isLoggedIn && (
                          <Grid item xs={12} md={12}>
                            <TextField
                              label="Email"
                              name="email"
                              fullWidth
                              onChange={formik.handleChange}
                              value={formik.values.email}
                              error={
                                formik.touched.email &&
                                Boolean(formik.errors.email)
                              }
                              helperText={
                                formik.touched.email && formik.errors.email
                              }
                            />
                          </Grid>
                        )}

                        <Grid item xs={12} md={12}>
                          <div
                            style={{
                              border: "1px solid #ccc",
                              padding: "16px",
                              borderRadius: "5px",
                              marginTop: "15px",
                            }}
                          >
                            <CardElement
                              options={{
                                disableLink: true,
                                style: {
                                  base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": {
                                      color: "#aab7c4",
                                    },
                                  },
                                  invalid: {
                                    color: "#9e2146",
                                  },
                                },
                              }}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  <Button
                    type="submit"
                    color="btn"
                    variant="contained"
                    style={btnstyle}
                    justifyContent="center"
                    disabled={!stripe}
                  >
                    Donate Now!
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* Modal for Loading/Success/Failure */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          "& .MuiPaper-root": {
            width: "50%", // Applying border-radius to the dialog
          },
        }}
      >
        <DialogContent
          style={{
            textAlign: "center",
            paddingTop: 50,
            paddingBottom: 50,
          }}
        >
          {donationStatus === "success" ? (
            <div
              style={{
                textAlign: "center",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img src="/success.jpg" alt="" style={{ width: "20%" }} />
              <Typography variant="h6" color="green">
                <strong>Thank you for your gift!</strong> <br />
                Your donation will help local wildlife thrive.
              </Typography>
              <DialogActions style={{ paddingTop: 50 }}>
                <Button
                  onClick={handleCloseModal}
                  color="primary"
                  style={{
                    backgroundColor: "#228B22",
                    color: "white",
                    width: 120,
                  }}
                >
                  Redirect
                </Button>
              </DialogActions>
            </div>
          ) : donationStatus === "failure" ? (
            <div
              style={{
                textAlign: "center",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img src="/fail.png" alt="" style={{ width: "20%" }} />
              <Typography variant="h6" color="red" style={{ paddingTop: 40 }}>
                <strong>Donation Failed</strong> <br />
                Something went wrong.
                <br />
                Please try again later.
              </Typography>
              <DialogActions style={{ paddingTop: 50 }}>
                <Button
                  onClick={handleCloseModal}
                  color="primary"
                  style={{
                    backgroundColor: "#DC143C",
                    color: "white",
                    width: 120,
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </div>
          ) : (
            <>
              <CircularProgress size={50} />
              <Typography
                variant="body1"
                style={{ marginTop: 20, paddingTop: 30 }}
              >
                {loadingMessage}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </Container>
  );
};

function ContactUs() {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default ContactUs;
