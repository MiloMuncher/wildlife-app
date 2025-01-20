import React from 'react'
import {Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Grid, Card } from '@mui/material'
import { Link, Routes, Route } from 'react-router-dom'

//Pages
import CreateEvent from './CreateEvent'
import ViewEvent from './ViewEvent'
import EditEvent from './EditEvent'

//icons
import CreateIcon from '@mui/icons-material/Create';
import EventIcon from '@mui/icons-material/Event';

function ProfileRoutes() {
  return (
    <Container maxWidth='xl'>
            <Grid container spacing={2} marginTop={10}>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <CreateIcon color='primary' />
                                </ListItemIcon>
                                <ListItemButton LinkComponent={Link} to='/merchant/createevent' >
                                    <ListItemText primary="Create Your Event" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemIcon>
                                    <EventIcon color='primary' />
                                </ListItemIcon>
                                <ListItemButton LinkComponent={Link} to='/merchant/viewevent' >
                                    <ListItemText primary="View all your events" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </List>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Routes>
                        <Route path='/createevent' element={<CreateEvent />} />
                        <Route path='/viewevent' element={<ViewEvent />} />
                        <Route path='/editEvent/:id' element={<EditEvent />} />
                    </Routes>
                </Grid>
            </Grid>
        </Container>
  )
}

export default ProfileRoutes