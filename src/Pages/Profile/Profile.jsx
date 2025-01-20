import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Container, Box, Paper, Grid, Typography, Button, Divider, Card, CardContent, CardMedia, TextField } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import UserContext from '../../contexts/UserContext.js';
import http from '../../http.js';

// icons
import AndroidIcon from '@mui/icons-material/Android';
import { Avatar } from '@mui/material';



function Profile() {
    const avatarStyle = { backgroundColor: '#FF4E00', marginTop: '1rem', width: '6rem', height: '6rem' };
    const btnstyle = { fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' }
    const accountTitle = { color: "#000000", fontWeight: "bold" }
    const accountText = { color: "#000000", fontWeight: "semibold" }

    const { user, setUser } = useContext(UserContext)

    useEffect(() => {
        http.get(`/User/${user.id}`).then((res) => {
            setUser(res.data)
        });
    }, []);

    return (
        <Container maxWidth="xl" >
            <Card>
                <CardMedia
                    component="img"
                    height="200"
                    image="../images/ProfileBackground.png"
                    alt="Profile Background"
                />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={2}>
                            <Avatar style={avatarStyle}>
                                <AndroidIcon />
                            </Avatar>
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <Typography variant="h4" style={accountTitle} marginTop={5}>
                                {user.name}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} marginTop={1}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" style={accountTitle} marginTop={2} marginBottom={2}>
                                Email:
                            </Typography>
                            <Typography variant="h6" style={accountText}>
                                {user.email}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" style={accountTitle} marginTop={2} marginBottom={2}>
                                Phone number:
                            </Typography>
                            <Typography variant="h6" style={accountText}>
                                {user.contact}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} marginTop={1}>
                        <Grid item xs={12} md={6}>
                            <Button
                                variant="contained"
                                color="btn"
                                style={btnstyle}
                                LinkComponent={Link}
                                to={`/profile/edit/${user.id}`}
                            >
                                Edit Details
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                variant="contained"
                                color="btn"
                                style={btnstyle}
                                LinkComponent={Link}
                                to={`/profile/changepassword`}
                            >
                                Change Password
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container >
    )
}
export default Profile