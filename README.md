# BrickOurHouse 🧱

BrickOurHouse is a comprehensive, dynamic marketplace connecting verified construction workers, agriculture workers, and domestic helpers with people looking to hire them seamlessly. It empowers communities by providing transparent hiring, dynamic scheduling, and an ecosystem for material purchasing.

## 🚀 Features

- **Multi-Platform Access:** Fully responsive web application and a companion cross-platform mobile app.
- **Worker Onboarding & Verification:** Secure onboarding flow with document uploads (Aadhar, PAN) and verification via Cyber Cafe admins or core admins.
- **Payment Gateway Integration:** Integrated with Razorpay & PhonePe for onboarding fee collection and cart checkouts.
- **Job Marketplace:** Users can post work requests with specific budgets and timelines, or direct-hire verified workers.
- **Materials Marketplace:** Browse and purchase construction materials directly through the platform.
- **Real-Time Communication:** Built-in Socket.io support for real-time notifications and chat features.
- **Cyber Cafe Portal:** Specialized dashboard for local cyber cafes to assist offline workers in joining the platform.

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, React Router
- **Mobile App:** React Native (Expo), NativeWind/Tailwind, Expo Image Picker
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io
- **Security:** Helmet, Express Rate Limit, Mongo Sanitize, HPP
- **Payments:** Razorpay, PhonePe (Testing via UAT)

## 📁 Project Structure

```
building/
├── backend/          # Node.js + Express API server
│   ├── config/       # Database & Env configurations
│   ├── controllers/  # API route logic
│   ├── models/       # Mongoose Schemas
│   ├── routes/       # Express router definitions
│   └── server.js     # Entry point
├── frontend/         # Vite + React Web Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route screens (Home, Profile, Cart, etc.)
│   │   ├── context/    # Global State (AuthContext)
│   │   └── data/       # Static localized data (Locations, Categories)
│   └── index.html    # Entry point with optimized LCP pre-connects
└── mobile/           # React Native Expo App
    ├── src/
    │   ├── screens/    # Mobile application screens
    │   ├── api/        # Axios API Client configuration
    │   └── theme/      # Color palettes and global styles
    └── app.json      # Production Expo configuration
```

## 💻 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or Atlas URI)
- Expo CLI (for mobile app)

### 1. Backend Setup
```bash
cd backend
npm install
# Create backend/.env with PORT, MONGO_URI, JWT_SECRET, RAZORPAY_KEY_ID, and RAZORPAY_KEY_SECRET
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create frontend/.env with VITE_API_URL and VITE_RAZORPAY_KEY_ID
npm run dev
```
*The frontend will run on `http://localhost:5173` and automatically proxy API requests to the backend.*

### 3. Mobile App Setup
```bash
cd mobile
npm install
npm start
```
*Use the Expo Go app on your physical device or run on an iOS Simulator / Android Emulator to test.*

## 🔒 Security & Deployment
- The backend is configured for deployment on platforms like Render or Heroku (`render.yaml` included).
- Rate-limiting and MongoDB sanitization are enabled by default for production environments.
- Mobile production assets (App Icon, Splash screens, Permissions) are pre-configured in `app.json`.

---
*Built with ❤️ to revolutionize the informal workforce sector.*
