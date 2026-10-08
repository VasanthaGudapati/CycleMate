import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, LinearProgress } from '@mui/material';
import { CheckCircle, EmojiEvents, AccessTime, Bolt } from '@mui/icons-material';
import confetti from 'canvas-confetti';
import { Challenge } from '../../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onToggleJoin: (id: string) => void;
  loading?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onToggleJoin,
  loading = false,
}) => {
  const percent = Math.min(100, Math.round((challenge.currentKm / challenge.targetKm) * 100));

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!challenge.joined) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    onToggleJoin(challenge.id);
  };

  const getDifficultyColor = (diff: Challenge['difficulty']) => {
    switch (diff) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'info';
      case 'Hard':
        return 'warning';
      case 'Epic':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        border: challenge.completed ? '1.5px solid #10B981' : undefined,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ lineHeight: 1 }}>
              {challenge.badgeIcon}
            </Typography>
            <Chip
              label={challenge.difficulty}
              size="small"
              color={getDifficultyColor(challenge.difficulty) as any}
              sx={{ fontWeight: 700, fontSize: '0.7rem' }}
            />
          </Box>
          <Chip
            icon={<Bolt sx={{ fontSize: '14px !important' }} />}
            label={`+${challenge.rewardXp} XP`}
            size="small"
            color="success"
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          {challenge.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, minHeight: 40 }}>
          {challenge.description}
        </Typography>

        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              Progress: {challenge.currentKm} / {challenge.targetKm} {challenge.category === 'Streak' ? 'days' : challenge.category === 'Elevation' ? 'm' : challenge.category === 'Exploration' ? 'routes' : 'km'}
            </Typography>
            <Typography variant="caption" fontWeight={800} color="primary.main">
              {percent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 9, borderRadius: 5 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <AccessTime sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={500}>
              {challenge.deadline}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {challenge.participantsCount.toLocaleString()} cyclists
          </Typography>
        </Box>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        {challenge.completed ? (
          <Button
            fullWidth
            variant="outlined"
            color="success"
            startIcon={<CheckCircle />}
            disabled
          >
            Completed
          </Button>
        ) : (
          <Button
            fullWidth
            variant={challenge.joined ? 'outlined' : 'contained'}
            color={challenge.joined ? 'secondary' : 'primary'}
            disabled={loading}
            onClick={handleJoinClick}
          >
            {challenge.joined ? 'Joined (In Progress)' : 'Join Challenge'}
          </Button>
        )}
      </Box>
    </Card>
  );
};
