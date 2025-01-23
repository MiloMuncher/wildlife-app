import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button, IconButton, Drawer, List, Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';
import UserContext from '../contexts/UserContext.js';

import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AccountCircle } from '@mui/icons-material';

function Navbar() {
    const logout = () => {
        localStorage.clear();
        window.location = "/";
    };

    const { user, setUser } = useContext(UserContext);
    const isAdmin = user && user.role === 'Admin';
    const isMerchant = user && user.role === 'Merchant';
    const isCustomer = user && user.role === 'Customer';

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
                                {(isCustomer || !user) && (
                                    <>
                                        <ListItem disablePadding>
                                            <img
                                                src="src\Images\Home.png"
                                                alt="logo"
                                                style={{ height: "25px", width: "25px", padding: 15 }}
                                            />
                                            <ListItemButton component={Link} to="/">
                                                <ListItemText primary="Home" />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <img
                                                src="src\Images\Star.png"
                                                alt="logo"
                                                style={{ height: "25px", width: "25px", padding: 15 }}
                                            />
                                            <ListItemButton component={Link} to="/categories">
                                                <ListItemText primary="Support Us" />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <img
                                                src="src\Images\Suitcase.png"
                                                alt="logo"
                                                style={{ height: "25px", width: "25px", padding: 15 }}
                                            />
                                            <ListItemButton component={Link} to="/contactus">
                                                <ListItemText primary="How We Operate" />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <img
                                                src="src\Images\Book.png"
                                                alt="logo"
                                                style={{ height: "25px", width: "25px", padding: 15 }}
                                            />
                                            <ListItemButton component={Link} to="/forum">
                                                <ListItemText primary="About" />
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                                )}
                                {isMerchant && (
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} to="/merchant/viewevent">
                                            <ListItemText primary="Merchant" />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                                {isAdmin && (
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} to="/admin/dashboard">
                                            <ListItemText primary="Admin" />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </List>
                            <Divider />
                            <List>
                                {user ? (
                                    <>
                                        {isCustomer && (
                                            <>
                                                <ListItem disablePadding>

                                                    <ListItemButton component={Link} to="/cart">
                                                        <ListItemText primary="Cart" />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem disablePadding>
                                                    <ListItemButton component={Link} to={`/profile/profile`}>
                                                        <ListItemText primary={user.name} />
                                                    </ListItemButton>
                                                </ListItem>
                                            </>
                                        )}
                                        {isMerchant && (
                                            <ListItem disablePadding>
                                                <ListItemButton component={Link} to={`/profile/profile`}>
                                                    <ListItemText primary={user.name} />
                                                </ListItemButton>
                                            </ListItem>
                                        )}
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={logout}>
                                                <ListItemText primary="Logout" />
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                                ) : (
                                    <>
                                        <ListItem disablePadding>
                                            <ListItemButton component={Link} to="/login">
                                                {user && (
                                                    <Button onClick={logout} color="inherit" sx={{ fontWeight: 'bold' }}>
                                                        Logout
                                                    </Button>
                                                )}
                                                {!user && (
                                                    <>
                                                        <AccountCircle style={{ color: "black" }} />
                                                        <Button color="inherit" LinkComponent={Link} to="/login" sx={{ fontWeight: 'bold' }}>
                                                            Login
                                                        </Button>
                                                    </>
                                                )}
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                                )}
                            </List>
                        </Box>
                    </Drawer>

                    {/* Logo and Navbar Links */}
                    <Box style={{ backgroundColor: '#FAF6E3' }} className='content-text' marginLeft={"1rem"} display={["none", "none", "flex"]} sx={{ flexGrow: 1 }}>
                        <img
                            src="src/images/logo.png"
                            alt="logo"
                            style={{ height: "90px", width: "90px" }}
                        />

                        {isAdmin && (
                            <Button color="inherit" LinkComponent={Link} to="/admin/dashboard" sx={{ fontWeight: 'bold' }}>
                                Admin
                            </Button>
                        )}
                    </Box>

                    {/* Profile and Logout/Login Links */}
                    <>
                        {isCustomer && (
                            <>
                                <ShoppingCartIcon style={{ color: "black" }} />
                                <Button color="inherit" LinkComponent={Link} to="/cart" sx={{ fontWeight: 'bold' }}>
                                    Cart
                                </Button>
                                <AccountCircle style={{ color: 'black' }} />
                                <Button color="inherit" sx={{ fontWeight: 'bold' }} LinkComponent={Link} to={`/profile/profile`}>
                                    {user.name}
                                </Button>
                            </>
                        )}
                        {isMerchant && (
                            <>
                                <AccountCircle style={{ color: 'black' }} />
                                <Button color="inherit" sx={{ fontWeight: 'bold' }} LinkComponent={Link} to={`/profile/profile`}>
                                    {user.name}
                                </Button>
                            </>
                        )}

                    </>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
