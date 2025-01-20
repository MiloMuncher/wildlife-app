import React, { useContext } from 'react'
import { Collapse, Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Grid, Card } from '@mui/material'
import { Link, Routes, Route } from 'react-router-dom'

//Pages
import Profile from './Profile'
import Purchases from './ProfilePurchases';
import Posts from './Posts';
import Reviews from './Reviews';
import ChangePassword from './ChangePassword';
import ProfileEdit from './ProfileEdit';
import EditPost from '../EditPost';
import Items from './ProfileItems';

//icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import UserContext from '../../contexts/UserContext';



function ProfileRoutes() {
    const { user } = useContext(UserContext)
    console.log(user)

    return (
        <Container maxWidth='xl'>
            <Grid container spacing={2} marginTop={10}>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <AccountCircleIcon color='primary' />
                                </ListItemIcon>
                                <ListItemButton LinkComponent={Link} to='/profile/profile' >
                                    <ListItemText primary="Profile" />
                                </ListItemButton>
                            </ListItem>

                            {
                                user.role == "Customer" && (
                                    <>
                                        <Divider />
                                        <ListItem>
                                            <ListItemIcon>
                                                <AttachMoneyIcon color='primary' />
                                            </ListItemIcon>
                                            <ListItemButton LinkComponent={Link} to='/profile/purchases' >
                                                <ListItemText primary="My Purchases" />
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider />
                                        <ListItem>
                                            <ListItemIcon>
                                                <LocalPostOfficeIcon color='primary' />
                                            </ListItemIcon>
                                            <ListItemButton LinkComponent={Link} to='/profile/posts' >
                                                <ListItemText primary="My Posts" />
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider />
                                    </>
                                )
                            }

                        </List>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Routes>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/changepassword" element={<ChangePassword />} />
                        <Route path="/edit/:id" element={<ProfileEdit />} />

                        {
                            user.role == "Customer" && (
                                <>
                                    <Route path="/editpost/:id" element={<EditPost />} />
                                    <Route path="/purchases" element={<Purchases />} />
                                    <Route path="/posts" element={<Posts />} />
                                    <Route path="/orders" element={<Purchases />} />
                                    <Route path="/items/:id" element={<Items />} />
                                </>
                            )
                        }
                    </Routes>
                </Grid>
            </Grid>
        </Container>
    )
}

export default ProfileRoutes