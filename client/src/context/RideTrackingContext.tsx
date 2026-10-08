import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Route, Ride, ActivityCoordinate, SpeedDataPoint, ElevationDataPoint } from '../types';
import { apiService } from '../services/api';
import { useToast } from './ToastContext';
import { mockRoutes } from '../data/mockData';

interface RideTrackingContextType {
  isTracking: boolean;
  isPaused: boolean;
  activeRoute: Route | null;
  elapsedSeconds: number;
  currentSpeed: number; // km/h
  avgSpeed: number; // km/h
  maxSpeed: number; // km/h
  distanceKm: number; // km
  caloriesBurned: number; // kcal
  currentElevation: number; // meters
  elevationGain: number; // meters
  currentPosition: [number, number]; // [lat, lng]
  pathHistory: [number, number][];
  speedProfile: SpeedDataPoint[];
  heartRate: number;
  startRide: (route?: Route) => void;
  pauseRide: () => void;
  resumeRide: () => void;
  finishRide: (title?: string) => Promise<Ride | null>;
  cancelRide: () => void;
  lastCompletedRide: Ride | null;
  simulationMultiplier: number;
  setSimulationMultiplier: (mult: number) => void;
}

const RideTrackingContext = createContext<RideTrackingContextType | null>(null);

// Default coordinates circuit around Boulder Reservoir
const DEFAULT_CIRCUIT: [number, number, number][] = [
  [40.0274, -105.2797, 1630],
  [40.0320, -105.2730, 1635],
  [40.0381, -105.2652, 1642],
  [40.0450, -105.2530, 1665],
  [40.0512, -105.2410, 1710],
  [40.0610, -105.2280, 1670],
  [40.0725, -105.2155, 1600],
  [40.0811, -105.2289, 1610],
  [40.0750, -105.2450, 1614],
  [40.0655, -105.2598, 1618],
  [40.0530, -105.2690, 1622],
  [40.0410, -105.2750, 1625],
  [40.0274, -105.2797, 1630],
];

