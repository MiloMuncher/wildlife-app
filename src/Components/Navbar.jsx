import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button, IconButton, Drawer, List, Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AccountCircle } from '@mui/icons-material';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        // Check if user is signed in on component mount
        const checkAuthSession = async () => {
            try {
                await fetchAuthSession();
                setIsSignedIn(true);  // Set user as signed in
            } catch {
                console.log("Error fetching the session");
            }
        };

        checkAuthSession();
    }, []);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsOpen(open);
    };
    const handleLogout = async () => {
        try {
            await signOut();
            setIsSignedIn(false); // Update state to reflect user signed out
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={0} style={{ color: 'black' }}>
                <Toolbar style={{ backgroundColor: 'white' }}>
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
                                    <ListItemButton component={Link} to="/supportus">
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
                                    {isSignedIn ? (
                                        <ListItemButton onClick={handleLogout} component={Link} to="/">
                                            <AccountCircle style={{ color: 'black' }} />
                                            <ListItemText primary="Logout" />
                                        </ListItemButton>
                                    ) : (
                                        <ListItemButton component={Link} to="/login">
                                            <AccountCircle style={{ color: 'black' }} />
                                            <ListItemText primary="Login" />
                                        </ListItemButton>
                                    )}
                                </ListItem>
                            </List>
                        </Box>
                    </Drawer>

                    {/* Logo and Navbar Links */}
                    <Box marginLeft="1rem" display="flex" sx={{ flexGrow: 1 }}>
                        <img
                            src="\logo.png"
                            alt="logo"
                            style={{ height: '90px', width: '90px' }}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
