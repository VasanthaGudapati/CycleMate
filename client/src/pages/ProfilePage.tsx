import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  Edit,
  EmojiEvents,
  DirectionsBike,
  LocalFireDepartment,
  Speed,
  Terrain,
  Bolt,
  LocationOn,
  CalendarMonth,
  Lock,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Achievement } from '../types';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const ach = await apiService.getAchievements();
        setAchievements(ach);
      } catch (err) {
        console.error('Failed to load achievements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading || !user) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const xpPercent = Math.round((user.xp / user.xpNextLevel) * 100);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Box sx={{ pb: 4 }}>
      {/* Profile Hero Card */}
      <Card sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 3.5, position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 3,
          }}
        >
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{
              width: 100,
              height: 100,
              border: '4px solid #10B981',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
            }}
          />

          <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, gap: 1.5, mb: 0.5 }}>
              <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {user.name}
              </Typography>
              <Chip
                label={`Level ${user.level} Cyclist`}
                color="primary"
                size="small"
                sx={{ fontWeight: 800 }}
              />
              <Chip
                label={user.experience}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 2, color: 'text.secondary', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">{user.city}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarMonth fontSize="small" />
                <Typography variant="body2">Member since {user.memberSince}</Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ maxWidth: 640, mb: 2.5, lineHeight: 1.6 }}>
              {user.bio}
            </Typography>

            {/* XP Level Progression Bar */}
            <Box sx={{ maxWidth: 420 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  Level {user.level} Progress
                </Typography>
                <Typography variant="caption" fontWeight={800} color="primary.main">
                  {user.xp} / {user.xpNextLevel} XP ({xpPercent}%)
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={xpPercent} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          </Box>

          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate('/settings')}
            sx={{ fontWeight: 600, alignSelf: { xs: 'center', sm: 'flex-start' } }}
          >
            Edit Profile
          </Button>
        </Box>
      </Card>

      {/* 4 Lifetime Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Total Distance
            </Typography>
            <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ my: 0.5, fontFamily: "'Outfit', sans-serif" }}>
              {user.totalDistance.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              kilometers
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Total Rides
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ my: 0.5, fontFamily: "'Outfit', sans-serif" }}>
              {user.totalRides}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              activities logged
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Active Streak
            </Typography>
            <Typography variant="h4" fontWeight={800} color="warning.main" sx={{ my: 0.5, fontFamily: "'Outfit', sans-serif" }}>
              🔥 {user.currentStreak}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              consecutive days
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Favorite Style
            </Typography>
            <Typography variant="h5" fontWeight={800} sx={{ my: 0.8, fontFamily: "'Outfit', sans-serif" }}>
              {user.preferredType}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              primary discipline
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Badges & Achievements Cabinet */}
      <Card sx={{ p: 3, mb: 3.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EmojiEvents color="primary" sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Achievements & Badges ({unlockedCount}/{achievements.length})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Earned through cycling milestones, elevation conquests, and streak challenges
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {achievements.map(ach => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ach.id}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: ach.unlocked ? 'primary.light' : 'divider',
                  bgcolor: ach.unlocked ? 'action.hover' : 'background.paper',
                  opacity: ach.unlocked ? 1 : 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: ach.unlocked ? 'primary.main' : 'action.disabledBackground',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {ach.unlocked ? ach.icon : <Lock fontSize="small" />}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {ach.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ach.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="primary.main" fontWeight={700}>
                      +{ach.xp} XP
                    </Typography>
                    {ach.unlockedAt && (
                      <Typography variant="caption" color="text.secondary">
                        {ach.unlockedAt}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
};
