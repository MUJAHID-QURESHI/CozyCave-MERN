import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Save, Camera, LogOut } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { updateUserProfile, logout } from '../../redux/slices/authSlice';
import { addToast } from '../../redux/slices/uiSlice';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // If user is not authenticated, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !mobile.trim()) {
      dispatch(addToast({ message: 'Please fill in all details', type: 'warning' }));
      return;
    }

    dispatch(updateUserProfile({ name, mobile }))
      .unwrap()
      .then(() => {
        dispatch(addToast({ message: 'Profile details updated successfully!', type: 'success' }));
      })
      .catch((err) => {
        dispatch(addToast({ message: err || 'Update failed', type: 'error' }));
      });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      dispatch(addToast({ message: 'All password fields are required', type: 'warning' }));
      return;
    }

    if (newPassword !== confirmPassword) {
      dispatch(addToast({ message: 'New passwords do not match', type: 'error' }));
      return;
    }

    dispatch(addToast({ message: 'Password changed successfully (Mocked)!', type: 'success' }));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ message: 'Logged out successfully', type: 'info' }));
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[1000px] mx-auto w-full px-6 md:px-12 py-12">
        <h2 className="font-fraunces text-3xl font-semibold text-forest-dark mb-10">My Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left profile avatar card (4 grid columns) */}
          <div className="md:col-span-4 bg-white border border-line rounded-2xl p-6 text-center flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-forest text-white font-fraunces font-bold text-3xl flex items-center justify-center shadow-md">
                {user.avatar || user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} />
              </div>
            </div>

            <div>
              <h3 className="font-fraunces text-lg font-semibold text-forest-dark">{user.name}</h3>
              <span className="text-[12px] font-bold text-gold uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded">
                {user.role}
              </span>
              <span className="text-[12.5px] text-charcoal-soft block mt-1">Joined in {user.joinedDate || '2025'}</span>
            </div>

            <button 
              onClick={handleLogout}
              className="mt-4 w-full py-2.5 border border-red-200 text-red-600 font-semibold text-[13.5px] rounded-full hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </div>

          {/* Right profile forms (8 grid columns) */}
          <div className="md:col-span-8 flex flex-col gap-8">
            
            {/* Form: Profile Information */}
            <div className="bg-white border border-line rounded-2xl p-6">
              <h3 className="font-fraunces text-lg font-semibold text-forest-dark mb-5">
                Profile Information
              </h3>
              
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <User size={13} className="text-forest" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-3 px-4 text-[14px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <Phone size={13} className="text-forest" />
                      Mobile Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-cream/30 border border-line rounded-xl py-3 px-4 text-[14px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="self-start mt-2 px-6 py-3 bg-forest hover:bg-forest-light text-white font-semibold rounded-full text-[13.5px] flex items-center gap-1.5 shadow-sm"
                >
                  <Save size={15} />
                  Save Changes
                </button>
              </form>
            </div>

            {/* Form: Password Security */}
            <div className="bg-white border border-line rounded-2xl p-6">
              <h3 className="font-fraunces text-lg font-semibold text-forest-dark mb-5">
                Security & Password
              </h3>
              
              <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <Lock size={13} className="text-forest" />
                    Current Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-3 px-4 text-[14px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={13} className="text-forest" />
                      New Password
                    </label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-cream/30 border border-line rounded-xl py-3 px-4 text-[14px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={13} className="text-forest" />
                      Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-cream/30 border border-line rounded-xl py-3 px-4 text-[14px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="self-start mt-2 px-6 py-3 bg-forest hover:bg-forest-light text-white font-semibold rounded-full text-[13.5px] flex items-center gap-1.5 shadow-sm"
                >
                  <Lock size={15} />
                  Update Password
                </button>
              </form>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
