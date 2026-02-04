import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Fade,
  Skeleton
} from '@mui/material';
import {
  ArrowBack,
  DirectionsBus,
  LocationOn,
  Schedule,
  AttachMoney,
  EventSeat,
  Wifi,
  BatteryCharging80,
  LocalDrink,
  AcUnit,
  Star,
  Save,
  Cancel,
  NavigateNext
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.35)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
  },
}));

const AmenityChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const EditBus = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    { value: 'SEATER', label: 'Seater', icon: '🪑' },
    { value: 'SLEEPER', label: 'Sleeper', icon: '🛏️' },
    { value: 'SEMI_SLEEPER', label: 'Semi Sleeper', icon: '🛋️' },
    { value: 'AC', label: 'AC', icon: '❄️' },
    { value: 'NON_AC', label: 'Non AC', icon: '🌡️' },
    { value: 'VOLVO', label: 'Volvo', icon: '⭐' }
  ];

  const amenityOptions = [
    { name: 'WiFi', icon: <Wifi /> },
    { name: 'Charging Point', icon: <BatteryCharging80 /> },
    { name: 'Water Bottle', icon: <LocalDrink /> },
    { name: 'Blanket', icon: <AcUnit /> },
    { name: 'Pillow', icon: <Star /> },
    { name: 'Reading Light', icon: <Star /> },
    { name: 'Emergency Exit', icon: <Star /> }
  ];

  useEffect(() => {
    fetchBusDetails();
  }, [busId]);

  const fetchBusDetails = async () => {
    try {
      const response = await travelerService.getBuses();
      const bus = response.data?.find(b => b.bus_id === busId);
      if (bus) {
        setFormData({
          bus_number: bus.bus_number,
          bus_type: bus.bus_type,
          from_location: bus.from_location,
          to_location: bus.to_location,
          departure_time: bus.departure_time,
          arrival_time: bus.arrival_time,
          total_seats: bus.total_seats,
          fare: bus.fare,
          amenities: bus.amenities || []
        });
      } else {
        toast.error('Bus not found');
        navigate('/traveler');
      }
    } catch (error) {
      toast.error('Failed to load bus details');
      navigate('/traveler');
    } finally {
      setLoading(false);
    }
  };

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
    setSubmitting(true);

    try {
      await travelerService.updateBus(busId, {
        ...formData,
        total_seats: parseInt(formData.total_seats),
        fare: parseFloat(formData.fare)
      });
      toast.success('Bus updated successfully! 🎉');
      navigate('/traveler');
    } catch (error) {
      toast.error(error.message || 'Failed to update bus');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <StyledPaper>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
              Loading bus details...
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        </StyledPaper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Breadcrumbs */}
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />} 
            sx={{ mb: 3 }}
            aria-label="breadcrumb"
          >
            <Link 
              underline="hover" 
              color="inherit" 
              onClick={() => navigate('/traveler')}
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <DirectionsBus sx={{ mr: 0.5 }} fontSize="small" />
              Dashboard
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              Edit Bus
            </Typography>
          </Breadcrumbs>

          {/* Header Card */}
          <HeaderCard elevation={0}>
            <CardContent sx={{ py: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                  onClick={() => navigate('/traveler')}
                  sx={{ 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight="700" gutterBottom>
                    Edit Bus Details
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.95 }}>
                    Update your bus information and amenities
                  </Typography>
                </Box>
                <DirectionsBus sx={{ fontSize: 80, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </HeaderCard>

          {/* Form */}
          <StyledPaper>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {/* Bus Number - Disabled */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bus Number"
                    name="bus_number"
                    value={formData.bus_number}
                    disabled
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DirectionsBus color="action" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Bus number cannot be changed"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#f5f5f5',
                      }
                    }}
                  />
                </Grid>

                {/* Bus Type */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Bus Type *</InputLabel>
                    <Select
                      name="bus_type"
                      value={formData.bus_type}
                      onChange={handleChange}
                      label="Bus Type *"
                      required
                      sx={{ borderRadius: 2 }}
                    >
                      {busTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* From Location */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="From Location"
                    name="from_location"
                    value={formData.from_location}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* To Location */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="To Location"
                    name="to_location"
                    value={formData.to_location}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="error" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Departure Time */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Departure Time"
                    name="departure_time"
                    type="time"
                    value={formData.departure_time}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Schedule color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Arrival Time */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Arrival Time"
                    name="arrival_time"
                    type="time"
                    value={formData.arrival_time}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Schedule color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Total Seats */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Total Seats"
                    name="total_seats"
                    type="number"
                    value={formData.total_seats}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 1, max: 100 }}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventSeat color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Fare */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fare per Seat"
                    name="fare"
                    type="number"
                    value={formData.fare}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 1, step: 0.01 }}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney color="success" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Amenities Section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
                    🎯 Bus Amenities
                  </Typography>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      bgcolor: '#f8f9fa',
                      borderRadius: 2,
                      border: '2px dashed #e0e0e0'
                    }}
                  >
                    <FormGroup>
                      <Grid container spacing={2}>
                        {amenityOptions.map(amenity => (
                          <Grid item xs={12} sm={6} md={4} key={amenity.name}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.amenities?.includes(amenity.name)}
                                  onChange={() => handleAmenityToggle(amenity.name)}
                                  sx={{
                                    color: '#667eea',
                                    '&.Mui-checked': {
                                      color: '#667eea',
                                    },
                                  }}
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {amenity.icon}
                                  <Typography variant="body2" fontWeight="500">
                                    {amenity.name}
                                  </Typography>
                                </Box>
                              }
                              sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                m: 0,
                                bgcolor: 'white',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  bgcolor: '#f5f5f5',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </Paper>

                  {/* Selected Amenities Preview */}
                  {formData.amenities && formData.amenities.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Selected Amenities:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {formData.amenities.map(amenity => (
                          <AmenityChip
                            key={amenity}
                            label={amenity}
                            color="primary"
                            variant="outlined"
                            onDelete={() => handleAmenityToggle(amenity)}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                    <StyledButton
                      variant="outlined"
                      size="large"
                      startIcon={<Cancel />}
                      onClick={() => navigate('/traveler')}
                      sx={{
                        borderColor: '#e0e0e0',
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: '#bdbdbd',
                          bgcolor: '#f5f5f5',
                        }
                      }}
                    >
                      Cancel
                    </StyledButton>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
                        }
                      }}
                    >
                      {submitting ? 'Updating...' : 'Update Bus'}
                    </StyledButton>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </StyledPaper>

          {/* Info Alert */}
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 28
              }
            }}
          >
            <Typography variant="body2">
              <strong>Note:</strong> All changes will be reflected immediately after updating. 
              Make sure to verify all details before saving.
            </Typography>
          </Alert>
        </Box>
      </Fade>
    </Container>
  );
};

export default EditBus;