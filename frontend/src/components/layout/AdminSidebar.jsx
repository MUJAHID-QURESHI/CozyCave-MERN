import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  FileText, 
  Users, 
  Star, 
  TrendingUp, 
  Settings, 
  ArrowLeft,
  X 
} from 'lucide-react';
import Logo from './Logo';
import { setAdminSidebarOpen } from '../../redux/slices/uiSlice';

export default function AdminSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { adminSidebarOpen } = useSelector((state) => state.ui);

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Properties', path: '/admin/properties', icon: Home },
    { name: 'Calendar', path: '/admin/calendar', icon: Calendar },
    { name: 'Bookings', path: '/admin/bookings', icon: FileText },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Revenue', path: '/admin/revenue', icon: TrendingUp },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {adminSidebarOpen && (
        <div 
          onClick={() => dispatch(setAdminSidebarOpen(false))}
          className="lg:hidden fixed inset-0 z-40 bg-forest-dark/40 backdrop-blur-sm"
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-forest-dark text-white border-r border-forest-light/20 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        adminSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header/Logo */}
        <div className="p-6 border-b border-forest-light/20 flex items-center justify-between">
          <Logo light={true} />
          <button 
            onClick={() => dispatch(setAdminSidebarOpen(false))}
            className="lg:hidden p-1.5 text-cream hover:bg-forest-light/35 rounded-full"
            aria-label="Close admin sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => dispatch(setAdminSidebarOpen(false))}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 ${
                  active 
                    ? 'bg-gold text-forest-dark shadow-md' 
                    : 'text-cream/80 hover:bg-forest hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer/Back to Site Link */}
        <div className="p-4 border-t border-forest-light/20">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-3 bg-forest rounded-xl text-[14px] font-semibold text-white hover:bg-forest-light transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Customer Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
