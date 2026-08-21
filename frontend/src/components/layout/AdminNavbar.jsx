import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Menu, LogOut, Bell, User } from 'lucide-react';
import { toggleAdminSidebar } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import api from '../../services/api';

export default function AdminNavbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data);
      setUnreadCount(response.data.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Derive page name from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard Overview';
    if (path === '/admin/properties') return 'Property Management';
    if (path === '/admin/properties/add') return 'Add New Property';
    if (path.startsWith('/admin/properties/edit')) return 'Edit Property';
    if (path === '/admin/calendar') return 'Occupancy Calendar';
    if (path === '/admin/bookings') return 'Booking Records';
    if (path === '/admin/customers') return 'Customer Directory';
    if (path === '/admin/reviews') return 'Review Management';
    if (path === '/admin/revenue') return 'Financial Analytics';
    if (path === '/admin/settings') return 'Portal Settings';
    return 'Admin Panel';
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-line py-4 px-6 flex items-center justify-between">
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleAdminSidebar())}
          className="lg:hidden p-2 text-forest-dark focus:outline-none hover:bg-cream-deep rounded-lg"
          aria-label="Toggle admin sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-fraunces text-xl font-semibold text-forest-dark leading-none md:text-2xl">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Notifications & Profile info */}
      <div className="flex items-center gap-4 relative">
        {/* Simple Notification bell */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 text-charcoal hover:text-forest hover:bg-cream/40 rounded-lg focus:outline-none"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-line rounded-2xl shadow-xl z-50 overflow-hidden anim-scale-in origin-top-right">
              <div className="p-4 border-b border-line flex items-center justify-between bg-cream/20">
                <span className="font-fraunces text-sm font-semibold text-forest-dark">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-forest hover:underline uppercase"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[300px] overflow-y-auto divide-y divide-line">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n._id}
                      onClick={() => handleMarkAsRead(n._id)}
                      className={`p-3.5 text-[12.5px] cursor-pointer hover:bg-cream/10 transition-colors ${!n.isRead ? 'bg-gold/5 font-medium' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="text-forest-dark">{n.title || 'Notification'}</span>
                        <span className="text-[10px] text-charcoal-soft font-normal">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-charcoal-soft text-[11.5px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-charcoal-soft text-[12.5px]">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-[1px] bg-line hidden sm:block" />

        {/* Profile Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[13px] font-semibold text-charcoal">{user?.name || 'Administrator'}</span>
            <span className="text-[10px] text-charcoal-soft font-medium uppercase tracking-wider">System Owner</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gold text-forest-dark flex items-center justify-center font-fraunces text-xs font-bold shadow-sm">
            {user?.avatar || 'AD'}
          </div>
          <button 
            onClick={() => dispatch(logout())}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
