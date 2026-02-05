import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  CircularProgress,
  IconButton,
  Stack,
  Divider,
  Alert,
  Avatar,
  Paper,
  Tooltip,
  Fade,
  ButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  DirectionsBus as BusIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Cancel as CancelIcon,
  EventAvailable as EventAvailableIcon,
  History as HistoryIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import travelerService from '../../services/travelerService';
import { formatDate, formatTime, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  border: '1px solid',
  borderColor: theme.palette.divider,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  color: 'white',
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const StyledChip = styled(Chip)(({ theme, status }) => {
  const getColors = () => {
    switch (status?.toLowerCase()) {
      case 'active':
        return {
          bg: theme.palette.success.light,
          color: theme.palette.success.dark,
        };
      case 'cancelled':
        return {
          bg: theme.palette.error.light,
          color: theme.palette.error.dark,
        };
      default:
        return {
          bg: theme.palette.grey[300],
          color: theme.palette.grey[700],
        };
    }
  };

  const colors = getColors();
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 600,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0.5, 1),
  };
});

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await travelerService.getSchedules();
      setSchedules(response.data || []);
    } catch (error) {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSchedule = async (scheduleId) => {
    if (!confirm('Are you sure you want to cancel this schedule? Active bookings will be affected.')) return;

    try {
      await travelerService.cancelSchedule(scheduleId);
      toast.success('Schedule cancelled successfully');
      fetchSchedules();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel schedule');
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const journeyDate = new Date(schedule.journey_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') return journeyDate >= today && schedule.schedule_status === 'ACTIVE';
    if (filter === 'past') return journeyDate < today || schedule.schedule_status !== 'ACTIVE';
    return true;
  });

  const getFilterCount = (filterType) => {
    if (filterType === 'all') return schedules.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return schedules.filter(schedule => {
      const journeyDate = new Date(schedule.journey_date);
      if (filterType === 'upcoming') return journeyDate >= today && schedule.schedule_status === 'ACTIVE';
      if (filterType === 'past') return journeyDate < today || schedule.schedule_status !== 'ACTIVE';
      return true;
    }).length;
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} thickness={4} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <HeaderBox>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Bus Schedules
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Manage and monitor all your bus schedules in one place
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/traveler/add-schedule"
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'grey.100',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            Create Schedule
          </Button>
        </Stack>
      </HeaderBox>

      {/* Filter Buttons */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'grey.50' }}>
        <ButtonGroup variant="outlined" size="large" fullWidth sx={{ bgcolor: 'white' }}>
          <Button
            onClick={() => setFilter('all')}
            startIcon={<ViewListIcon />}
            variant={filter === 'all' ? 'contained' : 'outlined'}
            sx={{
              borderRadius: '8px 0 0 8px',
              fontWeight: filter === 'all' ? 'bold' : 'medium',
            }}
          >
            All Schedules ({getFilterCount('all')})
          </Button>
          <Button
            onClick={() => setFilter('upcoming')}
            startIcon={<EventAvailableIcon />}
            variant={filter === 'upcoming' ? 'contained' : 'outlined'}
            sx={{
              borderRadius: 0,
              fontWeight: filter === 'upcoming' ? 'bold' : 'medium',
            }}
          >
            Upcoming ({getFilterCount('upcoming')})
          </Button>
          <Button
            onClick={() => setFilter('past')}
            startIcon={<HistoryIcon />}
            variant={filter === 'past' ? 'contained' : 'outlined'}
            sx={{
              borderRadius: '0 8px 8px 0',
              fontWeight: filter === 'past' ? 'bold' : 'medium',
            }}
          >
            Past/Cancelled ({getFilterCount('past')})
          </Button>
        </ButtonGroup>
      </Paper>

      {/* Schedule List or Empty State */}
      {filteredSchedules.length === 0 ? (
        <Fade in={true}>
          <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8, px: 4 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.light',
                mx: 'auto',
                mb: 3,
              }}
            >
              <CalendarIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              No Schedules Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Create your first bus schedule to start accepting bookings and managing your routes effectively
            </Typography>
            <Button
              component={Link}
              to="/traveler/add-schedule"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Create Your First Schedule
            </Button>
          </Card>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {filteredSchedules.map((schedule, index) => (
            <Grid item xs={12} key={schedule.schedule_id}>
              <Fade in={true} timeout={300 + index * 100}>
                <StyledCard>
                  <CardContent sx={{ p: 3 }}>
                    {/* Header Row */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.main',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }}
                        >
                          <BusIcon sx={{ fontSize: 30 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {schedule.bus_number}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" fontWeight="medium">
                              {schedule.from_location} → {schedule.to_location}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                      <StyledChip
                        label={schedule.schedule_status}
                        status={schedule.schedule_status}
                        size="medium"
                      />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Info Grid */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <InfoBox>
                          <CalendarIcon color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Journey Date
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {formatDate(schedule.journey_date)}
                            </Typography>
                          </Box>
                        </InfoBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <InfoBox>
                          <ClockIcon color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Departure Time
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {formatTime(schedule.departure_time)}
                            </Typography>
                          </Box>
                        </InfoBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <InfoBox>
                          <PeopleIcon color="success" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Available Seats
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              {schedule.available_seats} / {schedule.total_seats}
                            </Typography>
                          </Box>
                        </InfoBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <InfoBox>
                          <PeopleIcon color="info" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Booked Seats
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="info.main">
                              {schedule.booked_seats || 0} seats
                            </Typography>
                          </Box>
                        </InfoBox>
                      </Grid>
                    </Grid>

                    {/* Cancel Button */}
                    {schedule.schedule_status === 'ACTIVE' && schedule.booked_seats === 0 && (
                      <>
                        <Divider sx={{ my: 3 }} />
                        <Box display="flex" justifyContent="flex-end">
                          <Tooltip title="Cancel this schedule (only available when no bookings exist)">
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleCancelSchedule(schedule.schedule_id)}
                              sx={{
                                borderRadius: 2,
                                px: 3,
                                fontWeight: 'bold',
                                '&:hover': {
                                  bgcolor: 'error.light',
                                  color: 'white',
                                  borderColor: 'error.main',
                                },
                              }}
                            >
                              Cancel Schedule
                            </Button>
                          </Tooltip>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </StyledCard>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ScheduleList;