import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { EmojiEvents, Bolt, CheckCircle } from '@mui/icons-material';
import { apiService } from '../services/api';
import { Challenge } from '../types';
import { ChallengeCard } from '../components/challenges/ChallengeCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

type ChallengeCategory = 'All' | 'Distance' | 'Elevation' | 'Streak' | 'Exploration';

export const ChallengesPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory>('All');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await apiService.getChallenges();
        setChallenges(data);
      } catch (err) {
        console.error('Failed to load challenges', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const handleToggleJoin = async (id: string) => {
    setActionLoading(true);
    try {
      const updated = await apiService.toggleJoinChallenge(id);
      setChallenges(prev => prev.map(c => c.id === id ? updated : c));
      await refreshUser();
      showToast(
        updated.joined
          ? `Joined "${updated.title}"! (+50 XP) Let's crush this goal! 🚴🔥`
          : `Left "${updated.title}" challenge`,
        'success'
      );
    } catch (err) {
      showToast('Could not update challenge status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(c =>
    selectedCategory === 'All' || c.category === selectedCategory
  );

  const completedCount = challenges.filter(c => c.completed).length;
  const activeCount = challenges.filter(c => c.joined && !c.completed).length;

  if (loading) {
    return <LoadingSkeleton type="cards" count={6} />;
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
          Challenges & Quests 🏆
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Push your boundaries, earn bonus XP, and unlock prestigious peloton badges.
        </Typography>
      </Box>

      {/* Overview Progress Banner */}
      <Card
        sx={{
          mb: 3.5,
          p: { xs: 2.5, sm: 3 },
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
          borderLeft: '5px solid #10B981',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
              Active In Progress
            </Typography>
            <Typography variant="h4" fontWeight={800} color="primary.main">
              {activeCount} Quests
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
              Completed Trophies
            </Typography>
            <Typography variant="h4" fontWeight={800} color="success.main">
              {completedCount} Finished
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
              Total Bonus XP Earned
            </Typography>
            <Typography variant="h4" fontWeight={800} color="info.main">
              +1,850 XP
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Category Filter Chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
        {(['All', 'Distance', 'Elevation', 'Streak', 'Exploration'] as ChallengeCategory[]).map(cat => (
          <Chip
            key={cat}
            label={cat}
            clickable
            color={selectedCategory === cat ? 'primary' : 'default'}
            variant={selectedCategory === cat ? 'filled' : 'outlined'}
            onClick={() => setSelectedCategory(cat)}
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Stack>

      {/* Challenges Grid */}
      <Grid container spacing={3}>
        {filteredChallenges.map(challenge => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={challenge.id}>
            <ChallengeCard
              challenge={challenge}
              onToggleJoin={handleToggleJoin}
              loading={actionLoading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
