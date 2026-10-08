import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  BookmarkBorder,
  Bookmark,
  Share,
  ArrowBack,
  Navigation,
  Terrain,
  Timer,
  Security,
  WaterDrop,
  Coffee,
  CheckCircle,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Route, RouteWaypoint } from '../types';
import { MapView } from '../components/map/MapView';
import { ElevationChart } from '../components/charts/ElevationChart';
import { useRideTracking } from '../context/RideTrackingContext';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const RouteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startRide } = useRideTracking();
  const { showToast } = useToast();

  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        if (id) {
          const found = await apiService.getRouteById(id);
          if (found) {
            setRoute(found);
            setIsSaved(!!found.isFavorite);
          } else {
            const all = await apiService.getRoutes();
            setRoute(all[0]);
          }
        }
      } catch (err) {
        console.error('Error loading route', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [id]);

  if (loading || !route) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const handleStartRoute = () => {
    startRide(route);
    navigate('/track');
  };

  const handleToggleSave = async () => {
    await apiService.toggleFavoriteRoute(route.id);
    setIsSaved(!isSaved);
    showToast(isSaved ? 'Route removed from saved list' : 'Route saved to your favorites! ⭐', 'success');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Route link copied to clipboard! 🔗', 'success');
  };

  const getWaypointIcon = (type: RouteWaypoint['type']) => {
    switch (type) {
      case 'Start':
        return <Navigation color="success" />;
      case 'Finish':
        return <CheckCircle color="error" />;
      case 'Climb':
        return <Terrain color="warning" />;
      case 'Water stop':
        return <WaterDrop color="info" />;
      case 'Rest area':
        return <Coffee sx={{ color: '#8B5CF6' }} />;
      default:
        return <Navigation color="primary" />;
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Back button & Action controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/routes')}
          sx={{ fontWeight: 600 }}
        >
          All Routes
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
            onClick={handleToggleSave}
          >
            {isSaved ? 'Saved' : 'Save Route'}
          </Button>
          <Button variant="outlined" startIcon={<Share />} onClick={handleShare}>
            Share
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrow />}
            onClick={handleStartRoute}
            sx={{ fontWeight: 700, px: 3 }}
          >
            Start This Route
          </Button>
        </Stack>
      </Box>

      {/* Route Header Info Card */}
      <Card sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 3.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip label={route.difficulty} color="primary" size="small" sx={{ fontWeight: 700 }} />
              <Chip label={route.type} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
              <Chip label={route.surfaceType} size="small" sx={{ bgcolor: 'action.hover' }} />
            </Box>
            <Typography variant="h3" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
              {route.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              From {route.startLocation} to {route.destination}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              COMMUNITY SAFETY
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating value={route.safetyRating} precision={0.1} readOnly size="medium" />
              <Typography variant="h6" fontWeight={800}>
                {route.safetyRating}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 3, maxWidth: 840 }}>
          {route.description}
        </Typography>

        {/* 4 Metric Stats */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                Total Distance
              </Typography>
              <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {route.distance} <Typography component="span" variant="caption">km</Typography>
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                Est. Duration
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {route.estTime}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                Vertical Ascent
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {route.elevation} <Typography component="span" variant="caption">m</Typography>
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                Safety Score
              </Typography>
              <Typography variant="h4" fontWeight={800} color="success.main" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {route.safetyRating} <Typography component="span" variant="caption">/ 5</Typography>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Large Interactive Leaflet Map */}
      <Card sx={{ p: 1, mb: 3.5 }}>
        <MapView
          height={480}
          path={route.coordinates}
          waypoints={route.waypoints}
        />
      </Card>

      {/* Elevation Profile Chart */}
      <Card sx={{ p: 3, mb: 3.5 }}>
        <Typography variant="h6" fontWeight={800} gutterBottom>
          Elevation Profile (Meters vs Distance)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Gradient profile analysis for pacing gear selection
        </Typography>
        <ElevationChart data={route.elevationProfile} height={220} />
      </Card>

      {/* Waypoints & Points of Interest List */}
      <Card sx={{ p: 3, mb: 3.5 }}>
        <Typography variant="h6" fontWeight={800} gutterBottom>
          Key Waypoints & Route Highlights ({route.waypoints.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Verified water refill points, repair stations, and summit vistas
        </Typography>

        <List disablePadding>
          {route.waypoints.map((wp, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ py: 1.5, px: 1 }}>
                <ListItemIcon sx={{ minWidth: 44 }}>
                  {getWaypointIcon(wp.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {wp.name}
                      </Typography>
                      <Chip label={wp.type} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }} />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                      Elevation: {wp.elevation}m • {wp.description}
                    </Typography>
                  }
                />
              </ListItem>
              {index < route.waypoints.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Card>

      {/* Bottom Start Action Bar */}
      <Paper
        elevation={4}
        sx={{
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Ready to ride {route.name}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Simulated GPS guidance will direct you along this {route.distance} km path.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PlayArrow />}
          onClick={handleStartRoute}
          sx={{ px: 4, py: 1.4, fontWeight: 800 }}
        >
          Start This Route
        </Button>
      </Paper>
    </Box>
  );
};
