import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogIn, User, Heart, Briefcase, Menu, X, ShieldAlert } from 'lucide-react';
import Logo from './Logo';
import { toggleMobileMenu, setMobileMenuOpen } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { mobileMenuOpen } = useSelector((state) => state.ui);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setMobileMenuOpen(false));
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-line">
      <nav className="flex items-center justify-between py-5 px-6 md:px-12 max-w-[1240px] mx-auto">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-inter text-[14.5px] font-medium relative py-1 transition-colors duration-200 ${
                isActive(link.path)
                  ? 'text-forest-dark font-semibold'
                  : 'text-charcoal hover:text-forest-light'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-gold rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-5">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-[13.5px] font-semibold text-gold bg-forest-dark/10 px-3 py-1.5 rounded-full hover:bg-forest-dark/20 transition-all duration-200"
                >
                  <ShieldAlert size={15} />
                  Admin
                </Link>
              )}
              <Link
                to="/favorites"
                className="text-charcoal hover:text-forest transition-colors"
                title="Favorites"
              >
                <Heart size={20} className={location.pathname === '/favorites' ? 'fill-forest text-forest' : ''} />
              </Link>
              <Link
                to="/my-bookings"
                className="text-charcoal hover:text-forest transition-colors"
                title="My Bookings"
              >
                <Briefcase size={20} className={location.pathname === '/my-bookings' ? 'fill-forest text-forest' : ''} />
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-forest-dark font-semibold text-[14.5px] hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-fraunces text-xs">
                  {user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : 'US')}
                </div>
                <span>{user?.name ? user.name.split(' ')[0] : 'User'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-[13.5px] font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="font-semibold text-forest-dark text-[14.5px] hover:opacity-85">
                Log in
              </Link>
              <Link to="/properties" className="btn btn-primary bg-forest text-white px-7 py-3 rounded-full text-[14.5px] font-semibold shadow-[0_10px_24px_-10px_rgba(8,69,62,0.55)] hover:translate-y-[-2px] hover:shadow-[0_14px_28px_-10px_rgba(8,69,62,0.6)] transition-all duration-200">
                Book now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="md:hidden p-2 text-forest-dark focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-line shadow-lg anim-fade-up z-50">
          <div className="flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className={`py-4 px-6 border-b border-line text-[15px] font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-cream/40 text-forest-dark font-bold'
                    : 'text-charcoal hover:bg-cream/20'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex flex-col bg-cream/20">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                    className="py-4 px-6 border-b border-line text-[15px] font-semibold text-gold flex items-center gap-2"
                  >
                    <ShieldAlert size={18} />
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/favorites"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className="py-4 px-6 border-b border-line text-[15px] font-medium text-charcoal flex items-center gap-2"
                >
                  <Heart size={18} />
                  My Favorites
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className="py-4 px-6 border-b border-line text-[15px] font-medium text-charcoal flex items-center gap-2"
                >
                  <Briefcase size={18} />
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className="py-4 px-6 border-b border-line text-[15px] font-medium text-charcoal flex items-center gap-2"
                >
                  <User size={18} />
                  Profile ({user?.name || 'User'})
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-4 px-6 text-left text-[15px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col p-4 gap-3">
                <Link
                  to="/login"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className="w-full text-center py-3 border border-line rounded-full font-semibold text-forest-dark hover:bg-cream/30 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/properties"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className="w-full text-center py-3 bg-forest text-white rounded-full font-semibold shadow-md hover:bg-forest-light transition-colors"
                >
                  Book now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
