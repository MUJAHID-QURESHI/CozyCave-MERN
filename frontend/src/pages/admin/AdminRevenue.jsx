import React from 'react';
import { useSelector } from 'react-redux';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { IndianRupee, Landmark, TrendingUp, Award, Calendar } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { mockRevenueStats } from '../../data/mockData';

export default function AdminRevenue() {
  const { bookings } = useSelector((state) => state.bookings);

  // Compute stats from active bookings dynamically
  const activeBookings = bookings.filter(b => b.status !== 'Cancelled');
  const totalEarnings = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalNights = activeBookings.reduce((sum, b) => sum + b.nights, 0);

  const averageEarnings = activeBookings.length > 0 
    ? Math.round(totalEarnings / activeBookings.length) 
    : 0;

  const dynamicPropertyRevenue = activeBookings.reduce((acc, b) => {
    const key = b.propertyName.split(' ').slice(0, 2).join(' '); // shorten name
    const match = acc.find(item => item.name === key);
    if (match) {
      match.revenue += b.totalAmount;
    } else {
      acc.push({ name: key, revenue: b.totalAmount });
    }
    return acc;
  }, []);

  const stats = [
    { name: 'Gross Income', value: `₹${totalEarnings.toLocaleString()}`, desc: 'Earnings across all active bookings', icon: IndianRupee, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { name: 'Average Transaction', value: `₹${averageEarnings}`, desc: 'Average earnings per stay order', icon: Landmark, color: 'text-gold bg-amber-50 border-amber-100' },
    { name: 'Nights Booked', value: `${totalNights} nights`, desc: 'Occupancy nights summary count', icon: Calendar, color: 'text-blue-700 bg-blue-50 border-blue-100' },
  ];

  return (
    <div className="min-h-screen bg-cream/30 flex">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        <AdminNavbar />

        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-[1240px] mx-auto w-full">
          
          <div className="pb-4 border-b border-line">
            <p className="text-[13.5px] text-charcoal-soft">Detailed overview of financial performance, monthly timeline growth, and stay assets contribution</p>
          </div>

          {/* Stats row grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                    <Icon size={20} className="stroke-[2.2]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Area timeline chart */}
            <div className="lg:col-span-8 bg-white border border-line rounded-2xl p-6 shadow-sm">
              <h3 className="font-fraunces text-lg font-semibold text-forest-dark mb-6">
                Monthly Earnings Growth
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockRevenueStats.monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#08453E" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#08453E" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(8,69,62,0.06)" />
                    <XAxis dataKey="month" stroke="#5B5B54" fontSize={11} tickLine={false} />
                    <YAxis stroke="#5B5B54" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '12.5px', borderRadius: '10px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#08453E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Stays contribution chart */}
            <div className="lg:col-span-4 bg-white border border-line rounded-2xl p-6 shadow-sm">
              <h3 className="font-fraunces text-lg font-semibold text-forest-dark mb-6">
                Property-Wise Earnings
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynamicPropertyRevenue.length > 0 ? dynamicPropertyRevenue : mockRevenueStats.propertyRevenue} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
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

          {/* Dynamic booking invoices ledger */}
          <div className="bg-white border border-line rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h3 className="font-fraunces text-lg font-semibold text-forest-dark mb-6">
              Financial ledger
            </h3>
            
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-charcoal-soft">
                  <th className="pb-3">Reference ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Property</th>
                  <th className="pb-3">Nights</th>
                  <th className="pb-3">Cleaning</th>
                  <th className="pb-3">Service Fee</th>
                  <th className="pb-3 text-right">Total Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40 text-[13.5px] text-charcoal">
                {activeBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-cream/15 transition-colors">
                    <td className="py-3.5 font-mono text-[12px] font-bold">{b.id}</td>
                    <td className="py-3.5 text-charcoal-soft">{b.createdAt}</td>
                    <td className="py-3.5 font-semibold text-forest-dark">{b.propertyName}</td>
                    <td className="py-3.5 font-medium">{b.nights} nights</td>
                    <td className="py-3.5 text-charcoal-soft">₹{b.cleaningFee || 0}</td>
                    <td className="py-3.5 text-charcoal-soft">₹{b.serviceFee || 0}</td>
                    <td className="py-3.5 text-right font-bold text-forest-dark">₹{b.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}
