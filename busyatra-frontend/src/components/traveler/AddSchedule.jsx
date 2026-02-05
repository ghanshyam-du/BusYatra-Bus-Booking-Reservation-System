import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Alert,
  IconButton,
  Stack,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Chip,
  Avatar,
  InputAdornment,
  Fade,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  DirectionsBus as BusIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  EventAvailable as EventAvailableIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  EventSeat as EventSeatIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

// Styled Components
const HeaderBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    transform: 'translate(30%, -30%)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid',
  borderColor: theme.palette.divider,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.3s',
    '&:hover': {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
    },
  },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.info.light}15 0%, ${theme.palette.info.light}25 100%)`,
  border: `2px solid ${theme.palette.info.light}`,
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
}));

const AddSchedule = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    bus_id: '',
    journey_date: '',
    departure_time: '',
    arrival_time: ''
  });

  const steps = ['Select Bus', 'Set Date & Time', 'Review & Create'];

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await travelerService.getBuses();
      setBuses(response.data?.filter(b => b.is_active) || []);
    } catch (error) {
      toast.error('Failed to load buses');
    }
  };

  // Time validation helper (HH:MM format)
  const isValidTimeFormat = (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // Validate journey date is not in the past
  const validateJourneyDate = (date) => {
    if (!date) return 'Journey date is required';
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return 'Journey date cannot be in the past';
    }
    return null;
  };

  // Validate time format
  const validateTime = (time, fieldName) => {
    if (!time) return `${fieldName} is required`;
    if (!isValidTimeFormat(time)) {
      return 'Please enter valid time format (HH:MM)';
    }
    return null;
  };

  // Validate arrival time is after departure time
  const validateTimeSequence = (departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return null;

    const [depHour, depMin] = departureTime.split(':').map(Number);
    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);

    const depMinutes = depHour * 60 + depMin;
    const arrMinutes = arrHour * 60 + arrMin;

    if (arrMinutes <= depMinutes) {
      return 'Arrival time must be after departure time';
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    setErrors({ ...errors, [name]: null });

    // Auto-fill times from selected bus
    if (name === 'bus_id' && value) {
      const selectedBus = buses.find(b => b.bus_id === value);
      if (selectedBus) {
        setFormData(prev => ({
          ...prev,
          bus_id: value,
          departure_time: selectedBus.departure_time,
          arrival_time: selectedBus.arrival_time
        }));
        setErrors({});
        setActiveStep(1); // Move to next step
      }
    }

    // Real-time validation
    if (name === 'journey_date') {
      const dateError = validateJourneyDate(value);
      if (dateError) {
        setErrors(prev => ({ ...prev, journey_date: dateError }));
      }
    }

    if (name === 'departure_time') {
      const timeError = validateTime(value, 'Departure time');
      if (timeError) {
        setErrors(prev => ({ ...prev, departure_time: timeError }));
      } else if (formData.arrival_time) {
        const seqError = validateTimeSequence(value, formData.arrival_time);
        setErrors(prev => ({ ...prev, time_sequence: seqError }));
      }
    }

    if (name === 'arrival_time') {
      const timeError = validateTime(value, 'Arrival time');
      if (timeError) {
        setErrors(prev => ({ ...prev, arrival_time: timeError }));
      } else if (formData.departure_time) {
        const seqError = validateTimeSequence(formData.departure_time, value);
        setErrors(prev => ({ ...prev, time_sequence: seqError }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate bus_id
    if (!formData.bus_id) {
      newErrors.bus_id = 'Bus selection is required';
    }

    // Validate journey_date
    const dateError = validateJourneyDate(formData.journey_date);
    if (dateError) {
      newErrors.journey_date = dateError;
    }

    // Validate departure_time
    const depTimeError = validateTime(formData.departure_time, 'Departure time');
    if (depTimeError) {
      newErrors.departure_time = depTimeError;
    }

    // Validate arrival_time
    const arrTimeError = validateTime(formData.arrival_time, 'Arrival time');
    if (arrTimeError) {
      newErrors.arrival_time = arrTimeError;
    }

    // Validate time sequence
    if (!depTimeError && !arrTimeError) {
      const seqError = validateTimeSequence(formData.departure_time, formData.arrival_time);
      if (seqError) {
        newErrors.time_sequence = seqError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!validateForm()) {
      toast.error('Please fix all validation errors');
      return;
    }

    setLoading(true);
    try {
      // The backend will auto-generate:
      // - schedule_id
      // - total_seats (from bus)
      // - available_seats (equals total_seats)
      // - booked_seats (defaults to 0)
      // - schedule_status (defaults to 'ACTIVE')
      
      await travelerService.createSchedule(formData);
      toast.success('Schedule created successfully! Seats auto-generated.');
      navigate('/traveler/schedules');
    } catch (error) {
      toast.error(error.message || 'Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const selectedBus = buses.find(b => b.bus_id === formData.bus_id);

  const canProceed = () => {
    if (activeStep === 0) return formData.bus_id !== '';
    if (activeStep === 1) {
      return formData.journey_date && 
             formData.departure_time && 
             formData.arrival_time &&
             !errors.journey_date &&
             !errors.departure_time &&
             !errors.arrival_time &&
             !errors.time_sequence;
    }
    return true;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <HeaderBox>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <IconButton
            onClick={() => navigate('/traveler/schedules')}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box flex={1}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Create New Schedule
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95 }}>
              Schedule a bus journey with automatic seat generation
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <ScheduleIcon sx={{ fontSize: 45 }} />
          </Avatar>
        </Stack>
      </HeaderBox>

      {/* Stepper */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'grey.50' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': {
                      color: 'primary.main',
                    },
                    '&.Mui-completed': {
                      color: 'success.main',
                    },
                  },
                }}
              >
                <Typography variant="body2" fontWeight="medium">
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Form Card */}
      <Fade in={true}>
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Step 1: Select Bus */}
                {activeStep >= 0 && (
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                      <BusIcon color="primary" />
                      <Typography variant="h5" fontWeight="bold">
                        Select Your Bus
                      </Typography>
                    </Stack>

                    {buses.length === 0 ? (
                      <Alert severity="error" icon={<InfoIcon />}>
                        No active buses found. Please add a bus first before creating a schedule.
                      </Alert>
                    ) : (
                      <FormControl fullWidth error={!!errors.bus_id}>
                        <InputLabel id="bus-select-label">Choose a bus *</InputLabel>
                        <Select
                          labelId="bus-select-label"
                          name="bus_id"
                          value={formData.bus_id}
                          onChange={handleChange}
                          label="Choose a bus *"
                          required
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderWidth: 2,
                            },
                          }}
                        >
                          {buses.map(bus => (
                            <MenuItem key={bus.bus_id} value={bus.bus_id}>
                              <Stack direction="row" spacing={2} alignItems="center" width="100%">
                                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                  <BusIcon />
                                </Avatar>
                                <Box flex={1}>
                                  <Typography variant="body1" fontWeight="bold">
                                    {bus.bus_number}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {bus.from_location} → {bus.to_location}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={`${bus.total_seats} seats`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.bus_id && (
                          <FormHelperText>{errors.bus_id}</FormHelperText>
                        )}
                      </FormControl>
                    )}

                    {selectedBus && (
                      <Fade in={true}>
                        <Paper
                          elevation={0}
                          sx={{
                            mt: 3,
                            p: 3,
                            bgcolor: 'success.lighter',
                            border: '2px solid',
                            borderColor: 'success.light',
                            borderRadius: 2,
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            <CheckCircleIcon color="success" />
                            <Box>
                              <Typography variant="body2" fontWeight="bold" color="success.dark">
                                Bus Selected: {selectedBus.bus_number}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Route: {selectedBus.from_location} to {selectedBus.to_location} • {selectedBus.total_seats} total seats
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      </Fade>
                    )}
                  </Box>
                )}

                <Divider />

                {/* Step 2: Date & Time */}
                {activeStep >= 1 && formData.bus_id && (
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                      <CalendarIcon color="primary" />
                      <Typography variant="h5" fontWeight="bold">
                        Set Journey Date & Time
                      </Typography>
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <StyledTextField
                          fullWidth
                          type="date"
                          name="journey_date"
                          label="Journey Date"
                          value={formData.journey_date}
                          onChange={(e) => {
                            handleChange(e);
                            if (e.target.value && formData.departure_time && formData.arrival_time && !errors.journey_date && !errors.time_sequence) {
                              setActiveStep(2);
                            }
                          }}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: today }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EventAvailableIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.journey_date}
                          helperText={errors.journey_date}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          fullWidth
                          type="time"
                          name="departure_time"
                          label="Departure Time"
                          value={formData.departure_time}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ClockIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.departure_time}
                          helperText={errors.departure_time || 'Format: HH:MM (24-hour)'}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          fullWidth
                          type="time"
                          name="arrival_time"
                          label="Arrival Time"
                          value={formData.arrival_time}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ClockIcon color="success" />
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.arrival_time}
                          helperText={errors.arrival_time || 'Format: HH:MM (24-hour)'}
                          required
                        />
                      </Grid>

                      {errors.time_sequence && (
                        <Grid item xs={12}>
                          <Alert severity="warning" icon={<WarningIcon />}>
                            {errors.time_sequence}
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}

                {/* Step 3: Review & Info */}
                {activeStep >= 2 && canProceed() && (
                  <Fade in={true}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                        <InfoIcon color="primary" />
                        <Typography variant="h5" fontWeight="bold">
                          Review Schedule Details
                        </Typography>
                      </Stack>

                      <InfoCard elevation={0}>
                        <InfoIcon color="info" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="body1" fontWeight="bold" color="info.dark" gutterBottom>
                            Automatic Seat Generation
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            When you create this schedule, <strong>{selectedBus?.total_seats} seats</strong> will be automatically generated and marked as available for booking. The system will handle all seat assignments automatically.
                          </Typography>
                        </Box>
                      </InfoCard>

                      {selectedBus && (
                        <Paper
                          elevation={0}
                          sx={{
                            mt: 3,
                            p: 3,
                            bgcolor: 'grey.50',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Schedule Summary
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Stack spacing={1}>
                                <Typography variant="caption" color="text.secondary">
                                  Bus Number
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  {selectedBus.bus_number}
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Stack spacing={1}>
                                <Typography variant="caption" color="text.secondary">
                                  Route
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  {selectedBus.from_location} → {selectedBus.to_location}
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Stack spacing={1}>
                                <Typography variant="caption" color="text.secondary">
                                  Journey Date
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  {new Date(formData.journey_date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Stack spacing={1}>
                                <Typography variant="caption" color="text.secondary">
                                  Departure → Arrival
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  {formData.departure_time} → {formData.arrival_time}
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <EventSeatIcon color="success" />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Total Seats
                                  </Typography>
                                  <Typography variant="h6" fontWeight="bold" color="success.main">
                                    {selectedBus.total_seats}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <CheckCircleIcon color="primary" />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Schedule Status
                                  </Typography>
                                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                                    ACTIVE
                                  </Typography>
                                </Box>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Paper>
                      )}
                    </Box>
                  </Fade>
                )}

                <Divider />

                {/* Action Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/traveler/schedules')}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      fontWeight: 'bold',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      },
                    }}
                  >
                    Cancel
                  </Button>

                  {activeStep > 0 && activeStep < 2 && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => setActiveStep(activeStep - 1)}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        fontWeight: 'bold',
                      }}
                    >
                      Back
                    </Button>
                  )}

                  {activeStep < 2 ? (
                    <Button
                      variant="contained"
                      size="large"
                      disabled={!canProceed()}
                      onClick={() => setActiveStep(activeStep + 1)}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        fontWeight: 'bold',
                      }}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || buses.length === 0 || !canProceed()}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                        },
                      }}
                    >
                      {loading ? 'Creating Schedule...' : 'Create Schedule'}
                    </Button>
                  )}
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </StyledCard>
      </Fade>
    </Container>
  );
};

export default AddSchedule;