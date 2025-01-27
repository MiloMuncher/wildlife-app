import React from 'react';
import { Typography, Grid, Container, Card, CardContent } from '@mui/material';
import OrdersChart from '../Charts/OrdersChart';
import UserChart from '../Charts/UserChart';
import EventChart from '../Charts/EventChart';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';

function Dashboard({ signOut }) {
    const itemcolor = { backgroundColor: '#FAF6E3' }
    const session = fetchAuthSession();
    console.log(session);
    

    return (
        <Container maxWidth='xl'>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Card style={itemcolor}>
                        <CardContent>
                            <Typography variant='h6' color="black" marginBottom={2} align='center'>
                                Total Orders
                            </Typography>
                            <OrdersChart />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card style={itemcolor}>
                        <CardContent>
                            <Typography variant='h6' color="black" marginBottom={2} align='center'>
                                Total Customers
                            </Typography>
                            <UserChart />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card style={itemcolor}>
                        <CardContent>
                            <Typography variant='h6' color="black" marginBottom={2} align='center'>
                                Total Events Created
                            </Typography>
                            <EventChart />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <button onClick={signOut}>Sign Out</button>
        </Container>
    );
}

// Disable sign-up functionality by setting the 'signUp' option to false
export default withAuthenticator(Dashboard, {
    hideSignUp: true
});
