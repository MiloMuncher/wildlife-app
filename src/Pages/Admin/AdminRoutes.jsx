import React, { useState } from 'react'
import { Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Grid, Card, Collapse } from '@mui/material'
import { Link, Routes, Route } from 'react-router-dom'

// Pages
import UserView from './UserView';
import UserEdit from './UserEdit';
import MerchantView from './VetView';
import AddMerchant from './AddMerchant';
import OrdersView from './OrdersView';
import OrderItems from './OrderItems';
import PostsView from './PostsView';
import AddAdminPost from './AddAdminPost';
import AdminEditPost from './AdminEditPost';
import CustomerServiceTickets from './CustomerServiceTickets';
import Dashboard from './Dashboard';
import EditMerchant from './EditMerchant';
//Pages
import UserView from './UserView'
import UserEdit from './UserEdit'
import MerchantView from './MerchantView'
import AddMerchant from './AddMerchant'
import OrdersView from './OrdersView'
import OrderItems from './OrderItems'
import PostsView from './PostsView'
import AddAdminPost from './AddAdminPost'
import AddEmployee from './AddEmployee'
import AdminEditPost from './AdminEditPost'
import EventsView from './EventsView'
import CustomerServiceTickets from './CustomerServiceTickets'
import Dashboard from './Dashboard'
import EditMerchant from './EditMerchant'

// Icons
import CreateIcon from '@mui/icons-material/Create';
import EventIcon from '@mui/icons-material/Event';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { fetchAuthSession } from 'aws-amplify/auth';
import UploadTranscripts from './UploadTranscripts';
import InventoryIcon from '@mui/icons-material/Inventory';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


function ProfileRoutes() {
    const [openUsers, setOpenUsers] = useState(false);
    const [openAnimals, setOpenAnimals] = useState(false);
    const [openInventory, setOpenInventory] = useState(false);
    const [openCases, setOpenCases] = useState(false);

    const handleToggle = (setOpen) => {
        setOpen((prev) => !prev);
    };

    return (
        <Container maxWidth='xl'>


            <Grid container spacing={2} marginTop={10}>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <DashboardIcon color='primary' />
                                </ListItemIcon>
                                <ListItemButton LinkComponent={Link} to='/admin/dashboard' >
                                    <ListItemText primary="Dashboard" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />

                            <ListItemButton onClick={() => handleToggle(setOpenUsers)} sx={{ padding: '17px', height: 'auto'}}>
                                <ListItemIcon sx={{ paddingRight: '30px'}}>
                                {openUsers ? (
                                        <ExpandLessIcon color="primary" />
                                    ) : (
                                        <ExpandMoreIcon color="primary" />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary="Manage Staff" sx={{ paddingLeft: '15px'}} />
                            </ListItemButton>
                            <Collapse in={openUsers} timeout="auto" unmountOnExit>
                                <List component="div">
                                    <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/viewusers">
                                        <ListItemText primary="View Employees" />
                                    </ListItemButton>
                                    <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/#viewvets">
                                        <ListItemText primary="View Vets" />
                                    </ListItemButton>
                                    <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/#viewvets">
                                        <ListItemText primary="View Shifts" />
                                    </ListItemButton>
                                    <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/#viewvets">
                                        <ListItemText primary="Payroll Management" />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                            <Divider />

                            <ListItemButton onClick={() => handleToggle(setOpenAnimals)} sx={{ padding: '17px', height: 'auto'}}>
                                <ListItemIcon sx={{ paddingRight: '30px'}}>
                                {openAnimals ? (
                                        <ExpandLessIcon color="primary" />
                                    ) : (
                                        <ExpandMoreIcon color="primary" />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary="Manage Animals" sx={{ paddingLeft: '15px'}} />
                            </ListItemButton>
                            <Collapse in={openAnimals} timeout="auto" unmountOnExit>
                                <List component="div">
                                    <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/#animals">
                                        <ListItemText primary="View Animals" />
                                    </ListItemButton>
                                    <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/#viewvets">
                                        <ListItemText primary="Animal Data" />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                            <Divider />

                            <ListItemButton onClick={() => handleToggle(setOpenInventory)} sx={{ padding: '17px', height: 'auto'}}>
                                <ListItemIcon sx={{ paddingRight: '30px'}}>
                                {openInventory ? (
                                        <ExpandLessIcon color="primary" />
                                    ) : (
                                        <ExpandMoreIcon color="primary" />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary="Manage Inventory" sx={{ paddingLeft: '15px'}} />
                            </ListItemButton>
                            <Collapse in={openInventory} timeout="auto" unmountOnExit>
                                <List component="div">
                                    <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/#animals">
                                        <ListItemText primary="View Medication" />
                                    </ListItemButton>
                                    <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/#viewvets">
                                        <ListItemText primary="View Food" />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                            <Divider />

                            <ListItemButton onClick={() => handleToggle(setOpenCases)} sx={{ padding: '17px', height: 'auto'}}>
                                <ListItemIcon sx={{ paddingRight: '30px'}}>
                                {openCases ? (
                                        <ExpandLessIcon color="primary" />
                                    ) : (
                                        <ExpandMoreIcon color="primary" />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary="Manage Cases" sx={{ paddingLeft: '15px'}} />
                            </ListItemButton>
                            <Collapse in={openCases} timeout="auto" unmountOnExit>
                                <List component="div">
                                    <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/#animals">
                                        <ListItemText primary="View Cases" />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </List>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Routes>
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path="/viewusers/edit/:id" element={<UserEdit />} />
                        <Route path='/viewusers' element={<UserView />} />
                        <Route path='/vieworders' element={<OrdersView />} />
                        <Route path='/orderitems/:id' element={<OrderItems />} />
                        <Route path='/viewposts' element={<PostsView />} />
                        <Route path='/addemployee' element={<AddEmployee />} />
                        <Route path='/addadminpost' element={<AddAdminPost />} />
                        <Route path='/admineditpost/:id' element={<AdminEditPost />} />
                        <Route path='/customerserviceticket' element={<CustomerServiceTickets />} />
                        <Route path='/viewevents' element={<EventsView />} />
                        <Route path='/viewmerchant' element={<MerchantView />} />
                        <Route path='/addmerchant' element={<AddMerchant />} />
                        <Route path='/editmerchant/:id' element={<EditMerchant />} />
                    </Routes>
                </Grid>
            </Grid>


        </Container>
    )
}

export default ProfileRoutes