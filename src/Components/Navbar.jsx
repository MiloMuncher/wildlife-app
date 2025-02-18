import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Typography,
} from '@mui/material';
import { Login, Logout } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { fetchAuthSession } from 'aws-amplify/auth';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);


    useEffect(() => {
        sessionStorage.setItem('previousPage', location.pathname);
        const checkAuthSession = async () => {
            try {
                await fetchAuthSession();
                setIsSignedIn(true);  // Set user as signed in
            } catch {
                console.log('Error fetching the session');
            }
        };
        checkAuthSession();
    }, [location.pathname]);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsOpen(open);
    };
    const handleCloseDrawer = () => {
        setIsOpen(false);
    };
    const handleLogout = () => {
        // Handle logout logic (e.g., clear session, redirect)
        setIsSignedIn(false);
        localStorage.clear()
        console.log('Logged out');
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={0} style={{ color: 'black' }}>
                <Toolbar style={{ backgroundColor: 'white' }}>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>

                    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
                        <Box sx={{ width: 250, backgroundColor: '#f9f9f9', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Logo at the top */}
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <img
                                    src="/logo.png"
                                    alt="Home"
                                    style={{
                                        marginRight: '10px',
                                        transition: 'transform 0.3s ease',
                                    }}
                                />
                                <Typography color="textSecondary">
                                    Isiolo Wildlife Rehab Centre
                                </Typography>
                            </Box>
                            <Divider />

                            {/* Main List */}
                            <Box sx={{ flexGrow: 1 }}>
                                <List>
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} to="/" style={{ paddingLeft: '20px' }} onClick={handleCloseDrawer}>
                                            <img
                                                src="/Home.png"
                                                alt="Home"
                                                style={{
                                                    marginRight: '10px',
                                                    transition: 'transform 0.3s ease',
                                                }}
                                            />
                                            <ListItemText primary="Home" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} to="/supportus" style={{ paddingLeft: '20px' }} onClick={handleCloseDrawer}>
                                            <img
                                                src="/Star.png"
                                                alt="Support Us"
                                                style={{
                                                    marginRight: '10px',
                                                    transition: 'transform 0.3s ease',
                                                }}
                                            />
                                            <ListItemText primary="Support Us" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} to="/howweoperate" style={{ paddingLeft: '20px' }} onClick={handleCloseDrawer}>
                                            <img
                                                src="/Suitcase.png"
                                                alt="How We Operate"
                                                style={{
                                                    marginRight: '10px',
                                                    transition: 'transform 0.3s ease',
                                                }}
                                            />
                                            <ListItemText primary="How We Operate" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} to="/aboutus" style={{ paddingLeft: '20px' }} onClick={handleCloseDrawer}>
                                            <img
                                                src="/Book.png"
                                                alt="About"
                                                style={{
                                                    marginRight: '10px',
                                                    transition: 'transform 0.3s ease',
                                                }}
                                            />
                                            <ListItemText primary="About" />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Box>

                            {/* Login Button at the Bottom */}
                            <Box sx={{ borderTop: '1px solid #ddd' }}>
                                <ListItem disablePadding>
                                    {isSignedIn ? (

                                        <ListItemButton component={Link} to="/" style={{ paddingLeft: '20px' }} onClick={handleLogout}>
                                            <Logout sx={{ marginRight: '10px' }} />
                                            <ListItemText primary="Logout" />
                                        </ListItemButton>
                                    ) : (
                                        <ListItemButton component={Link} to="/login" style={{ paddingLeft: '20px' }} onClick={handleCloseDrawer}>
                                            <Login sx={{ marginRight: '10px' }} />
                                            <ListItemText primary="Login" />
                                        </ListItemButton>
                                    )}
                                </ListItem>
                            </Box>
                        </Box>
                    </Drawer>

                    <Box
                        marginLeft="1rem"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        sx={{ flexGrow: 1 }}
                        mb={2}
                    >
                        <img src="/logo.png" alt="logo" style={{ height: '90px', width: '90px' }} />
                        <Typography color="textSecondary" fontWeight="bold">
                            Isiolo Wildlife Rehab Centre
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
