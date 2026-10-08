import React from 'react';
import { Card, CardContent, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { Air, Opacity, WbSunny, Shield, Speed } from '@mui/icons-material';
import { WeatherData } from '../../types';

interface WeatherCardProps {
  weather: WeatherData;
  compact?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, compact = false }) => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: compact ? 2 : 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
              Cycling Weather Intelligence
            </Typography>
            <Typography variant="h5" fontWeight={800} sx={{ mt: 0.2 }}>
              {weather.temp}°C • {weather.condition}
            </Typography>
          </Box>
          <Chip
            icon={<Shield sx={{ fontSize: 16 }} />}
            label={`Score: ${weather.cyclingScore}/100`}
            color="success"
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {weather.summary}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Air sx={{ fontSize: 20, color: 'info.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Wind
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {weather.windSpeed} km/h {weather.windDirection}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Opacity sx={{ fontSize: 20, color: 'primary.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Rain Prob
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {weather.rainProbability}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WbSunny sx={{ fontSize: 20, color: 'warning.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Humidity / UV
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {weather.humidity}% (UV {weather.uvIndex})
              </Typography>
            </Box>
          </Box>
        </Box>

        {!compact && weather.hourlyForecast && (
          <Box sx={{ mt: 2.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase" display="block" sx={{ mb: 1 }}>
              Hourly Riding Window Forecast
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 1,
                textAlign: 'center',
              }}
            >
              {weather.hourlyForecast.map((hour, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" display="block">
                    {hour.time}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {hour.temp}°
                  </Typography>
                  <Typography variant="caption" color={hour.rainProb > 15 ? 'warning.main' : 'success.main'} display="block" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                    {hour.cyclingScore} pts
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
