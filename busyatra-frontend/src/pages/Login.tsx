import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  Stack,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
  Grid,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  DirectionsBus as BusIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  LocalOffer as OfferIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success('Welcome back! Login successful');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.4,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ my: 'auto', position: 'relative', zIndex: 1 }}>
        <Grid container spacing={0} sx={{ minHeight: { md: '600px' } }}>
          {/* Left Side - Branding & Features */}
          {!isMobile && (
            <Grid item md={6}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: 6,
                  borderRadius: '24px 0 0 24px',
                  background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.95) 0%, rgba(42, 82, 152, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-30%',
                    width: '500px',
                    height: '500px',
                    background: alpha('#fff', 0.05),
                    borderRadius: '50%',
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  {/* Logo */}
                  <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        bgcolor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      }}
                    >
                      <BusIcon sx={{ fontSize: 36, color: '#1e3c72' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">
                        BusYatra
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Your Journey Partner
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Welcome Message */}
                  <Typography variant="h3" fontWeight={800} mb={2} letterSpacing="-1px">
                    Welcome Back!
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 6, fontWeight: 400 }}>
                    Book your next journey in seconds
                  </Typography>

                  {/* Features */}
                  <Stack spacing={3}>
                    {[
                      { icon: <LocationIcon />, text: '500+ Routes Across India' },
                      { icon: <ScheduleIcon />, text: 'Real-time Bus Tracking' },
                      { icon: <OfferIcon />, text: 'Exclusive Deals & Offers' },
                      { icon: <CheckIcon />, text: 'Secure & Easy Booking' },
                    ].map((feature, idx) => (
                      <Stack
                        key={idx}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha('#fff', 0.1),
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s',
                          '&:hover': {
                            bgcolor: alpha('#fff', 0.15),
                            transform: 'translateX(8px)',
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: alpha('#fff', 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="body1" fontWeight={600}>
                          {feature.text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1, mt: 4 }}>
                  <Grid item xs={4}>
                    <Box>
                      <Typography variant="h4" fontWeight={800}>
                        10K+
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Happy Travelers
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <Typography variant="h4" fontWeight={800}>
                        500+
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Bus Routes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <Typography variant="h4" fontWeight={800}>
                        4.8★
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        User Rating
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                p: { xs: 4, sm: 6 },
                borderRadius: { xs: 4, md: '0 24px 24px 0' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: 'white',
              }}
            >
              {/* Mobile Logo */}
              {isMobile && (
                <Stack direction="row" spacing={2} alignItems="center" mb={4} justifyContent="center">
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BusIcon sx={{ fontSize: 30, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" fontWeight={800} color="primary">
                    BusBook
                  </Typography>
                </Stack>
              )}

              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
                  Sign In
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={4}>
                  Enter your credentials to access your account
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />

                  {/* Password Field */}
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />

                  {/* Remember Me & Forgot Password */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                  >
                    <Stack direction="row" alignItems="center" spacing={-1}>
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: 'primary.main',
                          '&.Mui-checked': {
                            color: 'primary.main',
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Remember me
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      component={Link}
                      to="/forgot-password"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Forgot Password?
                    </Typography>
                  </Stack>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    endIcon={!loading && <ArrowIcon />}
                    sx={{
                      py: 1.8,
                      borderRadius: 2,
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                      boxShadow: '0 8px 24px rgba(30, 60, 114, 0.3)',
                      mb: 3,
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
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  {/* Divider */}
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  {/* Register Link */}
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?
                    </Typography>
                    <Typography
                      variant="body2"
                      component={Link}
                      to="/register"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Create Account
                    </Typography>
                  </Stack>

                  {/* Quick Info Chips */}
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    justifyContent="center" 
                    flexWrap="wrap"
                    gap={1}
                    sx={{ mt: 4 }}
                  >
                    <Chip
                      icon={<CheckIcon />}
                      label="Instant Booking"
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: alpha(theme.palette.primary.main, 0.3) }}
                    />
                    <Chip
                      icon={<CheckIcon />}
                      label="Secure Payment"
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: alpha(theme.palette.primary.main, 0.3) }}
                    />
                    <Chip
                      icon={<CheckIcon />}
                      label="24/7 Support"
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: alpha(theme.palette.primary.main, 0.3) }}
                    />
                  </Stack>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;