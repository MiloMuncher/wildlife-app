import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Button, Card, CardContent, Tabs, Tab, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../../http.js';

function AnimalData() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);
    
    const [animalData, setAnimalData] = useState({
        fed: false,
        medicated: false,
        surgeryTranscript: "",
    });

    useEffect(() => {
        http.get(`https://api.example.com/animals/${id}`)
            .then((res) => {
                setAnimalData(res.data);
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, [id]);

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const handleInputChange = (event) => {
        const { name, type, checked, value } = event.target;
        setAnimalData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = () => {
        http.put(`https://api.example.com/animals/${id}`, animalData)
            .then(() => navigate(-1))
            .catch((err) => console.error("Error updating data:", err));
    };

    return (
        <Container maxWidth='sm'>
            <Card>
                <CardContent>
                    <Tabs value={tabIndex} onChange={handleChange} centered>
                        <Tab label="Feeding" />
                        <Tab label="Medication" />
                        <Tab label="Surgery Transcript" />
                    </Tabs>
                    {tabIndex === 0 && (
                        <FormControlLabel
                            control={<Checkbox checked={animalData.fed} onChange={handleInputChange} name="fed" />}
                            label="Fed the animal"
                        />
                    )}
                    {tabIndex === 1 && (
                        <FormControlLabel
                            control={<Checkbox checked={animalData.medicated} onChange={handleInputChange} name="medicated" />}
                            label="Gave medicine"
                        />
                    )}
                    {tabIndex === 2 && (
                        <TextField
                            label="Add Transcript"
                            name="surgeryTranscript"
                            multiline
                            rows={4}
                            fullWidth
                            value={animalData.surgeryTranscript}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                    )}
                    <Box mt={2} textAlign='center'>
                        <Button variant='contained' color='primary' onClick={handleSubmit}>
                            Save
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

export default AnimalData;
