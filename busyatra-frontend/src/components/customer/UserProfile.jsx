import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  IconButton,
  Divider,
  Chip,
  Stack,
  InputAdornment,
  Paper,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarMonth as CalendarIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  DirectionsBus as BusIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    mobile_number: user?.mobile_number || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      mobile_number: user?.mobile_number || ''
    });
    setEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: (theme) => alpha(theme.palette.common.white, 0.1),
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
          }
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              fontSize: '2.5rem',
              bgcolor: 'white',
              color: '#667eea',
              border: '4px solid white',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            }}
          >
            {getInitials(user?.full_name)}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {user?.full_name || 'Guest User'}
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
              <Chip
                icon={<VerifiedIcon />}
                label="Verified Customer"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<BusIcon />}
                label="Bus Traveler"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Stack>
          </Box>
          {!editing && (
            <IconButton
              onClick={() => setEditing(true)}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                '&:hover': {
                  bgcolor: alpha('#fff', 0.9),
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s',
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </Stack>
      </Paper>

      {/* Profile Information Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Personal Information
            </Typography>
            {editing && (
              <Chip
                label="Editing Mode"
                color="primary"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Stack>

          <Divider sx={{ mb: 4 }} />

          <Box component="form" onSubmit={handleUpdate}>
            <Grid container spacing={3}>
              {/* Full Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={editing ? formData.full_name : user?.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color={editing ? 'primary' : 'action'} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: editing ? 'background.paper' : 'action.hover',
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: editing ? 'background.paper' : 'action.hover',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Email Address */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                    },
                  }}
                />
              </Grid>

              {/* Mobile Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={editing ? formData.mobile_number : user?.mobile_number || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, mobile_number: value });
                  }}
                  disabled={!editing}
                  inputProps={{
                    maxLength: 10,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color={editing ? 'primary' : 'action'} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: editing ? 'background.paper' : 'action.hover',
                      transition: 'all 0.3s',
                    },
                  }}
                />
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  value={formatDate(user?.date_of_birth)}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            {editing && (
              <Stack
                direction="row"
                spacing={2}
                mt={4}
                pt={3}
                borderTop={1}
                borderColor="divider"
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<CloseIcon />}
                  onClick={handleCancel}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Account Stats Card */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Total Bookings
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Completed Trips
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="warning.main" gutterBottom>
              ₹0
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Total Spent
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;