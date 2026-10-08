import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Button,
  Chip,
  Avatar,
  Paper,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Psychology,
  Send,
  ThumbUp,
  TrendingUp,
  Bolt,
  CheckCircle,
  WarningAmber,
  CalendarMonth,
  SmartToy,
  Person,
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { AICoachMessage } from '../types';
import { useAuth } from '../context/AuthContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const AICoachPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AICoachMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_QUESTIONS = [
    'How can I improve my speed?',
    'Create a 4-week training plan',
    'Analyze my latest ride',
    'How much should I cycle this week?',
    'Am I improving?',
  ];

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const history = await apiService.getAIChatHistory();
        setMessages(history);
      } catch (err) {
        console.error('Failed to load AI chat', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: AICoachMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const aiReply = await apiService.sendAICoachMessage(textToSend);
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error('AI query error', err);
    } finally {
      setIsThinking(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
            <Psychology sx={{ fontSize: 28, color: '#fff' }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
              Your AI Cycling Coach 🤖
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sports science diagnostic engine analyzing your cadence, power, heart rate, and fatigue.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Fitness Profile Diagnostic Banner */}
      <Card sx={{ p: 3, mb: 3.5, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.04) 100%)' }}>
        <Typography variant="h6" fontWeight={800} gutterBottom>
          Current Fitness Diagnostic Summary
        </Typography>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2.5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', mb: 1 }}>
                <CheckCircle fontSize="small" />
                <Typography variant="subtitle2" fontWeight={800}>
                  Key Strengths
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                • Aerobic threshold consistency on flat sectors (24 km/h baseline)<br />
                • Strong mental discipline maintaining a 7-day consecutive streak<br />
                • Steady cadence discipline (88 RPM average)
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2.5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main', mb: 1 }}>
                <WarningAmber fontSize="small" />
                <Typography variant="subtitle2" fontWeight={800}>
                  Endurance Limiters
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                • 12% pace drop after 20km during rides longer than 60 mins<br />
                • Inconsistent glycogen replenishment and late-ride hydration<br />
                • High torque grinding on steep 8%+ sustained climbs
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2.5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', mb: 1 }}>
                <Bolt fontSize="small" />
                <Typography variant="subtitle2" fontWeight={800}>
                  Weekly Recommendation
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                • 2x Zone 2 endurance spins (40–50 km total)<br />
                • 1x VO2 Max interval session (4x4m at 32 km/h)<br />
                • Target weekly volume: 75 km
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Main Conversational AI Chat Interface */}
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 600,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Chat message history list */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2.5}>
            {messages.map(msg => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.sender === 'ai' && (
                  <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34, mt: 0.5 }}>
                    <SmartToy sx={{ fontSize: 18, color: '#fff' }} />
                  </Avatar>
                )}

                <Box
                  sx={{
                    maxWidth: { xs: '85%', sm: '75%' },
                    p: 2,
                    borderRadius: 3,
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                    color: msg.sender === 'user' ? '#fff' : 'text.primary',
                    border: msg.sender === 'ai' ? '1px solid' : undefined,
                    borderColor: 'divider',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </Typography>

                  {/* Advice Card if attached */}
                  {msg.adviceCard && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        borderLeft: '4px solid #10B981',
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                        📋 {msg.adviceCard.title}
                      </Typography>

                      <Grid container spacing={1.5} sx={{ my: 1 }}>
                        {msg.adviceCard.metrics.map((m, idx) => (
                          <Grid size={4} key={idx}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {m.label}
                            </Typography>
                            <Typography variant="body2" fontWeight={700}>
                              {m.value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>

                      <Divider sx={{ my: 1 }} />
                      <Stack spacing={0.5}>
                        {msg.adviceCard.tips.map((t, idx) => (
                          <Typography key={idx} variant="caption" sx={{ display: 'block', fontWeight: 500 }}>
                            • {t}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 1,
                      textAlign: 'right',
                      opacity: 0.7,
                      fontSize: '0.68rem',
                    }}
                  >
                    {msg.timestamp}
                  </Typography>
                </Box>

                {msg.sender === 'user' && (
                  <Avatar src={user?.avatar} sx={{ width: 34, height: 34, mt: 0.5 }} />
                )}
              </Box>
            ))}

            {isThinking && (
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34 }}>
                  <SmartToy sx={{ fontSize: 18, color: '#fff' }} />
                </Avatar>
                <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    CycleMate AI is calculating telemetry insights...
                  </Typography>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Stack>
        </Box>

        {/* Suggested Quick Question Chips */}
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mr: 1, textTransform: 'uppercase' }}>
            Suggested:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', py: 0.5 }}>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <Chip
                key={idx}
                label={q}
                size="small"
                clickable
                onClick={() => handleSendMessage(q)}
                sx={{ fontWeight: 600, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
              />
            ))}
          </Stack>
        </Box>

        {/* Chat Input Bar */}
        <Box
          component="form"
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            placeholder="Ask your coach anything about speed, recovery, nutrition, or routes..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={isThinking}
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!inputText.trim() || isThinking}
            sx={{ px: 3, fontWeight: 700 }}
          >
            Send
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
