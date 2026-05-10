import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import ProtectedRoute from './components/shared/ProtectedRoute.jsx'

// Public pages
import Home            from './pages/public/Home.jsx'
import Services        from './pages/public/Services.jsx'
import ProviderProfile from './pages/public/ProviderProfile.jsx'
import Login           from './pages/public/Login.jsx'
import Register        from './pages/public/Register.jsx'

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard.jsx'
import MyBookings        from './pages/customer/MyBookings.jsx'
import BookingDetail     from './pages/customer/BookingDetail.jsx'
import CreateBooking     from './pages/customer/CreateBooking.jsx'
import LeaveReview       from './pages/customer/LeaveReview.jsx'

// Provider pages
import ProviderDashboard from './pages/provider/Dashboard.jsx'
import Requests          from './pages/provider/Requests.jsx'
import Jobs              from './pages/provider/Jobs.jsx'
import JobDetail         from './pages/provider/JobDetail.jsx'
import ProviderProfile_  from './pages/provider/Profile.jsx'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminProviders from './pages/admin/Providers.jsx'
import AdminServices  from './pages/admin/Services.jsx'
import AdminReviews   from './pages/admin/Reviews.jsx'
import AdminBookings  from './pages/admin/Bookings.jsx'

const App = () => {
  return (
    <Layout>
      <Routes>
        {/* Public */}
        <Route path="/"                   element={<Home />} />
        <Route path="/services"           element={<Services />} />
        <Route path="/providers/:id"      element={<ProviderProfile />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/register"           element={<Register />} />

        {/* Customer */}
        <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/bookings"  element={<ProtectedRoute allowedRoles={['customer']}><MyBookings /></ProtectedRoute>} />
        <Route path="/customer/bookings/:id" element={<ProtectedRoute allowedRoles={['customer']}><BookingDetail /></ProtectedRoute>} />
        <Route path="/customer/bookings/create" element={<ProtectedRoute allowedRoles={['customer']}><CreateBooking /></ProtectedRoute>} />
        <Route path="/customer/review/:bookingId" element={<ProtectedRoute allowedRoles={['customer']}><LeaveReview /></ProtectedRoute>} />

        {/* Provider */}
        <Route path="/provider/dashboard" element={<ProtectedRoute allowedRoles={['provider']}><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/provider/requests"  element={<ProtectedRoute allowedRoles={['provider']}><Requests /></ProtectedRoute>} />
        <Route path="/provider/jobs"      element={<ProtectedRoute allowedRoles={['provider']}><Jobs /></ProtectedRoute>} />
        <Route path="/provider/jobs/:id"  element={<ProtectedRoute allowedRoles={['provider']}><JobDetail /></ProtectedRoute>} />
        <Route path="/provider/profile"   element={<ProtectedRoute allowedRoles={['provider']}><ProviderProfile_ /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard"  element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/providers"  element={<ProtectedRoute allowedRoles={['admin']}><AdminProviders /></ProtectedRoute>} />
        <Route path="/admin/services"   element={<ProtectedRoute allowedRoles={['admin']}><AdminServices /></ProtectedRoute>} />
        <Route path="/admin/reviews"    element={<ProtectedRoute allowedRoles={['admin']}><AdminReviews /></ProtectedRoute>} />
        <Route path="/admin/bookings"   element={<ProtectedRoute allowedRoles={['admin']}><AdminBookings /></ProtectedRoute>} />
      </Routes>
    </Layout>
  )
}

export default App