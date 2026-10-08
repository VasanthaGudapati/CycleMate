import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Add, Build, DirectionsBike, History, CheckCircle } from '@mui/icons-material';
import { apiService } from '../services/api';
import { Bike, BikeComponent, MaintenanceRecord } from '../types';
import { BikeCard } from '../components/bikes/BikeCard';
import { MaintenanceCard } from '../components/bikes/MaintenanceCard';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const BikeGaragePage: React.FC = () => {
  const { showToast } = useToast();

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [tabIndex, setTabIndex] = useState(0); // 0: Garage, 1: Component Health, 2: Service History
  const [loading, setLoading] = useState(true);

  // Add Bike Dialog State
  const [addBikeOpen, setAddBikeOpen] = useState(false);
  const [newBikeData, setNewBikeData] = useState({
    brand: '',
    model: '',
    type: 'Road Bike' as Bike['type'],
    year: 2024,
    totalDistance: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    weightKg: 8.8,
  });

  // Service Component Dialog State
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [servicingComponent, setServicingComponent] = useState<BikeComponent | null>(null);
  const [serviceNotes, setServiceNotes] = useState('');

  useEffect(() => {
    const fetchGarage = async () => {
      try {
        const [bikesData, recordsData] = await Promise.all([
          apiService.getBikes(),
          apiService.getMaintenanceRecords(),
        ]);
        setBikes(bikesData);
        setMaintenanceRecords(recordsData);
        if (bikesData.length > 0) {
          setSelectedBike(bikesData[0]);
        }
      } catch (err) {
        console.error('Failed to load garage', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGarage();
  }, []);

  const handleAddBike = async () => {
    if (!newBikeData.brand || !newBikeData.model) {
      showToast('Please enter both brand and model name', 'warning');
      return;
    }

    try {
      const created = await apiService.addBike({
        ...newBikeData,
        isDefault: bikes.length === 0,
      });
      setBikes([...bikes, created]);
      setSelectedBike(created);
      setAddBikeOpen(false);
      showToast(`Added ${created.brand} ${created.model} to your garage! 🚲`, 'success');
    } catch (err) {
      showToast('Failed to add bike', 'error');
    }
  };

  const handleOpenServiceDialog = (comp: BikeComponent) => {
    setServicingComponent(comp);
    setServiceNotes('');
    setServiceDialogOpen(true);
  };

  const handleConfirmService = async () => {
    if (!selectedBike || !servicingComponent) return;

    try {
      const record = await apiService.markMaintenanceComplete(
        selectedBike.id,
        servicingComponent.name,
        serviceNotes
      );
      // Refresh local bikes and records
      const [updatedBikes, updatedRecords] = await Promise.all([
        apiService.getBikes(),
        apiService.getMaintenanceRecords(),
      ]);
      setBikes(updatedBikes);
      setSelectedBike(updatedBikes.find(b => b.id === selectedBike.id) || updatedBikes[0]);
      setMaintenanceRecords(updatedRecords);
      setServiceDialogOpen(false);
      showToast(`Serviced ${servicingComponent.name} on ${selectedBike.model}! Logged in history 🔧`, 'success');
    } catch (err) {
      showToast('Failed to record maintenance service', 'error');
    }
  };

  const handleSetPrimary = (bikeId: string) => {
    const updated = bikes.map(b => ({ ...b, isDefault: b.id === bikeId }));
    setBikes(updated);
    showToast('Primary active bike updated! 🚴', 'success');
  };

  if (loading) {
    return <LoadingSkeleton type="cards" count={3} />;
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            My Bike Garage & Maintenance 🔧
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your fleet, track component wear limits, and schedule drivetrain tune-ups.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setAddBikeOpen(true)}
          sx={{ fontWeight: 800 }}
        >
          Add Bicycle
        </Button>
      </Box>

      {/* Tabs: Garage / Component Health / Service Log */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3.5 }}>
        <Tabs
          value={tabIndex}
          onChange={(_e, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={`Fleet Garage (${bikes.length})`} sx={{ fontWeight: 700 }} />
          <Tab
            label={selectedBike ? `Component Health (${selectedBike.model})` : 'Component Health'}
            sx={{ fontWeight: 700 }}
          />
          <Tab label={`Service History (${maintenanceRecords.length})`} sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* TAB 0: Fleet Garage Overview */}
      {tabIndex === 0 && (
        <Grid container spacing={3}>
          {bikes.map(bike => (
            <Grid size={{ xs: 12, md: 4 }} key={bike.id}>
              <BikeCard
                bike={bike}
                onManageMaintenance={b => {
                  setSelectedBike(b);
                  setTabIndex(1);
                }}
                onSetDefault={handleSetPrimary}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* TAB 1: Component Health for Selected Bike */}
      {tabIndex === 1 && selectedBike && (
        <Box>
          {/* Bike Selector Banner */}
          <Paper
            sx={{
              p: 2.5,
              mb: 3.5,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              borderRadius: 3,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={800}>
                {selectedBike.brand} {selectedBike.model}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedBike.type} • {selectedBike.totalDistance.toLocaleString()} total km • Purchased in {selectedBike.year}
              </Typography>
            </Box>

            {/* Quick Switch Dropdown */}
            <TextField
              select
              size="small"
              label="Switch Bike"
              value={selectedBike.id}
              onChange={e => {
                const b = bikes.find(x => x.id === e.target.value);
                if (b) setSelectedBike(b);
              }}
              sx={{ minWidth: 220 }}
            >
              {bikes.map(b => (
                <MenuItem key={b.id} value={b.id}>
                  {b.brand} {b.model}
                </MenuItem>
              ))}
            </TextField>
          </Paper>

          {/* 6 Components Grid */}
          <Grid container spacing={3}>
            {selectedBike.components.map(component => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={component.id}>
                <MaintenanceCard
                  component={component}
                  onService={handleOpenServiceDialog}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* TAB 2: Maintenance Service History Table */}
      {tabIndex === 2 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Service Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Bicycle</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Component</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Service Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Odometer</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenanceRecords.map(rec => (
                  <TableRow key={rec.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{rec.date}</TableCell>
                    <TableCell>{rec.bikeName}</TableCell>
                    <TableCell>
                      <Chip label={rec.component} size="small" sx={{ fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rec.serviceType}
                        size="small"
                        color={rec.serviceType === 'Replacement' ? 'warning' : 'primary'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>{rec.distanceAtService.toLocaleString()} km</TableCell>
                    <TableCell>{rec.notes}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>${rec.cost || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Add Bike Dialog */}
      <Dialog
        open={addBikeOpen}
        onClose={() => setAddBikeOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Add New Bicycle to Garage</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Brand"
                placeholder="e.g. Trek, Specialized, Canyon"
                value={newBikeData.brand}
                onChange={e => setNewBikeData({ ...newBikeData, brand: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Model"
                placeholder="e.g. Domane AL 2, Diverge"
                value={newBikeData.model}
                onChange={e => setNewBikeData({ ...newBikeData, model: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Type"
                value={newBikeData.type}
                onChange={e => setNewBikeData({ ...newBikeData, type: e.target.value as any })}
              >
                <MenuItem value="Road Bike">Road Bike</MenuItem>
                <MenuItem value="Gravel">Gravel</MenuItem>
                <MenuItem value="Mountain Bike">Mountain Bike</MenuItem>
                <MenuItem value="Commuter">Commuter</MenuItem>
                <MenuItem value="E-Bike">E-Bike</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                fullWidth
                label="Model Year"
                value={newBikeData.year}
                onChange={e => setNewBikeData({ ...newBikeData, year: parseInt(e.target.value) || 2024 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                fullWidth
                label="Current Total Distance (km)"
                value={newBikeData.totalDistance}
                onChange={e => setNewBikeData({ ...newBikeData, totalDistance: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                fullWidth
                label="Weight (kg)"
                value={newBikeData.weightKg}
                onChange={e => setNewBikeData({ ...newBikeData, weightKg: parseFloat(e.target.value) || 9 })}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={newBikeData.image}
                onChange={e => setNewBikeData({ ...newBikeData, image: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setAddBikeOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddBike} sx={{ fontWeight: 700 }}>
            Save Bike
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Service Dialog */}
      <Dialog
        open={serviceDialogOpen}
        onClose={() => setServiceDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Record Maintenance Service 🔧
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You are marking <strong>{servicingComponent?.name}</strong> on <strong>{selectedBike?.model}</strong> as fully serviced. This resets wear mileage to 0 km.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Service Notes / Work Performed"
            placeholder="e.g. Installed new Shimano chain, lubricated pins..."
            multiline
            rows={3}
            value={serviceNotes}
            onChange={e => setServiceNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setServiceDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmService} sx={{ fontWeight: 700 }}>
            Confirm & Log Service
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
