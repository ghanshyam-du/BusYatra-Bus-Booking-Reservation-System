import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Button,
  Stack,
  Divider,
  IconButton,
  Paper,
  alpha,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  Avatar,
  useTheme,
  Fade,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  EventSeat as SeatIcon,
  DirectionsBus as BusIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  ConfirmationNumber as TicketIcon,
  Info as InfoIcon,
  ArrowForward as ArrowIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatDate, formatTime, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState({ open: false, bookingId: null });
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await bookingService.cancelBooking(cancelDialog.bookingId);
      toast.success('Booking cancelled successfully');
      setCancelDialog({ open: false, bookingId: null });
      fetchBookings();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      CONFIRMED: {
        color: 'success',
        bgcolor: alpha(theme.palette.success.main, 0.1),
        icon: <CheckCircleIcon fontSize="small" />,
      },
      CANCELLED: {
        color: 'error',
        bgcolor: alpha(theme.palette.error.main, 0.1),
        icon: <CancelIcon fontSize="small" />,
      },
      PENDING: {
        color: 'warning',
        bgcolor: alpha(theme.palette.warning.main, 0.1),
        icon: <ScheduleIcon fontSize="small" />,
      },
      COMPLETED: {
        color: 'info',
        bgcolor: alpha(theme.palette.info.main, 0.1),
        icon: <CheckCircleIcon fontSize="small" />,
      },
    };
    return configs[status] || configs.PENDING;
  };

  const toggleExpand = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 3, mb: 3 }} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 2 }} />
        ))}
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            p: 8,
            borderRadius: 4,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'divider',
            background: alpha(theme.palette.primary.main, 0.02),
          }}
        >
          <BusIcon sx={{ fontSize: 80, color: 'action.disabled', mb: 3 }} />
          <Typography variant="h5" fontWeight={700} color="text.secondary" gutterBottom>
            No Bookings Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Start your journey by booking your first bus ticket
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            }}
          >
            Book Now
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
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
        <Stack direction="row" alignItems="center" spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'white',
              color: '#1e3c72',
            }}
          >
            <TicketIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">
              My Bookings
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Bookings List */}
      <Stack spacing={3}>
        {bookings.map((booking, index) => {
          const statusConfig = getStatusConfig(booking.booking_status);
          const isExpanded = expandedBooking === booking.booking_id;

          return (
            <Fade in={true} timeout={300 + index * 100} key={booking.booking_id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Status Bar */}
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      bgcolor: statusConfig.bgcolor,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Booking ID
                        </Typography>
                        <Chip
                          label={booking.booking_reference}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            bgcolor: 'background.paper',
                          }}
                        />
                      </Stack>
                      <Chip
                        icon={statusConfig.icon}
                        label={booking.booking_status}
                        color={statusConfig.color}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </Stack>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {/* Journey Details */}
                      <Grid item xs={12} md={8}>
                        <Stack spacing={2.5}>
                          {/* Route */}
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main',
                              }}
                            >
                              <BusIcon />
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Journey Route
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Typography variant="h6" fontWeight={700}>
                                  {booking.from_location}
                                </Typography>
                                <ArrowIcon color="action" />
                                <Typography variant="h6" fontWeight={700}>
                                  {booking.to_location}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>

                          <Divider />

                          {/* Date and Seats */}
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <CalendarIcon color="action" />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Journey Date
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    {formatDate(booking.journey_date)}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <SeatIcon color="action" />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Seats Booked
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    {booking.number_of_seats} {booking.number_of_seats === 1 ? 'Seat' : 'Seats'}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Grid>
                          </Grid>

                          {/* Seat Numbers Chips */}
                          {booking.seat_numbers && booking.seat_numbers.length > 0 && (
                            <Box>
                              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {booking.seat_numbers.map((seat) => (
                                  <Chip
                                    key={seat}
                                    icon={<SeatIcon fontSize="small" />}
                                    label={`Seat ${seat}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      </Grid>

                      {/* Amount and Actions */}
                      <Grid item xs={12} md={4}>
                        <Stack
                          spacing={2}
                          sx={{
                            height: '100%',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2.5,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                border: '1px solid',
                                borderColor: alpha(theme.palette.primary.main, 0.1),
                                textAlign: 'center',
                              }}
                            >
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                Total Amount
                              </Typography>
                              <Typography
                                variant="h4"
                                fontWeight={800}
                                sx={{
                                  mt: 1,
                                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                {formatCurrency(booking.total_amount)}
                              </Typography>
                            </Paper>
                          </Box>

                          <Stack spacing={1.5}>
                            {booking.booking_status === 'CONFIRMED' && (
                              <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => setCancelDialog({ open: true, bookingId: booking.booking_id })}
                                sx={{
                                  borderRadius: 2,
                                  py: 1.2,
                                  borderWidth: 2,
                                  fontWeight: 700,
                                  textTransform: 'none',
                                  '&:hover': {
                                    borderWidth: 2,
                                    bgcolor: alpha(theme.palette.error.main, 0.08),
                                  }
                                }}
                              >
                                Cancel Booking
                              </Button>
                            )}

                            <Button
                              fullWidth
                              variant="text"
                              endIcon={
                                <ExpandMoreIcon
                                  sx={{
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s',
                                  }}
                                />
                              }
                              onClick={() => toggleExpand(booking.booking_id)}
                              sx={{
                                borderRadius: 2,
                                py: 1.2,
                                fontWeight: 600,
                                textTransform: 'none',
                              }}
                            >
                              {isExpanded ? 'Hide' : 'Show'} Details
                            </Button>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>

                    {/* Expanded Details */}
                    <Collapse in={isExpanded} timeout="auto">
                      <Box sx={{ mt: 3, pt: 3, borderTop: '2px dashed', borderColor: 'divider' }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Additional Information
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                              Booking Date
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {booking.booking_date ? formatDate(booking.booking_date) : 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                              Bus Type
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {booking.bus_type || 'Standard'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                              Departure Time
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {booking.departure_time ? formatTime(booking.departure_time) : 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                              Arrival Time
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {booking.arrival_time ? formatTime(booking.arrival_time) : 'N/A'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          );
        })}
      </Stack>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, bookingId: null })}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>
              <InfoIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Cancel Booking
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This action cannot be undone
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to cancel this booking? Your refund will be processed according to our cancellation policy.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button
            onClick={() => setCancelDialog({ open: false, bookingId: null })}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Keep Booking
          </Button>
          <Button
            onClick={handleCancelBooking}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;