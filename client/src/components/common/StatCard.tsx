import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  accentColor?: string;
  compact?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  subtitle,
  change,
  isPositive = true,
  accentColor,
  compact = false,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: accentColor ? `4px solid ${accentColor}` : undefined,
      }}
    >
      <CardContent sx={{ p: compact ? 2 : 2.5, '&:last-child': { pb: compact ? 2 : 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                p: 0.8,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: accentColor ? `${accentColor}18` : 'primary.light',
                color: accentColor || 'primary.main',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
          <Typography
            variant={compact ? 'h5' : 'h4'}
            component="span"
            fontWeight={800}
            sx={{
              fontFamily: "'Outfit', 'Inter', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            {value}
          </Typography>
          {unit && (
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {unit}
            </Typography>
          )}
        </Box>

        {(subtitle || change) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            {change && (
              <Chip
                label={change}
                size="small"
                color={isPositive ? 'success' : 'error'}
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  borderRadius: 1,
                }}
              />
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
