import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  DirectionsBike,
  Map,
  History,
  TrendingUp,
  EmojiEvents,
  Leaderboard,
  Groups,
  Build,
  Psychology,
  Shield,
  AccountCircle,
  Settings,
  Brightness4,
  Brightness7,
  PlayArrow,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCycleTheme } from '../../context/ThemeContext';
import { useRideTracking } from '../../context/RideTrackingContext';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { label: 'Ride Tracking', path: '/track', icon: <DirectionsBike /> },
  { label: 'Routes', path: '/routes', icon: <Map /> },
  { label: 'Ride History', path: '/history', icon: <History /> },
  { label: 'Analytics', path: '/analytics', icon: <TrendingUp /> },
  { label: 'Challenges', path: '/challenges', icon: <EmojiEvents /> },
  { label: 'Leaderboard', path: '/leaderboard', icon: <Leaderboard /> },
  { label: 'Community', path: '/community', icon: <Groups /> },
  { label: 'Bike Garage', path: '/garage', icon: <Build /> },
  { label: 'AI Cycling Coach', path: '/coach', icon: <Psychology />, badge: 'AI' },
  { label: 'Safety & Weather', path: '/safety', icon: <Shield /> },
  { label: 'Profile', path: '/profile', icon: <AccountCircle /> },
  { label: 'Settings', path: '/settings', icon: <Settings /> },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { mode, toggleTheme } = useCycleTheme();
  const { isTracking } = useRideTracking();

  const xpPercent = user ? Math.round((user.xp / user.xpNextLevel) * 100) : 70;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box sx={{ p: 2.5, pb: 1 }}>
        {/* Brand Logo */}
        <Box
          onClick={() => navigate('/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
            }}
          >
            <DirectionsBike sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                fontFamily: "'Outfit', 'Inter', sans-serif",
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              Cycle<Typography component="span" variant="h6" color="primary.main" fontWeight={800}>Mate</Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Intelligent Companion
            </Typography>
          </Box>
        </Box>

        {/* Start Ride Hero CTA Button */}
        <Button
          fullWidth
          variant="contained"
          size="medium"
          startIcon={<PlayArrow />}
          onClick={() => navigate('/track')}
          sx={{
            py: 1.1,
            mb: 2,
            background: isTracking
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
              : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            boxShadow: isTracking
              ? '0 4px 14px rgba(239, 68, 68, 0.35)'
              : '0 4px 14px rgba(16, 185, 129, 0.35)',
            fontWeight: 700,
          }}
        >
          {isTracking ? 'Active Ride In Progress' : 'Start Riding'}
        </Button>

        {/* User XP & Level Progression Card */}
        {user && (
          <Box
            onClick={() => navigate('/profile')}
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: 'action.hover',
              cursor: 'pointer',
              mb: 2,
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Chip
                label={`Level ${user.level}`}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: '0.7rem', fontWeight: 800 }}
              />
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                {user.xp} / {user.xpNextLevel} XP
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={xpPercent} sx={{ height: 6, borderRadius: 3 }} />
          </Box>
        )}
      </Box>

      {/* Main Navigation List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1.5 }}>
        <List dense disablePadding>
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: '#ffffff',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#ffffff',
                      },
                      '& .MuiChip-root': {
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        color: '#ffffff',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? 'inherit' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      color="secondary"
                      sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Footer Section */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box
            onClick={() => navigate('/profile')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer', flexGrow: 1 }}
          >
            <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 34, height: 34 }} />
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {user?.name || 'Guest Cyclist'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                🔥 {user?.currentStreak || 0} Day Streak
              </Typography>
            </Box>
          </Box>
          <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode`}>
            <IconButton size="small" onClick={toggleTheme}>
              {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
};
