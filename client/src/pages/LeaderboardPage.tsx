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
  Avatar,
  Chip,
  Tabs,
  Tab,
  Grid,
  Paper,
} from '@mui/material';
import { EmojiEvents, Bolt, DirectionsBike } from '@mui/icons-material';
import { apiService } from '../services/api';
import { LeaderboardEntry } from '../types';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await apiService.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="table" count={7} />;
  }

  const top3 = leaderboard.slice(0, 3);

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Community Leaderboard 🏆
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Weekly peloton standings and distance milestones across Colorado.
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3.5 }}>
        <Tabs
          value={timeframe}
          onChange={(_e, val) => setTimeframe(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Weekly (Current)" value="weekly" sx={{ fontWeight: 700 }} />
          <Tab label="Monthly (October)" value="monthly" sx={{ fontWeight: 700 }} />
          <Tab label="All-Time Peloton" value="allTime" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* Top 3 Visual Podium */}
      <Grid container spacing={2.5} sx={{ mb: 4, alignItems: 'flex-end' }}>
        {/* 2nd Place */}
        {top3[1] && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                border: '2px solid #CBD5E1',
                bgcolor: 'background.paper',
                borderRadius: 3.5,
              }}
            >
              <Typography variant="h3" sx={{ mb: 1 }}>
                🥈
              </Typography>
              <Avatar
                src={top3[1].avatar}
                alt={top3[1].name}
                sx={{ width: 68, height: 68, mx: 'auto', mb: 1.5, border: '3px solid #94A3B8' }}
              />
              <Typography variant="h6" fontWeight={800}>
                {top3[1].name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {top3[1].city}
              </Typography>
              <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ my: 1, fontFamily: "'Outfit', sans-serif" }}>
                {top3[1].distance} km
              </Typography>
              <Chip label={`+${top3[1].xp} XP`} size="small" sx={{ fontWeight: 700 }} />
            </Card>
          </Grid>
        )}

        {/* 1st Place (Center and elevated) */}
        {top3[0] && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              sx={{
                p: 3.5,
                textAlign: 'center',
                border: '3px solid #F59E0B',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                borderRadius: 4,
                boxShadow: '0 8px 30px rgba(245, 158, 11, 0.2)',
              }}
            >
              <Typography variant="h2" sx={{ mb: 1 }}>
                🥇
              </Typography>
              <Avatar
                src={top3[0].avatar}
                alt={top3[0].name}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 1.5, border: '4px solid #F59E0B' }}
              />
              <Typography variant="h5" fontWeight={800}>
                {top3[0].name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {top3[0].city}
              </Typography>
              <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ my: 1, fontFamily: "'Outfit', sans-serif" }}>
                {top3[0].distance} km
              </Typography>
              <Chip label={`Leader • +${top3[0].xp} XP`} color="warning" size="small" sx={{ fontWeight: 800 }} />
            </Card>
          </Grid>
        )}

        {/* 3rd Place (Alex Morgan) */}
        {top3[2] && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                border: '2px solid #D97706',
                bgcolor: 'background.paper',
                borderRadius: 3.5,
              }}
            >
              <Typography variant="h3" sx={{ mb: 1 }}>
                🥉
              </Typography>
              <Avatar
                src={top3[2].avatar}
                alt={top3[2].name}
                sx={{ width: 68, height: 68, mx: 'auto', mb: 1.5, border: '3px solid #D97706' }}
              />
              <Typography variant="h6" fontWeight={800}>
                {top3[2].name} (You)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {top3[2].city}
              </Typography>
              <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ my: 1, fontFamily: "'Outfit', sans-serif" }}>
                {top3[2].distance} km
              </Typography>
              <Chip label={`Podium • +${top3[2].xp} XP`} color="primary" size="small" sx={{ fontWeight: 700 }} />
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Complete Rankings Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 80 }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cyclist</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>City</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Distance</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Rides</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Experience Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map(entry => (
                <TableRow
                  key={entry.userId}
                  sx={{
                    bgcolor: entry.isCurrentUser ? 'action.selected' : 'inherit',
                    borderLeft: entry.isCurrentUser ? '4px solid #10B981' : undefined,
                  }}
                >
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={800}>
                      {entry.rank === 1 ? '🥇 1' : entry.rank === 2 ? '🥈 2' : entry.rank === 3 ? '🥉 3' : `#${entry.rank}`}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={entry.avatar} alt={entry.name} sx={{ width: 36, height: 36 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={entry.isCurrentUser ? 800 : 700}>
                          {entry.name} {entry.isCurrentUser && '(You)'}
                        </Typography>
                        {entry.badge && (
                          <Chip label={entry.badge} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {entry.city}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                      {entry.distance} km
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {entry.rides} rides
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Bolt color="warning" fontSize="small" />
                      <Typography variant="body2" fontWeight={700}>
                        {entry.xp.toLocaleString()} XP
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
