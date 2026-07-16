import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import ShopContextProvider from './context/ShopContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { SpeedInsights } from "@vercel/speed-insights/react"

// Global fetch patch for production API endpoints
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://brickourhouse-backend.onrender.com';
    input = baseUrl + input;
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'}>
    <BrowserRouter>
      <AuthProvider>
        <ShopContextProvider>
          <App/>
          <SpeedInsights />
        </ShopContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
)
