import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { ArrowForward, LocalFireDepartment, Speed, Timer, Terrain } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Ride } from '../../types';

interface RideCardProps {
  ride: Ride;
}

export const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  const navigate = useNavigate();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <Card
      onClick={() => navigate(`/rides/${ride.id}`)}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {ride.date}
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 0.2 }}>
              {ride.title}
            </Typography>
            {ride.routeName && (
              <Typography variant="body2" color="primary.main" fontWeight={500}>
                📍 {ride.routeName}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={ride.type}
              size="small"
              sx={{
                bgcolor: 'action.hover',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
            <IconButton size="small" color="primary">
              <ArrowForward fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1.5,
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Distance
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {ride.distance} <Typography component="span" variant="caption" color="text.secondary">km</Typography>
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Timer sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Time
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight={700}>
              {formatDuration(ride.duration)}
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Speed sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Avg
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight={700}>
              {ride.avgSpeed} <Typography component="span" variant="caption" color="text.secondary">km/h</Typography>
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Terrain sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Elevation
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight={700}>
              {ride.elevation} <Typography component="span" variant="caption" color="text.secondary">m</Typography>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
