import React, { useEffect, useState } from 'react';
import { Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Grid, Card } from '@mui/material';
import { Link, Routes, Route } from 'react-router-dom';

// Pages
import UserView from './UserView';
import UserEdit from './UserEdit';
import MerchantView from './VetView';
import AddMerchant from './AddMerchant';
import OrdersView from './OrdersView';
import OrderItems from './OrderItems';
import PostsView from './PostsView';
import AddAdminPost from './AddAdminPost';
import AdminEditPost from './AdminEditPost';
import CustomerServiceTickets from './CustomerServiceTickets';
import Dashboard from './Dashboard';
import EditMerchant from './EditMerchant';

// Icons
import CreateIcon from '@mui/icons-material/Create';
import EventIcon from '@mui/icons-material/Event';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { fetchAuthSession } from 'aws-amplify/auth';
import UploadTranscripts from './UploadTranscripts';

function ProfileRoutes() {
  const [userGroup, setUserGroup] = useState(null);

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

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} marginTop={10}>
        <Grid item xs={12} sm={3}>
          <Card>
            <List>
              {/* Dashboard is visible to all */}
              <ListItem>
                <ListItemIcon>
                  <DashboardIcon color="primary" />
                </ListItemIcon>
                <ListItemButton component={Link} to="/admin/dashboard">
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <Divider />

              {/* Admin-specific items */}
              {userGroup === 'Admins' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <CreateIcon color="primary" />
                    </ListItemIcon>
                    <ListItemButton component={Link} to="/admin/viewusers">
                      <ListItemText primary="View All Users" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <CreateIcon color="primary" />
                    </ListItemIcon>
                    <ListItemButton component={Link} to="/admin/viewmerchant">
                      <ListItemText primary="View All Vets" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemButton component={Link} to="/admin/vieworders">
                      <ListItemText primary="View All Orders" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <ChatBubbleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemButton component={Link} to="/admin/viewposts">
                      <ListItemText primary="View All Posts" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <ConfirmationNumberIcon color="primary" />
                    </ListItemIcon>
                    <ListItemButton component={Link} to="/admin/customerserviceticket">
                      <ListItemText primary="View Customer Service Tickets" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              )}

              {/* Vet-specific items */}
              {userGroup === 'Vets' &&  (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemButton component={Link} to="/admin/uploadtranscripts">
                      <ListItemText primary="Upload Transcripts" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              )}
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Routes>
            {/* Routes visible to all */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin-specific routes */}
            {userGroup === 'Admins' && (
              <>
                <Route path="/viewusers/edit/:id" element={<UserEdit />} />
                <Route path="/viewusers" element={<UserView />} />
                <Route path="/vieworders" element={<OrdersView />} />
                <Route path="/orderitems/:id" element={<OrderItems />} />
                <Route path="/viewposts" element={<PostsView />} />
                <Route path="/addadminpost" element={<AddAdminPost />} />
                <Route path="/admineditpost/:id" element={<AdminEditPost />} />
                <Route path="/customerserviceticket" element={<CustomerServiceTickets />} />
                <Route path="/viewmerchant" element={<MerchantView />} />
                <Route path="/addmerchant" element={<AddMerchant />} />
                <Route path="/editmerchant/:id" element={<EditMerchant />} />
              </>
            )}

            {/* Vet-specific routes */}
            {userGroup === 'Vets' && <Route path="/uploadtranscripts" element={<UploadTranscripts />} />}
          </Routes>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProfileRoutes;
