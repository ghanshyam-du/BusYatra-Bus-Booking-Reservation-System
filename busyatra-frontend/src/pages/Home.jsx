import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import {
  DirectionsBus,
  ArrowForward,
  LocationOn,
  CalendarMonth,
  ConfirmationNumber,
} from '@mui/icons-material';

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff, #ffffff, #faf5ff)',
      }}
    >
      {/* NAVBAR */}
      <AppBar
        position="static"
        elevation={1}
        sx={{ bgcolor: '#fff', color: '#000' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <DirectionsBus color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5" fontWeight={700}>
                BusYatra
              </Typography>
            </Box>

            <Box display="flex" gap={2}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{ fontWeight: 600 }}
              >
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* HERO SECTION */}
      <Container maxWidth="lg">
        <Box textAlign="center" py={{ xs: 10, md: 16 }}>
          <Typography
            variant="h2"
            fontWeight={800}
            mb={3}
            sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            Your Journey Begins Here
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="700px"
            mx="auto"
            mb={6}
          >
            Book bus tickets across India with ease. Fast, secure, and
            convenient travel solutions at your fingertips.
          </Typography>

          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.8,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Get Started
          </Button>
        </Box>
      </Container>

      {/* FEATURES */}
      <Container maxWidth="lg">
        <Grid container spacing={4} pb={12}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <LocationOn color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" fontWeight={700} mb={1}>
                Pan-India Coverage
              </Typography>
              <Typography color="text.secondary">
                Travel to any destination across India
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <CalendarMonth color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" fontWeight={700} mb={1}>
                Easy Booking
              </Typography>
              <Typography color="text.secondary">
                Book your seats in just a few clicks
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <ConfirmationNumber
                color="primary"
                sx={{ fontSize: 48, mb: 2 }}
              />
              <Typography variant="h6" fontWeight={700} mb={1}>
                Instant Confirmation
              </Typography>
              <Typography color="text.secondary">
                Get booking confirmation immediately
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
