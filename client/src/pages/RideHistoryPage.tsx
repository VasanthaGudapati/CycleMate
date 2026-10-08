import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Chip,
  IconButton,
  Button,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Search,
  FilterList,
  ArrowForward,
  ViewList,
  ViewModule,
  Timer,
  Speed,
  LocalFireDepartment,
  DirectionsBike,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Ride, CyclingType } from '../types';
import { RideCard } from '../components/rides/RideCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const RideHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'distance' | 'speed'>('date');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiService.getRides();
        setRides(data);
      } catch (err) {
        console.error('Failed to load ride history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const filteredRides = rides
    .filter(r => {
      const matchesSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.routeName && r.routeName.toLowerCase().includes(search.toLowerCase()));
      const matchesType = typeFilter === 'All' || r.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return b.distance - a.distance;
      if (sortBy === 'speed') return b.avgSpeed - a.avgSpeed;
      return 0; // default order
    });

  if (loading) {
    return <LoadingSkeleton type="table" count={5} />;
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Ride History 🚴
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive archive of your recorded activities, GPS traces, and performance data.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/track')}
          sx={{ fontWeight: 700 }}
        >
          Track New Ride
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Card sx={{ p: 2.5, mb: 3.5 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title or route..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Activity Type"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Road cycling">Road cycling</MenuItem>
              <MenuItem value="Gravel">Gravel</MenuItem>
              <MenuItem value="Commuting">Commuting</MenuItem>
              <MenuItem value="Fitness">Fitness</MenuItem>
              <MenuItem value="Recreation">Recreation</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Sort By"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
            >
              <MenuItem value="date">Most Recent</MenuItem>
              <MenuItem value="distance">Longest Distance</MenuItem>
              <MenuItem value="speed">Fastest Avg Speed</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ToggleButtonGroup
              size="small"
              value={viewMode}
              exclusive
              onChange={(_e, val) => val && setViewMode(val)}
            >
              <ToggleButton value="table">
                <ViewList fontSize="small" />
              </ToggleButton>
              <ToggleButton value="grid">
                <ViewModule fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Card>

      {/* List / Table Display */}
      {filteredRides.length === 0 ? (
        <EmptyState
          title="No rides found"
          description="Try clearing your search filters or start a new ride tracking session."
          actionText="Start a Ride"
          onAction={() => navigate('/track')}
          icon={<DirectionsBike sx={{ fontSize: 40 }} />}
        />
      ) : viewMode === 'table' ? (
        <Card>
          <TableContainer>
            <Table sx={{ minWidth: 680 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Date & Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Route</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Distance</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Avg Speed</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Elevation</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Calories</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRides.map(ride => (
                  <TableRow
                    key={ride.id}
                    hover
                    onClick={() => navigate(`/rides/${ride.id}`)}
                    sx={{ cursor: 'pointer', transition: 'background-color 0.15s' }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {ride.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ride.date} • <Chip label={ride.type} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600 }} />
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {ride.routeName || 'Free Ride'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                        {ride.distance} km
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {formatDuration(ride.duration)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {ride.avgSpeed} km/h
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {ride.elevation} m
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {ride.calories} kcal
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <ArrowForward fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredRides.map(ride => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ride.id}>
              <RideCard ride={ride} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
