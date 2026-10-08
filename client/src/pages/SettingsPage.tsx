import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  MenuItem,
  Divider,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Stack,
  Alert,
} from '@mui/material';
import {
  Save,
  Brightness4,
  Brightness7,
  Straighten,
  Notifications,
  Lock,
  RestartAlt,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCycleTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import { CyclingExperience, CyclingType } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const { mode, toggleTheme, setMode } = useCycleTheme();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@cyclemate.io',
    city: user?.city || 'Boulder, Colorado',
    bio: user?.bio || '',
    experience: (user?.experience || 'Intermediate') as CyclingExperience,
    preferredType: (user?.preferredType || 'Road cycling') as CyclingType,
    weeklyGoalKm: user?.weeklyGoalKm || 75,
  });

  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [notifyRides, setNotifyRides] = useState(true);
  const [notifyChallenges, setNotifyChallenges] = useState(true);
  const [notifyMaintenance, setNotifyMaintenance] = useState(true);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.updateUser(formData);
      await refreshUser();
      showToast('Profile and preferences updated successfully! 💾', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    }
  };

  const handleResetDemoData = () => {
    localStorage.clear();
    showToast('Demo state reset. Reloading CycleMate...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <Box sx={{ maxWidth: 840, mx: 'auto', pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
          Preferences & Settings ⚙️
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your cyclist profile, units, display theme, and notification preferences.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Profile Card */}
        <Card sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Cyclist Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Personal information displayed across community and leaderboard standings.
          </Typography>

          <Box component="form" onSubmit={handleSaveProfile}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Location / City"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  type="number"
                  fullWidth
                  label="Weekly Target Goal (km)"
                  value={formData.weeklyGoalKm}
                  onChange={e => setFormData({ ...formData, weeklyGoalKm: parseFloat(e.target.value) || 50 })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Experience Level"
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value as any })}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                  <MenuItem value="Pro">Pro / Racer</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Primary Cycling Type"
                  value={formData.preferredType}
                  onChange={e => setFormData({ ...formData, preferredType: e.target.value as any })}
                >
                  <MenuItem value="Road cycling">Road cycling</MenuItem>
                  <MenuItem value="Mountain biking">Mountain biking</MenuItem>
                  <MenuItem value="Gravel">Gravel</MenuItem>
                  <MenuItem value="Commuting">Commuting</MenuItem>
                  <MenuItem value="Fitness">Fitness</MenuItem>
                  <MenuItem value="Recreation">Recreation</MenuItem>
                </TextField>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Bio"
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell fellow cyclists about your cycling goals..."
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                sx={{ fontWeight: 700, px: 3 }}
              >
                Save Profile
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Display & Measurement Units */}
        <Card sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Display & Measurement Units
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure theme aesthetics and distance measurement standards.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1 }}>
                  Interface Theme Mode
                </FormLabel>
                <RadioGroup
                  row
                  value={mode}
                  onChange={e => setMode(e.target.value as any)}
                >
                  <FormControlLabel value="light" control={<Radio />} label="Light Mode ☀️" />
                  <FormControlLabel value="dark" control={<Radio />} label="Dark Mode 🌙" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1 }}>
                  Measurement Standard
                </FormLabel>
                <RadioGroup
                  row
                  value={unitSystem}
                  onChange={e => setUnitSystem(e.target.value as any)}
                >
                  <FormControlLabel value="metric" control={<Radio />} label="Metric (km, m, km/h)" />
                  <FormControlLabel value="imperial" control={<Radio />} label="Imperial (mi, ft, mph)" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Notification Preferences */}
        <Card sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Notification Alerts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose what notifications you wish to receive from CycleMate.
          </Typography>

          <Stack spacing={1}>
            <FormControlLabel
              control={<Switch checked={notifyRides} onChange={e => setNotifyRides(e.target.checked)} color="primary" />}
              label="Ride telemetry summaries and AI analysis digests"
            />
            <FormControlLabel
              control={<Switch checked={notifyChallenges} onChange={e => setNotifyChallenges(e.target.checked)} color="primary" />}
              label="Weekly challenge reminders and leaderboard position changes"
            />
            <FormControlLabel
              control={<Switch checked={notifyMaintenance} onChange={e => setNotifyMaintenance(e.target.checked)} color="primary" />}
              label="Bike garage maintenance wear alerts (Chain, Brake pads)"
            />
          </Stack>
        </Card>

        {/* Account & Demo Management */}
        <Card sx={{ p: { xs: 2.5, sm: 3.5 }, borderColor: 'error.light' }}>
          <Typography variant="h6" fontWeight={800} color="error.main" gutterBottom>
            Account & Data Reset
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Reset local test session data back to the clean baseline demo state.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<RestartAlt />}
              onClick={handleResetDemoData}
            >
              Reset All Demo State
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
            >
              Sign Out
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
};
