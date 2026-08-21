import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { registerUser } from '../../redux/slices/authSlice';
import { addToast } from '../../redux/slices/uiSlice';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
      dispatch(addToast({ message: 'All fields are required', type: 'warning' }));
      return;
    }

    if (password !== confirmPassword) {
      dispatch(addToast({ message: 'Passwords do not match', type: 'error' }));
      return;
    }

    dispatch(registerUser({ name, email, mobile, password }))
      .unwrap()
      .then((user) => {
        dispatch(addToast({ message: `Account created! Welcome to CozyCave, ${user.name}!`, type: 'success' }));
        navigate('/');
      })
      .catch((err) => {
        dispatch(addToast({ message: err || 'Registration failed', type: 'error' }));
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[460px] mx-auto w-full px-6 py-16 flex flex-col justify-center">
        <div className="bg-white border border-line rounded-2xl shadow-cozy p-8">
          
          <div className="text-center mb-8">
            <h2 className="font-fraunces text-2xl md:text-3xl font-semibold text-forest-dark mb-1">
              Create an account
            </h2>
            <p className="text-charcoal-soft text-[13.5px]">
              Join CozyCave and discover handpicked premium stays
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            
            {/* Field: Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <User size={13} className="text-forest" />
                Full Name
              </label>
              <input 
                type="text" 
                placeholder="Emma Watson" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                required
              />
            </div>

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
                className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                required
              />
            </div>

            {/* Field: Mobile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Phone size={13} className="text-forest" />
                Mobile Number
              </label>
              <input 
                type="tel" 
                placeholder="+1 (828) 555-0000" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                required
              />
            </div>

            {/* Field: Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={13} className="text-forest" />
                Password
              </label>
              <input 
                type="password" 
                placeholder="Create password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                required
              />
            </div>

            {/* Field: Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={13} className="text-forest" />
                Confirm Password
              </label>
              <input 
                type="password" 
                placeholder="Re-enter password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full mt-2 py-3.5 bg-forest hover:bg-forest-light text-white font-semibold rounded-xl text-[14.5px] text-center shadow-md hover:translate-y-[-1px] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Create Account</span>
              <ArrowRight size={15} />
            </button>
          </form>

          <div className="text-center mt-6 text-[13.5px] text-charcoal-soft">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest hover:underline">
              Log in
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
