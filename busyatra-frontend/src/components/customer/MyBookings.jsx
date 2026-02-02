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
  Badge,
  LinearProgress,
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
  AccessTime as TimeIcon,
  TripOrigin as OriginIcon,
  FiberManualRecord as DotIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  LocalOffer as TagIcon,
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
      <Stack spacing={4}>
        {bookings.map((booking, index) => {
          const statusConfig = getStatusConfig(booking.booking_status);
          const isExpanded = expandedBooking === booking.booking_id;

          return (
            <Fade in={true} timeout={300 + index * 100} key={booking.booking_id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: 'white',
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    transform: 'translateY(-8px)',
                    borderColor: 'primary.main',
                  },
                  // Perforated edge effect
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '100%',
                    height: '2px',
                    background: `repeating-linear-gradient(
                      to right,
                      ${alpha(theme.palette.divider, 0.5)} 0px,
                      ${alpha(theme.palette.divider, 0.5)} 10px,
                      transparent 10px,
                      transparent 20px
                    )`,
                    display: { xs: 'none', md: 'block' },
                  }
                }}
              >
                {/* Ticket Header with Pattern */}
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${alpha('#1e3c72', 0.05)} 0%, ${alpha('#2a5298', 0.05)} 100%)`,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '300px',
                      height: '100%',
                      background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3c72' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      opacity: 0.4,
                    }
                  }}
                >
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                    sx={{ px: 3, py: 2, position: 'relative', zIndex: 1 }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Chip
                        icon={<TicketIcon />}
                        label={booking.booking_reference}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          bgcolor: 'white',
                          border: '2px solid',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                        }}
                      />
                      <Chip
                        icon={<CalendarIcon fontSize="small" />}
                        label={formatDate(booking.journey_date)}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>
                    <Badge
                      badgeContent={statusConfig.icon}
                      sx={{
                        '& .MuiBadge-badge': {
                          bgcolor: statusConfig.bgcolor,
                          color: `${statusConfig.color}.main`,
                          right: -8,
                          top: 8,
                        }
                      }}
                    >
                      <Chip
                        label={booking.booking_status}
                        color={statusConfig.color}
                        size="small"
                        sx={{ 
                          fontWeight: 700,
                          minWidth: 100,
                          boxShadow: `0 2px 8px ${alpha(theme.palette[statusConfig.color].main, 0.25)}`,
                        }}
                      />
                    </Badge>
                  </Stack>
                </Box>

                <CardContent sx={{ p: 0 }}>
                  <Grid container>
                    {/* Main Journey Section */}
                    <Grid item xs={12} md={8} sx={{ p: 3, borderRight: { md: '1px dashed' }, borderColor: 'divider' }}>
                      {/* Journey Timeline */}
                      <Box sx={{ position: 'relative', pl: 2 }}>
                        {/* Departure */}
                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                          <Box sx={{ position: 'relative', pt: 0.5 }}>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'primary.main',
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                              }}
                            >
                              <OriginIcon sx={{ fontSize: 24 }} />
                            </Avatar>
                            {/* Connecting line */}
                            <Box
                              sx={{
                                position: 'absolute',
                                left: '50%',
                                top: 48,
                                transform: 'translateX(-50%)',
                                width: 3,
                                height: 60,
                                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                              }}
                            />
                          </Box>
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                              Departure
                            </Typography>
                            <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5, mb: 0.5 }}>
                              {booking.from_location}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Chip
                                icon={<TimeIcon />}
                                label={booking.departure_time ? formatTime(booking.departure_time) : 'TBD'}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: 'primary.main',
                                  fontWeight: 600,
                                }}
                              />
                            </Stack>
                          </Box>
                        </Stack>

                        {/* Bus Travel Info */}
                        <Stack 
                          direction="row" 
                          spacing={2} 
                          alignItems="center" 
                          sx={{ 
                            ml: 1,
                            mb: 3,
                            py: 1.5,
                            px: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.05),
                            border: '1px dashed',
                            borderColor: alpha(theme.palette.info.main, 0.3),
                          }}
                        >
                          <BusIcon sx={{ color: 'info.main', fontSize: 28 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Bus Type
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color="info.main">
                              {booking.bus_type || 'Express AC'}
                            </Typography>
                          </Box>
                          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Duration
                            </Typography>
                            <Typography variant="body2" fontWeight={700}>
                              {booking.duration || '6h 30m'}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Arrival */}
                        <Stack direction="row" spacing={2}>
                          <Box sx={{ position: 'relative', pt: 0.5 }}>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'success.main',
                                boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                              }}
                            >
                              <LocationIcon sx={{ fontSize: 24 }} />
                            </Avatar>
                          </Box>
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                              Arrival
                            </Typography>
                            <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5, mb: 0.5 }}>
                              {booking.to_location}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Chip
                                icon={<TimeIcon />}
                                label={booking.arrival_time ? formatTime(booking.arrival_time) : 'TBD'}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  color: 'success.main',
                                  fontWeight: 600,
                                }}
                              />
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Seats Section */}
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                          <SeatIcon color="action" />
                          <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                            Seat Information
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {booking.seat_numbers && booking.seat_numbers.length > 0 ? (
                            booking.seat_numbers.map((seat) => (
                              <Paper
                                key={seat}
                                elevation={0}
                                sx={{
                                  px: 2,
                                  py: 1,
                                  borderRadius: 2,
                                  border: '2px solid',
                                  borderColor: 'primary.main',
                                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                                  minWidth: 60,
                                  textAlign: 'center',
                                  transition: 'all 0.3s',
                                  '&:hover': {
                                    bgcolor: 'primary.main',
                                    '& .seat-number': {
                                      color: 'white',
                                    }
                                  }
                                }}
                              >
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary" 
                                  sx={{ fontSize: '0.65rem', display: 'block' }}
                                >
                                  SEAT
                                </Typography>
                                <Typography 
                                  className="seat-number"
                                  variant="h6" 
                                  fontWeight={800}
                                  color="primary.main"
                                  sx={{ transition: 'color 0.3s' }}
                                >
                                  {seat}
                                </Typography>
                              </Paper>
                            ))
                          ) : (
                            <Chip
                              label={`${booking.number_of_seats} ${booking.number_of_seats === 1 ? 'Seat' : 'Seats'}`}
                              color="primary"
                              sx={{ fontWeight: 600 }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </Grid>

                    {/* Fare & Actions Section */}
                    <Grid item xs={12} md={4}>
                      <Stack sx={{ height: '100%', p: 3 }} spacing={2.5}>
                        {/* Fare Breakdown */}
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${alpha('#1e3c72', 0.08)} 0%, ${alpha('#2a5298', 0.08)} 100%)`,
                            border: '2px solid',
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '"₹"',
                              position: 'absolute',
                              right: -20,
                              top: -20,
                              fontSize: '150px',
                              fontWeight: 800,
                              color: alpha(theme.palette.primary.main, 0.03),
                            }
                          }}
                        >
                          <Stack spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                              Total Fare
                            </Typography>
                            <Typography
                              variant="h3"
                              fontWeight={900}
                              sx={{
                                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-1px',
                              }}
                            >
                              {formatCurrency(booking.total_amount)}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip
                                icon={<PersonIcon fontSize="small" />}
                                label={`${booking.number_of_seats} Passenger${booking.number_of_seats > 1 ? 's' : ''}`}
                                size="small"
                                sx={{ 
                                  bgcolor: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </Stack>
                          </Stack>
                        </Paper>

                        {/* Quick Actions */}
                        <Stack spacing={1.5} sx={{ mt: 'auto' }}>
                          {booking.booking_status === 'CONFIRMED' && (
                            <>
                              <Button
                                fullWidth
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                sx={{
                                  borderRadius: 2,
                                  py: 1.5,
                                  fontWeight: 700,
                                  textTransform: 'none',
                                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                  '&:hover': {
                                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                                    transform: 'translateY(-2px)',
                                  },
                                  transition: 'all 0.3s',
                                }}
                              >
                                Download Ticket
                              </Button>
                              
                              <Stack direction="row" spacing={1}>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  startIcon={<PrintIcon />}
                                  sx={{
                                    borderRadius: 2,
                                    py: 1,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderWidth: 2,
                                    '&:hover': {
                                      borderWidth: 2,
                                    }
                                  }}
                                >
                                  Print
                                </Button>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  startIcon={<ShareIcon />}
                                  sx={{
                                    borderRadius: 2,
                                    py: 1,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderWidth: 2,
                                    '&:hover': {
                                      borderWidth: 2,
                                    }
                                  }}
                                >
                                  Share
                                </Button>
                              </Stack>

                              <Divider sx={{ my: 1 }} />

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
                            </>
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
                              color: 'text.secondary',
                            }}
                          >
                            {isExpanded ? 'Less' : 'More'} Details
                          </Button>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* Expanded Details */}
                  <Collapse in={isExpanded} timeout="auto">
                    <Box 
                      sx={{ 
                        px: 3, 
                        py: 3,
                        borderTop: '2px dashed',
                        borderColor: 'divider',
                        bgcolor: alpha(theme.palette.grey[100], 0.5),
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
                        📋 Additional Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={6} sm={3}>
                          <Stack spacing={0.5}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Booking Date
                            </Typography>
                            <Typography variant="body2" fontWeight={700}>
                              {booking.booking_date ? formatDate(booking.booking_date) : 'N/A'}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Stack spacing={0.5}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              PNR Number
                            </Typography>
                            <Typography variant="body2" fontWeight={700} fontFamily="monospace">
                              {booking.pnr || booking.booking_reference}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Stack spacing={0.5}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Operator
                            </Typography>
                            <Typography variant="body2" fontWeight={700}>
                              {booking.operator || 'Express Travels'}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Stack spacing={0.5}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Bus Number
                            </Typography>
                            <Typography variant="body2" fontWeight={700}>
                              {booking.bus_number || 'GJ-01-AB-1234'}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>

                      {/* Passenger Details */}
                      {booking.passengers && booking.passengers.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
                            👥 Passenger Details
                          </Typography>
                          <Stack spacing={1.5}>
                            {booking.passengers.map((passenger, idx) => (
                              <Paper
                                key={idx}
                                elevation={0}
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  bgcolor: 'white',
                                }}
                              >
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Avatar
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                                      color: 'primary.main',
                                      fontWeight: 700,
                                      fontSize: '0.875rem',
                                    }}
                                  >
                                    {idx + 1}
                                  </Avatar>
                                  <Box flex={1}>
                                    <Typography variant="body2" fontWeight={700}>
                                      {passenger.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {passenger.age} years • {passenger.gender}
                                    </Typography>
                                  </Box>
                                  {booking.seat_numbers && booking.seat_numbers[idx] && (
                                    <Chip
                                      label={`Seat ${booking.seat_numbers[idx]}`}
                                      size="small"
                                      color="primary"
                                      sx={{ fontWeight: 600 }}
                                    />
                                  )}
                                </Stack>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
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