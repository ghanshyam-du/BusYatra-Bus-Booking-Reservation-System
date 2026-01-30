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
  } from '@mui/material';
  import {
    MailOutline,
    LockOutlined,
    Visibility,
    VisibilityOff,
  } from '@mui/icons-material';
  import { useAuth } from '../context/AuthContext';
  import toast from 'react-hot-toast';

  const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: { target: { name: any; value: any; }; }) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      setLoading(true);
      try {
        await login(formData);
        toast.success('Login successful!');
        navigate('/');
      } catch (err) {
        toast.error('Login failed');
      } finally {
        setLoading(false);
      }
    };

    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519681393784-d120267933ba')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Glass Card */}
        <Container
          maxWidth="sm"
          sx={{
            backdropFilter: 'blur(18px)',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 4,
            padding: 6,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            color: '#fff',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight={600}
            mb={5}
            letterSpacing={1}
          >
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>

            {/* Email */}
            <TextField
              fullWidth
              variant="standard"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                input: { color: '#fff', fontSize: '1.05rem' },
                mb: 4,
              }}
            />

            {/* Password */}
            <TextField
              fullWidth
              variant="standard"
              name="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                input: { color: '#fff', fontSize: '1.05rem' },
                mb: 4,
              }}
            />

            {/* Remember / Forgot */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Box display="flex" alignItems="center">
                <Checkbox sx={{ color: '#fff' }} />
                <Typography variant="body2">Remember me</Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{ cursor: 'pointer', opacity: 0.8 }}
              >
                Forgot Password?
              </Typography>
            </Box>

            {/* Button */}
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                background: '#fff',
                color: '#000',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': { background: '#f1f1f1' },
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>

          {/* Footer */}
          <Typography
            align="center"
            mt={4}
            variant="body2"
            sx={{ opacity: 0.85 }}
          >
            Don’t have an account?{' '}
            <Link
              to="/register"
              style={{ color: '#fff', fontWeight: 600 }}
            >
              Register
            </Link>
          </Typography>
        </Container>
      </Box>
    );
  };

  export default LoginPage;
