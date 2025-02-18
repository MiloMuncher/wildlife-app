import React, { useState, useEffect } from 'react';
import { Typography, Grid, Container, Card, CardContent, Button, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../../http.js';

function FoodDetails() {
    const { id } = useParams();
    const [foodData, setFoodData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expirationDate, setExpirationDate] = useState('');
    const [batchCount, setBatchCount] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        http.get(`https://vqhu3eilu9.execute-api.us-east-1.amazonaws.com/dev/food/${id}`)
            .then((res) => {
                setFoodData(res.data[0]);
                setLoading(false);
                console.log(foodData)
            })
            .catch((error) => {
                console.log(error);
                setError("Failed to load food data.");
                setLoading(false);
            });
    }, [id]);

    const generateBatchNumber = (name) => {
        const initials = name.split(' ').map(word => word[0].toUpperCase()).join('');
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `${initials}${today}`;
    };

    const handleConfirm = () => {
        if (!foodData) return;

        const batchNumber = generateBatchNumber(foodData.name);
        const updatedQuantity = foodData.available_quantity * batchCount;

        const payload = {
            name: foodData.name,
            description: foodData.description,
            available_quantity: updatedQuantity,
            expiration_date: expirationDate,
            batch_number: batchNumber,
            price: foodData.price,
            weight_per_quantity: foodData.weight_per_quantity
        };

        console.log(payload);

        http.post('https://vqhu3eilu9.execute-api.us-east-1.amazonaws.com/dev/food', payload)
            .then((response) => {
                console.log("Food item confirmed:", response.data);
                navigate("/supply-success");
            })
            .catch((error) => {
                console.error("Error confirming food item:", error);
                setError("Failed to confirm the food item.");
            });
    };

    if (loading) {
        return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Loading...</Typography>;
    }

    return (
        <Container maxWidth="sm" sx={{ p: 2 }}>
            <Typography variant="h6" color="black" marginBottom={2}>
                Food Details for {foodData?.name}
            </Typography>

            {error && (
                <Typography variant="body1" color="error" sx={{ mb: 2, textAlign: 'center' }}>
                    {error}
                </Typography>
            )}

            <Card sx={{ borderRadius: 2, boxShadow: 3, mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Name:</Typography>
                            <Typography variant="body1">{foodData?.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Description:</Typography>
                            <Typography variant="body1">{foodData?.description}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Quantity To Add:</Typography>
                            <Typography variant="body1">{foodData?.available_quantity}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Unit Price:</Typography>
                            <Typography variant="body1">${foodData?.price}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Batch Number:</Typography>
                            <Typography variant="body1">{generateBatchNumber(foodData?.name)}</Typography>
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


            <Button
                onClick={handleConfirm}
                sx={{
                    mt: 2,
                    width: '100%',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: '#FF4E00',
                    '&:hover': { backgroundColor: '#e04300' }
                }}
            >
                Add New Batch
            </Button>
        </Container>
    );
}

export default FoodDetails;
