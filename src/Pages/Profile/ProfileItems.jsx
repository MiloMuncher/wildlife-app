import React from 'react'
import { Typography, Grid, Container, TextField, Box, Button, Card, CardContent, Divider } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react'
import http from '../../http'

function ProfileItems() {
    const btnstyle = { margin: '8px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };
    const dividerstyle = { backgroundColor: '#150039', fontWeight: 'bold', margin: '10px 0' };

    const [orderList, setOrderList] = useState([]);
    const { id } = useParams()
    const calculateTotalPrice = (order) => {
        return order.cartItems.reduce((total, cartItem) => {
            return total + cartItem.quantity * cartItem.event.price;
        }, 0);
    };
    const getOrders = () => {
        http.get(`/Order/User/${id}`).then((res) => {
            console.log(res.data)
            setOrderList(res.data);
        });
    };

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <Container maxWidth="xl" >
            <Typography variant="h4" marginBottom={2}>
                Order Details
            </Typography>
            <Button style={btnstyle} variant="contained" LinkComponent={Link} to='/profile/purchases'   >
                Go Back
            </Button>
            <Grid container>
                {
                    orderList.map((order) =>
                        <>
                            <Grid item xs={12} md={12} >
                                <Card elevation={5}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={4}>
                                                <Box
                                                    component="img"
                                                    width="100%"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${order.event.imageFile}`}
                                                    alt=" test image">
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6} display={'flex'} >
                                                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Typography variant='h5' fontWeight={600}>
                                                        {order.event.title}
                                                    </Typography>
                                                    <Typography variant='h6'>
                                                        Ticket Quantity: {order.quantity}
                                                    </Typography>
                                                    <Typography variant='h6'>
                                                        Ticket Price: ${order.event.price}
                                                    </Typography>
                                                    <Typography variant='h6'>
                                                        Date: {new Date(order.date).toLocaleDateString()}
                                                    </Typography>

                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                    )}
            </Grid>
        </Container>
    )
}

export default ProfileItems