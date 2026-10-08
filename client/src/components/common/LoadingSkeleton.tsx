import React from 'react';
import { Box, Skeleton, Grid } from '@mui/material';

interface LoadingSkeletonProps {
  type?: 'cards' | 'table' | 'dashboard' | 'chart';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'cards', count = 4 }) => {
  if (type === 'dashboard') {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width={260} height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={180} height={24} sx={{ mb: 3 }} />
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[1, 2, 3, 4].map(k => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k}>
              <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (type === 'chart') {
    return <Skeleton variant="rounded" width="100%" height={320} sx={{ borderRadius: 3 }} />;
  }

  return (
    <Grid container spacing={2.5}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="text" width="70%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rounded" width={80} height={32} />
              <Skeleton variant="rounded" width={80} height={32} />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
