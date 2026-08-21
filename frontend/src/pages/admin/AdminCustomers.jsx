import React from 'react';
import { useSelector } from 'react-redux';
import { Users, Mail, Phone, Calendar, DollarSign, Briefcase } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';

export default function AdminCustomers() {
  const { bookings } = useSelector((state) => state.bookings);
  
  // Define default customer profiles and extract unique guest profiles from bookings dynamically
  const defaultCustomers = [
    {
      name: 'Emma Morrison',
      email: 'emma@example.com',
      mobile: '+1 (828) 555-4921',
      joinedDate: 'January 2025'
    },
    {
      name: 'James Delgado',
      email: 'james@example.com',
      mobile: '+1 (510) 555-3921',
      joinedDate: 'March 2025'
    },
    {
      name: 'Sofia Petrova',
      email: 'sofia@example.com',
      mobile: '+1 (704) 555-9011',
      joinedDate: 'June 2025'
    }
  ];

  // Group bookings by guest email to build dynamic spending profiles
  const customerList = defaultCustomers.map(customer => {
    const customerBookings = bookings.filter(b => b.userEmail?.toLowerCase() === customer.email.toLowerCase());
    const totalStays = customerBookings.length;
    const totalSpend = customerBookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      ...customer,
      totalStays,
      totalSpend
    };
  });

  return (
    <div className="min-h-screen bg-cream/30 flex">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <AdminNavbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1240px] mx-auto w-full">
          
          <div className="pb-4 border-b border-line">
            <p className="text-[13.5px] text-charcoal-soft">View history and value analytics for CozyCave guest members</p>
          </div>

          {/* Customers table list */}
          <div className="bg-white border border-line rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-charcoal-soft bg-cream/15">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact Information</th>
                  <th className="p-4">Member Since</th>
                  <th className="p-4 text-center">Total Stays</th>
                  <th className="p-4 text-right">Total Spending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40 text-[13.5px] text-charcoal">
                {customerList.map((c, i) => (
                  <tr key={i} className="hover:bg-cream/10 transition-colors">
                    {/* Avatar and name */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-fraunces font-bold text-sm">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-forest-dark block">{c.name}</span>
                    </td>

                    {/* Contact */}
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] flex items-center gap-1 text-charcoal leading-none">
                          <Mail size={12} className="text-charcoal-soft" />
                          {c.email}
                        </span>
                        <span className="text-[12px] flex items-center gap-1 text-charcoal-soft mt-1">
                          <Phone size={11} className="text-charcoal-soft" />
                          {c.mobile}
                        </span>
                      </div>
                    </td>

                    {/* Member since */}
                    <td className="p-4 text-charcoal-soft font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} className="text-charcoal-soft" />
                        <span>{c.joinedDate}</span>
                      </div>
                    </td>

                    {/* Stays count */}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-forest-dark bg-cream-deep/60 px-2.5 py-1 rounded-md text-[13px]">
                        <Briefcase size={12} className="text-forest" />
                        {c.totalStays} stays
                      </span>
                    </td>

                    {/* Spending total */}
                    <td className="p-4 text-right font-bold text-forest-dark text-[14.5px]">
                      ${c.totalSpend.toLocaleString()}
                    </td>
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
