import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search,
  ConfirmationNumber,
  Person,
  Logout,
  DirectionsBus,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import BusSearch from '../components/customer/BusSearch';
import MyBookings from '../components/customer/MyBookings';
import UserProfile from '../components/customer/UserProfile';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* NAVBAR */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: '#fff', color: '#000' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <DirectionsBus color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5" fontWeight={700}>
                BusYatra
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={3}>
              <Typography color="text.secondary">
                Hi, <strong>{user?.full_name}</strong>
              </Typography>

              <Button
                color="error"
                startIcon={<Logout />}
                onClick={logout}
                sx={{ fontWeight: 600 }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* CONTENT */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" gap={3}>
          {/* SIDEBAR */}
          <Paper
            elevation={2}
            sx={{
              width: 260,
              borderRadius: 2,
              p: 1,
              height: 'fit-content',
            }}
          >
            <List>
              <ListItemButton
                component={Link}
                to="/customer"
                selected={location.pathname === '/customer'}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                  },
                }}
              >
                <ListItemIcon>
                  <Search />
                </ListItemIcon>
                <ListItemText primary="Search Buses" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/customer/bookings"
                selected={isActive('/bookings')}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                  },
                }}
              >
                <ListItemIcon>
                  <ConfirmationNumber />
                </ListItemIcon>
                <ListItemText primary="My Bookings" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/customer/profile"
                selected={isActive('/profile')}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                  },
                }}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </List>
          </Paper>

          {/* MAIN CONTENT */}
          <Box flex={1}>
            <Routes>
              <Route index element={<BusSearch />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="profile" element={<UserProfile />} />
            </Routes>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CustomerDashboard;
