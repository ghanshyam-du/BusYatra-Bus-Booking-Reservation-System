// View all bookings for traveler's buses with analytics
// ----------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  ButtonGroup,
  Divider,
  CircularProgress,
  Stack,
  Avatar,
  Paper,
} from '@mui/material';
import {
  CalendarToday,
  Place,
  People,
  CurrencyRupee,
  TrendingUp,
  ConfirmationNumber,
} from '@mui/icons-material';
import travelerService from '../../services/travelerService';
import { formatCurrency, formatDate, formatTime, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const BookingAnalytics = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await travelerService.getBookings();
      setBookings(response.data?.bookings || []);
      setStats(response.data?.stats || null);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.booking_status === filter.toUpperCase();
  });

  // Helper function to get chip color based on status
  const getChipColor = (status) => {
    const statusUpper = status?.toUpperCase();
    if (statusUpper === 'CONFIRMED' || statusUpper === 'PAID') return 'success';
    if (statusUpper === 'CANCELLED') return 'error';
    if (statusUpper === 'PENDING') return 'warning';
    return 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Booking Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage bookings for your buses
        </Typography>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    <ConfirmationNumber />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total_bookings || 0}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Total Bookings
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.confirmed || 0}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Confirmed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                    <People />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total_passengers || 0}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Total Passengers
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                    <CurrencyRupee />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(stats.total_revenue || 0).replace('₹', '')}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Box mb={4}>
        <ButtonGroup variant="outlined" size="large">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'contained' : 'outlined'}
          >
            All ({bookings.length})
          </Button>
          <Button
            onClick={() => setFilter('confirmed')}
            variant={filter === 'confirmed' ? 'contained' : 'outlined'}
          >
            Confirmed
          </Button>
          <Button
            onClick={() => setFilter('cancelled')}
            variant={filter === 'cancelled' ? 'contained' : 'outlined'}
          >
            Cancelled
          </Button>
        </ButtonGroup>
      </Box>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card elevation={2}>
          <CardContent>
            <Box textAlign="center" py={8}>
              <ConfirmationNumber sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" fontWeight="600" gutterBottom>
                No bookings found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Bookings will appear here once customers start booking
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {filteredBookings.map((booking) => (
            <Card key={booking.booking_id} elevation={2}>
              <CardContent>
                {/* Header Section */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {booking.booking_reference}
                      </Typography>
                      <Chip
                        label={booking.booking_status}
                        color={getChipColor(booking.booking_status)}
                        size="small"
                      />
                      <Chip
                        label={booking.payment_status}
                        color={getChipColor(booking.payment_status)}
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Booked on {formatDate(booking.booking_date)}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(booking.total_amount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {booking.number_of_seats} seats
                    </Typography>
                  </Box>
                </Box>

                {/* Journey Details */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Place color="action" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Route
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {booking.from_location} → {booking.to_location}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarToday color="action" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Journey Date
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {formatDate(booking.journey_date)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <People color="action" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Seats
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {booking.seat_numbers?.join(', ')}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Passenger Details */}
                {booking.passengers && booking.passengers.length > 0 && (
                  <>
                    <Divider sx={{ mb: 2 }} />
                    <Box>
                      <Typography variant="body2" fontWeight="500" color="text.primary" mb={1}>
                        Passengers:
                      </Typography>
                      <Grid container spacing={1}>
                        {booking.passengers.map((passenger, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Typography variant="body2" color="text.secondary">
                              {passenger.passenger_name} ({passenger.passenger_age}yrs,{' '}
                              {passenger.passenger_gender})
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default BookingAnalytics;