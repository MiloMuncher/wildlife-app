import React, { useState, useEffect, useContext } from 'react'
import { Container, Box, Paper, Grid, Typography, Button, Divider, Card, CardContent } from '@mui/material'
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton';
import { Menu } from '@mui/base/Menu';
import { MenuItem } from '@mui/base/MenuItem'
import { Link, useNavigate } from 'react-router-dom'
import http from '../http.js';
import UserContext from '../contexts/UserContext.js';
import DeleteIcon from '@mui/icons-material/Delete';

function Cart() {
    const { user } = useContext(UserContext);

    const [cartList, setCartList] = useState([]);
    const [deleteTrigger, setDeleteTrigger] = useState(false);

    useEffect(() => {
        http.get(`/Cart`).then((res) => {
            setCartList(res.data);
            console.log(res.data)
        })
    }, [deleteTrigger])

    const calculateTotalPrice = () => {
        return cartList.reduce((total, cartItem) => {
            return total + cartItem.quantity * cartItem.event.price;
        }, 0);
    };

    const handleCheckout = async () => {
        try {
            http.post(`/Order/create-checkout-session`).then((res) => {
                console.log(res.data)
                localStorage.setItem("stripeid", res.data.id)
                window.location.href = res.data.url;
            })
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    const handleDelete = (cartItemId) => {
        try {
            http.delete(`/Cart/${cartItemId}`).then((res) => {
                console.log(res.data)
                setDeleteTrigger(!deleteTrigger)
            })
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    const handleDeleteAll = () => {
        try {
            http.delete(`/Cart`).then((res) => {
                console.log(res.data)
                setDeleteTrigger(!deleteTrigger)
            })
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <Container maxWidth="x1">
            <Box flexDirection={'row'} display={'flex'} justifyContent={'center'}>
                <Box border={0} marginTop={15} height={600} width={632} marginLeft={0}>
                    <Box border={0} borderRadius={3} height={64} width={697} style={{ backgroundColor: '#000000' }}>
                        <Typography variant="h6" style={{ textAlign: "left", paddingTop: 15, paddingLeft: 20, fontWeight: 'bold', color: 'white' }}>My Cart</Typography>
                    </Box>
                    <Box border={1} borderRadius={3} width={632} height={300} padding={4} marginTop={3}>
                        {cartList.map((cartItem) => (
                            <Grid container direction='row' border={0} justifyContent={'center'} spacing={1}>
                                <Grid item xs={4} borderRadius={4}>
                                    <img src={`${import.meta.env.VITE_FILE_BASE_URL}${cartItem.event.imageFile}`} style={{ width: '100%', borderRadius: '10px' }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" style={{ textAlign: "left", fontWeight: 'bold' }}>
                                        {cartItem.event.title}
                                    </Typography>
                                    <Grid container direction='row' border={0} justifyContent={'left'} spacing={0}>
                                        <Grid item xs={6}>
                                            <Typography variant="h8" style={{ textAlign: "left", paddingTop: 15, fontWeight: 'bold' }}>{new Date(cartItem.date).toLocaleDateString()}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h8" style={{ textAlign: "left", paddingTop: 15, fontWeight: 'bold' }}>
                                        Quantity: {cartItem.quantity}
                                    </Typography>
                                </Grid>

                                <Grid item xs={2}>
                                    <Typography variant="h6" style={{ textAlign: "right", paddingTop: 15 }}>${cartItem.quantity * cartItem.event.price}</Typography>
                                    <DeleteIcon onClick={() => handleDelete(cartItem.id)} sx={{ cursor: 'pointer' }} style={{ paddingLeft: 80, paddingTop: 5 }} />
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                
                    <Button onClick={() => handleDeleteAll()} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 10, display: 'block', fontWeight: "bold", color: 'white', backgroundColor:'red', padding: 15  }}>Delete All</Button>
                </Box>
                <Box border={1} marginTop={15} width={632} marginLeft={20}>
                    <Box border={0} height={64} width={632} style={{ backgroundColor: '#000000', }}>
                        <Typography variant="h6" style={{ textAlign: "left", paddingTop: 15, paddingLeft: 20, fontWeight: 'bold', color: 'white' }}>Order Summary</Typography>
                    </Box>
                    <Box border={0}>
                        <Typography variant="h6" style={{ textAlign: "left", paddingTop: 50, paddingLeft: 20, fontWeight: 'bold' }}>Subtotal</Typography>
                    </Box>
                    {cartList.map((cartItem) => (
                        <Grid container direction="row">
                            <Grid item xs={8}>
                                <Typography variant="h6" style={{ textAlign: "left", paddingTop: 15, paddingLeft: 20, }}>{cartItem.event.title}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="h6" style={{ textAlign: "right", paddingTop: 15, paddingRight: 20, }}>${cartItem.quantity * cartItem.event.price}</Typography>
                            </Grid>
                        </Grid>
                    ))}
                    <Box border={0} borderTop={1} marginTop={2}>
                        <Grid container direction="row">
                            <Grid item xs={8}>
                                <Typography variant="h6" style={{ textAlign: "left", paddingTop: 15, paddingLeft: 20, fontWeight: 'bold' }}>
                                    Total
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="h6" style={{ textAlign: "right", paddingTop: 15, paddingRight: 20 }}>
                                    ${calculateTotalPrice()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
            <Box maxWidth={110} marginLeft={159} marginTop={5}>
                <Button onClick={handleCheckout} variant="contained" color='btnGreen' style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', fontWeight: "bold", color: 'white', padding: 15 }}>
                    Checkout
                </Button>
            </Box>
        </Container>
    )
}
export default Cart