import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import ShopContextProvider from './context/ShopContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'}>
    <BrowserRouter>
      <AuthProvider>
        <ShopContextProvider>
          <App/>
        </ShopContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
)
