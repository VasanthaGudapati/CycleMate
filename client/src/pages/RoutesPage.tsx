import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import { Search, Map, Tune, FilterList } from '@mui/icons-material';
import { apiService } from '../services/api';
import { Route } from '../types';
import { RouteCard } from '../components/routes/RouteCard';
import { MapView } from '../components/map/MapView';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

type RoutePreference = 'All' | 'Fastest' | 'Safest' | 'Scenic' | 'Challenging';

export const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreference, setSelectedPreference] = useState<RoutePreference>('All');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await apiService.getRoutes();
        setRoutes(data);
        if (data.length > 0) {
          setSelectedRoute(data[0]);
        }
      } catch (err) {
        console.error('Failed to load routes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const filteredRoutes = routes.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPref =
      selectedPreference === 'All' || r.type === selectedPreference;

    return matchesSearch && matchesPref;
  });

  if (loading) {
    return <LoadingSkeleton type="cards" count={6} />;
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
          Explore Cycling Routes 🗺️
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover verified cycling corridors, protected paths, and scenic alpine mountain passes.
        </Typography>
      </Box>

      {/* Large Interactive Explorer Map */}
      <Card sx={{ mb: 3.5, p: 1 }}>
        <Box sx={{ p: 1.5, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {selectedRoute ? `Previewing: ${selectedRoute.name} (${selectedRoute.distance} km)` : 'Route Map Explorer'}
          </Typography>
          {selectedRoute && (
            <Chip
              label={`Safety Score: ${selectedRoute.safetyRating}/5`}
              size="small"
              color="success"
              sx={{ fontWeight: 700 }}
            />
          )}
        </Box>
        <MapView
          height={380}
          path={selectedRoute?.coordinates}
          waypoints={selectedRoute?.waypoints}
        />
      </Card>

      {/* Search & Preference Filters */}
      <Card sx={{ p: 2.5, mb: 3.5 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search start location, destination, or route name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: { xs: 1, md: 0 } }}>
              {(['All', 'Scenic', 'Safest', 'Fastest', 'Challenging'] as RoutePreference[]).map(pref => (
                <Chip
                  key={pref}
                  label={pref}
                  clickable
                  color={selectedPreference === pref ? 'primary' : 'default'}
                  variant={selectedPreference === pref ? 'filled' : 'outlined'}
                  onClick={() => setSelectedPreference(pref)}
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Card>

      {/* Route Cards Grid */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
        Available Routes ({filteredRoutes.length})
      </Typography>

      <Grid container spacing={3}>
        {filteredRoutes.map(route => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={route.id}>
            <RouteCard
              route={route}
              onSelect={() => setSelectedRoute(route)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
