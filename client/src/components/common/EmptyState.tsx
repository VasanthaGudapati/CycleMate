import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        maxWidth: 520,
        mx: 'auto',
        my: 4,
      }}
    >
      {icon && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            color: 'primary.main',
            display: 'inline-flex',
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380, mb: 3 }}>
        {description}
      </Typography>
      {actionText && onAction && (
        <Button variant="contained" color="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Paper>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this data. Please check your connection and retry.',
  onRetry,
}) => {
  return (
    <Paper
      sx={{
        p: 5,
        textAlign: 'center',
        borderRadius: 4,
        borderColor: 'error.light',
        maxWidth: 480,
        mx: 'auto',
        my: 4,
      }}
    >
      <Typography variant="h6" color="error.main" fontWeight={700} gutterBottom>
        ⚠️ {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Paper>
  );
};
