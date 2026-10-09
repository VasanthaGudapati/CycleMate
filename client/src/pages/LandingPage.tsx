import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  useTheme,
} from '@mui/material';
import {
  DirectionsBike,
  Map,
  TrendingUp,
  Psychology,
  Shield,
  EmojiEvents,
  PlayArrow,
  ArrowForward,
  CheckCircle,
  Speed,
  Favorite,
  Explore,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCycleTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { loginDemo } = useAuth();
  const { toggleTheme, mode } = useCycleTheme();

  const handleDemoAccess = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  const FEATURES = [
    {
      icon: <DirectionsBike sx={{ fontSize: 32 }} />,
      title: '🚴 Live Ride Tracking',
      desc: 'Simulated real-time GPS telemetry, speedometer, cadence, elevation gain, and instant ride profiles.',
      color: '#10B981',
    },
    {
      icon: <Map sx={{ fontSize: 32 }} />,
      title: '🗺️ Smart Routes',
      desc: 'Explore curated scenic circuits, safest vehicle-free trails, and elevation-graded climbs with waypoint details.',
      color: '#0EA5E9',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      title: '📊 Performance Analytics',
      desc: 'Deep-dive into weekly distance, pace trends, personal records, and granular VO2 max aerobic zones.',
      color: '#8B5CF6',
    },
    {
      icon: <Psychology sx={{ fontSize: 32 }} />,
      title: '🤖 AI Cycling Coach',
      desc: 'Conversational sports-science coaching that analyzes your telemetry and prescribes targeted training plans.',
      color: '#F59E0B',
    },
    {
      icon: <Shield sx={{ fontSize: 32 }} />,
      title: '🛡️ Ride Safety Beacon',
      desc: 'Emergency SOS beacon, automatic crash simulation, live link sharing, and real-time weather forecasts.',
      color: '#EF4444',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 32 }} />,
      title: '🏆 Challenges & XP',
      desc: 'Level up from Beginner to Pro, conquer weekend distance quests, earn badges, and climb the podium.',
      color: '#10B981',
    },
  ];

  const STEPS = [
    {
      step: '01',
      title: 'Plan Your Ride',
      desc: 'Choose from community-verified routes or pick your custom destination based on safety and elevation.',
    },
    {
      step: '02',
      title: 'Track With Precision',
      desc: 'Start simulated GPS tracking with live speed, calorie burn, heart rate, and real-time map waypoints.',
    },
    {
      step: '03',
      title: 'Analyze Performance',
      desc: 'Review interactive charts showing speed over time, gradient distribution, and effort consistency.',
    },
    {
      step: '04',
      title: 'Improve With AI Coach',
      desc: 'Receive AI-driven feedback highlighting pacing improvements and structured multi-week training protocols.',
    },
  ];

  const STATS = [
    { value: '50K+', label: 'Rides Tracked' },
    { value: '12K+', label: 'Active Cyclists' },
    { value: '1.2M+', label: 'Kilometers Logged' },
    { value: '95+', label: 'Verified Routes' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Top Marketing Header */}
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <DirectionsBike />
              </Box>
              <Typography variant="h6" fontWeight={800} sx={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                Cycle<Typography component="span" variant="h6" color="primary.main" fontWeight={800}>Mate</Typography>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Button variant="text" color="inherit" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="outlined" color="primary" onClick={handleDemoAccess}>
                Demo Account
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/register')}
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Start Riding
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 14 },
          background: isDark
            ? 'radial-gradient(ellipse at 50% 20%, rgba(16, 185, 129, 0.15) 0%, rgba(11, 15, 23, 0) 70%)'
            : 'radial-gradient(ellipse at 50% 20%, rgba(16, 185, 129, 0.1) 0%, rgba(248, 250, 252, 0) 70%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Chip
            icon={<Speed sx={{ fontSize: 16 }} />}
            label="Next-Generation Cycling Intelligence"
            color="primary"
            variant="outlined"
            sx={{ mb: 3, fontWeight: 700, px: 1 }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.8rem', sm: '4rem', md: '4.8rem' },
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              mb: 3,
            }}
          >
            Ride Smarter.{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Go Further.
            </Box>
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 680,
              mx: 'auto',
              mb: 5,
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
            }}
          >
            Your intelligent cycling companion for tracking rides, discovering better routes, improving performance, and riding safer.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PlayArrow />}
              onClick={() => navigate('/register')}
              sx={{ py: 1.6, px: 3.5, fontSize: '1.05rem', fontWeight: 700 }}
            >
              Start Riding
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleDemoAccess}
              sx={{ py: 1.6, px: 3, fontSize: '1.05rem', fontWeight: 600 }}
            >
              Explore Live Demo
            </Button>
          </Stack>

          {/* Quick Stats Banner */}
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {STATS.map((stat, idx) => (
              <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            *Platform statistics aggregated from verified simulation benchmark data.
          </Typography>
        </Container>
      </Box>

      {/* Why CycleMate Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" color="primary.main" fontWeight={800} letterSpacing="0.1em">
              WHY CYCLEMATE
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
              Engineered for Every Pedal Stroke
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 1.5 }}>
              From casual scenic weekend spins to grueling alpine climbs, CycleMate empowers your ride with intelligent insights and community camaraderie.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {FEATURES.map((feat, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1.5,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: 3,
                        bgcolor: `${feat.color}15`,
                        color: feat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                      }}
                    >
                      {feat.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {feat.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                      {feat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" color="primary.main" fontWeight={800} letterSpacing="0.1em">
              HOW IT WORKS
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
              Ride → Track → Analyze → Improve → Connect
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {STEPS.map((step, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 3.5,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    color="primary.light"
                    sx={{ opacity: 0.6, mb: 1, fontFamily: "'Outfit', sans-serif" }}
                  >
                    {step.step}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Footer Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: 'primary.dark',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: '#fff' }}>
            Ready to Elevate Your Cycling Journey?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', mb: 4, fontWeight: 400 }}>
            Join thousands of cyclists logging miles, conquering challenges, and unlocking peak performance.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleDemoAccess}
            sx={{
              bgcolor: '#ffffff',
              color: 'primary.dark',
              fontWeight: 800,
              px: 4,
              py: 1.5,
              fontSize: '1.05rem',
              '&:hover': { bgcolor: '#F1F5F9' },
            }}
          >
            Launch CycleMate Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};
