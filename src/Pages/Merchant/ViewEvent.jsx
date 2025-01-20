import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Typography, Grid, Container, TextField, Box, Button, Card, CardContent, CardMedia } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import http from '../../http.js';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import dayjs from 'dayjs';

function ViewEvent() {
    const btnstyle = { fontWeight: 'bold', color: 'white', backgroundColor: '#799ae0' }
    const deletebtnstyle = { fontWeight: 'bold', color: 'white', backgroundColor: 'red' }
    const [eventList, setEventList] = useState([]);
    const getEvents = () => {
        http.get(`/Event/Merchant`).then((res) => {
            console.log(res.data)
            setEventList(res.data);
        });
    };

    useEffect(() => {
        getEvents();
    }, []);


    const [open, setOpen] = useState(false);
    const [dId, setId] = useState("");
    const handleOpen = (eventId) => {
        setId(eventId);
        console.log(eventId)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container maxWidth="xl" >
            <Typography variant="h4" marginBottom={2}>
                View Event
            </Typography>
            {eventList.map((event) =>
                <Card>
                    <CardMedia
                        component="img"
                        height="200"
                        image={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                        alt="Event Image">
                    </CardMedia>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Typography variant="h5" marginBottom={2}>
                                    Title: {event.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" marginBottom={2}>
                                    Category: {event.category}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" marginBottom={2}>
                                    Price: ${event.price}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" marginBottom={2}>
                                    Capacity: {event.capacity}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant="h6" marginBottom={2}>
                                    Address: {event.address}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" marginBottom={2}>
                                    Date: {new Date(event.startDate).toLocaleDateString()} To {new Date(event.endDate).toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant="h6" marginBottom={2}>
                                    Description: {event.description}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Link to={`/Merchant/EditEvent/${event.id}`}>
                                    <Button variant="contained" style={btnstyle} fullWidth>
                                        Edit Event
                                    </Button>
                                </Link>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    variant="contained" style={deletebtnstyle} fullWidth
                                    onClick={() => handleOpen(event.id)}
                                >
                                    Delete Event
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Event
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={() => {
                            http.delete(`/Event/${dId}`).then((res) => {
                                console.log(res.data)
                                handleClose()
                                getEvents()
                            });
                        }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default ViewEvent