import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { loginUser } from '../../redux/slices/authSlice';
import { addToast } from '../../redux/slices/uiSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      dispatch(addToast({ message: 'Please enter both email and password', type: 'warning' }));
      return;
    }

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((user) => {
        dispatch(addToast({ message: `Welcome back, ${user.name}!`, type: 'success' }));
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      })
      .catch((err) => {
        dispatch(addToast({ message: err || 'Login failed', type: 'error' }));
      });
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@cozycave.com');
      setPassword('adminpassword123');
    } else {
      setEmail('emma@example.com');
      setPassword('emmapassword123');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[460px] mx-auto w-full px-6 py-16 flex flex-col justify-center">
        <div className="bg-white border border-line rounded-2xl shadow-cozy p-8">
          
          <div className="text-center mb-8">
            <h2 className="font-fraunces text-2xl md:text-3xl font-semibold text-forest-dark mb-1">
              Welcome back
            </h2>
            <p className="text-charcoal-soft text-[13.5px]">
              Sign in to manage your bookings and listings
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {/* Field: Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={13} className="text-forest" />
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream/30 border border-line rounded-xl py-3 px-4 text-[14px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                required
              />
            </div>

            {/* Field: Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                  <Lock size={13} className="text-forest" />
                  Password
                </label>
                <a href="#" className="text-[11.5px] font-semibold text-forest-light hover:underline">
                  Forgot password?
                </a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream/30 border border-line rounded-xl py-3 px-4 text-[14px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                required
              />
            </div>

            {/* Remember me check */}
            <label className="flex items-center gap-2.5 text-[13.5px] text-charcoal cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-line text-forest focus:ring-forest cursor-pointer"
              />
              <span className="font-medium text-charcoal-soft">Remember me on this device</span>
            </label>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full py-3.5 bg-forest hover:bg-forest-light text-white font-semibold rounded-xl text-[14.5px] text-center shadow-md hover:translate-y-[-1px] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick login helper buttons for testing ease */}
          <div className="mt-8 pt-6 border-t border-line">
            <span className="text-[11px] font-bold text-charcoal-soft uppercase tracking-wider block text-center mb-3">
              Developer Quick Sign-in
            </span>
            <div className="flex gap-3">
              <button 
                onClick={() => handleQuickLogin('customer')}
                className="flex-1 py-2 px-3 border border-line rounded-lg text-[12px] font-semibold text-forest-dark hover:bg-cream/40 flex items-center justify-center gap-1"
              >
                Emma (Customer)
              </button>
              <button 
                onClick={() => handleQuickLogin('admin')}
                className="flex-1 py-2 px-3 border border-line rounded-lg text-[12px] font-semibold text-forest-dark hover:bg-cream/40 flex items-center justify-center gap-1"
              >
                <ShieldAlert size={12} className="text-gold" />
                CozyAdmin
              </button>
            </div>
          </div>

          <div className="text-center mt-6 text-[13.5px] text-charcoal-soft">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-forest hover:underline">
              Create account
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
