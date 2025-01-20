import React from 'react'
import { Typography, Grid, Container, TextField, Box, Button, Card, CardContent, Divider } from '@mui/material'
import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import http from '../../http'

function Purchases() {
  const btnstyle = { margin: '8px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };
  const dividerstyle = { backgroundColor: '#150039', fontWeight: 'bold', margin: '10px 0' };

  const [orderList, setOrderList] = useState([]);
  const calculateTotalPrice = (order) => {
    return order.cartItems.reduce((total, cartItem) => {
      return total + cartItem.quantity * cartItem.event.price;
    }, 0);
  };
  const getOrders = () => {
    http.get(`/Order/User`).then((res) => {
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
        Purchases
      </Typography>
      <Grid container>
        {
          orderList.map((order) =>
            <>
              <Grid item xs={12} md={12} >
                <Card elevation={5}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} display={'flex'} >
                        <Box style={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant='h5' fontWeight={600}>
                            Order ID: {order.id}
                          </Typography>
                          <Typography variant='h6'>
                            Total Price: ${calculateTotalPrice(order)}
                          </Typography>
                          <Typography variant='h6'>
                            Status: {order.status}
                          </Typography>
                          <Divider style={dividerstyle} />
                          <Button style={btnstyle} variant="contained" fullWidth LinkComponent={Link} to={`/profile/items/${order.id}`}   >
                            View Details
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
      </Grid >
    </Container>
  )
}

export default Purchases