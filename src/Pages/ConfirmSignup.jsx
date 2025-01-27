import React, { useState } from 'react';
import { Container, Box, Paper, Grid, Typography, TextField, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmSignUp } from 'aws-amplify/auth';

function ConfirmSignup() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state // Get username from state passed during signup

    const [code, setConfirmationCode] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        try {
            await confirmSignUp(username, code);
            navigate('/login');  // Redirect to login page after confirmation
        } catch (err) {
            console.error(err);  // Log the full error for more details
            setError('Failed to confirm sign-up. Please check your confirmation code.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Paper elevation={3} sx={{ padding: '2rem', width: '100%' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Confirm Your Sign Up
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Confirmation Code"
                                fullWidth
                                value={code}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                                error={Boolean(error)}
                                helperText={error}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" color="primary" onClick={handleConfirm}>
                                Confirm Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
}

export default ConfirmSignup;
