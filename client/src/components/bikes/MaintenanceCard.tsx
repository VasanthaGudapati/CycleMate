import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, LinearProgress } from '@mui/material';
import { CheckCircle, Warning, Error as ErrorIcon, BuildCircle } from '@mui/icons-material';
import { BikeComponent } from '../../types';

interface MaintenanceCardProps {
  component: BikeComponent;
  onService: (component: BikeComponent) => void;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  component,
  onService,
}) => {
  const percent = Math.min(100, Math.round((component.distanceSinceReplacement / component.thresholdKm) * 100));

  const getStatusConfig = (status: BikeComponent['status']) => {
    switch (status) {
      case 'Good':
        return {
          color: 'success' as const,
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
          barColor: '#10B981',
          text: 'Good Condition',
        };
      case 'Due Soon':
        return {
          color: 'warning' as const,
          icon: <Warning sx={{ fontSize: 16 }} />,
          barColor: '#F59E0B',
          text: 'Service Recommended',
        };
      case 'Overdue':
        return {
          color: 'error' as const,
          icon: <ErrorIcon sx={{ fontSize: 16 }} />,
          barColor: '#EF4444',
          text: 'Service Overdue',
        };
    }
  };

  const config = getStatusConfig(component.status);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `4px solid ${config.barColor}`,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {component.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last serviced: {component.lastServicedDate}
            </Typography>
          </Box>
          <Chip
            icon={config.icon}
            label={config.text}
            size="small"
            color={config.color}
            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="body2" color="text.secondary">
              {component.distanceSinceReplacement.toLocaleString()} km since replacement
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {component.thresholdKm.toLocaleString()} km limit
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                bgcolor: config.barColor,
              },
            }}
          />
        </Box>

        {component.notes && (
          <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 2, mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              📝 Note: {component.notes}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          color={component.status === 'Good' ? 'inherit' : config.color}
          startIcon={<BuildCircle />}
          onClick={() => onService(component)}
        >
          Mark as Serviced
        </Button>
      </Box>
    </Card>
  );
};