export const RideTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeRoute, setActiveRoute] = useState<Route | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [currentElevation, setCurrentElevation] = useState(1630);
  const [elevationGain, setElevationGain] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([40.0274, -105.2797]);
  const [pathHistory, setPathHistory] = useState<[number, number][]>([[40.0274, -105.2797]]);
  const [speedProfile, setSpeedProfile] = useState<SpeedDataPoint[]>([]);
  const [heartRate, setHeartRate] = useState(132);
  const [lastCompletedRide, setLastCompletedRide] = useState<Ride | null>(null);
  const [simulationMultiplier, setSimulationMultiplier] = useState(1); // 1x or 3x for demo speed

  const waypointIndexRef = useRef(0);
  const progressRatioRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const { showToast } = useToast();

  const waypoints = activeRoute?.coordinates?.map(c => [c[0], c[1], 1630] as [number, number, number]) || DEFAULT_CIRCUIT;

  // Active GPS simulator loop
  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => {
          const nextSec = prev + 1;

          // Simulated speed variance (e.g. 20 - 28 km/h)
          const baseSpeed = 22.4;
          const noise = Math.sin(nextSec / 6) * 3.5 + (Math.random() - 0.5) * 1.5;
          const instantSpeed = Math.max(14.0, Math.min(38.0, Number((baseSpeed + noise).toFixed(1))));
          
          setCurrentSpeed(instantSpeed);
          setMaxSpeed(currentMax => Math.max(currentMax, instantSpeed));

          // Increment distance (instantSpeed km/h -> km per sec) * multiplier
          const distanceIncrement = (instantSpeed / 3600) * simulationMultiplier;
          setDistanceKm(prevDist => {
            const nextDist = Number((prevDist + distanceIncrement).toFixed(3));
            return nextDist;
          });

          // Calories (approx 25 kcal / km + speed factor)
          setCaloriesBurned(prevCal => prevCal + Math.round((distanceIncrement * 26) * 10) / 10);

          // Simulated Heart Rate (130 - 165 bpm)
          setHeartRate(Math.round(135 + (instantSpeed - 18) * 1.6 + Math.sin(nextSec / 5) * 4));

          // Map position interpolation
          const wps = waypoints;
          progressRatioRef.current += (0.012 * simulationMultiplier);
          if (progressRatioRef.current >= 1) {
            progressRatioRef.current = 0;
            waypointIndexRef.current = (waypointIndexRef.current + 1) % (wps.length - 1);
          }

          const currentWp = wps[waypointIndexRef.current];
          const nextWp = wps[(waypointIndexRef.current + 1) % wps.length];
          const lat = currentWp[0] + (nextWp[0] - currentWp[0]) * progressRatioRef.current;
          const lng = currentWp[1] + (nextWp[1] - currentWp[1]) * progressRatioRef.current;
          const elev = Math.round(currentWp[2] + (nextWp[2] - currentWp[2]) * progressRatioRef.current);

          setCurrentPosition([lat, lng]);
          setCurrentElevation(elev);
          setElevationGain(prevGain => prevGain + (Math.random() > 0.8 ? 1 : 0));
          setPathHistory(prevPath => {
            if (nextSec % 2 === 0) {
              return [...prevPath, [lat, lng]];
            }
            return prevPath;
          });

          // Record telemetry points every 10 simulated seconds
          if (nextSec % 10 === 0) {
            const mins = Math.floor(nextSec / 60);
            const secs = nextSec % 60;
            const timeLabel = `${mins}m ${secs > 0 ? secs + 's' : ''}`.trim();
            setSpeedProfile(prevProf => [
              ...prevProf,
              { time: timeLabel, speed: instantSpeed, heartRate: Math.round(140 + instantSpeed) },
            ]);
          }

          return nextSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking, isPaused, simulationMultiplier, waypoints]);

  const avgSpeed = elapsedSeconds > 0 
    ? Number(((distanceKm / (elapsedSeconds / 3600))).toFixed(1)) 
    : 0;

  const startRide = (route?: Route) => {
    const selectedRoute = route || mockRoutes[0];
    setActiveRoute(selectedRoute);
    setIsTracking(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setDistanceKm(0);
    setCaloriesBurned(0);
    setCurrentSpeed(18.5);
    setMaxSpeed(18.5);
    setElevationGain(0);
    waypointIndexRef.current = 0;
    progressRatioRef.current = 0;

    const startCoord = selectedRoute.coordinates[0];
    setCurrentPosition(startCoord);
    setPathHistory([startCoord]);
    setSpeedProfile([{ time: '0m', speed: 18.5, heartRate: 125 }]);
    showToast(`Ride started! GPS simulated tracking active 🚴`, 'success');
  };

  const pauseRide = () => {
    setIsPaused(true);
    setCurrentSpeed(0);
    showToast('Ride paused ⏸️', 'info');
  };

  const resumeRide = () => {
    setIsPaused(false);
    showToast('Ride resumed ▶️', 'success');
  };

  const cancelRide = () => {
    setIsTracking(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    showToast('Ride tracking cancelled', 'info');
  };

  const finishRide = async (title?: string): Promise<Ride | null> => {
    setIsTracking(false);
    setIsPaused(false);

    const finalDistance = Math.max(distanceKm, 0.5); // Minimum sample
    const finalAvg = avgSpeed > 0 ? avgSpeed : 20.4;
    const finalMax = maxSpeed > 0 ? maxSpeed : 31.8;
    const finalDuration = Math.max(elapsedSeconds, 45);
    const finalCalories = Math.max(Math.round(caloriesBurned), 28);
    const finalElevation = Math.max(elevationGain, 45);

    // Build rich coordinates list
    const recordedCoords: ActivityCoordinate[] = pathHistory.map((p, idx) => ({
      lat: p[0],
      lng: p[1],
      elevation: 1630 + (idx % 5) * 8,
      speed: 21.0,
    }));

    // Ensure speed profile has data
    const finalSpeedProfile = speedProfile.length > 2 ? speedProfile : [
      { time: '0m', speed: 18.2, heartRate: 128 },
      { time: '5m', speed: 23.4, heartRate: 142 },
      { time: '10m', speed: 25.1, heartRate: 154 },
      { time: '15m', speed: 22.0, heartRate: 146 },
    ];

    const elevationProfile: ElevationDataPoint[] = [
      { distance: 0, elevation: 1630 },
      { distance: Number((finalDistance * 0.35).toFixed(1)), elevation: 1630 + finalElevation },
      { distance: Number(finalDistance.toFixed(1)), elevation: 1630 + 10 },
    ];

    const rideToSave: Omit<Ride, 'id'> = {
      userId: 'u-alex-morgan',
      title: title || `${activeRoute?.name || 'Afternoon Ride'} — Completed`,
      date: 'Just now',
      distance: Number(finalDistance.toFixed(1)),
      duration: finalDuration,
      avgSpeed: Number(finalAvg.toFixed(1)),
      maxSpeed: Number(finalMax.toFixed(1)),
      elevation: finalElevation,
      calories: finalCalories,
      routeName: activeRoute?.name || 'Lake Loop Scenic Circuit',
      type: 'Road cycling',
      coordinates: recordedCoords,
      speedProfile: finalSpeedProfile,
      elevationProfile,
      weather: { temp: 24, condition: 'Mostly Sunny', windSpeed: 11 },
      aiAnalysis: `Great effort on today's session! You maintained a solid average speed of ${finalAvg.toFixed(1)} km/h over ${finalDistance.toFixed(1)} km. Your acceleration was smooth and your pacing in the middle stretch demonstrated disciplined aerobic endurance.`,
      recommendations: [
        'Perform a 5-minute cool-down stretch focused on hamstrings and hip flexors.',
        'Rehydrate with at least 500ml of water and an electrolyte tablet.',
        'Inspect your bike chain and wipe down road dust to prolong component lifespan.',
      ],
      safetyRating: 4.9,
    };

    const saved = await apiService.saveRide(rideToSave);
    setLastCompletedRide(saved);
    showToast(`Great Ride! 🚴 Logged ${finalDistance.toFixed(1)} km (+50 XP)`, 'success');
    return saved;
  };

  return (
    <RideTrackingContext.Provider
      value={{
        isTracking,
        isPaused,
        activeRoute,
        elapsedSeconds,
        currentSpeed,
        avgSpeed,
        maxSpeed,
        distanceKm,
        caloriesBurned,
        currentElevation,
        elevationGain,
        currentPosition,
        pathHistory,
        speedProfile,
        heartRate,
        startRide,
        pauseRide,
        resumeRide,
        finishRide,
        cancelRide,
        lastCompletedRide,
        simulationMultiplier,
        setSimulationMultiplier,
      }}
    >
      {children}
    </RideTrackingContext.Provider>
  );
};

export const useRideTracking = () => {
  const context = useContext(RideTrackingContext);
  if (!context) throw new Error('useRideTracking must be used within RideTrackingProvider');
  return context;
};
