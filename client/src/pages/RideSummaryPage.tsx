import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  Speed,
  Timer,
  Terrain,
  LocalFireDepartment,
  Psychology,
  CheckCircle,
  Share,
  ArrowBack,
  BookmarkAdded,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { apiService } from '../services/api';
import { Ride } from '../types';
import { SpeedChart, ElevationChart } from '../components/charts/ElevationChart';
import { MapView } from '../components/map/MapView';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const RideSummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti on mount
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });

    const fetchRide = async () => {
      try {
        if (id) {
          const found = await apiService.getRideById(id);
          if (found) {
            setRide(found);
          } else {
            const allRides = await apiService.getRides();
            setRide(allRides[0]);
          }
        } else {
          const allRides = await apiService.getRides();
          setRide(allRides[0]);
        }
      } catch (err) {
        console.error('Error loading ride summary', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id]);

  if (loading || !ride) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const handleSave = () => {
    showToast('Ride telemetry and analysis confirmed in garage logs! 💾', 'success');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Ride summary link copied to clipboard! 🔗', 'success');
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Back button & Action Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/history')}
          sx={{ fontWeight: 600 }}
        >
          Ride History
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" startIcon={<Share />} onClick={handleShare}>
            Share Ride
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<BookmarkAdded />}
            onClick={handleSave}
            sx={{ fontWeight: 700 }}
          >
            Save Ride
          </Button>
        </Stack>
      </Box>

      {/* Hero Achievement Card */}
      <Card
        sx={{
          mb: 3.5,
          p: { xs: 2.5, sm: 3.5 },
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.05) 100%)',
          borderLeft: '5px solid #10B981',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Chip
              icon={<EmojiEvents sx={{ fontSize: 16 }} />}
              label="ACTIVITY COMPLETE • +50 XP"
              color="success"
              size="small"
              sx={{ fontWeight: 800, mb: 1 }}
            />
            <Typography variant="h3" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
              Great Ride! 🚴
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              {ride.title} • {ride.date}
            </Typography>
          </Box>
        </Box>

        {/* 6 Key Statistics Grid */}
        <Grid container spacing={2.5} sx={{ mt: 1 }}>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2.5, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                Distance
              </Typography>
              <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {ride.distance}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                km
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2.5, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                Duration
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {formatDuration(ride.duration)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                elapsed
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2.5, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                Avg Speed
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {ride.avgSpeed}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                km/h
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2.5, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                Max Speed
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {ride.maxSpeed}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                km/h
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2.5, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                Elevation
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {ride.elevation}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                meters
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2.5, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                Calories
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {ride.calories}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                kcal
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Map & Telemetry Profile Section */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Route Map Preview */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>
              GPS Route Trace
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 320 }}>
              <MapView
                height={320}
                path={ride.coordinates?.map(c => [c.lat, c.lng])}
              />
            </Box>
          </Card>
        </Grid>

        {/* Speed Profile Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Speed & Cadence Over Time
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Pacing consistency metric across ride intervals
              </Typography>
            </Box>
            <SpeedChart data={ride.speedProfile} height={260} />
          </Card>
        </Grid>
      </Grid>

      {/* Elevation Profile Chart */}
      <Card sx={{ p: 2.5, mb: 3.5 }}>
        <Typography variant="h6" fontWeight={800}>
          Elevation Profile (Meters vs Distance)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Climbing gradient visualization
        </Typography>
        <ElevationChart data={ride.elevationProfile} height={200} />
      </Card>

      {/* AI Ride Analysis & Recommendations */}
      <Card
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 3.5,
          borderLeft: '5px solid #0EA5E9',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              bgcolor: 'info.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Psychology sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              AI Ride Analysis
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sports science diagnostic on energy management and pacing
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.7, mb: 3 }}>
          {ride.aiAnalysis ||
            'You maintained a consistent pace during the first half of your ride. Your speed decreased slightly during the final 5 km, which suggests that endurance may be your next improvement area.'}
        </Typography>

        <Divider sx={{ mb: 2.5 }} />

        <Typography variant="subtitle1" fontWeight={800} gutterBottom>
          🎯 Actionable Recommendations
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 1 }}>
          {(ride.recommendations || [
            'Start the first 5 km slightly slower to preserve glycogen stores.',
            'Maintain a consistent cadence around 85–90 RPM during false flats.',
            'Hydrate before the final third of the ride.',
          ]).map((rec, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <CheckCircle color="primary" sx={{ fontSize: 20, mt: 0.3 }} />
              <Typography variant="body2" fontWeight={500}>
                {rec}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Card>

      {/* Bottom Navigation CTAs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<BookmarkAdded />}
          onClick={handleSave}
          sx={{ px: 4, py: 1.3, fontWeight: 700 }}
        >
          Save Ride
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<TrendingUp />}
          onClick={() => navigate('/analytics')}
          sx={{ px: 4, py: 1.3, fontWeight: 700 }}
        >
          View Analytics
        </Button>
      </Box>
    </Box>
  );
};
