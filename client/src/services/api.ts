import { 
  mockCurrentUser, 
  mockRides, 
  mockRoutes, 
  mockBikes, 
  mockMaintenanceRecords, 
  mockChallenges, 
  mockLeaderboard, 
  mockPosts, 
  mockEmergencyContacts, 
  mockSafetySettings, 
  mockWeather, 
  mockAchievements 
} from '../data/mockData';
import { 
  User, 
  Ride, 
  Route, 
  Bike, 
  MaintenanceRecord, 
  Challenge, 
  LeaderboardEntry, 
  Post, 
  EmergencyContact, 
  SafetySettings, 
  WeatherData,
  AICoachMessage,
  Achievement
} from '../types';

// Storage keys
const STORAGE_KEYS = {
  USER: 'cyclemate_user',
  RIDES: 'cyclemate_rides',
  ROUTES: 'cyclemate_routes',
  BIKES: 'cyclemate_bikes',
  MAINTENANCE: 'cyclemate_maintenance',
  CHALLENGES: 'cyclemate_challenges',
  POSTS: 'cyclemate_posts',
  EMERGENCY: 'cyclemate_emergency',
  SAFETY_SETTINGS: 'cyclemate_safety_settings',
  AI_CHAT: 'cyclemate_ai_chat',
};

// Helper for local storage persistence
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage save error:', err);
  }
}

