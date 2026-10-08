import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button } from '@mui/material';
import { Build, DirectionsBike, WarningAmber } from '@mui/icons-material';
import { Bike } from '../../types';

interface BikeCardProps {
  bike: Bike;
  onManageMaintenance: (bike: Bike) => void;
  onSetDefault?: (bikeId: string) => void;
}

export const BikeCard: React.FC<BikeCardProps> = ({
  bike,
  onManageMaintenance,
  onSetDefault,
}) => {
  const attentionCount = bike.components.filter(c => c.status !== 'Good').length;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={bike.image}
          alt={`${bike.brand} ${bike.model}`}
          sx={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 1,
          }}
        >
          {bike.isDefault && (
            <Chip
              label="Primary Bike"
              size="small"
              color="primary"
              sx={{ fontWeight: 700 }}
            />
          )}
          <Chip
            label={bike.type}
            size="small"
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.75)',
              color: '#ffffff',
              backdropFilter: 'blur(4px)',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
          {bike.brand} • {bike.year}
        </Typography>
        <Typography variant="h6" fontWeight={800} gutterBottom>
          {bike.model}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'action.hover',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Total Distance
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {bike.totalDistance.toLocaleString()} km
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Weight / Frame
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {bike.weightKg ? `${bike.weightKg} kg` : 'Alloy'}
            </Typography>
          </Box>
        </Box>

        {attentionCount > 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              px: 1.5,
              borderRadius: 2,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
              mb: 2,
            }}
          >
            <WarningAmber fontSize="small" sx={{ color: '#B45309' }} />
            <Typography variant="caption" fontWeight={700} sx={{ color: '#B45309' }}>
              {attentionCount} component{attentionCount > 1 ? 's' : ''} service recommended
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              px: 1.5,
              borderRadius: 2,
              bgcolor: 'success.light',
              color: 'success.dark',
              mb: 2,
            }}
          >
            <DirectionsBike fontSize="small" />
            <Typography variant="caption" fontWeight={700}>
              All components tuned & ready to ride
            </Typography>
          </Box>
        )}
      </CardContent>

      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<Build />}
          onClick={() => onManageMaintenance(bike)}
        >
          Maintenance
        </Button>
        {!bike.isDefault && onSetDefault && (
          <Button
            variant="outlined"
            onClick={() => onSetDefault(bike.id)}
            sx={{ minWidth: 100 }}
          >
            Set Primary
          </Button>
        )}
      </Box>
    </Card>
  );
};
