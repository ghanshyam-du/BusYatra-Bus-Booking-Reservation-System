import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  InputAdornment,
  CircularProgress,
  Stack,
  Avatar,
  Fade,
  Skeleton,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarIcon,
  DirectionsBus as BusIcon,
  AccessTime as ClockIcon,
  SwapHoriz as SwapIcon,
  TrendingFlat as ArrowIcon,
  EventSeat as SeatIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatTime, formatDuration } from '../../utils/formatters';
import toast from 'react-hot-toast';
import SeatSelection from './SeatSelection';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 30px rgba(0,0,0,0.12)',
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(1.5),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const BusCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transform: 'translateY(-4px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}));

const BusSearch = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showSeatSelection, setShowSeatSelection] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await bookingService.searchBuses(searchParams);
      setBuses(response.data || []);
      if (response.data?.length === 0) {
        toast.error('No buses found for this route');
      } else {
        toast.success(`Found ${response.data.length} buses!`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to search buses');
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLocations = () => {
    setSearchParams({
      ...searchParams,
      from: searchParams.to,
      to: searchParams.from,
    });
  };

  const handleSelectSeats = (bus) => {
    setSelectedBus(bus);
    setShowSeatSelection(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Form */}
      <StyledPaper elevation={0}>
        <Stack spacing={3}>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={700}
              color="primary"
              gutterBottom
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                mb: 1
              }}
            >
              <BusIcon sx={{ fontSize: 40 }} />
              Search Buses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find the best buses for your journey
            </Typography>
          </Box>

          <form onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              {/* From Location */}
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="From"
                  placeholder="e.g., Ahmedabad"
                  value={searchParams.from}
                  onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Swap Button */}
              {!isMobile && (
                <Grid item md="auto" sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title="Swap locations">
                    <IconButton
                      onClick={handleSwapLocations}
                      sx={{
                        bgcolor: 'primary.50',
                        '&:hover': { bgcolor: 'primary.100' },
                      }}
                    >
                      <SwapIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}

              {/* To Location */}
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="To"
                  placeholder="e.g., Mumbai"
                  value={searchParams.to}
                  onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon color="error" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Journey Date */}
              <Grid item xs={12} md={isMobile ? 12 : 3}>
                <StyledTextField
                  fullWidth
                  type="date"
                  label="Journey Date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: today }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Search Button */}
              <Grid item xs={12}>
                <SearchButton
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth={isMobile}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                >
                  {loading ? 'Searching...' : 'Search Buses'}
                </SearchButton>
              </Grid>
            </Grid>
          </form>
        </Stack>
      </StyledPaper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ mt: 4 }}>
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              variant="rectangular"
              height={200}
              sx={{ mb: 2, borderRadius: 2 }}
            />
          ))}
        </Box>
      )}

      {/* Search Results */}
      {!loading && buses.length > 0 && (
        <Fade in timeout={500}>
          <Box sx={{ mt: 4 }}>
            <Stack 
              direction="row" 
              alignItems="center" 
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Typography variant="h5" fontWeight={700}>
                Available Buses
              </Typography>
              <Chip 
                label={`${buses.length} buses found`} 
                color="primary" 
                variant="outlined"
              />
            </Stack>

            <Stack spacing={3}>
              {buses.map((bus) => (
                <BusCard key={bus.schedule_id}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {/* Bus Info */}
                      <Grid item xs={12}>
                        <Stack 
                          direction={isMobile ? 'column' : 'row'} 
                          spacing={2} 
                          alignItems={isMobile ? 'flex-start' : 'center'}
                        >
                          <Avatar
                            sx={{
                              bgcolor: 'primary.100',
                              width: 56,
                              height: 56,
                            }}
                          >
                            <BusIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={700}>
                              {bus.bus_number}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {bus.company_name}
                            </Typography>
                          </Box>

                          <Chip
                            label={bus.bus_type}
                            color="info"
                            size="medium"
                            sx={{ fontWeight: 600 }}
                          />

                          <Chip
                            icon={<SeatIcon />}
                            label={`${bus.available_seats} seats`}
                            color={bus.available_seats > 10 ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      {/* Journey Details */}
                      <Grid item xs={12} md={9}>
                        <Grid container spacing={2} alignItems="center">
                          {/* Departure */}
                          <Grid item xs={12} sm={4}>
                            <Box>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                fontWeight={600}
                                textTransform="uppercase"
                              >
                                Departure
                              </Typography>
                              <Typography variant="h5" fontWeight={700} sx={{ my: 0.5 }}>
                                {formatTime(bus.departure_time)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {bus.from_location}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Duration */}
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                fontWeight={600}
                                textTransform="uppercase"
                              >
                                Duration
                              </Typography>
                              <Stack 
                                direction="row" 
                                alignItems="center" 
                                justifyContent="center"
                                spacing={1}
                                sx={{ my: 0.5 }}
                              >
                                <Box sx={{ width: 40, height: 2, bgcolor: 'divider' }} />
                                <ClockIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                <Box sx={{ width: 40, height: 2, bgcolor: 'divider' }} />
                              </Stack>
                              <Typography variant="body2" fontWeight={600}>
                                {formatDuration(bus.departure_time, bus.arrival_time)}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Arrival */}
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: isMobile ? 'left' : 'right' }}>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                fontWeight={600}
                                textTransform="uppercase"
                              >
                                Arrival
                              </Typography>
                              <Typography variant="h5" fontWeight={700} sx={{ my: 0.5 }}>
                                {formatTime(bus.arrival_time)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {bus.to_location}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Price & Book Button */}
                      <Grid item xs={12} md={3}>
                        <Stack 
                          spacing={2} 
                          sx={{ 
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: isMobile ? 'flex-start' : 'flex-end'
                          }}
                        >
                          <Box sx={{ textAlign: isMobile ? 'left' : 'right' }}>
                            <Typography variant="caption" color="text.secondary">
                              Starting from
                            </Typography>
                            <Typography 
                              variant="h4" 
                              fontWeight={700}
                              color="primary.main"
                              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                              {formatCurrency(bus.fare)}
                            </Typography>
                          </Box>

                          <Button
                            variant="contained"
                            size="large"
                            fullWidth={isMobile}
                            onClick={() => handleSelectSeats(bus)}
                            endIcon={<ArrowIcon />}
                            sx={{
                              py: 1.5,
                              px: 4,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: '1rem',
                              fontWeight: 600,
                              boxShadow: 2,
                              '&:hover': {
                                boxShadow: 4,
                              },
                            }}
                          >
                            Select Seats
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </BusCard>
              ))}
            </Stack>
          </Box>
        </Fade>
      )}

      {/* No Results */}
      {!loading && buses.length === 0 && searchParams.from && searchParams.to && searchParams.date && (
        <Fade in timeout={500}>
          <Box 
            sx={{ 
              mt: 6, 
              textAlign: 'center',
              py: 8,
            }}
          >
            <BusIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No buses found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try searching with different locations or dates
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Seat Selection Modal */}
      {showSeatSelection && selectedBus && (
        <SeatSelection
          bus={selectedBus}
          onClose={() => {
            setShowSeatSelection(false);
            setSelectedBus(null);
          }}
          onBookingComplete={() => {
            setShowSeatSelection(false);
            setSelectedBus(null);
            setBuses([]);
            toast.success('Booking completed! Check My Bookings');
          }}
        />
      )}
    </Container>
  );
};

export default BusSearch;