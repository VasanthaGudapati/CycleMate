# CycleMate 🚴

**CycleMate** is an intelligent cycling companion and activity tracker designed to elevate the riding experience through real-time telemetry, route discovery, safety alerts, maintenance management, and community engagement.

---

## 🌟 Key Features

- **Live Ride Tracking**: Real-time metrics including speed, elevation gain, distance, pace, and interactive GPS map tracking using Leaflet.
- **Route Discovery**: Explore popular trails and cycling routes with elevation profiles and difficulty ratings.
- **Performance Analytics**: Visualized summaries and trends of riding performance powered by Recharts.
- **Bike Garage**: Track maintenance schedules, component wear, and manage multiple bikes.
- **Safety & Weather Alerts**: Real-time weather forecasting and emergency/incident safety alerts.
- **AI Coach**: Personalized training advice, riding tips, and performance recommendations.
- **Community & Challenges**: Leaderboards, monthly challenges, and peer riding interactions.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: React 19 + TypeScript + Vite
- **UI Components**: Material UI (MUI v9) + Lucide Icons
- **Mapping**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Routing**: React Router v7

### Backend
- **Environment**: Python 3.12+

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.12+)

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

The frontend development server will start at `http://localhost:5173`.

### Backend Setup
```bash
# Activate virtual environment (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Run backend
python main.py
```

---

## 📁 Project Structure

```
CycleMate/
├── client/              # React + Vite frontend application
│   ├── src/
│   │   ├── components/  # Modular UI elements (maps, charts, cards)
│   │   ├── context/     # React state providers (Auth, Tracking, Theme, Toast)
│   │   ├── pages/       # Application views (Dashboard, Track, Garage, etc.)
│   │   ├── services/    # API client
│   │   └── theme/       # Custom MUI theme
│   └── package.json
├── .venv/               # Python virtual environment (ignored)
├── .gitignore           # Git ignore rules
├── main.py              # Python application entrypoint
└── README.md            # Project documentation
```
