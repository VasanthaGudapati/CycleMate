import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

interface ActivityChartProps {
  data: { day: string; distance: number; speed?: number; calories?: number }[];
  height?: number;
  barColor?: string;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({
  data,
  height = 260,
  barColor,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const defaultBarColor = barColor || theme.palette.primary.main;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" fontWeight={700}>
            {label}
          </Typography>
          <Typography variant="body2" color="primary.main" fontWeight={600}>
            Distance: {item.distance} km
          </Typography>
          {item.calories && (
            <Typography variant="caption" color="text.secondary" display="block">
              Burn: {item.calories} kcal
            </Typography>
          )}
          {item.speed && (
            <Typography variant="caption" color="text.secondary" display="block">
              Avg Speed: {item.speed} km/h
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
          />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }}
            tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12, fontWeight: 500 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }}
            unit="km"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }} />
          <Bar dataKey="distance" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.distance >= 30 ? '#10B981' : defaultBarColor}
                opacity={entry.distance >= 30 ? 1 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
