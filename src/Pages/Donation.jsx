import React, { useState } from 'react';
import { Container, Box, Grid, Typography, Button, TextField, Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

function ContactUs() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };

    const [showChatbot, setShowChatbot] = useState(false);

    const toggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            address: '',
            postal: '',
            category: 'Donate',
            emailUpdates: '',
            donationAmount: '',
        },
        validationSchema: yup.object({
            name: yup.string().trim().min(3).max(100).required(),
            email: yup.string().trim().email('Email must be valid')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            address: yup.string().trim().required(),
            postal: yup.string().trim().required(),
            emailUpdates: yup.string().oneOf(['Yes', 'No'], 'Invalid selection').required('This field is required'),
            donationAmount: yup.string().required('Please select a donation amount'),
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.address = data.address.trim();
            data.postal = data.postal.trim();
            data.category = "Donate";
            console.log('Form data submitted:', data);
        },
    });

    const donationAmounts = ["$10", "$25", "$50", "$100", "$250", "$500"];

    return (
        <Container maxWidth="xl">
            <Box style={{ backgroundSize: 'cover', borderRadius: 15 }} display={'flex'} flexDirection={'column'}>
                <Typography variant="h4" style={{ textAlign: "left", fontWeight: "bold", paddingTop: 100, fontSize: '60px' }}>
                    Donate To Wildlife Rehab
                </Typography>
                <Typography variant="h6" style={{ textAlign: "left", paddingTop: 20 }}>
                    Together, we can protect vulnerable wildlife,
                </Typography>
                <Typography variant="h6" style={{ textAlign: "left" }}>
                    conserve vital habitats, and build a future where
                </Typography>
                <Typography variant="h6" style={{ textAlign: "left" }}>
                    people live in harmony with nature.
                </Typography>

                <Box display={'flex'} flexDirection={'column'}>
                    <Grid container spacing={0} marginTop={5} justifyContent="center">
                        <Grid item xs={12} md={5}>
                            <Box style={{ backgroundSize: 'cover', borderRadius: 15, backgroundColor: 'white' }} display={'flex'} flexDirection={'column'}>
                                

                                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} paddingTop={2}>
                                    {donationAmounts.map((amount, index) => (
                                        <Button
                                            key={index}
                                            variant={formik.values.donationAmount === amount ? "contained" : "outlined"}
                                            style={{
                                                fontWeight: 'bold',
                                                borderColor: '#FF4E00',
                                                color: formik.values.donationAmount === amount ? 'white' : '#FF4E00',
                                                backgroundColor: formik.values.donationAmount === amount ? '#FF4E00' : 'transparent',
                                            }}
                                            onClick={() => formik.setFieldValue('donationAmount', amount)}
                                        >
                                            {amount}
                                        </Button>
                                    ))}
                                </Box>
                                {formik.touched.donationAmount && formik.errors.donationAmount && (
                                    <Typography color="error" variant="body2" align="center" paddingTop={1}>
                                        {formik.errors.donationAmount}
                                    </Typography>
                                )}
                                <Typography variant="h5" style={{ textAlign: "center", fontWeight: "bold", paddingTop: 60, color: "black", paddingLeft: 20, paddingRight: 20 }}>
                                    Your Information
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
                                                        label="Address"
                                                        name='address'
                                                        fullWidth
                                                        onChange={formik.handleChange}
                                                        value={formik.values.address}
                                                        error={formik.touched.address && Boolean(formik.errors.address)}
                                                        helperText={formik.touched.address && formik.errors.address}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={12}>
                                                    <TextField
                                                        label="Postal Code"
                                                        name='postal'
                                                        multiline
                                                        fullWidth
                                                        onChange={formik.handleChange}
                                                        value={formik.values.postal}
                                                        error={formik.touched.postal && Boolean(formik.errors.postal)}
                                                        helperText={formik.touched.postal && formik.errors.postal}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={12}>
                                                    <FormControl component="fieldset">
                                                        <FormLabel component="legend">I would like to get (or continue to get) email updates:</FormLabel>
                                                        <RadioGroup
                                                            row
                                                            name="emailUpdates"
                                                            value={formik.values.emailUpdates}
                                                            onChange={formik.handleChange}
                                                        >
                                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                            <FormControlLabel value="No" control={<Radio />} label="No" />
                                                        </RadioGroup>
                                                        {formik.touched.emailUpdates && formik.errors.emailUpdates && (
                                                            <Typography color="error" variant="body2">
                                                                {formik.errors.emailUpdates}
                                                            </Typography>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                    <Button type='submit' color='btn' variant="contained" style={btnstyle} justifyContent="center">
                                        Donate Now!
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

            </Box>
        </Container>
    );
}

export default ContactUs;
