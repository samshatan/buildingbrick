import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'

// Static layout components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import ScrollToTop from './components/ScrollToTop'
import OfflineIndicator from './components/OfflineIndicator'
import ReloadPrompt from './components/ReloadPrompt'
import InstallPrompt from './components/InstallPrompt'

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Collection = lazy(() => import('./pages/Collection'))
const Contact = lazy(() => import('./pages/Contact'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const Orders = lazy(() => import('./pages/Orders'))
const SignUp = lazy(() => import('./pages/SignUp'))
const About = lazy(() => import('./pages/About'))
const Profile = lazy(() => import('./pages/Profile'))
const WorkRequests = lazy(() => import('./pages/WorkRequests'))
const DirectHire = lazy(() => import('./pages/DirectHire'))
const CafeDashboard = lazy(() => import('./pages/CafeDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const VerificationRequired = lazy(() => import('./pages/VerificationRequired'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

// Loading fallback component
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

function App() {
  return (
    <div>
      <OfflineIndicator />
      <ReloadPrompt />
      <InstallPrompt />
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        toastClassName={(context) => `toast-base toast-${context?.type ?? 'default'}`}
        progressClassName="toast-progress"
      />
      <ScrollToTop />
      <div className="print:hidden">
        <Navbar />
      </div>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/workers' element={<Collection />} />
          <Route path='/worker/:workerId' element={<Product />} />
          <Route path='/direct-hire/:workerId' element={<DirectHire />} />
          <Route path='/hire-request' element={<Cart />} />
          <Route path='/requests' element={<WorkRequests />} />
          <Route path='/jobs' element={<Orders />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verification-required' element={<VerificationRequired />} />
          <Route path='/cafe-dashboard' element={<CafeDashboard />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
        </Routes>
      </Suspense>
      <div className="print:hidden">
        <Footer />
        <BottomNav />
      </div>
    </div>
  )
}

export default App
