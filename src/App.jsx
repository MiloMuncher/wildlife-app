// Import react things
import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import UserContext from './contexts/UserContext.js';

// Import pages
import Home from './Pages/Home';
import Categories from './Pages/Categories';
import AboutUs from './Pages/AboutUs.jsx';
import Donation from './Pages/Donation.jsx';
import AddPost from './Pages/AddPost';
import Description from './Pages/Description';
import RaisedRequest from './Pages/RaisedRequest';
import Cart from './Pages/Cart';
import Login from './Pages/Login'
import Footer  from './Components/Footer.jsx';

//Other routes
import MerchantRoutes from './Pages/Merchant/MerchantRoutes';
import AdminRoutes from './Pages/Admin/AdminRoutes';

// Import components
import Navbar from './Components/Navbar';
import Checkout_Success from './Pages/Checkout_Success.jsx';

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
        <Route path="/categories" element={<Categories />} />
        <Route path="/description/:id" element={<Description />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/supportus" element={<Donation />} />


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
        <Route path="/addpost" element={<AddPost />} />
        <Route path="/contactus/raisedrequest" element={<RaisedRequest />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<Checkout_Success />} />

      </Routes>
      <Footer />
    </UserContext.Provider>
  );
}

export default App;
