import React, { useState, useEffect } from 'react'
import { Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Grid, Card, Collapse } from '@mui/material'
import { Link, Routes, Route } from 'react-router-dom'

// Pages
import UserView from './UserView';
import UserEdit from './UserEdit';
import AddMerchant from './AddMerchant';
import OrdersView from './OrdersView';
import OrderItems from './OrderItems';
import PostsView from './PostsView';
import AddAdminPost from './AddAdminPost';
import AdminEditPost from './AdminEditPost';
import CustomerServiceTickets from './CustomerServiceTickets';
import Dashboard from './Dashboard';
import EditMerchant from './EditMerchant';
import AddEmployee from './AddEmployee';
import FoodView from './FoodView'
import ShiftView from './ShiftView'
import PayrollView from './PayrollView'
import ShiftEdit from './ShiftEdit'
import MedicationView from './MedicationView';
import AddFood from './AddFood';
import AnimalQR from './QRCodePages/AnimalQR';
import SupplyQR from './QRCodePages/SupplyQR';
import SupplyDetails from './QRCodePages/SupplyDetails';
import AddAnimal from './AddAnimal';
import ViewAnimals from './ViewAnimals';
import EditAnimal from './EditAnimal';
import AddMedication from './AddMedication';
import AnimalProfile from './AnimalProfile';

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
import { Logout } from '@mui/icons-material';


function ProfileRoutes() {
  const [openUsers, setOpenUsers] = useState(false);
  const [openAnimals, setOpenAnimals] = useState(false);
  const [openInventory, setOpenInventory] = useState(false);
  const [openCases, setOpenCases] = useState(false);
  const [userGroup, setUserGroup] = useState(null);

  const handleToggle = (setOpen) => {
    setOpen((prev) => !prev);
  };
  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        const { tokens } = await fetchAuthSession();
        const groups = tokens.accessToken.payload['cognito:groups'];
        console.log(tokens)
        console.log(groups);
        setUserGroup(groups ? groups[0] : null); // Assuming the user belongs to a single group
      } catch (error) {
        console.error('Error fetching the session', error);
      }
    };

    checkAuthSession();
  }, []);
  const handleLogout = async () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
              {/* Admin-specific items */}
              {userGroup === 'Admins' && (
                <>
                  <ListItemButton onClick={() => handleToggle(setOpenUsers)} sx={{ padding: '17px', height: 'auto' }}>
                    <ListItemIcon sx={{ paddingRight: '30px' }}>
                      {openUsers ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary="Manage Staff" sx={{ paddingLeft: '15px' }} />
                  </ListItemButton>
                  <Collapse in={openUsers} timeout="auto" unmountOnExit>
                    <List component="div">
                      <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/viewusers">
                        <ListItemText primary="View Employees" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/viewshifts">
                        <ListItemText primary="View Shifts" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/payrollview">
                        <ListItemText primary="Payroll Management" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                  <Divider />

                  <ListItemButton onClick={() => handleToggle(setOpenAnimals)} sx={{ padding: '17px', height: 'auto' }}>
                    <ListItemIcon sx={{ paddingRight: '30px' }}>
                      {openAnimals ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary="Manage Animals" sx={{ paddingLeft: '15px' }} />
                  </ListItemButton>
                  <Collapse in={openAnimals} timeout="auto" unmountOnExit>
                    <List component="div">
                      <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/viewanimals">
                        <ListItemText primary="View Animals" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/#viewvets">
                        <ListItemText primary="Animal Data" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                  <Divider />

                  <ListItemButton onClick={() => handleToggle(setOpenInventory)} sx={{ padding: '17px', height: 'auto' }}>
                    <ListItemIcon sx={{ paddingRight: '30px' }}>
                      {openInventory ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary="Manage Inventory" sx={{ paddingLeft: '15px' }} />
                  </ListItemButton>
                  <Collapse in={openInventory} timeout="auto" unmountOnExit>
                    <List component="div">
                      <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/viewmedications">
                        <ListItemText primary="View Medication" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/viewfood">
                        <ListItemText primary="View Food" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                  <Divider />

                  <ListItemButton onClick={() => handleToggle(setOpenCases)} sx={{ padding: '17px', height: 'auto' }}>
                    <ListItemIcon sx={{ paddingRight: '30px' }}>
                      {openCases ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary="Manage Cases" sx={{ paddingLeft: '15px' }} />
                  </ListItemButton>
                  <Collapse in={openCases} timeout="auto" unmountOnExit>
                    <List component="div">
                      <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/uploadtranscripts">
                        <ListItemText primary="View Cases" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </>
              )}
              {/* Vet-specific items */}
              {userGroup === 'Vets' && (
                <>
                  <ListItemButton onClick={() => handleToggle(setOpenCases)} sx={{ padding: '17px', height: 'auto' }}>
                    <ListItemIcon sx={{ paddingRight: '30px' }}>
                      {openCases ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary="Manage Cases" sx={{ paddingLeft: '15px' }} />
                  </ListItemButton>
                  <Collapse in={openCases} timeout="auto" unmountOnExit>
                    <List component="div">
                      <ListItemButton sx={{ pl: 4 }} LinkComponent={Link} to="/admin/uploadtranscripts">
                        <ListItemText primary="View Cases" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </>
              )}
              <ListItem>
                <ListItemButton component={Link} to="/" style={{ paddingLeft: '20px' }} onClick={handleLogout}>
                  <Logout sx={{ marginRight: '10px' }} />
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            {/* Admin-specific routes */}
            {userGroup === 'Admins' && (
              <>
                <Route path="/viewusers/edit/:id" element={<UserEdit />} />
                <Route path='/viewusers' element={<UserView />} />
                <Route path='/viewshifts' element={<ShiftView />} />
                <Route path='/payrollview' element={<PayrollView />} />
                <Route path='/vieworders' element={<OrdersView />} />
                <Route path='/orderitems/:id' element={<OrderItems />} />
                <Route path='/viewposts' element={<PostsView />} />
                <Route path='/addemployee' element={<AddEmployee />} />
                <Route path='/addadminpost' element={<AddAdminPost />} />
                <Route path='/admineditpost/:id' element={<AdminEditPost />} />
                <Route path='/customerserviceticket' element={<CustomerServiceTickets />} />
                <Route path='/addmerchant' element={<AddMerchant />} />
                <Route path='/editmerchant/:id' element={<EditMerchant />} />
                <Route path="/uploadtranscripts" element={<UploadTranscripts />} />
                <Route path="/viewmedications" element={<MedicationView />} />
                <Route path="/addmedication" element={<AddMedication />} />
                <Route path="/viewfood" element={<FoodView />} />
                <Route path="/addfood" element={<AddFood />} />


                <Route path="/supplydetails/:id" element={<SupplyDetails />} />
                <Route path="/supply-qr/:id" element={<SupplyQR /> } />
                <Route path="/viewanimals" element={<ViewAnimals />} />
                <Route path="/addanimal" element={<AddAnimal />} />
                <Route path="/viewanimals/edit/:id" element={<EditAnimal />} />
                <Route path="/animal-qr/:id" element={<AnimalQR />} />
                <Route path="/viewanimals/profile/:id" element={<AnimalProfile />} />

              </>
            )}
            {userGroup === 'Vets' && <Route path="/uploadtranscripts" element={<UploadTranscripts />} />}
          </Routes>
        </Grid>
      </Grid>


    </Container >
  )
}

export default ProfileRoutes