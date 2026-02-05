import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider,
  Avatar,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Fade,
  Slide,
  Paper,
  alpha,
  Skeleton,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  DirectionsBus as BusIcon,
  EventSeat as SeatIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AttachMoney as MoneyIcon,
  ArrowForward as ArrowIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Wc as OtherIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatTime, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SeatSelection = ({ bus, onClose, onBookingComplete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  // Validate bus data
  useEffect(() => {
    console.log('SeatSelection received bus data:', bus);
    
    if (!bus) {
      setError('Bus information is missing');
      setLoading(false);
      return;
    }

    if (!bus.schedule_id) {
      setError('Schedule ID is missing');
      setLoading(false);
      return;
    }

    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      console.log('Fetching seats for schedule_id:', bus.schedule_id);
      const response = await bookingService.getSeats(bus.schedule_id);
      console.log('Seats API response:', response);
      console.log('Full response.data structure:', response.data);
      
      // Handle different API response structures
      let seatsData = [];
      
      if (response.data) {
        // Check if seats are directly in response.data
        if (Array.isArray(response.data)) {
          seatsData = response.data;
        }
        // Check if seats are nested in response.data.seats
        else if (response.data.seats && Array.isArray(response.data.seats)) {
          seatsData = response.data.seats;
        }
        // Check if seats are in response.data.data
        else if (response.data.data && Array.isArray(response.data.data)) {
          seatsData = response.data.data;
        }
        // If response.data is an object with seat properties, convert to array
        else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
          console.log('Data is object, checking for seats array inside...');
          // Try to find seats array in any property
          const possibleSeatsKeys = ['seats', 'seatList', 'seatData', 'availableSeats'];
          for (const key of possibleSeatsKeys) {
            if (response.data[key] && Array.isArray(response.data[key])) {
              seatsData = response.data[key];
              console.log(`Found seats in response.data.${key}`);
              break;
            }
          }
        }
      }
      
      console.log('Extracted seats data:', seatsData);
      
      if (!Array.isArray(seatsData) || seatsData.length === 0) {
        console.warn('No seats found or invalid format. Full response:', response);
        throw new Error('No seats data available');
      }
      
      setSeats(seatsData);
      setError(null);
    } catch (error) {
      console.error('Fetch seats error:', error);
      setError(error.message || 'Failed to load seats');
      toast.error('Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.is_booked) return;

    const isSelected = selectedSeats.find((s) => s.seat_id === seat.seat_id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seat_id !== seat.seat_id));
      setPassengers(passengers.filter((_, i) => i !== selectedSeats.indexOf(isSelected)));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      setPassengers([...passengers, { name: '', age: '', gender: '' }]);
    }
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleBooking = async () => {
    // Validation
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || !passengers[i].age || !passengers[i].gender) {
        toast.error(`Please fill all details for passenger ${i + 1}`);
        return;
      }
      
      // Validate age is a number
      if (isNaN(passengers[i].age) || passengers[i].age < 1 || passengers[i].age > 120) {
        toast.error(`Please enter a valid age for passenger ${i + 1}`);
        return;
      }
    }

    setBooking(true);
    try {
      const bookingData = {
        schedule_id: bus.schedule_id,
        seat_ids: selectedSeats.map((s) => s.seat_id),
        passengers: passengers.map(p => ({
          name: p.name.trim(),
          age: parseInt(p.age), // Ensure age is a number
          gender: p.gender
        }))
      };

      console.log('📤 Submitting booking:', bookingData);
      console.log('📋 Details:', {
        schedule_id: bookingData.schedule_id,
        seat_ids_count: bookingData.seat_ids.length,
        seat_ids_sample: bookingData.seat_ids[0],
        passengers_count: bookingData.passengers.length,
        first_passenger: bookingData.passengers[0],
        age_type: typeof bookingData.passengers[0]?.age
      });
      console.log('🎫 Selected seats objects:', selectedSeats);
      console.log('👥 Passenger input data:', passengers);
      
      const response = await bookingService.createBooking(bookingData);
      console.log('✅ Booking response:', response);
      
      toast.success('Booking successful!');
      onBookingComplete();
    } catch (error) {
      console.error('❌ Booking error:', error);
      console.error('❌ Error.response:', error.response);
      console.error('❌ Error.response.data:', error.response?.data);
      console.error('❌ Error message:', error.message);
      
      // Show the actual error message from backend
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Booking failed. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setBooking(false);
    }
  };

  // Safe getters with fallbacks
  const getBusNumber = () => {
    return bus?.bus_number || bus?.busNumber || 'N/A';
  };

  const getFromLocation = () => {
    return bus?.from_location || bus?.fromLocation || 'Origin';
  };

  const getToLocation = () => {
    return bus?.to_location || bus?.toLocation || 'Destination';
  };

  const getJourneyDate = () => {
    try {
      return bus?.journey_date ? formatDate(bus.journey_date) : 'N/A';
    } catch (e) {
      console.error('Date format error:', e);
      return 'Invalid Date';
    }
  };

  const getFare = () => {
    const fare = bus?.fare || 0;
    try {
      return formatCurrency(fare);
    } catch (e) {
      console.error('Currency format error:', e);
      return `₹${fare}`;
    }
  };

  const totalAmount = selectedSeats.length * (bus?.fare || 0);

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'Male': return <MaleIcon fontSize="small" />;
      case 'Female': return <FemaleIcon fontSize="small" />;
      default: return <OtherIcon fontSize="small" />;
    }
  };

  // Error state
  if (error && !loading) {
    return (
      <Dialog
        open={true}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'error.light' }}>
              <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Unable to Load Seats
            </Typography>
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Please try again or contact support if the problem persists.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={onClose}>
                Close
              </Button>
              <Button variant="contained" onClick={fetchSeats}>
                Retry
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          maxHeight: '95vh',
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: alpha('#fff', 0.1),
            borderRadius: '50%',
          }
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <BusIcon sx={{ fontSize: 28 }} />
              <Typography variant="h4" fontWeight="800" letterSpacing="-0.5px">
                Select Your Seats
              </Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} mt={2}>
              <Chip
                icon={<LocationIcon />}
                label={`${getFromLocation()} → ${getToLocation()}`}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
              <Chip
                icon={<CalendarIcon />}
                label={getJourneyDate()}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
              <Chip
                icon={<MoneyIcon />}
                label={`${getFare()} per seat`}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            </Stack>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              bgcolor: alpha('#fff', 0.2),
              color: 'white',
              '&:hover': {
                bgcolor: alpha('#fff', 0.3),
                transform: 'rotate(90deg)',
              },
              transition: 'all 0.3s',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Seat Layout Section */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'divider',
                background: 'white',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <SeatIcon color="primary" />
                <Typography variant="h6" fontWeight="700">
                  Choose Your Seats
                </Typography>
              </Stack>

              {/* Legend */}
              <Stack direction="row" spacing={3} mb={4} flexWrap="wrap" gap={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      border: '3px solid',
                      borderColor: 'success.main',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Available
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'primary.main',
                      borderRadius: 1.5,
                      boxShadow: '0 4px 12px rgba(30, 60, 114, 0.3)',
                    }}
                  />
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Selected
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'action.disabledBackground',
                      borderRadius: 1.5,
                    }}
                  />
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Booked
                  </Typography>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {/* Bus Front Indicator */}
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'inline-flex',
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    🚌 DRIVER
                  </Typography>
                </Paper>
              </Box>

              {/* Seats Grid */}
              {loading ? (
                <Grid container spacing={1.5}>
                  {[...Array(20)].map((_, i) => (
                    <Grid item xs={2.4} key={i}>
                      <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1.5 }} />
                    </Grid>
                  ))}
                </Grid>
              ) : seats.length === 0 ? (
                <Alert severity="info">No seats available for this schedule</Alert>
              ) : (
                <Grid container spacing={1.5}>
                  {seats.map((seat) => {
                    const isSelected = selectedSeats.find((s) => s.seat_id === seat.seat_id);
                    return (
                      <Grid item xs={2.4} key={seat.seat_id}>
                        <Button
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.is_booked}
                          fullWidth
                          sx={{
                            height: 56,
                            borderRadius: 1.5,
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            ...(seat.is_booked
                              ? {
                                  bgcolor: 'action.disabledBackground',
                                  color: 'text.disabled',
                                  cursor: 'not-allowed',
                                  '&:hover': {
                                    bgcolor: 'action.disabledBackground',
                                  }
                                }
                              : isSelected
                              ? {
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  boxShadow: '0 4px 12px rgba(30, 60, 114, 0.3)',
                                  transform: 'translateY(-2px)',
                                  '&:hover': {
                                    bgcolor: 'primary.dark',
                                    boxShadow: '0 6px 16px rgba(30, 60, 114, 0.4)',
                                  }
                                }
                              : {
                                  border: '3px solid',
                                  borderColor: 'success.main',
                                  color: 'success.main',
                                  bgcolor: 'background.paper',
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                                  }
                                }),
                          }}
                        >
                          {seat.seat_number}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              )}

              {/* Selected Seats Summary */}
              {selectedSeats.length > 0 && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  }}
                >
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      Selected:
                    </Typography>
                    {selectedSeats.map((seat) => (
                      <Chip
                        key={seat.seat_id}
                        label={seat.seat_number}
                        size="small"
                        color="primary"
                        onDelete={() => toggleSeat(seat)}
                        sx={{ fontWeight: 600 }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Passenger Details Section */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'divider',
                background: 'white',
                position: 'sticky',
                top: 20,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight="700">
                  Passenger Details
                </Typography>
              </Stack>

              {selectedSeats.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                  }}
                >
                  <SeatIcon sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Select seats to enter passenger details
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={3}>
                  {selectedSeats.map((seat, index) => (
                    <Fade in={true} key={seat.seat_id} timeout={300 + index * 100}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          borderWidth: 2,
                          borderColor: 'divider',
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Chip
                              icon={<SeatIcon />}
                              label={`Seat ${seat.seat_number}`}
                              color="primary"
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                              }}
                            >
                              {index + 1}
                            </Avatar>
                          </Stack>

                          <Stack spacing={2}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Full Name"
                              placeholder="Enter passenger name"
                              value={passengers[index]?.name || ''}
                              onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                              InputProps={{
                                startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} fontSize="small" />,
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1.5,
                                }
                              }}
                            />
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  type="number"
                                  label="Age"
                                  placeholder="Age"
                                  value={passengers[index]?.age || ''}
                                  onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                                  inputProps={{ min: 1, max: 120 }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1.5,
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Gender</InputLabel>
                                  <Select
                                    value={passengers[index]?.gender || ''}
                                    label="Gender"
                                    onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                                    sx={{
                                      borderRadius: 1.5,
                                    }}
                                  >
                                    <MenuItem value="Male">
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <MaleIcon fontSize="small" />
                                        <span>Male</span>
                                      </Stack>
                                    </MenuItem>
                                    <MenuItem value="Female">
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <FemaleIcon fontSize="small" />
                                        <span>Female</span>
                                      </Stack>
                                    </MenuItem>
                                    <MenuItem value="Other">
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <OtherIcon fontSize="small" />
                                        <span>Other</span>
                                      </Stack>
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Fade>
                  ))}
                </Stack>
              )}

              {/* Total & Book Button */}
              {selectedSeats.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1" fontWeight={600} color="text.secondary">
                        Seats Selected:
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {selectedSeats.length}
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1" fontWeight={600} color="text.secondary">
                        Fare per Seat:
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {getFare()}
                      </Typography>
                    </Stack>

                    <Divider />
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight={700}>
                        Total Amount:
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {formatCurrency(totalAmount)}
                      </Typography>
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      endIcon={<ArrowIcon />}
                      onClick={handleBooking}
                      disabled={booking}
                      sx={{
                        mt: 2,
                        py: 2,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        boxShadow: '0 8px 24px rgba(30, 60, 114, 0.3)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 12px 32px rgba(30, 60, 114, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        '&:disabled': {
                          background: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
                        }
                      }}
                    >
                      {booking ? 'Processing Booking...' : 'Confirm Booking'}
                    </Button>
                  </Stack>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SeatSelection;