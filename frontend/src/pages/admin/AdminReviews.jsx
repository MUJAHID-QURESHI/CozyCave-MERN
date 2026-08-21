import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Star, Trash2, Eye, EyeOff, MessageSquare } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { mockReviews } from '../../data/mockData';
import { addToast } from '../../redux/slices/uiSlice';

export default function AdminReviews() {
  const dispatch = useDispatch();
  const { properties } = useSelector((state) => state.properties);

  // Load reviews from mockReviews list
  const [reviews, setReviews] = useState(mockReviews);

  const handleToggleHide = (id, isHidden) => {
    // Toggle hidden status in mock state
    setReviews(reviews.map(r => r.id === id ? { ...r, isHidden: !r.isHidden } : r));
    dispatch(addToast({ 
      message: isHidden ? 'Review is now visible on frontend stay page' : 'Review has been hidden from guest pages', 
      type: 'success' 
    }));
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id));
      dispatch(addToast({ message: 'Review deleted successfully', type: 'info' }));
    }
  };

  const getPropertyName = (propId) => {
    const p = properties.find(p => p.id === propId);
    return p ? p.name : 'Unknown Stay';
  };

  return (
    <div className="min-h-screen bg-cream/30 flex">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <AdminNavbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1240px] mx-auto w-full">
          
          <div className="pb-4 border-b border-line">
            <p className="text-[13.5px] text-charcoal-soft">Moderate guest ratings, testimonials, and active review visibility</p>
          </div>

          {/* Reviews list grid */}
          <div className="bg-white border border-line rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-charcoal-soft bg-cream/15">
                  <th className="p-4">Stay Property</th>
                  <th className="p-4">Reviewer Profile</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 w-[40%]">Feedback Comment</th>
                  <th className="p-4 text-center">Visibility</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40 text-[13.5px] text-charcoal">
                {reviews.map((r) => (
                  <tr key={r.id} className={`hover:bg-cream/10 transition-colors ${r.isHidden ? 'opacity-60 bg-gray-50' : ''}`}>
                    {/* Stay name */}
                    <td className="p-4 font-semibold text-forest-dark">
                      {getPropertyName(r.propertyId)}
                    </td>

                    {/* Reviewer details */}
                    <td className="p-4">
                      <span className="font-medium block leading-tight">{r.userName}</span>
                      <span className="text-[11.5px] text-charcoal-soft block mt-0.5">{r.date}</span>
                    </td>

                    {/* Stars */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-forest-dark">
                        <Star size={13} className="fill-gold text-gold" />
                        <span>{r.rating.toFixed(1)}</span>
                      </div>
                    </td>

                    {/* Content comment */}
                    <td className="p-4 text-[13px] text-charcoal-soft italic max-w-xs truncate" title={r.text}>
                      "{r.text}"
                    </td>

                    {/* Visibility label */}
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        r.isHidden 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {r.isHidden ? 'Hidden' : 'Visible'}
                      </span>
                    </td>

                    {/* Actions button controls */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleToggleHide(r.id, r.isHidden)}
                          className="p-2 border border-line hover:border-forest text-charcoal hover:text-forest rounded-lg hover:bg-cream/20 transition-colors"
                          title={r.isHidden ? 'Show review' : 'Hide review'}
                        >
                          {r.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="p-2 border border-line hover:border-red-200 text-charcoal hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete permanently"
                        >
                          <Trash2 size={14} />
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
    </div>
  );
}
