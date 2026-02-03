import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Stack,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  ArrowBack,
  DirectionsBus,
  LocationOn,
  Schedule,
  EventSeat,
  CurrencyRupee,
  Wifi,
  BatteryCharging80,
  LocalDrink,
  AcUnit,
  Bed,
  Lightbulb,
  ExitToApp,
  CheckCircle,
  InfoOutlined,
} from '@mui/icons-material';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

const AddBus = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bus_number: '',
    bus_type: 'SEATER',
    from_location: '',
    to_location: '',
    departure_time: '',
    arrival_time: '',
    total_seats: 40,
    fare: '',
    amenities: []
  });

  const busTypes = [
    { value: 'SEATER', label: 'Seater', description: 'Standard seating' },
    { value: 'SLEEPER', label: 'Sleeper', description: 'Comfortable berths' },
    { value: 'SEMI_SLEEPER', label: 'Semi Sleeper', description: 'Reclining seats' },
    { value: 'AC', label: 'AC', description: 'Air conditioned' },
    { value: 'NON_AC', label: 'Non-AC', description: 'Regular bus' },
    { value: 'VOLVO', label: 'Volvo', description: 'Premium luxury' }
  ];

  const amenityOptions = [
    { name: 'WiFi', icon: <Wifi /> },
    { name: 'Charging Point', icon: <BatteryCharging80 /> },
    { name: 'Water Bottle', icon: <LocalDrink /> },
    { name: 'Blanket', icon: <AcUnit /> },
    { name: 'Pillow', icon: <Bed /> },
    { name: 'Reading Light', icon: <Lightbulb /> },
    { name: 'Emergency Exit', icon: <ExitToApp /> }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityToggle = (amenity) => {
    const current = formData.amenities || [];
    if (current.includes(amenity)) {
      setFormData({ ...formData, amenities: current.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...current, amenity] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.from_location === formData.to_location) {
      toast.error('From and To locations must be different');
      return;
    }

    if (parseInt(formData.total_seats) < 10 || parseInt(formData.total_seats) > 60) {
      toast.error('Total seats must be between 10 and 60');
      return;
    }

    setLoading(true);
    try {
      await travelerService.addBus({
        ...formData,
        total_seats: parseInt(formData.total_seats),
        fare: parseFloat(formData.fare)
      });
      toast.success('Bus added successfully!');
      navigate('/traveler');
    } catch (error) {
      toast.error(error.message || 'Failed to add bus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <IconButton
            onClick={() => navigate('/traveler')}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              Add New Bus
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Register your bus and start accepting bookings
            </Typography>
          </Box>
          <DirectionsBus sx={{ fontSize: 60, opacity: 0.3 }} />
        </Stack>
      </Paper>

      {/* Info Alert */}
      <Alert
        severity="info"
        icon={<InfoOutlined />}
        sx={{ mb: 3, borderRadius: 2 }}
      >
        Fill in all required details carefully. This information will be visible to passengers when they book tickets.
      </Alert>

      {/* Main Form */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Bus Registration Details
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          {/* Section 1: Basic Information */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            Basic Information
          </Typography>
          
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Bus Number"
                name="bus_number"
                value={formData.bus_number}
                onChange={handleChange}
                placeholder="GJ01AB1234"
                helperText="Enter registration number (e.g., GJ01AB1234)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DirectionsBus color="action" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  pattern: '[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}',
                  style: { textTransform: 'uppercase' }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Bus Type</InputLabel>
                <Select
                  name="bus_type"
                  value={formData.bus_type}
                  onChange={handleChange}
                  label="Bus Type"
                >
                  {busTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box>
                        <Typography variant="body1">{type.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Section 2: Route Information */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            Route Information
          </Typography>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="From Location"
                name="from_location"
                value={formData.from_location}
                onChange={handleChange}
                placeholder="e.g., Ahmedabad"
                helperText="Starting point of the journey"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="success" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="To Location"
                name="to_location"
                value={formData.to_location}
                onChange={handleChange}
                placeholder="e.g., Mumbai"
                helperText="Destination of the journey"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="error" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Section 3: Timing */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            Schedule Timing
          </Typography>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="time"
                label="Departure Time"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule color="action" />
                    </InputAdornment>
                  ),
                }}
                helperText="Bus departure time"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="time"
                label="Arrival Time"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule color="action" />
                    </InputAdornment>
                  ),
                }}
                helperText="Expected arrival time"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Section 4: Capacity & Pricing */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            Capacity & Pricing
          </Typography>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Total Seats"
                name="total_seats"
                value={formData.total_seats}
                onChange={handleChange}
                inputProps={{ min: 10, max: 60 }}
                helperText="Number of seats (10-60)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventSeat color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Fare per Seat"
                name="fare"
                value={formData.fare}
                onChange={handleChange}
                inputProps={{ min: 1, step: 0.01 }}
                placeholder="500"
                helperText="Price per seat in ₹"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupee sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Section 5: Amenities */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
            Amenities & Facilities
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Select the amenities available in your bus (Optional)
          </Typography>

          <Grid container spacing={2} mb={4}>
            {amenityOptions.map((amenity) => (
              <Grid item xs={12} sm={6} md={4} key={amenity.name}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 2,
                    borderColor: formData.amenities?.includes(amenity.name)
                      ? 'primary.main'
                      : 'divider',
                    bgcolor: formData.amenities?.includes(amenity.name)
                      ? 'primary.50'
                      : 'background.paper',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => handleAmenityToggle(amenity.name)}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          color: formData.amenities?.includes(amenity.name)
                            ? 'primary.main'
                            : 'text.secondary',
                        }}
                      >
                        {amenity.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        fontWeight={
                          formData.amenities?.includes(amenity.name) ? 600 : 400
                        }
                        sx={{
                          color: formData.amenities?.includes(amenity.name)
                            ? 'primary.main'
                            : 'text.primary',
                        }}
                      >
                        {amenity.name}
                      </Typography>
                      {formData.amenities?.includes(amenity.name) && (
                        <CheckCircle
                          color="primary"
                          sx={{ ml: 'auto', fontSize: 20 }}
                        />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Selected Amenities Display */}
          {formData.amenities && formData.amenities.length > 0 && (
            <Box mb={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Selected Amenities:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {formData.amenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    color="primary"
                    variant="outlined"
                    onDelete={() => handleAmenityToggle(amenity)}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Action Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/traveler')}
              sx={{ minWidth: 150 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                minWidth: 150,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                },
              }}
            >
              {loading ? 'Adding Bus...' : 'Add Bus to Fleet'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddBus;