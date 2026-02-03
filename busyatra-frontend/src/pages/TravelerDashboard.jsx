import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Container,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  DirectionsBus,
  CalendarMonth,
  ConfirmationNumber,
  SupportAgent,
  BarChart,
  Logout,
  Menu as MenuIcon,
  AccountCircle,
  Add,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import BusList from '../components/traveler/BusList';
import AddBus from '../components/traveler/AddBus';
import EditBus from '../components/traveler/EditBus';
import ScheduleList from '../components/traveler/ScheduleList';
import AddSchedule from '../components/traveler/AddSchedule';
import BookingAnalytics from '../components/traveler/BookingAnalytics';
import SupportTickets from '../components/traveler/SupportTickets';

const DRAWER_WIDTH = 280;

const TravelerDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/traveler' && location.pathname === '/traveler') return true;
    return location.pathname.includes(path) && path !== '/traveler';
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/traveler',
      badge: null,
    },
    {
      text: 'My Buses',
      icon: <DirectionsBus />,
      path: '/traveler/buses',
      badge: null,
    },
    {
      text: 'Schedules',
      icon: <CalendarMonth />,
      path: '/traveler/schedules',
      badge: null,
    },
    {
      text: 'Bookings',
      icon: <BarChart />,
      path: '/traveler/bookings',
      badge: null,
    },
    {
      text: 'Support Tickets',
      icon: <SupportAgent />,
      path: '/traveler/tickets',
      badge: 3,
    },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <DirectionsBus sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              BusYatra
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Traveler Portal
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Bus Operator"
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 500,
          }}
        />
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 2, px: 2 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) handleDrawerToggle();
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: active ? 'primary.main' : 'transparent',
                  color: active ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: active ? 'primary.dark' : 'action.hover',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? 'white' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                    fontSize: '0.95rem',
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 20,
                      bgcolor: active ? 'white' : 'error.main',
                      color: active ? 'primary.main' : 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Profile Section */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 44,
              height: 44,
              fontWeight: 'bold',
            }}
          >
            {user?.full_name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.full_name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1 }} />

          {/* Welcome Message */}
          <Typography
            variant="body2"
            sx={{ mr: 2, display: { xs: 'none', sm: 'block' }, color: 'text.secondary' }}
          >
            Welcome back, <strong>{user?.full_name}</strong>
          </Typography>

          {/* User Menu */}
          <IconButton onClick={handleMenuOpen} sx={{ color: 'text.primary' }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '1rem',
              }}
            >
              {user?.full_name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" fontWeight={600}>
                {user?.full_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleMenuClose(); navigate('/traveler/profile'); }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: 1,
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Routes>
            <Route index element={<BusList />} />
            <Route path="buses" element={<BusList />} />
            <Route path="add-bus" element={<AddBus />} />
            <Route path="edit-bus/:busId" element={<EditBus />} />
            <Route path="schedules" element={<ScheduleList />} />
            <Route path="add-schedule" element={<AddSchedule />} />
            <Route path="bookings" element={<BookingAnalytics />} />
            <Route path="tickets" element={<SupportTickets />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default TravelerDashboard;