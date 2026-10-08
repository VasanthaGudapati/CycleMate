export type CyclingExperience = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';

export type CyclingType = 
  | 'Road cycling' 
  | 'Mountain biking' 
  | 'Gravel' 
  | 'Commuting' 
  | 'Fitness' 
  | 'Recreation' 
  | 'E-Bike';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  experience: CyclingExperience;
  preferredType: CyclingType;
  level: number;
  xp: number;
  xpNextLevel: number;
  totalDistance: number; // in km
  totalRides: number;
  currentStreak: number; // in days
  weeklyGoalKm: number;
  weeklyProgressKm: number;
  memberSince: string;
  city: string;
  bio?: string;
}

export interface ActivityCoordinate {
  lat: number;
  lng: number;
  elevation: number;
  timestamp?: number;
  speed?: number;
}

export interface SpeedDataPoint {
  time: string; // e.g. "10m", "20m"
  speed: number; // km/h
  heartRate?: number;
}

export interface ElevationDataPoint {
  distance: number; // km
  elevation: number; // meters
}

export interface Ride {
  id: string;
  userId: string;
  title: string;
  date: string;
  distance: number; // km
  duration: number; // seconds
  avgSpeed: number; // km/h
  maxSpeed: number; // km/h
  elevation: number; // meters
  calories: number; // kcal
  routeName?: string;
  bikeId?: string;
  bikeName?: string;
  type: CyclingType;
  coordinates: ActivityCoordinate[];
  speedProfile: SpeedDataPoint[];
  elevationProfile: ElevationDataPoint[];
  notes?: string;
  weather?: {
    temp: number;
    condition: string;
    windSpeed: number;
  };
  aiAnalysis?: string;
  recommendations?: string[];
  safetyRating?: number;
}

export interface RouteWaypoint {
  name: string;
  type: 'Start' | 'Water stop' | 'Rest area' | 'Climb' | 'Finish';
  lat: number;
  lng: number;
  elevation: number;
  description: string;
}

export interface Route {
  id: string;
  name: string;
  startLocation: string;
  destination: string;
  distance: number; // km
  estTime: string; // e.g. "1h 32m"
  elevation: number; // meters
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  type: 'Fastest' | 'Safest' | 'Scenic' | 'Challenging';
  safetyRating: number; // 0-5
  surfaceType: string; // e.g. "Paved Road (85%), Cycleway (15%)"
  coordinates: [number, number][];
  waypoints: RouteWaypoint[];
  elevationProfile: ElevationDataPoint[];
  description: string;
  popularCount: number;
  isFavorite?: boolean;
}

export type ComponentStatus = 'Good' | 'Due Soon' | 'Overdue';

export interface BikeComponent {
  id: string;
  name: 'Chain' | 'Brake Pads' | 'Tires' | 'Gears' | 'Cassette' | 'Brake Cables';
  status: ComponentStatus;
  distanceSinceReplacement: number; // km
  thresholdKm: number; // replacement recommended threshold
  lastServicedDate: string;
  notes?: string;
}

export interface Bike {
  id: string;
  brand: string;
  model: string;
  type: 'Road Bike' | 'Gravel' | 'Mountain Bike' | 'Commuter' | 'E-Bike';
  year: number;
  totalDistance: number; // km
  purchaseDate: string;
  image: string;
  weightKg?: number;
  frameMaterial?: string;
  isDefault: boolean;
  components: BikeComponent[];
}

export interface MaintenanceRecord {
  id: string;
  bikeId: string;
  bikeName: string;
  component: string;
  date: string;
  serviceType: 'Replacement' | 'Inspection' | 'Tuning' | 'Cleaning';
  distanceAtService: number;
  notes: string;
  cost?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetKm: number;
  currentKm: number;
  rewardXp: number;
  deadline: string; // e.g. "2 days remaining"
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Epic';
  category: 'Distance' | 'Elevation' | 'Streak' | 'Exploration';
  joined: boolean;
  completed: boolean;
  participantsCount: number;
  badgeIcon: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  city: string;
  distance: number; // km
  rides: number;
  xp: number;
  isCurrentUser: boolean;
  badge?: string;
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    badge?: string;
    isFollowing?: boolean;
  };
  content: string;
  timestamp: string;
  rideSnippet?: {
    id: string;
    title: string;
    distance: number;
    duration: string;
    avgSpeed: number;
    elevation: number;
    mapPreview?: string;
  };
  likes: number;
  hasLiked: boolean;
  comments: PostComment[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  notifyOnRideStart: boolean;
}

export interface SafetySettings {
  liveRideSharing: boolean;
  autoCrashDetection: boolean;
  emergencyMessage: string;
  beaconIntervalSeconds: number;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  rainProb: number;
  windSpeed: number;
  cyclingScore: number;
  condition: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  conditionCode: string;
  windSpeed: number;
  windDirection: string;
  rainProbability: number;
  humidity: number;
  uvIndex: number;
  cyclingScore: number; // 0-100
  summary: string;
  hourlyForecast: HourlyWeather[];
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[];
  adviceCard?: {
    title: string;
    metrics: { label: string; value: string }[];
    tips: string[];
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'Milestones' | 'Speed' | 'Climbing' | 'Community';
  xp: number;
}
