import React, { useState, useEffect } from 'react'
import { Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Grid, Card, Collapse } from '@mui/material'
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'



// Pages
import UserView from "./UserView";
import UserEdit from "./UserEdit";
import OrderItems from "./OrderItems";
import PostsView from "./PostsView";
import Dashboard from "./Dashboard";

// Employee Pages
import AddEmployee from "./AddEmployee";
import ShiftView from "./ShiftView";
import PayrollView from "./PayrollView";
import ShiftEdit from "./ShiftEdit";

// Animal Pages
import AddAnimal from "./AddAnimal";
import ViewAnimals from "./ViewAnimals";
import EditAnimal from "./EditAnimal";
import AnimalProfile from "./AnimalProfile";
import AnimalQR from "./QRCodePages/AnimalQR";

// Inventory Pages
import FoodView from "./FoodView";
import AddFood from "./AddFood";
import FoodEdit from './FoodEdit';

import MedicationView from "./MedicationView";
import AddMedication from './AddMedication';
import ViewAnimalsInSanctuary from "./ViewAnimalsInSanctuary";
import EditAnimalInSanctuary from "./EditAnimalSanctuaryDetails";

// Icons
import CreateIcon from "@mui/icons-material/Create";
import EventIcon from "@mui/icons-material/Event";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { fetchAuthSession } from "aws-amplify/auth";
import UploadTranscripts from "./UploadTranscripts";
import InventoryIcon from "@mui/icons-material/Inventory";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Logout } from "@mui/icons-material";

