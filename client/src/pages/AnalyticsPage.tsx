import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Stack,
  useTheme,
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  Speed,
  Timer,
  Terrain,
  LocalFireDepartment,
  DirectionsBike,
  Bolt,
  CalendarMonth,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { weeklyDistanceStats } from '../data/mockData';

const MONTHLY_STATS = [
  { month: 'May', distance: 120, rides: 5, elevation: 850 },
  { month: 'Jun', distance: 185, rides: 7, elevation: 1240 },
  { month: 'Jul', distance: 240, rides: 9, elevation: 1820 },
  { month: 'Aug', distance: 295, rides: 11, elevation: 2100 },
  { month: 'Sep', distance: 280, rides: 10, elevation: 1940 },
  { month: 'Oct', distance: 164, rides: 5, elevation: 1120 },
];

const SPEED_TRENDS = [
  { week: 'Wk 1', avgSpeed: 18.4, maxSpeed: 31.0 },
  { week: 'Wk 2', avgSpeed: 18.9, maxSpeed: 32.5 },
  { week: 'Wk 3', avgSpeed: 19.3, maxSpeed: 35.0 },
  { week: 'Wk 4', avgSpeed: 19.8, maxSpeed: 34.2 },
  { week: 'Wk 5', avgSpeed: 20.4, maxSpeed: 41.2 },
];

export const AnalyticsPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { user } = useAuth();

  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Performance Analytics 📊
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Continuous telemetry metrics, aerobic progression, and personal records.
          </Typography>
        </Box>
        <ToggleButtonGroup
          size="small"
          value={timeRange}
          exclusive
          onChange={(_e, val) => val && setTimeRange(val)}
        >
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 7 High-Level Key Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Total Distance"
            value={user?.totalDistance || 1284.5}
            unit="km"
            icon={<DirectionsBike />}
            change="+14.2%"
            subtitle="vs last month"
            accentColor="#10B981"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Total Rides"
            value={user?.totalRides || 47}
            unit="rides"
            icon={<CalendarMonth />}
            change="+4 rides"
            subtitle="consistent pace"
            accentColor="#0EA5E9"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Total Ride Time"
            value="58h 40m"
            icon={<Timer />}
            subtitle="saddle endurance"
            accentColor="#8B5CF6"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Average Speed"
            value="20.4"
            unit="km/h"
            icon={<Speed />}
            change="+8.4%"
            subtitle="aerobic lift"
            accentColor="#F59E0B"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Best Speed"
            value="41.2"
            unit="km/h"
            icon={<Bolt />}
            subtitle="Marshall descent"
            accentColor="#EF4444"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Total Elevation"
            value="8,420"
            unit="m"
            icon={<Terrain />}
            change="+920m"
            subtitle="climbed"
            accentColor="#10B981"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Calories Burned"
            value="36,400"
            unit="kcal"
            icon={<LocalFireDepartment />}
            subtitle="metabolic energy"
            accentColor="#F97316"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Current Streak"
            value={`${user?.currentStreak || 7} Days`}
            icon={<EmojiEvents />}
            change="Active"
            subtitle="unbroken"
            accentColor="#EAB308"
          />
        </Grid>
      </Grid>

      {/* Personal Records Trophy Cabinet */}
      <Card sx={{ p: 3, mb: 3.5, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <EmojiEvents sx={{ color: '#F59E0B', fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
              Personal Records Cabinet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              All-time lifetime high-water marks verified by CycleMate
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                🏆 Longest Ride
              </Typography>
              <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ my: 0.5, fontFamily: "'Outfit', sans-serif" }}>
                68.4 <Typography component="span" variant="h6" color="text.secondary">km</Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Walker Ranch High Alpine Loop • Sep 27
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                ⚡ Highest Speed
              </Typography>
              <Typography variant="h3" fontWeight={800} color="error.main" sx={{ my: 0.5, fontFamily: "'Outfit', sans-serif" }}>
                41.2 <Typography component="span" variant="h6" color="text.secondary">km/h</Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lookout Canyon Descent • Sep 20
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                ⛰️ Highest Elevation
              </Typography>
              <Typography variant="h3" fontWeight={800} color="info.main" sx={{ my: 0.5, fontFamily: "'Outfit', sans-serif" }}>
                620 <Typography component="span" variant="h6" color="text.secondary">m</Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Flagstaff Summit Pass • Sep 27
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Card>

      {/* Analytics Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Distance Volume Chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  {timeRange === 'weekly' ? 'Weekly Distance (km)' : 'Monthly Mileage Progression'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consistent progressive aerobic volume
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeRange === 'weekly' ? weeklyDistanceStats : MONTHLY_STATS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                  <XAxis dataKey={timeRange === 'weekly' ? 'day' : 'month'} tickLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} />
                  <YAxis unit="km" tickLine={false} axisLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="distance" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Speed Trend Line Chart */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={800}>
                Average Speed Progression
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Weekly velocity & acceleration metrics
              </Typography>
            </Box>

            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SPEED_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                  <XAxis dataKey="week" tickLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} />
                  <YAxis unit="km/h" domain={[16, 24]} tickLine={false} axisLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                      borderRadius: 8,
                    }}
                  />
                  <Line type="monotone" dataKey="avgSpeed" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