// Simulated network delay
const delay = (ms = 180) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // --- AUTH & USER ---
  async getCurrentUser(): Promise<User> {
    await delay(100);
    return getStored<User>(STORAGE_KEYS.USER, mockCurrentUser);
  },

  async login(email: string, _password?: string): Promise<User> {
    await delay(350);
    const user = getStored<User>(STORAGE_KEYS.USER, mockCurrentUser);
    user.email = email || user.email;
    setStored(STORAGE_KEYS.USER, user);
    return user;
  },

  async register(data: Partial<User>): Promise<User> {
    await delay(450);
    const newUser: User = {
      ...mockCurrentUser,
      ...data,
      id: `u-${Date.now()}`,
      level: 1,
      xp: 150,
      xpNextLevel: 500,
      totalDistance: 0,
      totalRides: 0,
      currentStreak: 1,
      memberSince: 'Just joined',
    };
    setStored(STORAGE_KEYS.USER, newUser);
    return newUser;
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    await delay(200);
    const user = getStored<User>(STORAGE_KEYS.USER, mockCurrentUser);
    const updated = { ...user, ...updates };
    setStored(STORAGE_KEYS.USER, updated);
    return updated;
  },

  async addXP(xpToAdd: number): Promise<{ user: User; levelUp: boolean }> {
    const user = getStored<User>(STORAGE_KEYS.USER, mockCurrentUser);
    let newXp = user.xp + xpToAdd;
    let newLevel = user.level;
    let levelUp = false;

    if (newXp >= user.xpNextLevel) {
      newLevel += 1;
      newXp = newXp - user.xpNextLevel;
      user.xpNextLevel = Math.round(user.xpNextLevel * 1.35);
      levelUp = true;
    }

    const updatedUser: User = {
      ...user,
      xp: newXp,
      level: newLevel,
    };
    setStored(STORAGE_KEYS.USER, updatedUser);
    return { user: updatedUser, levelUp };
  },

  // --- RIDES ---
  async getRides(): Promise<Ride[]> {
    await delay(150);
    return getStored<Ride[]>(STORAGE_KEYS.RIDES, mockRides);
  },

  async getRideById(id: string): Promise<Ride | undefined> {
    await delay(100);
    const rides = getStored<Ride[]>(STORAGE_KEYS.RIDES, mockRides);
    return rides.find(r => r.id === id);
  },

  async saveRide(rideData: Omit<Ride, 'id'>): Promise<Ride> {
    await delay(300);
    const rides = getStored<Ride[]>(STORAGE_KEYS.RIDES, mockRides);
    const newRide: Ride = {
      ...rideData,
      id: `ride-${Date.now()}`,
    };
    const updatedRides = [newRide, ...rides];
    setStored(STORAGE_KEYS.RIDES, updatedRides);

    // Update user stats
    const user = getStored<User>(STORAGE_KEYS.USER, mockCurrentUser);
    user.totalRides += 1;
    user.totalDistance = Number((user.totalDistance + newRide.distance).toFixed(1));
    user.weeklyProgressKm = Number((user.weeklyProgressKm + newRide.distance).toFixed(1));
    setStored(STORAGE_KEYS.USER, user);

    // Add +50 XP for ride completion
    await this.addXP(50);

    return newRide;
  },

  async deleteRide(id: string): Promise<boolean> {
    await delay(150);
    const rides = getStored<Ride[]>(STORAGE_KEYS.RIDES, mockRides);
    const filtered = rides.filter(r => r.id !== id);
    setStored(STORAGE_KEYS.RIDES, filtered);
    return true;
  },

  // --- ROUTES ---
  async getRoutes(): Promise<Route[]> {
    await delay(150);
    return getStored<Route[]>(STORAGE_KEYS.ROUTES, mockRoutes);
  },

  async getRouteById(id: string): Promise<Route | undefined> {
    await delay(100);
    const routes = getStored<Route[]>(STORAGE_KEYS.ROUTES, mockRoutes);
    return routes.find(r => r.id === id);
  },

  async toggleFavoriteRoute(id: string): Promise<boolean> {
    const routes = getStored<Route[]>(STORAGE_KEYS.ROUTES, mockRoutes);
    const updated = routes.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r);
    setStored(STORAGE_KEYS.ROUTES, updated);
    return true;
  },

  // --- BIKES & MAINTENANCE ---
  async getBikes(): Promise<Bike[]> {
    await delay(150);
    return getStored<Bike[]>(STORAGE_KEYS.BIKES, mockBikes);
  },

  async addBike(bikeData: Omit<Bike, 'id' | 'components'>): Promise<Bike> {
    await delay(250);
    const bikes = getStored<Bike[]>(STORAGE_KEYS.BIKES, mockBikes);
    const newBike: Bike = {
      ...bikeData,
      id: `bike-${Date.now()}`,
      components: [
        { id: `c-1-${Date.now()}`, name: 'Chain', status: 'Good', distanceSinceReplacement: 0, thresholdKm: 3000, lastServicedDate: new Date().toISOString().split('T')[0] },
        { id: `c-2-${Date.now()}`, name: 'Brake Pads', status: 'Good', distanceSinceReplacement: 0, thresholdKm: 2500, lastServicedDate: new Date().toISOString().split('T')[0] },
        { id: `c-3-${Date.now()}`, name: 'Tires', status: 'Good', distanceSinceReplacement: 0, thresholdKm: 3000, lastServicedDate: new Date().toISOString().split('T')[0] },
        { id: `c-4-${Date.now()}`, name: 'Gears', status: 'Good', distanceSinceReplacement: 0, thresholdKm: 4000, lastServicedDate: new Date().toISOString().split('T')[0] },
        { id: `c-5-${Date.now()}`, name: 'Cassette', status: 'Good', distanceSinceReplacement: 0, thresholdKm: 6000, lastServicedDate: new Date().toISOString().split('T')[0] },
        { id: `c-6-${Date.now()}`, name: 'Brake Cables', status: 'Good', distanceSinceReplacement: 0, thresholdKm: 3500, lastServicedDate: new Date().toISOString().split('T')[0] },
      ],
    };
    const updated = [...bikes, newBike];
    setStored(STORAGE_KEYS.BIKES, updated);
    return newBike;
  },

  async markMaintenanceComplete(bikeId: string, componentName: string, notes: string): Promise<MaintenanceRecord> {
    await delay(250);
    const bikes = getStored<Bike[]>(STORAGE_KEYS.BIKES, mockBikes);
    const bike = bikes.find(b => b.id === bikeId);
    
    if (bike) {
      bike.components = bike.components.map(c => {
        if (c.name === componentName) {
          return {
            ...c,
            status: 'Good' as const,
            distanceSinceReplacement: 0,
            lastServicedDate: new Date().toISOString().split('T')[0],
            notes,
          };
        }
        return c;
      });
      setStored(STORAGE_KEYS.BIKES, bikes);
    }

    const records = getStored<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCE, mockMaintenanceRecords);
    const newRecord: MaintenanceRecord = {
      id: `m-${Date.now()}`,
      bikeId,
      bikeName: bike ? `${bike.brand} ${bike.model}` : 'Bicycle',
      component: componentName,
      date: new Date().toISOString().split('T')[0],
      serviceType: 'Replacement',
      distanceAtService: bike ? bike.totalDistance : 0,
      notes: notes || 'Periodic scheduled maintenance service executed.',
      cost: 35,
    };
    setStored(STORAGE_KEYS.MAINTENANCE, [newRecord, ...records]);
    return newRecord;
  },

  async getMaintenanceRecords(): Promise<MaintenanceRecord[]> {
    await delay(100);
    return getStored<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCE, mockMaintenanceRecords);
  },

  // --- CHALLENGES ---
  async getChallenges(): Promise<Challenge[]> {
    await delay(150);
    return getStored<Challenge[]>(STORAGE_KEYS.CHALLENGES, mockChallenges);
  },

  async toggleJoinChallenge(id: string): Promise<Challenge> {
    await delay(200);
    const challenges = getStored<Challenge[]>(STORAGE_KEYS.CHALLENGES, mockChallenges);
    let targetCh = challenges.find(c => c.id === id);
    if (!targetCh) throw new Error('Challenge not found');

    const updated = challenges.map(c => {
      if (c.id === id) {
        return {
          ...c,
          joined: !c.joined,
          participantsCount: c.joined ? c.participantsCount - 1 : c.participantsCount + 1,
        };
      }
      return c;
    });
    setStored(STORAGE_KEYS.CHALLENGES, updated);
    targetCh = updated.find(c => c.id === id)!;
    if (targetCh.joined) {
      await this.addXP(50);
    }
    return targetCh;
  },

  // --- LEADERBOARD ---
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    await delay(150);
    return mockLeaderboard;
  },

  // --- COMMUNITY ---
  async getPosts(): Promise<Post[]> {
    await delay(150);
    return getStored<Post[]>(STORAGE_KEYS.POSTS, mockPosts);
  },

  async createPost(content: string, rideSnippetId?: string): Promise<Post> {
    await delay(300);
    const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, mockPosts);
    const user = getStored<User>(STORAGE_KEYS.USER, mockCurrentUser);
    
    let rideSnippet;
    if (rideSnippetId) {
      const rides = getStored<Ride[]>(STORAGE_KEYS.RIDES, mockRides);
      const ride = rides.find(r => r.id === rideSnippetId);
      if (ride) {
        rideSnippet = {
          id: ride.id,
          title: ride.title,
          distance: ride.distance,
          duration: `${Math.floor(ride.duration / 3600)}h ${Math.floor((ride.duration % 3600) / 60)}m`,
          avgSpeed: ride.avgSpeed,
          elevation: ride.elevation,
        };
      }
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        badge: `Level ${user.level} Cyclist`,
      },
      content,
      timestamp: 'Just now',
      rideSnippet,
      likes: 0,
      hasLiked: false,
      comments: [],
    };

    setStored(STORAGE_KEYS.POSTS, [newPost, ...posts]);
    await this.addXP(25);
    return newPost;
  },

  async toggleLikePost(postId: string): Promise<Post> {
    const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, mockPosts);
    const updated = posts.map(p => {
      if (p.id === postId) {
        const nextHasLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked: nextHasLiked,
          likes: nextHasLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      }
      return p;
    });
    setStored(STORAGE_KEYS.POSTS, updated);
    return updated.find(p => p.id === postId)!;
  },

  async addComment(postId: string, text: string): Promise<Post> {
    const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, mockPosts);
    const user = getStored<User>(STORAGE_KEYS.USER, mockCurrentUser);
    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              userId: user.id,
              userName: user.name,
              userAvatar: user.avatar,
              text,
              timestamp: 'Just now',
            },
          ],
        };
      }
      return p;
    });
    setStored(STORAGE_KEYS.POSTS, updated);
    return updated.find(p => p.id === postId)!;
  },

  // --- SAFETY & WEATHER ---
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return getStored<EmergencyContact[]>(STORAGE_KEYS.EMERGENCY, mockEmergencyContacts);
  },

  async addEmergencyContact(contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
    const contacts = getStored<EmergencyContact[]>(STORAGE_KEYS.EMERGENCY, mockEmergencyContacts);
    const newContact: EmergencyContact = { ...contact, id: `ec-${Date.now()}` };
    setStored(STORAGE_KEYS.EMERGENCY, [...contacts, newContact]);
    return newContact;
  },

  async getSafetySettings(): Promise<SafetySettings> {
    return getStored<SafetySettings>(STORAGE_KEYS.SAFETY_SETTINGS, mockSafetySettings);
  },

  async updateSafetySettings(settings: SafetySettings): Promise<SafetySettings> {
    setStored(STORAGE_KEYS.SAFETY_SETTINGS, settings);
    return settings;
  },

  async getWeather(): Promise<WeatherData> {
    await delay(120);
    return mockWeather;
  },

  async getAchievements(): Promise<Achievement[]> {
    await delay(100);
    return mockAchievements;
  },

  // --- AI CYCLING COACH ---
  async getAIChatHistory(): Promise<AICoachMessage[]> {
    return getStored<AICoachMessage[]>(STORAGE_KEYS.AI_CHAT, [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: 'Hello Alex! 👋 I am your CycleMate AI Cycling Coach. I’ve analyzed your recent 7-day streak, average speed of 19.8 km/h, and 52 km weekly progress. How can I assist your training today?',
        timestamp: '9:00 AM',
        suggestions: [
          'How can I improve my speed?',
          'Create a 4-week training plan',
          'Analyze my latest ride',
          'How much should I cycle this week?',
          'Am I improving?',
        ],
      },
    ]);
  },

  async sendAICoachMessage(userMessageText: string): Promise<AICoachMessage> {
    await delay(700); // Simulate AI thought latency
    const chatHistory = await this.getAIChatHistory();

    const lower = userMessageText.toLowerCase();
    let replyText = '';
    let adviceCard: AICoachMessage['adviceCard'];
    let suggestions: string[] = [
      'Analyze my latest ride',
      'Create a 4-week training plan',
      'Suggest a route for tomorrow',
      'What should I eat before my ride?',
    ];

    if (lower.includes('speed') || lower.includes('faster')) {
      replyText = 'Based on your recent rides, your average speed is 19.8 km/h. Your cadence and power remain solid during the first 15 km, but drop slightly after 20 km. I recommend adding structured sweet-spot intervals and cadence drills to lift your aerobic threshold.';
      adviceCard = {
        title: 'Speed Optimization Protocol',
        metrics: [
          { label: 'Current Avg', value: '19.8 km/h' },
          { label: 'Target Pace', value: '22.5 km/h' },
          { label: 'Key Focus', value: 'Cadence (88-92 RPM)' },
        ],
        tips: [
          'Incorporate 4x4 min threshold intervals once per week.',
          'Focus on smooth pedal circles rather than mashing high gears.',
          'Maintain an aerodynamic hood posture on flat headwinds.',
        ],
      };
    } else if (lower.includes('training plan') || lower.includes('4-week')) {
      replyText = 'Here is a progressive 4-week aerobic endurance and climbing plan calibrated for your intermediate level and goal of riding 75+ km weekly:';
      adviceCard = {
        title: '4-Week Gran Fondo Progression',
        metrics: [
          { label: 'Week 1-2', value: 'Base building (55-65 km)' },
          { label: 'Week 3', value: 'Peak load (85 km + 700m elevation)' },
          { label: 'Week 4', value: 'Taper & recovery spin (45 km)' },
        ],
        tips: [
          'Tuesday: 20 km recovery spin at Zone 2 (<130 bpm).',
          'Thursday: 25 km tempo ride with 3x10 min sweet spot efforts.',
          'Saturday: 45–60 km long weekend endurance adventure.',
        ],
      };
    } else if (lower.includes('latest ride') || lower.includes('today')) {
      replyText = 'Your morning 24.6 km ride on the Lake Loop was strong! You hit a top speed of 34.2 km/h and conquered 185m of elevation in 1h 14m. You held great consistency until km 20, where pace slowed by ~12%.';
      adviceCard = {
        title: 'Ride Diagnostic: Morning Tempo Run',
        metrics: [
          { label: 'Distance', value: '24.6 km' },
          { label: 'Efficiency', value: '88% Pacing Consistency' },
          { label: 'Limiter', value: 'Late ride hydration/fueling' },
        ],
        tips: [
          'Take a sip of electrolytes every 15 minutes like clockwork.',
          'Lower gear on the climb to keep cadence above 80 RPM.',
        ],
      };
    } else if (lower.includes('how much') || lower.includes('week') || lower.includes('volume')) {
      replyText = 'You have already completed 52.6 km out of your 75 km weekly goal (70% progress!). With 2 days left in the week, an easy 23 km endurance spin on Saturday or two 12 km rides will hit your target effortlessly without overtraining.';
    } else if (lower.includes('improving') || lower.includes('progress')) {
      replyText = 'Yes, you are definitely improving! Over the past 30 days, your average speed increased by 8.4%, your longest ride climbed from 42 km to 68.4 km, and your active streak reached 7 consecutive days.';
    } else {
      replyText = `That is an excellent cycling question. Looking at your telemetry and riding history, maintaining consistent weekly volume while giving yourself 1–2 rest or recovery days each week will yield the fastest adaptations. Would you like a customized workout breakdown?`;
    }

    const aiMessage: AICoachMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions,
      adviceCard,
    };

    const userMessage: AICoachMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setStored(STORAGE_KEYS.AI_CHAT, [...chatHistory, userMessage, aiMessage]);
    return aiMessage;
  },
};
