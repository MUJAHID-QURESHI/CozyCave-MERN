import React, { useState, useEffect } from 'react';
import { Mail, Phone, Trash2, Calendar, User } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { addToast } from '../../redux/slices/uiSlice';
import { useDispatch } from 'react-redux';
import api from '../../services/api';

export default function AdminMessages() {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/contacts');
      setMessages(response.data.data);
    } catch (err) {
      dispatch(addToast({ 
        message: err.response?.data?.message || 'Failed to load messages', 
        type: 'error' 
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/admin/contacts/${id}`);
        dispatch(addToast({ message: 'Message deleted successfully', type: 'success' }));
        setMessages(messages.filter(m => m._id !== id));
      } catch (err) {
        dispatch(addToast({ 
          message: err.response?.data?.message || 'Failed to delete message', 
          type: 'error' 
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 flex">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <AdminNavbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1240px] mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-fraunces text-3xl font-semibold text-forest-dark">Customer Messages</h2>
              <p className="text-[13.5px] text-charcoal-soft">Manage and read contact form submissions</p>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-cozy-sm">
            {loading ? (
              <div className="p-12 text-center text-charcoal-soft">Loading messages...</div>
            ) : messages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13.5px]">
                  <thead>
                    <tr className="bg-cream/40 border-b border-line text-forest-dark font-semibold">
                      <th className="p-4 w-44">Date</th>
                      <th className="p-4 w-48">Sender Details</th>
                      <th className="p-4">Message</th>
                      <th className="p-4 w-20 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg._id} className="border-b border-line hover:bg-cream/10 transition-colors">
                        <td className="p-4 text-charcoal-soft flex items-center gap-2">
                          <Calendar size={14} className="text-forest-light" />
                          {new Date(msg.createdAt).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="p-4 font-medium text-forest-dark">
                          <div className="flex items-center gap-1.5 mb-1">
                            <User size={14} className="text-forest-light" />
                            <span>{msg.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[12px] text-charcoal-soft mb-1">
                            <Mail size={12} className="text-charcoal-soft" />
                            <span>{msg.email}</span>
                          </div>
                          {msg.phone && (
                            <div className="flex items-center gap-1.5 text-[12px] text-charcoal-soft">
                              <Phone size={12} className="text-charcoal-soft" />
                              <span>{msg.phone}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-charcoal leading-relaxed whitespace-pre-line">{msg.message}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDelete(msg._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors inline-block"
                            title="Delete Message"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 text-center text-charcoal-soft">
                <Mail size={40} className="mx-auto text-charcoal-soft/40 mb-3 stroke-[1.5]" />
                <h3 className="font-semibold text-forest-dark text-[15px] mb-1">No messages yet</h3>
                <p className="text-[12.5px]">When customers send messages from the contact page, they will show up here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