function ProfileRoutes() {
  const [openUsers, setOpenUsers] = useState(false);
  const [openAnimals, setOpenAnimals] = useState(false);
  const [openInventory, setOpenInventory] = useState(false);
  const [openCases, setOpenCases] = useState(false);
  const [userGroup, setUserGroup] = useState(null);
  const navigate = useNavigate();

  const handleToggle = (setOpen) => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    
    const checkAuthSession = async () => {
      try {
        const { tokens } = await fetchAuthSession();
        const groups = tokens.accessToken.payload['cognito:groups'];

        if (!groups || groups.length === 0) {
          const previousPage = sessionStorage.getItem('previousPage') || '/';
          navigate(previousPage); // Navigate back to the previous page
        } else {
          setUserGroup(groups[0]); // Assuming the user belongs to a single group
        }
      } catch (error) {
        console.error('Error fetching the session', error);
        navigate('/'); // Redirect in case of an error (e.g., session expired)
      }
    };

    checkAuthSession();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} marginTop={10}>
        <Grid item xs={12} sm={3}>
          <Card>
            <List>

              {/* Admin-specific items */}
              {userGroup === "Admins" && (
                <>
                <ListItem>
                <ListItemIcon>
                  <DashboardIcon color="primary" />
                </ListItemIcon>
                <ListItemButton LinkComponent={Link} to="/admin/dashboard">
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <Divider />
                  <ListItemButton
                    onClick={() => handleToggle(setOpenUsers)}
                    sx={{ padding: "17px", height: "auto" }}
                  >
                    <ListItemIcon sx={{ paddingRight: "30px" }}>
                      {openUsers ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Manage Staff"
                      sx={{ paddingLeft: "15px" }}
                    />
                  </ListItemButton>
                  <Collapse in={openUsers} timeout="auto" unmountOnExit>
                    <List component="div">
                      <ListItemButton
                        sx={{ pl: 4 }}
                        LinkComponent={Link}
                        to="/admin/viewusers"
                      >
                        <ListItemText primary="View Employees" />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        LinkComponent={Link}
                        to="/admin/viewshifts"
                      >
                        <ListItemText primary="View Shifts" />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        LinkComponent={Link}
                        to="/admin/payrollview"
                      >
                        <ListItemText primary="Payroll Management" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                  <Divider />

                  <ListItemButton
                    onClick={() => handleToggle(setOpenAnimals)}
                    sx={{ padding: "17px", height: "auto" }}
                  >
                    <ListItemIcon sx={{ paddingRight: "30px" }}>
                      {openAnimals ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Manage Animals"
                      sx={{ paddingLeft: "15px" }}
                    />
                  </ListItemButton>
                  <Collapse in={openAnimals} timeout="auto" unmountOnExit>
                    <List component="div">
                      <ListItemButton
                        sx={{ pl: 4 }}
                        LinkComponent={Link}
                        to="/admin/viewanimals"
                      >
                        <ListItemText primary="View Animals" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                  <Divider />

                  <ListItemButton
                    onClick={() => handleToggle(setOpenInventory)}
                    sx={{ padding: "17px", height: "auto" }}
                  >
                    <ListItemIcon sx={{ paddingRight: "30px" }}>
                      {openInventory ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Manage Inventory"
                      sx={{ paddingLeft: "15px" }}
                    />
                  </ListItemButton>
                  <Collapse in={openInventory} timeout="auto" unmountOnExit>
                    <List component="div">
                      <ListItemButton
                        sx={{ pl: 4 }}
                        LinkComponent={Link}
                        to="/admin/viewmedications"
                      >
                        <ListItemText primary="View Medication" />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        LinkComponent={Link}
                        to="/admin/viewfood"
                      >
                        <ListItemText primary="View Food" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                  <Divider />

                  <ListItemButton
                    onClick={() => handleToggle(setOpenCases)}
                    sx={{ padding: "17px", height: "auto" }}
                  >
                    <ListItemIcon sx={{ paddingRight: "30px" }}>
                      {openCases ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Manage Cases"
                      sx={{ paddingLeft: "15px" }}
                    />
                  </ListItemButton>
                  <Collapse in={openCases} timeout="auto" unmountOnExit>
                    <List component="div">
                      <ListItemButton
                        sx={{ pl: 4 }}
                        LinkComponent={Link}
                        to="/admin/uploadtranscripts"
                      >
                        <ListItemText primary="View Cases" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </>
              )}
              {/* Vet-specific items */}
              {userGroup === "Vets" && (
                <>
                  <ListItemButton
                    onClick={() => handleToggle(setOpenCases)}
                    sx={{ padding: "17px", height: "auto" }}
                  >
                    <ListItemIcon sx={{ paddingRight: "30px" }}>
                      {openCases ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Manage Cases"
                      sx={{ paddingLeft: "15px" }}
                    />
                  </ListItemButton>
                  <Collapse in={openCases} timeout="auto" unmountOnExit>
                    <List component="div">
                      <ListItemButton
                        sx={{ pl: 4 }}
                        LinkComponent={Link}
                        to="/admin/uploadtranscripts"
                      >
                        <ListItemText primary="View Cases" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </>
              )}

              {userGroup === 'Suppliers' && (
                <>
                  <ListItemButton sx={{ padding: '17px', height: 'auto' }} LinkComponent={Link} to="/admin/viewmedications">
                    <ListItemText primary="View Medication" />
                  </ListItemButton>
                  <ListItemButton sx={{ padding: '17px', height: 'auto' }} LinkComponent={Link} to="/admin/viewfood">
                    <ListItemText primary="View Food" />
                  </ListItemButton>
                  <Divider />
                </>
              )}
              <ListItem>
                <ListItemButton
                  component={Link}
                  to="/"
                  style={{ paddingLeft: "20px" }}
                  onClick={handleLogout}
                >
                  <Logout sx={{ marginRight: "10px" }} />
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Routes>
            {/* Admin-specific routes */}
            {userGroup === "Admins" && (
              <>
              <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/viewusers/edit/:id" element={<UserEdit />} />
                <Route path="/viewusers" element={<UserView />} />
                <Route path="/viewshifts" element={<ShiftView />} />
                <Route path="/payrollview" element={<PayrollView />} />
                <Route path="/orderitems/:id" element={<OrderItems />} />
                <Route path="/viewposts" element={<PostsView />} />
                <Route path="/addemployee" element={<AddEmployee />} />

                <Route
                  path="/uploadtranscripts"
                  element={<UploadTranscripts />}
                />
                <Route path="/viewmedications" element={<MedicationView />} />
                <Route path="/addmedication" element={<AddMedication />} />
                <Route path="/viewfood" element={<FoodView />} />
                <Route path="/addfood" element={<AddFood />} />
                <Route path="/viewfood/edit/:id" element={<FoodEdit />} />
                <Route path="/viewmedications/edit/:id" element={<MedicationEdit />} />

                <Route path="/viewanimals" element={<ViewAnimals />} />
                <Route path="/addanimal" element={<AddAnimal />} />
                <Route path="/viewanimals/edit/:id" element={<EditAnimal />} />
                <Route
                  path="/viewanimals/profile/:id"
                  element={<AnimalProfile />}
                />
                <Route path="/animal-qr/:id" element={<AnimalQR />} />
              </>
            )}
            {userGroup === "Vets" && (
              <Route
                path="/uploadtranscripts"
                element={<UploadTranscripts />}
              />
            )}

            {userGroup === "Suppliers" && (
              <>
                <Route path="/viewmedications" element={<MedicationView />} />
                <Route path="/viewfood" element={<FoodView />} />
                <Route path="/supply-qr/:id" element={<SupplyQR /> } />
              </>
            )}
          </Routes>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProfileRoutes;
