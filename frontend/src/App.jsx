import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPortalSettings } from './redux/slices/settingsSlice';

// Toast Container
import ToastContainer from './components/common/Toast';

// Public Pages
import Home from './pages/public/Home';
import Properties from './pages/public/Properties';
import PropertyDetails from './pages/public/PropertyDetails';
import Checkout from './pages/public/Checkout';
import BookingConfirmation from './pages/public/BookingConfirmation';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Terms from './pages/public/Terms';
import CancellationPolicy from './pages/public/CancellationPolicy';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Protected Pages
import Profile from './pages/user/Profile';
import MyBookings from './pages/user/MyBookings';
import Favorites from './pages/user/Favorites';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AddEditProperty from './pages/admin/AddEditProperty';
import AdminCalendar from './pages/admin/AdminCalendar';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminRevenue from './pages/admin/AdminRevenue';
import AdminSettings from './pages/admin/AdminSettings';
import ScrollToTop from './components/common/ScrollToTop';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Admin Route Component
function AdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" replace />;
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPortalSettings());
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/properties" 
            element={
              <AdminRoute>
                <AdminProperties />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/properties/add" 
            element={
              <AdminRoute>
                <AddEditProperty />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/properties/edit/:id" 
            element={
              <AdminRoute>
                <AddEditProperty />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/calendar" 
            element={
              <AdminRoute>
                <AdminCalendar />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/customers" 
            element={
              <AdminRoute>
                <AdminCustomers />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/reviews" 
            element={
              <AdminRoute>
                <AdminReviews />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/revenue" 
            element={
              <AdminRoute>
                <AdminRevenue />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            } 
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Notification System */}
        <ToastContainer />
      </div>
    </Router>
  );
}
