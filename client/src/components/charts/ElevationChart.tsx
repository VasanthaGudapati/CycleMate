import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

interface ElevationPoint {
  distance: number;
  elevation: number;
}

interface SpeedPoint {
  time: string;
  speed: number;
  heartRate?: number;
}

interface ElevationChartProps {
  data: ElevationPoint[];
  height?: number;
  color?: string;
}

export const ElevationChart: React.FC<ElevationChartProps> = ({
  data,
  height = 200,
  color = '#10B981',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
          />
          <XAxis
            dataKey="distance"
            unit="km"
            tickLine={false}
            tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }}
          />
          <YAxis
            domain={['auto', 'auto']}
            unit="m"
            tickLine={false}
            axisLine={false}
            tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: any) => [`${value} m`, 'Elevation']}
            labelFormatter={(label: any) => `Distance: ${label} km`}
            contentStyle={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="elevation"
            stroke={color}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#elevationGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

interface SpeedChartProps {
  data: SpeedPoint[];
  height?: number;
  color?: string;
}

export const SpeedChart: React.FC<SpeedChartProps> = ({
  data,
  height = 200,
  color = '#0EA5E9',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
          />
          <XAxis
            dataKey="time"
            tickLine={false}
            tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }}
          />
          <YAxis
            unit="km/h"
            tickLine={false}
            axisLine={false}
            tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: any, name: any) => [
              name === 'speed' ? `${value} km/h` : `${value} bpm`,
              name === 'speed' ? 'Speed' : 'Heart Rate',
            ]}
            contentStyle={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="speed"
            stroke={color}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#speedGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
