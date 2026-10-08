import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Warning,
  Share,
  Security,
  Speed,
  Timer,
  Terrain,
  LocalFireDepartment,
  Favorite,
  FastForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useRideTracking } from '../context/RideTrackingContext';
import { MapView } from '../components/map/MapView';
import { useToast } from '../context/ToastContext';
import { SpeedChart } from '../components/charts/ElevationChart';

export const RideTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    isTracking,
    isPaused,
    activeRoute,
    elapsedSeconds,
    currentSpeed,
    avgSpeed,
    maxSpeed,
    distanceKm,
    caloriesBurned,
    currentElevation,
    elevationGain,
    currentPosition,
    pathHistory,
    speedProfile,
    heartRate,
    startRide,
    pauseRide,
    resumeRide,
    finishRide,
    cancelRide,
    simulationMultiplier,
    setSimulationMultiplier,
  } = useRideTracking();

  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosActive, setSosActive] = useState(false);
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Format seconds to hh:mm:ss
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishConfirm = async () => {
    setIsFinishing(true);
    try {
      const savedRide = await finishRide();
      setFinishModalOpen(false);
      if (savedRide) {
        navigate(`/rides/${savedRide.id}`);
      } else {
        navigate('/history');
      }
    } finally {
      setIsFinishing(false);
    }
  };

  const handleTriggerSos = () => {
    setSosModalOpen(true);
    setSosCountdown(5);
    setSosActive(true);
  };

  const handleShareLiveRide = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Live tracking link copied to clipboard! 🔗 Share with family/friends.', 'success');
  };

  return (
    <Box sx={{ pb: 3 }}>
      {/* Top Banner & Control Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
              {isTracking ? (isPaused ? 'Ride Paused ⏸️' : 'Live Ride Tracking 🚴') : 'Ride Tracking Mode'}
            </Typography>
            {isTracking && !isPaused && (
              <Chip
                label="GPS ACTIVE"
                color="error"
                size="small"
                sx={{ fontWeight: 800, animation: 'pulse-ring 1.8s infinite' }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {activeRoute ? `Route: ${activeRoute.name}` : 'Free Ride • Boulder, CO'}
          </Typography>
        </Box>

        {/* Speed Simulation Multiplier & Quick Safety Action */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Tooltip title="Cycle simulation speed (1x or 3x for quick testing)">
            <Button
              variant="outlined"
              size="small"
              startIcon={<FastForward />}
              onClick={() => setSimulationMultiplier(simulationMultiplier === 1 ? 3 : 1)}
              sx={{ fontWeight: 700 }}
            >
              Demo Speed: {simulationMultiplier}x
            </Button>
          </Tooltip>

          <Button
            variant="outlined"
            size="small"
            color="info"
            startIcon={<Share />}
            onClick={handleShareLiveRide}
          >
            Share Live Ride
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<Security />}
            onClick={handleTriggerSos}
            sx={{ fontWeight: 700 }}
          >
            SOS Beacon
          </Button>
        </Stack>
      </Box>

      {/* Main Grid: Telemetry Gauges + Map View */}
      <Grid container spacing={3}>
        {/* Left Column: Big Telemetry Gauges */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2.5}>
            {/* Primary Speedometer Card */}
            <Card
              sx={{
                textAlign: 'center',
                p: 3,
                background: isTracking && !isPaused
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.04) 100%)'
                  : 'background.paper',
                border: isTracking && !isPaused ? '2px solid #10B981' : undefined,
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase" letterSpacing="0.08em">
                Current Speed
              </Typography>
              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  fontFamily: "'Outfit', 'Inter', sans-serif",
                  fontSize: { xs: '4.5rem', sm: '5.5rem' },
                  lineHeight: 1,
                  my: 1,
                  color: isTracking && !isPaused ? 'primary.main' : 'text.primary',
                }}
              >
                {isTracking && !isPaused ? currentSpeed : '0.0'}
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                km/h
              </Typography>

              {/* Heart rate & Max speed indicators */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  mt: 2.5,
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Avg Speed
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {avgSpeed} km/h
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Max Speed
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {maxSpeed} km/h
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Heart Rate
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="error.main">
                    {isTracking && !isPaused ? `${heartRate} bpm` : '--'}
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Core Metrics Grid */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
                    <Timer fontSize="small" />
                    <Typography variant="caption" fontWeight={600} textTransform="uppercase">
                      Duration
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                    {formatTime(elapsedSeconds)}
                  </Typography>
                </Card>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
                    <Speed fontSize="small" />
                    <Typography variant="caption" fontWeight={600} textTransform="uppercase">
                      Distance
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                    {distanceKm.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    km
                  </Typography>
                </Card>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
                    <Terrain fontSize="small" />
                    <Typography variant="caption" fontWeight={600} textTransform="uppercase">
                      Elevation
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={800}>
                    {currentElevation}m
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    +{elevationGain}m gain
                  </Typography>
                </Card>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
                    <LocalFireDepartment fontSize="small" />
                    <Typography variant="caption" fontWeight={600} textTransform="uppercase">
                      Calories
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={800}>
                    {Math.round(caloriesBurned)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    kcal
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Giant Controls: Start, Pause, Resume, Finish */}
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              {!isTracking ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<PlayArrow sx={{ fontSize: 28 }} />}
                  onClick={() => startRide()}
                  sx={{
                    py: 2,
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  START RIDE
                </Button>
              ) : (
                <Stack spacing={1.5}>
                  {isPaused ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<PlayArrow sx={{ fontSize: 28 }} />}
                      onClick={resumeRide}
                      sx={{ py: 1.8, fontSize: '1.15rem', fontWeight: 800 }}
                    >
                      RESUME
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="warning"
                      size="large"
                      startIcon={<Pause sx={{ fontSize: 28 }} />}
                      onClick={pauseRide}
                      sx={{ py: 1.8, fontSize: '1.15rem', fontWeight: 800 }}
                    >
                      PAUSE
                    </Button>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<Stop sx={{ fontSize: 26 }} />}
                    onClick={() => setFinishModalOpen(true)}
                    sx={{ py: 1.6, fontSize: '1.05rem', fontWeight: 800 }}
                  >
                    FINISH RIDE
                  </Button>
                </Stack>
              )}
            </Paper>
          </Stack>
        </Grid>

        {/* Right Column: Live Interactive Leaflet Map & Real-time Speed Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            {/* Live Leaflet Map Container */}
            <Card sx={{ flexGrow: 1, minHeight: 460, p: 1 }}>
              <MapView
                height={460}
                path={pathHistory}
                waypoints={activeRoute?.waypoints}
                currentPosition={currentPosition}
                isLiveTracking={isTracking && !isPaused}
              />
            </Card>

            {/* Live Speed Profile Real-Time Graph */}
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Live Speed & Telemetry Waveform
              </Typography>
              <SpeedChart
                data={speedProfile.length > 0 ? speedProfile : [{ time: '0m', speed: 18.5 }]}
                height={160}
              />
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Finish Ride Confirmation Dialog */}
      <Dialog
        open={finishModalOpen}
        onClose={() => setFinishModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, textAlign: 'center' }}>
          Finish This Ride? 🚴
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You logged <strong>{distanceKm.toFixed(2)} km</strong> in{' '}
            <strong>{formatTime(elapsedSeconds)}</strong> with an average speed of{' '}
            <strong>{avgSpeed} km/h</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your telemetry and GPS map will be saved to your Ride History and analyzed by the AI Coach.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'center', gap: 1.5 }}>
          <Button variant="outlined" onClick={() => setFinishModalOpen(false)} disabled={isFinishing}>
            Continue Riding
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinishConfirm}
            disabled={isFinishing}
            sx={{ fontWeight: 700 }}
          >
            {isFinishing ? <CircularProgress size={24} color="inherit" /> : 'Finish & Save Ride'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Simulated Emergency SOS Dialog */}
      <Dialog
        open={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" /> Emergency SOS Beacon
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            Simulating Emergency SOS Alert Dispatch
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            A high-priority notification with your exact simulated GPS coordinates (Lat: {currentPosition[0].toFixed(4)}, Lng: {currentPosition[1].toFixed(4)}) would be transmitted to your registered emergency contacts (Sarah Morgan).
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            Prototype simulation only. In an actual life-threatening medical emergency, call 911 or local emergency services immediately.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button variant="contained" color="inherit" onClick={() => setSosModalOpen(false)}>
            Dismiss SOS
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
