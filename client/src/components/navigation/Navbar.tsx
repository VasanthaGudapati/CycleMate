import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Brightness4,
  Brightness7,
  DirectionsBike,
  Person,
  Settings as SettingsIcon,
  ExitToApp,
  WbSunny,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCycleTheme } from '../../context/ThemeContext';
import { useRideTracking } from '../../context/RideTrackingContext';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useCycleTheme();
  const { isTracking, currentSpeed, distanceKm } = useRideTracking();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/track')) return 'Live Ride Tracking';
    if (path.startsWith('/rides/')) return 'Ride Summary';
    if (path.startsWith('/routes/')) return 'Route Details';
    if (path.startsWith('/routes')) return 'Explore Routes';
    if (path.startsWith('/history')) return 'Ride History';
    if (path.startsWith('/analytics')) return 'Performance Analytics';
    if (path.startsWith('/challenges')) return 'Challenges & Goals';
    if (path.startsWith('/leaderboard')) return 'Community Leaderboard';
    if (path.startsWith('/community')) return 'Cyclist Community';
    if (path.startsWith('/garage')) return 'My Bike Garage';
    if (path.startsWith('/coach')) return 'AI Cycling Coach';
    if (path.startsWith('/safety')) return 'Ride Safety & Weather';
    if (path.startsWith('/profile')) return 'Cyclist Profile';
    if (path.startsWith('/settings')) return 'Preferences & Settings';
    return 'CycleMate';
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
        {/* Left: Mobile hamburger & title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onOpenMobileMenu}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              fontFamily: "'Outfit', 'Inter', sans-serif",
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            {getPageTitle(location.pathname)}
          </Typography>
        </Box>

        {/* Center: Live GPS Activity Pill if ride is active */}
        {isTracking && (
          <Box
            onClick={() => navigate('/track')}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1.2,
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              borderRadius: 9999,
              px: 2,
              py: 0.6,
              cursor: 'pointer',
              animation: 'pulse-ring 2s infinite',
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#EF4444' }} />
            <Typography variant="caption" fontWeight={800} color="error.main">
              LIVE RIDE: {currentSpeed} km/h • {distanceKm.toFixed(1)} km
            </Typography>
          </Box>
        )}

        {/* Right actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {/* Quick weather pill */}
          <Chip
            icon={<WbSunny sx={{ fontSize: '15px !important', color: '#F59E0B' }} />}
            label="27°C • Sunny"
            size="small"
            onClick={() => navigate('/safety')}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              fontWeight: 600,
              bgcolor: 'action.hover',
              cursor: 'pointer',
            }}
          />

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode`}>
            <IconButton size="small" onClick={toggleTheme}>
              {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton size="small">
              <Badge badgeContent={2} color="primary">
                <Notifications fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Avatar Menu */}
          <Box sx={{ ml: 0.5 }}>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{ width: 34, height: 34, border: '2px solid #10B981' }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: { width: 220, borderRadius: 2.5, mt: 1 },
              }}
            >
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {user?.name || 'Alex Morgan'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || 'alex.morgan@cyclemate.io'}
                </Typography>
                <Chip
                  label={`Level ${user?.level || 12} Cyclist`}
                  size="small"
                  color="primary"
                  sx={{ mt: 1, height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                />
              </Box>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                <Person sx={{ mr: 1.5, fontSize: 18, color: 'text.secondary' }} /> Profile
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
                <SettingsIcon sx={{ mr: 1.5, fontSize: 18, color: 'text.secondary' }} /> Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ExitToApp sx={{ mr: 1.5, fontSize: 18 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
