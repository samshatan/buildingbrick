import { Suspense, lazy } from 'react'
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
const Workers = lazy(() => import('./pages/Workers'))
const WorkerProfile = lazy(() => import('./pages/WorkerProfile'))
const Contact = lazy(() => import('./pages/Contact'))
const Cart = lazy(() => import('./pages/Cart'))
const Orders = lazy(() => import('./pages/Orders'))
const SignUp = lazy(() => import('./pages/SignUp'))
const About = lazy(() => import('./pages/About'))
const Profile = lazy(() => import('./pages/Profile'))
const Materials = lazy(() => import('./pages/Materials'))
const MaterialDetails = lazy(() => import('./pages/MaterialDetails'))
const MaterialOrders = lazy(() => import('./pages/MaterialOrders'))
const WorkRequests = lazy(() => import('./pages/WorkRequests'))
const Jobs = lazy(() => import('./pages/Jobs'))
const Projects = lazy(() => import('./pages/Projects'))
const WorkerOnboarding = lazy(() => import('./pages/WorkerOnboarding'))
const DirectHire = lazy(() => import('./pages/DirectHire'))
const CafeDashboard = lazy(() => import('./pages/CafeDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const VerificationRequired = lazy(() => import('./pages/VerificationRequired'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Terms = lazy(() => import('./pages/Terms'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))


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
          <Route path='/workers' element={<Workers />} />
          <Route path='/worker/:workerId' element={<WorkerProfile />} />
          <Route path='/direct-hire/:workerId' element={<DirectHire />} />
          <Route path='/hire-request' element={<Cart />} />
          <Route path='/materials' element={<Materials />} />
          <Route path='/materials/:id' element={<MaterialDetails />} />
          <Route path='/material-orders' element={<MaterialOrders />} />
          <Route path='/requests' element={<WorkRequests />} />
          <Route path='/jobs' element={<Jobs />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/worker-onboarding' element={<WorkerOnboarding />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verification-required' element={<VerificationRequired />} />
          <Route path='/cafe-dashboard' element={<CafeDashboard />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/refund-policy' element={<RefundPolicy />} />
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
