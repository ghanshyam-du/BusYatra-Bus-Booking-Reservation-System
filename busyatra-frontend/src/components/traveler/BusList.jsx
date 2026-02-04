import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Stack,
  Divider,
  Avatar,
  Skeleton,
  Alert,
  Tooltip,
  Fade,
  Container,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  DirectionsBus,
  LocationOn,
  EventSeat,
  CurrencyRupee,
  Wifi,
  BatteryCharging80,
  LocalDrink,
  Bed,
  Tv,
  Lightbulb,
  ExitToApp,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

const BusList = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await travelerService.getBuses();
      const busData = response.data;
      if (Array.isArray(busData)) {
        setBuses(busData);
      } else {
        console.error('Expected array but got:', busData);
        setBuses([]);
      }
    } catch (error) {
      toast.error('Failed to load buses');
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (busId) => {
    if (!window.confirm('Are you sure you want to delete this bus? This will cancel all future schedules.')) return;

    try {
      await travelerService.deleteBus(busId);
      toast.success('Bus deleted successfully');
      fetchBuses();
    } catch (error) {
      toast.error(error.message || 'Failed to delete bus');
    }
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': <Wifi fontSize="small" />,
      'Charging Port': <BatteryCharging80 fontSize="small" />,
      'Water Bottle': <LocalDrink fontSize="small" />,
      'Blanket': <Bed fontSize="small" />,
      'TV': <Tv fontSize="small" />,
      'Reading Light': <Lightbulb fontSize="small" />,
      'Emergency Exit': <ExitToApp fontSize="small" />
    };
    return icons[amenity] || null;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 3, borderRadius: 2 }} />
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} key={item}>
                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  My Bus Fleet
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Manage and monitor your buses
                </Typography>
                <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {buses.length}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Total Buses
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {buses.filter(b => b.is_active).length}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Active
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Button
                component={Link}
                to="/traveler/add-bus"
                variant="contained"
                size="large"
                startIcon={<Add />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Add New Bus
              </Button>
            </Stack>
          </Box>
          
          {/* Decorative Elements */}
          <DirectionsBus
            sx={{
              position: 'absolute',
              right: -50,
              bottom: -50,
              fontSize: 300,
              opacity: 0.1,
              transform: 'rotate(-15deg)',
            }}
          />
        </Paper>

        {/* Bus List */}
        {buses.length === 0 ? (
          <Fade in={true}>
            <Paper
              elevation={2}
              sx={{
                p: 8,
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)',
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  bgcolor: 'white',
                  boxShadow: 3,
                }}
              >
                <DirectionsBus sx={{ fontSize: 60, color: 'primary.main' }} />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
                No Buses Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                Start building your fleet by adding your first bus. Once added, you can create schedules and start accepting bookings.
              </Typography>
              <Button
                component={Link}
                to="/traveler/add-bus"
                variant="contained"
                size="large"
                startIcon={<Add />}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Add Your First Bus
              </Button>
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {buses.map((bus, index) => (
              <Grid item xs={12} key={bus.bus_id}>
                <Fade in={true} timeout={300 * (index + 1)}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      border: '2px solid transparent',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        {/* Bus Icon */}
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: bus.is_active ? 'success.main' : 'grey.400',
                            boxShadow: 3,
                          }}
                        >
                          <DirectionsBus sx={{ fontSize: 40 }} />
                        </Avatar>

                        {/* Main Content */}
                        <Box sx={{ flex: 1 }}>
                          {/* Header */}
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box>
                              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                <Typography variant="h4" fontWeight="bold">
                                  {bus.bus_number}
                                </Typography>
                                <Chip
                                  icon={bus.is_active ? <CheckCircle /> : <Cancel />}
                                  label={bus.is_active ? 'Active' : 'Inactive'}
                                  color={bus.is_active ? 'success' : 'default'}
                                  size="small"
                                  sx={{ fontWeight: 'bold' }}
                                />
                              </Stack>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip
                                  label={bus.bus_type}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                />
                                {bus.bus_model && (
                                  <Chip
                                    label={bus.bus_model}
                                    variant="outlined"
                                    size="small"
                                  />
                                )}
                              </Stack>
                            </Box>

                            {/* Action Buttons */}
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Edit Bus" arrow>
                                <IconButton
                                  component={Link}
                                  to={`/traveler/edit-bus/${bus.bus_id}`}
                                  sx={{
                                    bgcolor: 'primary.50',
                                    color: 'primary.main',
                                    '&:hover': {
                                      bgcolor: 'primary.100',
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Bus" arrow>
                                <IconButton
                                  onClick={() => handleDelete(bus.bus_id)}
                                  sx={{
                                    bgcolor: 'error.50',
                                    color: 'error.main',
                                    '&:hover': {
                                      bgcolor: 'error.100',
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>

                          <Divider sx={{ my: 2 }} />

                          {/* Bus Details Grid */}
                          <Grid container spacing={3} sx={{ mb: 3 }}>
                            {/* From Location */}
                            <Grid item xs={12} sm={6} md={3}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  bgcolor: 'success.50',
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'success.200',
                                }}
                              >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <LocationOn color="success" />
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      From
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold" color="success.dark">
                                      {bus.from_location}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Paper>
                            </Grid>

                            {/* To Location */}
                            <Grid item xs={12} sm={6} md={3}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  bgcolor: 'error.50',
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'error.200',
                                }}
                              >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <LocationOn color="error" />
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      To
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold" color="error.dark">
                                      {bus.to_location}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Paper>
                            </Grid>

                            {/* Total Seats */}
                            <Grid item xs={12} sm={6} md={3}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  bgcolor: 'info.50',
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'info.200',
                                }}
                              >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <EventSeat color="info" />
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      Capacity
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold" color="info.dark">
                                      {bus.total_seats} Seats
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Paper>
                            </Grid>

                            {/* Fare */}
                            <Grid item xs={12} sm={6} md={3}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  bgcolor: 'warning.50',
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'warning.200',
                                }}
                              >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <CurrencyRupee color="warning" />
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      Fare per Seat
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold" color="warning.dark">
                                      {formatCurrency(bus.fare)}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Paper>
                            </Grid>
                          </Grid>

                          {/* Amenities */}
                          {bus.amenities && bus.amenities.length > 0 && (
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>
                                Available Amenities:
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {bus.amenities.map((amenity, idx) => (
                                  <Chip
                                    key={idx}
                                    icon={getAmenityIcon(amenity)}
                                    label={amenity}
                                    size="small"
                                    sx={{
                                      bgcolor: 'grey.100',
                                      fontWeight: 500,
                                      '& .MuiChip-icon': {
                                        color: 'primary.main',
                                      },
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default BusList;