import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Home, FileText, Calendar, DollarSign, Users, Award, TrendingUp 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { mockRevenueStats } from '../../data/mockData';

export default function AdminDashboard() {
  const { properties } = useSelector((state) => state.properties);
  const { bookings } = useSelector((state) => state.bookings);

  // Compute stat totals dynamically
  const totalProperties = properties.length;
  const totalBookings = bookings.length;
  const activeProperties = properties.filter(p => p.isActive).length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;

  const totalRevenue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // Take recent bookings
  const recentBookings = bookings.slice(0, 4);

  const stats = [
    { name: 'Total Properties', value: totalProperties, desc: `${activeProperties} active stays`, icon: Home, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { name: 'Total Bookings', value: totalBookings, desc: `${pendingBookings} pending approval`, icon: FileText, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { name: 'Monthly Revenue', value: `₹${totalRevenue.toLocaleString()}`, desc: '+12.4% vs last month', icon: DollarSign, color: 'text-gold bg-amber-50 border-amber-100' },
    { name: 'Occupancy Rate', value: '78%', desc: 'Avg. 22 nights/property', icon: TrendingUp, color: 'text-purple-600 bg-purple-50 border-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-cream/30 flex">
      {/* Admin Sidebar Layout */}
      <AdminSidebar />

      {/* Main panel content (adjusted padding for desktop sidebar) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        <AdminNavbar />

        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-[1240px] mx-auto w-full">
          
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-line shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11.5px] font-bold text-charcoal-soft uppercase tracking-wider block mb-1">
                      {stat.name}
                    </span>
                    <h3 className="font-fraunces text-2xl md:text-3xl font-semibold text-forest-dark">
                      {stat.value}
                    </h3>
                    <span className="text-[12px] text-charcoal-soft font-medium mt-1 block">
                      {stat.desc}
                    </span>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.color}`}>
                    <Icon size={22} className="stroke-[2]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Recharts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Area Chart: Monthly Revenue */}
            <div className="lg:col-span-8 bg-white border border-line rounded-2xl p-6 shadow-sm">
              <h3 className="font-fraunces text-lg font-semibold text-forest-dark mb-6">
                Revenue Growth Timeline
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockRevenueStats.monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#08453E" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#08453E" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(8,69,62,0.06)" />
                    <XAxis dataKey="month" stroke="#5B5B54" fontSize={11} tickLine={false} />
                    <YAxis stroke="#5B5B54" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '12.5px', borderRadius: '10px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#08453E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Property performance */}
            <div className="lg:col-span-4 bg-white border border-line rounded-2xl p-6 shadow-sm">
              <h3 className="font-fraunces text-lg font-semibold text-forest-dark mb-6">
                Stays Performance
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockRevenueStats.propertyRevenue} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(8,69,62,0.06)" />
                    <XAxis dataKey="name" stroke="#5B5B54" fontSize={10} tickLine={false} />
                    <YAxis stroke="#5B5B54" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '12.5px', borderRadius: '10px' }} />
                    <Bar dataKey="revenue" fill="#C9A15A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tables Section: Recent Bookings & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent bookings table */}
            <div className="lg:col-span-12 bg-white border border-line rounded-2xl p-6 shadow-sm overflow-x-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-fraunces text-lg font-semibold text-forest-dark">
                  Recent Booking Invoices
                </h3>
                <Link to="/admin/bookings" className="text-[12.5px] font-semibold text-forest-light hover:underline">
                  View All Stays
                </Link>
              </div>

              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-charcoal-soft">
                    <th className="pb-3">Reference ID</th>
                    <th className="pb-3">Stay Property</th>
                    <th className="pb-3">Guest Profile</th>
                    <th className="pb-3">Stay Dates</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40 text-[13.5px] text-charcoal">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-cream/15 transition-colors">
                      <td className="py-3.5 font-mono text-[12.5px] font-bold">{b.id}</td>
                      <td className="py-3.5 font-semibold text-forest-dark">{b.propertyName}</td>
                      <td className="py-3.5">
                        <span className="font-medium block">{b.userName}</span>
                        <span className="text-[11.5px] text-charcoal-soft block">{b.userEmail}</span>
                      </td>
                      <td className="py-3.5 font-medium">{b.checkIn} to {b.checkOut}</td>
                      <td className="py-3.5 font-bold text-forest-dark">₹{b.totalAmount}</td>
                      <td className="py-3.5">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
