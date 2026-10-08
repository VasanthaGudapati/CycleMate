import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  Shield,
  Warning,
  Share,
  Phone,
  PersonAdd,
  Delete,
  CheckCircle,
  WbSunny,
  Air,
  Opacity,
  ContactPhone,
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { EmergencyContact, SafetySettings, WeatherData } from '../types';
import { WeatherCard } from '../components/weather/WeatherCard';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const SafetyWeatherPage: React.FC = () => {
  const { showToast } = useToast();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [settings, setSettings] = useState<SafetySettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Add Contact Dialog
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: 'Partner / Spouse',
    phone: '',
    notifyOnRideStart: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [w, c, s] = await Promise.all([
          apiService.getWeather(),
          apiService.getEmergencyContacts(),
          apiService.getSafetySettings(),
        ]);
        setWeather(w);
        setContacts(c);
        setSettings(s);
      } catch (err) {
        console.error('Failed to load safety data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleSetting = async (key: keyof SafetySettings) => {
    if (!settings) return;
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await apiService.updateSafetySettings(updated);
    showToast('Safety preferences updated', 'success');
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      showToast('Please provide both name and phone number', 'warning');
      return;
    }

    try {
      const created = await apiService.addEmergencyContact(newContact);
      setContacts([...contacts, created]);
      setAddContactOpen(false);
      setNewContact({ name: '', relationship: 'Friend', phone: '', notifyOnRideStart: true });
      showToast(`Added ${created.name} as emergency contact`, 'success');
    } catch (err) {
      showToast('Failed to add contact', 'error');
    }
  };

  const handleTestSos = () => {
    showToast('Simulating SOS beacon broadcast to emergency contacts... 🚨', 'warning');
  };

  if (loading || !weather || !settings) {
    return <LoadingSkeleton type="dashboard" />;
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
          Ride Safety & Cycling Weather 🛡️
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure real-time crash detection beacons, emergency contacts, and live meteorological conditions.
        </Typography>
      </Box>

      {/* Weather Intelligence Card */}
      <Box sx={{ mb: 3.5 }}>
        <WeatherCard weather={weather} />
      </Box>

      {/* Safety Controls Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Safety Preferences */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Shield color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={800}>
                  Ride Safety Automation
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                CycleMate monitors sudden decelerations and impacts to dispatch automatic emergency beacons.
              </Alert>

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.liveRideSharing}
                      onChange={() => handleToggleSetting('liveRideSharing')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Live Ride Link Sharing
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Generates an encrypted real-time GPS tracking URL accessible by trusted contacts.
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoCrashDetection}
                      onChange={() => handleToggleSetting('autoCrashDetection')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Automated Incident & Crash Detection
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Initiates a 30-second audible alert before notifying emergency contacts.
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Custom Emergency Broadcast Message"
                value={settings.emergencyMessage}
                onChange={e => setSettings({ ...settings, emergencyMessage: e.target.value })}
                onBlur={() => apiService.updateSafetySettings(settings)}
                size="small"
              />
            </Box>

            <Box sx={{ pt: 3 }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<Warning />}
                onClick={handleTestSos}
                sx={{ fontWeight: 700 }}
              >
                Simulate SOS Alert Beacon
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Right Column: Emergency Contacts List */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ContactPhone color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={800}>
                  Emergency Contacts ({contacts.length})
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setAddContactOpen(true)}
              >
                Add Contact
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Contacts will receive instant SMS notifications when an SOS beacon is triggered during a ride.
            </Typography>

            <List disablePadding sx={{ flexGrow: 1 }}>
              {contacts.map((contact, index) => (
                <React.Fragment key={contact.id}>
                  <ListItem sx={{ px: 1, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {contact.name}
                          </Typography>
                          <Chip label={contact.relationship} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }} />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {contact.phone} {contact.notifyOnRideStart && '• Notified on Ride Start'}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < contacts.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* Add Contact Modal */}
      <Dialog
        open={addContactOpen}
        onClose={() => setAddContactOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Add Emergency Contact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            fullWidth
            value={newContact.name}
            onChange={e => setNewContact({ ...newContact, name: e.target.value })}
            sx={{ mb: 1.5 }}
          />
          <TextField
            margin="dense"
            label="Relationship"
            fullWidth
            value={newContact.relationship}
            onChange={e => setNewContact({ ...newContact, relationship: e.target.value })}
            placeholder="e.g. Spouse, Parent, Riding Partner"
            sx={{ mb: 1.5 }}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={newContact.phone}
            onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setAddContactOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddContact} sx={{ fontWeight: 700 }}>
            Save Contact
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
