// Import react things
import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import UserContext from './contexts/UserContext.js';

// Import pages
import Home from './Pages/Home';
import AboutUs from './Pages/AboutUs.jsx';
import Donation from './Pages/Donation.jsx';
import Login from './Pages/Login'
import Footer  from './Components/Footer.jsx';
import HowWeOperate from './Pages/HowWeOperate.jsx';

//Other routes
import MerchantRoutes from './Pages/Merchant/MerchantRoutes';
import AdminRoutes from './Pages/Admin/AdminRoutes';

//QR Code pages
import AnimalData from './Pages/Admin/QRCodePages/AnimalData.jsx';

// Import components
import Navbar from './Components/Navbar';
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';

Amplify.configure(config);

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUser(user);
        }
  }, [setUser]);

  const isAdmin = user && user.role === 'Admin';
  const isMerchant = user && user.role === 'Merchant';
  const isCustomer = user && user.role === 'Customer';

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Navbar />
      <ToastContainer />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/supportus" element={<Donation />} />
        <Route path="/howweoperate" element={<HowWeOperate />} />
        <Route path="/animaldata/:id" element={<AnimalData />} />
        {
          isCustomer && (
            <Route path="/profile/*" element={<ProfileRoutes />} />
          )
        }
        {
          isMerchant && (
            <Route path="/profile/*" element={<ProfileRoutes />} />
          )
        }
        {
          isMerchant && (
            <Route path="/merchant/*" element={<MerchantRoutes />} />
          )
        }
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
      <Footer />
    </UserContext.Provider>
  );
}

export default App;
