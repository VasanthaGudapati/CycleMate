import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Paper, Typography } from '@mui/material';
import { RouteWaypoint } from '../../types';

// Fix Leaflet's default marker icon 404s using inline SVGs or standard data URIs
const createCustomIcon = (color: string, label?: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 11px;
        font-weight: bold;
      ">
        ${label || ''}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const liveRiderIcon = L.divIcon({
  className: 'live-rider-icon',
  html: `
    <div style="position: relative; width: 28px; height: 28px;">
      <div style="
        position: absolute;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: rgba(16, 185, 129, 0.4);
        animation: pulse-ring 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
      "></div>
      <div style="
        position: absolute;
        top: 4px;
        left: 4px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #059669;
        border: 2.5px solid #ffffff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="font-size: 10px;">🚴</span>
      </div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

// Component to dynamically adjust map center or bounds
const MapViewController: React.FC<{
  center: [number, number];
  bounds?: [number, number][];
  zoom?: number;
}> = ({ center, bounds, zoom = 13 }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 1) {
      try {
        const leafletBounds = L.latLngBounds(bounds.map(b => [b[0], b[1]]));
        map.fitBounds(leafletBounds, { padding: [40, 40], maxZoom: 15 });
      } catch (err) {
        map.setView(center, zoom);
      }
    } else {
      map.setView(center, zoom);
    }
  }, [map, center, bounds, zoom]);

  return null;
};

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  height?: string | number;
  path?: [number, number][];
  waypoints?: RouteWaypoint[];
  currentPosition?: [number, number];
  isLiveTracking?: boolean;
  interactive?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  center = [40.0274, -105.2797],
  zoom = 13,
  height = '100%',
  path,
  waypoints,
  currentPosition,
  isLiveTracking = false,
  interactive = true,
}) => {
  const mapCenter = useMemo(() => {
    if (currentPosition) return currentPosition;
    if (path && path.length > 0) return path[0];
    return center;
  }, [currentPosition, path, center]);

  const waypointIcon = (type: RouteWaypoint['type']) => {
    switch (type) {
      case 'Start':
        return createCustomIcon('#10B981', 'S');
      case 'Finish':
        return createCustomIcon('#EF4444', 'F');
      case 'Climb':
        return createCustomIcon('#F59E0B', '▲');
      case 'Water stop':
        return createCustomIcon('#0EA5E9', '💧');
      case 'Rest area':
        return createCustomIcon('#8B5CF6', '☕');
      default:
        return createCustomIcon('#10B981');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height,
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        minHeight: typeof height === 'number' ? height : 280,
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewController center={mapCenter} bounds={path} zoom={zoom} />

        {/* Route line */}
        {path && path.length > 1 && (
          <Polyline
            positions={path}
            pathOptions={{
              color: '#059669',
              weight: 5,
              opacity: 0.85,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        {/* Waypoints */}
        {waypoints &&
          waypoints.map((wp, index) => (
            <Marker
              key={`${wp.name}-${index}`}
              position={[wp.lat, wp.lng]}
              icon={waypointIcon(wp.type)}
            >
              <Popup>
                <Paper sx={{ p: 1, minWidth: 150 }} elevation={0}>
                  <Typography variant="subtitle2" color="primary.main">
                    {wp.type.toUpperCase()}: {wp.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Elevation: {wp.elevation}m
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {wp.description}
                  </Typography>
                </Paper>
              </Popup>
            </Marker>
          ))}

        {/* Live Tracking Position Marker */}
        {currentPosition && (
          <Marker position={currentPosition} icon={liveRiderIcon}>
            <Popup>
              <Box sx={{ p: 0.5, textAlign: 'center' }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  🚴 You are here
                </Typography>
                {isLiveTracking && (
                  <Typography variant="caption" color="success.main" fontWeight={600}>
                    Active Live GPS Beacon
                  </Typography>
                )}
              </Box>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};
