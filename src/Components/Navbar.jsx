import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button, IconButton, Drawer, List, Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { fetchAuthSession } from 'aws-amplify/auth';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AccountCircle } from '@mui/icons-material';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsOpen(open);
    };

    return (
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: '#FAF6E3' }}>
            <AppBar position="static" elevation={0} style={{ backgroundColor: '#FAF6E3', color: 'black' }}>
                <Toolbar style={{ backgroundColor: '#FAF6E3' }}>
                    {/* Menu Icon Button */}
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Drawer for the Sidebar Menu */}
                    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
                        <Box
                            sx={{ width: 250 }}
                            role="presentation"
                            onClick={toggleDrawer(false)}
                            onKeyDown={toggleDrawer(false)}
                        >
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/">
                                        <ListItemText primary="Home" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/categories">
                                        <ListItemText primary="Support Us" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/contactus">
                                        <ListItemText primary="How We Operate" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/forum">
                                        <ListItemText primary="About" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                            <Divider />
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/admin/dashboard">
                                        <AccountCircle style={{ color: 'black' }} />
                                        <ListItemText primary="Login" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Box>
                    </Drawer>

                    {/* Logo and Navbar Links */}
                    <Box style={{ backgroundColor: '#FAF6E3' }} marginLeft="1rem" display="flex" sx={{ flexGrow: 1 }}>
                        <img
                            src="..\src\Images\logo.png"
                            alt="logo"
                            style={{ height: '90px', width: '90px' }}
                        />
                    </Box>

                    {/* Profile and Other Links */}
                    <>
                        <AccountCircle style={{ color: 'black' }} />
                        <Button color="inherit" LinkComponent={Link} to="/profile/profile" sx={{ fontWeight: 'bold' }}>
                            Profile
                        </Button>
                    </>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
