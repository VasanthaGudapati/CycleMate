import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Alert,
  Link,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  DirectionsBike,
  PersonOutlined,
  EmailOutlined,
  LockOutlined,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CyclingExperience, CyclingType } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    experience: 'Intermediate' as CyclingExperience,
    preferredType: 'Road cycling' as CyclingType,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    try {
      await register({
        name: formData.name,
        email: formData.email,
        experience: formData.experience,
        preferredType: formData.preferredType,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
        py: 4,
      }}
    >
      <Card sx={{ maxWidth: 520, width: '100%', p: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
              }}
            >
              <DirectionsBike sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
              Join the CycleMate Peloton
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Personalized ride tracking, smart routes, and intelligent coaching
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1.5 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1.5 }}
            />

            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Cycling Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <MenuItem value="Beginner">Beginner (0-1 yrs)</MenuItem>
                  <MenuItem value="Intermediate">Intermediate (1-3 yrs)</MenuItem>
                  <MenuItem value="Advanced">Advanced (3+ yrs)</MenuItem>
                  <MenuItem value="Pro">Pro / Racer</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Preferred Cycling Type"
                  name="preferredType"
                  value={formData.preferredType}
                  onChange={handleChange}
                >
                  <MenuItem value="Road cycling">Road cycling</MenuItem>
                  <MenuItem value="Mountain biking">Mountain biking</MenuItem>
                  <MenuItem value="Gravel">Gravel</MenuItem>
                  <MenuItem value="Commuting">Commuting</MenuItem>
                  <MenuItem value="Fitness">Fitness</MenuItem>
                  <MenuItem value="Recreation">Recreation</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ py: 1.4, fontWeight: 700, mb: 2.5 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create CycleMate Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2" fontWeight={600} color="primary.main">
                Already have an account? Sign in here
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
