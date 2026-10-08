import React, { useState } from 'react';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Fab,
} from '@mui/material';
import {
  Dashboard,
  DirectionsBike,
  Map,
  Build,
  MoreHoriz,
  Psychology,
  EmojiEvents,
  Leaderboard,
  Groups,
  Shield,
  AccountCircle,
  Settings,
  History,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRideTracking } from '../../context/RideTrackingContext';

interface MobileNavigationProps {
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  drawerOpen,
  onCloseDrawer,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isTracking } = useRideTracking();

  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const getActiveTab = () => {
    if (location.pathname.startsWith('/dashboard')) return 0;
    if (location.pathname.startsWith('/track')) return 1;
    if (location.pathname.startsWith('/routes')) return 2;
    if (location.pathname.startsWith('/garage')) return 3;
    return 4;
  };

  const MORE_ITEMS = [
    { label: 'AI Cycling Coach', path: '/coach', icon: <Psychology color="primary" /> },
    { label: 'Community Feed', path: '/community', icon: <Groups color="primary" /> },
    { label: 'Performance Analytics', path: '/analytics', icon: <TrendingUp color="primary" /> },
    { label: 'Challenges', path: '/challenges', icon: <EmojiEvents color="primary" /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Leaderboard color="primary" /> },
    { label: 'Ride History', path: '/history', icon: <History color="primary" /> },
    { label: 'Safety & Weather', path: '/safety', icon: <Shield color="primary" /> },
    { label: 'Profile', path: '/profile', icon: <AccountCircle color="primary" /> },
    { label: 'Settings', path: '/settings', icon: <Settings color="primary" /> },
  ];

  return (
    <>
      {/* Bottom bar for mobile */}
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: 'block', md: 'none' },
          zIndex: 1100,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <BottomNavigation
          showLabels
          value={getActiveTab()}
          onChange={(_event, newValue) => {
            if (newValue === 0) navigate('/dashboard');
            else if (newValue === 1) navigate('/track');
            else if (newValue === 2) navigate('/routes');
            else if (newValue === 3) navigate('/garage');
            else if (newValue === 4) setMoreDrawerOpen(true);
          }}
          sx={{ height: 64 }}
        >
          <BottomNavigationAction label="Home" icon={<Dashboard />} />
          <BottomNavigationAction
            label={isTracking ? 'Active' : 'Track'}
            icon={
              <Box sx={{ position: 'relative' }}>
                <DirectionsBike sx={{ color: isTracking ? 'error.main' : 'inherit' }} />
                {isTracking && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                    }}
                  />
                )}
              </Box>
            }
          />
          <BottomNavigationAction label="Routes" icon={<Map />} />
          <BottomNavigationAction label="Garage" icon={<Build />} />
          <BottomNavigationAction label="More" icon={<MoreHoriz />} />
        </BottomNavigation>
      </Paper>

      {/* Slide-over Drawer for More Links */}
      <Drawer
        anchor="bottom"
        open={moreDrawerOpen || drawerOpen}
        onClose={() => {
          setMoreDrawerOpen(false);
          onCloseDrawer();
        }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80vh',
            pb: 4,
          },
        }}
      >
        <Box sx={{ p: 2.5, pb: 1, textAlign: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 2,
              bgcolor: 'divider',
              mx: 'auto',
              mb: 2,
            }}
          />
          <Typography variant="h6" fontWeight={800}>
            CycleMate Hub
          </Typography>
        </Box>
        <Divider />
        <List sx={{ px: 1 }}>
          {MORE_ITEMS.map(item => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  setMoreDrawerOpen(false);
                  onCloseDrawer();
                  navigate(item.path);
                }}
                sx={{ borderRadius: 2, py: 1.2 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};
