import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, Rating } from '@mui/material';
import { Terrain, Timer, Navigation, Security } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../types';
import { useRideTracking } from '../../context/RideTrackingContext';

interface RouteCardProps {
  route: Route;
  onSelect?: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, onSelect }) => {
  const navigate = useNavigate();
  const { startRide } = useRideTracking();

  const getDifficultyColor = (diff: Route['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'success';
      case 'Moderate':
        return 'info';
      case 'Challenging':
        return 'warning';
      case 'Expert':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStartRoute = (e: React.MouseEvent) => {
    e.stopPropagation();
    startRide(route);
    navigate('/track');
  };

  return (
    <Card
      onClick={() => {
        if (onSelect) onSelect();
        else navigate(`/routes/${route.id}`);
      }}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip
            label={route.difficulty}
            size="small"
            color={getDifficultyColor(route.difficulty) as any}
            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
          />
          <Chip
            label={route.type}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem', fontWeight: 600 }}
          />
        </Box>

        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ lineHeight: 1.3 }}>
          {route.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {route.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, bgcolor: 'action.hover', p: 1, borderRadius: 2 }}>
          <Security sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="caption" fontWeight={600}>
            Safety Score: {route.safetyRating} / 5
          </Typography>
          <Rating value={route.safetyRating} precision={0.1} readOnly size="small" sx={{ ml: 'auto' }} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Distance
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {route.distance} <Typography component="span" variant="caption">km</Typography>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Est. Time
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {route.estTime}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Elevation
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {route.elevation} <Typography component="span" variant="caption">m</Typography>
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={() => navigate(`/routes/${route.id}`)}
        >
          View Route
        </Button>
        <Button
          fullWidth
          variant="contained"
          size="small"
          color="primary"
          startIcon={<Navigation />}
          onClick={handleStartRoute}
        >
          Ride
        </Button>
      </Box>
    </Card>
  );
};
