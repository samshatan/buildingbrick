import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import SignUp from './pages/SignUp'
import Footer from './components/Footer'
import About from './pages/About'
import Profile from './pages/Profile'
import WorkRequests from './pages/WorkRequests'
import DirectHire from './pages/DirectHire'

import CafeDashboard from './pages/CafeDashboard'
import AdminDashboard from './pages/AdminDashboard'
import VerificationRequired from './pages/VerificationRequired'
import ScrollToTop from './components/ScrollToTop'
import BottomNav from './components/BottomNav'
import OfflineIndicator from './components/OfflineIndicator'
import ReloadPrompt from './components/ReloadPrompt'
import InstallPrompt from './components/InstallPrompt'

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
        <Route path='/verification-required' element={<VerificationRequired />} />
        <Route path='/cafe-dashboard' element={<CafeDashboard />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
      </Routes>
      <div className="print:hidden">
        <Footer />
        <BottomNav />
      </div>
    </div>
  )
}

export default App
