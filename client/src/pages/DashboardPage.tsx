import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Avatar,
  Stack,
  useTheme,
} from '@mui/material';
import {
  DirectionsBike,
  LocalFireDepartment,
  Speed,
  Timer,
  Terrain,
  Bolt,
  PlayArrow,
  ArrowForward,
  Psychology,
  EmojiEvents,
  TrendingUp,
  Map,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRideTracking } from '../context/RideTrackingContext';
import { apiService } from '../services/api';
import { Ride, Challenge } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ActivityChart } from '../components/charts/ActivityChart';
import { RideCard } from '../components/rides/RideCard';
import { weeklyDistanceStats } from '../data/mockData';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { isTracking } = useRideTracking();

  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [upcomingChallenge, setUpcomingChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ridesData, challengesData] = await Promise.all([
          apiService.getRides(),
          apiService.getChallenges(),
        ]);
        setRecentRides(ridesData.slice(0, 3));
        const activeCh = challengesData.find(c => c.joined && !c.completed) || challengesData[0];
        setUpcomingChallenge(activeCh);
      } catch (err) {
        console.error('Error loading dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const todayRide = recentRides[0];
  const weeklyGoalTarget = user?.weeklyGoalKm || 75;
  const weeklyProgress = user?.weeklyProgressKm || 52.6;
  const goalPercent = Math.min(100, Math.round((weeklyProgress / weeklyGoalTarget) * 100));

  return (
    <Box>
      {/* Header Greeting & Quick CTA */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3.5,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontFamily: "'Outfit', 'Inter', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            Good morning, {user?.name?.split(' ')[0] || 'Alex'} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ready for your next ride? Crisp tarmac and clear skies await.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<Map />}
            onClick={() => navigate('/routes')}
            sx={{ fontWeight: 600 }}
          >
            Browse Routes
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrow />}
            onClick={() => navigate('/track')}
            sx={{
              px: 3,
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            {isTracking ? 'Return to Ride' : 'Start Ride'}
          </Button>
        </Stack>
      </Box>

      {/* Top Section: Today's Ride Highlight Banner */}
      <Card
        sx={{
          mb: 3.5,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.03) 100%)',
          borderColor: 'primary.light',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label="TODAY'S RIDE"
                size="small"
                color="primary"
                sx={{ fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.05em' }}
              />
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                {todayRide?.title || 'Morning Tempo Run & Canyon Sprint'}
              </Typography>
            </Box>
            <Button
              size="small"
              endIcon={<ArrowForward />}
              onClick={() => navigate(`/rides/${todayRide?.id || 'ride-today'}`)}
              sx={{ fontWeight: 700 }}
            >
              Ride Summary
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Distance
                </Typography>
                <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                  {todayRide?.distance || 24.6}{' '}
                  <Typography component="span" variant="body2" color="text.secondary" fontWeight={600}>
                    km
                  </Typography>
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Average Speed
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                  {todayRide?.avgSpeed || 19.8}{' '}
                  <Typography component="span" variant="body2" color="text.secondary" fontWeight={600}>
                    km/h
                  </Typography>
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Ride Time
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                  1h 14m
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Elevation
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                  {todayRide?.elevation || 185}{' '}
                  <Typography component="span" variant="body2" color="text.secondary" fontWeight={600}>
                    m
                  </Typography>
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Calories
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                  {todayRide?.calories || 620}{' '}
                  <Typography component="span" variant="body2" color="text.secondary" fontWeight={600}>
                    kcal
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Grid: Weekly Progress Chart + Key Performance Cards */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Left Column: Weekly Progress Recharts Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: '100%', p: { xs: 2, sm: 2.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Weekly Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cycling volume for the last 7 days • 163.2 km total
                </Typography>
              </Box>
              <Chip
                icon={<TrendingUp sx={{ fontSize: 16 }} />}
                label="+12% vs last week"
                size="small"
                color="success"
                sx={{ fontWeight: 700 }}
              />
            </Box>

            <ActivityChart data={weeklyDistanceStats} height={260} />
          </Card>
        </Grid>

        {/* Right Column: Streak & Weekly Goal Progress */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2.5}>
            {/* Current Streak Card */}
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                borderLeft: '4px solid #F59E0B',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 38, height: 38 }}>
                    <LocalFireDepartment sx={{ color: '#fff' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                      🔥 {user?.currentStreak || 7} Day Streak
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You're on fire! Keep riding.
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Ride tomorrow to unlock the 8-Day Consecutive Master badge!
                </Typography>
              </CardContent>
            </Card>

            {/* Weekly Goal Card */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" textTransform="uppercase">
                    Weekly Goal
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                    {weeklyProgress} / {weeklyGoalTarget} km
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={goalPercent}
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {goalPercent}% completed
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="primary.main">
                    {Number((weeklyGoalTarget - weeklyProgress).toFixed(1))} km to target
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Secondary Grid: AI Coach Card & Upcoming Challenge */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* AI Cycling Coach Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderLeft: '4px solid #10B981',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                  <Psychology sx={{ color: '#fff' }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    🤖 Your AI Cycling Coach
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Real-time sports science telemetry engine
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.primary', mb: 2, lineHeight: 1.6 }}>
                "Your average speed improved by 8% this week. Your endurance is also trending upward. Pacing on the flats is optimal, but you lose ~12% speed in final 5km."
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recommended focus: 2x Zone 2 endurance spins + 1 interval session this weekend.
              </Typography>
            </CardContent>

            <Box sx={{ p: 3, pt: 0 }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                endIcon={<ArrowForward />}
                onClick={() => navigate('/coach')}
              >
                View Full Analysis & Chat
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Upcoming Challenge Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderLeft: '4px solid #0EA5E9',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'info.main', width: 40, height: 40 }}>
                    <EmojiEvents sx={{ color: '#fff' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>
                      {upcomingChallenge?.title || 'Weekend Warrior'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Active Challenge • {upcomingChallenge?.deadline || '2 days remaining'}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={<Bolt sx={{ fontSize: '14px !important' }} />}
                  label={`+${upcomingChallenge?.rewardXp || 500} XP`}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {upcomingChallenge?.description || 'Ride 50 km this weekend.'}
              </Typography>

              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Progress: {upcomingChallenge?.currentKm || 32} / {upcomingChallenge?.targetKm || 50} km
                  </Typography>
                  <Typography variant="caption" fontWeight={800} color="info.main">
                    {Math.round(((upcomingChallenge?.currentKm || 32) / (upcomingChallenge?.targetKm || 50)) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.round(((upcomingChallenge?.currentKm || 32) / (upcomingChallenge?.targetKm || 50)) * 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>

            <Box sx={{ p: 3, pt: 0 }}>
              <Button
                variant="outlined"
                color="info"
                fullWidth
                endIcon={<ArrowForward />}
                onClick={() => navigate('/challenges')}
              >
                View Challenge
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Rides Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>
            Recent Rides
          </Typography>
          <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/history')}>
            View All History
          </Button>
        </Box>

        <Grid container spacing={2.5}>
          {recentRides.map(ride => (
            <Grid size={{ xs: 12, md: 4 }} key={ride.id}>
              <RideCard ride={ride} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
