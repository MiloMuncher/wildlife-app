import React, { useState, useEffect } from 'react';
import { Typography, Grid, Container, Card, CardContent, Button, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../../http.js';

function MedicationDetails() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };
    const { id } = useParams();
    const [medicationData, setMedicationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expirationDate, setExpirationDate] = useState('');
    const [batchCount, setBatchCount] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        http.get(`https://vqhu3eilu9.execute-api.us-east-1.amazonaws.com/dev/medication/${id}`)
            .then((res) => {
                setMedicationData(res.data[0]);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setError("Failed to load medication data.");
                setLoading(false);
            });
    }, [id]);

    const generateBatchNumber = (name) => {
        const initials = name.split(' ').map(word => word[0].toUpperCase()).join('');
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `${initials}${today}`;
    };

    const handleConfirm = () => {
        if (!medicationData) return;

        const batchNumber = generateBatchNumber(medicationData.name);
        const updatedQuantity = medicationData.available_quantity * batchCount;

        const payload = {
            name: medicationData.name,
            description: medicationData.description,
            dosage: medicationData.dosage,
            available_quantity: updatedQuantity,
            expiration_date: expirationDate,
            batch_number: batchNumber,
            price: medicationData.price
        };

        console.log(payload);

        http.post('https://vqhu3eilu9.execute-api.us-east-1.amazonaws.com/dev/medication', payload)
            .then((response) => {
                console.log("Medication item confirmed:", response.data);
                navigate("/supply-success");
            })
            .catch((error) => {
                console.error("Error confirming medication item:", error);
                setError("Failed to confirm the medication item.");
            });
    };

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Container maxWidth='sm' sx={{ p: 2 }}>
            <Typography variant='h6' color="black" marginBottom={2}>
                Medication Details for {medicationData?.name}
            </Typography>

            {error && <Typography variant="body1" color="error">{error}</Typography>}

            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Name: {medicationData?.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Description: {medicationData?.description}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Dosage: {medicationData?.dosage}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Quantity By Batch: {medicationData?.available_quantity}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Unit Price: ${medicationData?.price}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Batch Number: {generateBatchNumber(medicationData?.name)}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <TextField
                label="Expiration Date"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
            />

            <TextField
                label="Number of Batches"
                type="number"
                inputProps={{ min: 1 }}
                value={batchCount === 0 ? "" : batchCount} // Allow empty input
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                        setBatchCount(""); // Allow empty input
                    } else {
                        const num = parseInt(value, 10);
                        if (!isNaN(num) && num >= 1) {
                            setBatchCount(num); // Set valid numbers
                        }
                    }
                }}
                fullWidth
                sx={{ mt: 2 }}
            />

            <Button onClick={handleConfirm} sx={{ mt: 2, width: '100%', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' }}>
                Add New Batch
            </Button>
        </Container>

    );
}

export default MedicationDetails;