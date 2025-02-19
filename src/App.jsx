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
import HowWeOperate from './Pages/HowWeOperate.jsx';
import OurSanctuary from './Pages/OurSanctuary.jsx';

//Other routes
import AdminRoutes from './Pages/Admin/AdminRoutes';

//QR Code pages
import AnimalData from './Pages/Admin/QRCodePages/AnimalData.jsx';
import FoodDetails from './Pages/Admin/QRCodePages/FoodDetails.jsx';
import MedicationDetails from './Pages/Admin/QRCodePages/MedicationDetails.jsx';
import SupplySuccess from './Pages/Admin/QRCodePages/SuccessPage.jsx';

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
      <ToastContainer />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/supportus" element={<Donation />} />
        <Route path="/howweoperate" element={<HowWeOperate />} />
        <Route path="/oursanctuary" element={<OurSanctuary />} />
        <Route path="/animaldata/:id/:email" element={<AnimalData />} />
        <Route path="/fooddetails/:id" element={<FoodDetails />} />
        <Route path="/meddetails/:id" element={<MedicationDetails />} />
        <Route path="/supply-success" element={<SupplySuccess />} />
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
    </UserContext.Provider>
  );
}

export default App;
