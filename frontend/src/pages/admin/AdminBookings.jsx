import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Eye, XCircle, CheckCircle, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { updateBookingStatus, deleteBooking } from '../../redux/slices/bookingSlice';
import { addToast } from '../../redux/slices/uiSlice';
import Modal from '../../components/common/Modal';

export default function AdminBookings() {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookings);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleUpdateStatus = (id, status) => {
    dispatch(updateBookingStatus({ bookingId: id, status }));
    dispatch(addToast({ message: `Updated booking status to ${status}`, type: 'success' }));
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status });
    }
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm(`Are you sure you want to delete booking reference ${id}?`)) {
      dispatch(deleteBooking(id));
      dispatch(addToast({ message: `Deleted booking ${id}`, type: 'info' }));
      setSelectedBooking(null);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.propertyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-cream/30 flex">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        <AdminNavbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1240px] mx-auto w-full">
          
          {/* Filters head bar */}
          <div className="bg-white border border-line rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <input 
                type="text" 
                placeholder="Search ID, guest, property..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-cream/30 border border-line rounded-xl py-2.5 pl-10 pr-4 text-[13px] font-medium text-forest-dark focus:outline-none"
              />
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-soft" />
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <label className="text-[12px] font-bold text-charcoal-soft uppercase tracking-wider">Status:</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-line rounded-xl py-2 px-3 text-[13px] font-semibold text-forest-dark focus:outline-none cursor-pointer"
              >
                <option value="">All Bookings</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings table list */}
          <div className="bg-white border border-line rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-charcoal-soft bg-cream/15">
                  <th className="p-4">Reference ID</th>
                  <th className="p-4">Stay Property</th>
                  <th className="p-4">Guest Profile</th>
                  <th className="p-4">Stay Dates</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40 text-[13.5px] text-charcoal">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-cream/10 transition-colors">
                    <td className="p-4 font-mono font-bold text-[12px]">{b.id}</td>
                    <td className="p-4 font-semibold text-forest-dark">{b.propertyName}</td>
                    <td className="p-4">
                      <span className="font-medium block leading-tight">{b.userName}</span>
                      <span className="text-[11.5px] text-charcoal-soft block mt-0.5">{b.userEmail}</span>
                    </td>
                    <td className="p-4 font-medium">{b.checkIn} to {b.checkOut}</td>
                    <td className="p-4 font-bold text-forest-dark">₹{b.totalAmount}</td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-2 border border-line hover:border-forest text-charcoal hover:text-forest rounded-lg hover:bg-cream/20 transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* Booking Details Viewer Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Booking Invoice: ${selectedBooking?.id}`}
      >
        {selectedBooking && (
          <div className="flex flex-col gap-5 text-[14.5px]">
            <div className="flex justify-between items-center bg-cream/45 p-4 border border-line rounded-xl">
              <div>
                <span className="text-[11px] font-bold text-charcoal-soft uppercase tracking-wider block">Reference ID</span>
                <span className="font-mono font-bold text-forest-dark text-[15px]">{selectedBooking.id}</span>
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                selectedBooking.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                selectedBooking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                selectedBooking.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {selectedBooking.status}
              </span>
            </div>

            {/* Info lists */}
            <div className="space-y-3 font-medium">
              <div>Stay: <span className="font-bold text-forest-dark">{selectedBooking.propertyName}</span></div>
              <div>Location: <span className="text-charcoal-soft font-normal">{selectedBooking.propertyLocation}</span></div>
              <div>Guest Name: <span className="text-charcoal-soft font-normal">{selectedBooking.userName}</span></div>
              <div>Email: <span className="text-charcoal-soft font-normal">{selectedBooking.userEmail}</span></div>
              <div>Phone: <span className="text-charcoal-soft font-normal">{selectedBooking.userMobile}</span></div>
              <div>Timings: <span className="text-charcoal-soft font-normal">{selectedBooking.checkIn} to {selectedBooking.checkOut} ({selectedBooking.nights} nights)</span></div>
              <div>Total Cost: <span className="font-bold text-forest-dark">₹{selectedBooking.totalAmount}</span></div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2.5 border-t border-line pt-4 mt-2">
              {selectedBooking.status === 'Pending' && (
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'Confirmed')}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[13px] flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={14} />
                  Confirm
                </button>
              )}
              {selectedBooking.status === 'Confirmed' && (
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'Completed')}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[13px] flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={14} />
                  Complete
                </button>
              )}
              {selectedBooking.status !== 'Cancelled' && selectedBooking.status !== 'Completed' && (
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'Cancelled')}
                  className="flex-1 py-2 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold text-[13px] flex items-center justify-center gap-1.5"
                >
                  <XCircle size={14} />
                  Cancel
                </button>
              )}
              <button
                onClick={() => handleDeleteBooking(selectedBooking.id)}
                className="py-2 px-3 border border-line hover:border-red-200 hover:bg-red-50 text-red-600 rounded-lg font-semibold text-[13px]"
                title="Delete invoice record"
              >
                <Trash2 size={14} />
              </button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}
