import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Star, Trash2, Eye, EyeOff, MessageSquare, Edit } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { mockReviews } from '../../data/mockData';
import { addToast } from '../../redux/slices/uiSlice';

export default function AdminReviews() {
  const dispatch = useDispatch();
  const { properties } = useSelector((state) => state.properties);

  // Load reviews from mockReviews list
  const [reviews, setReviews] = useState(mockReviews);

  // Edit Review Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState('');
  const [editIsHidden, setEditIsHidden] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditText(review.text);
    setEditIsHidden(!!review.isHidden);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingReview) return;
    if (!editText.trim()) {
      dispatch(addToast({ message: 'Feedback comment cannot be empty', type: 'warning' }));
      return;
    }

    setIsSaving(true);
    try {
      if (editingReview.id && !editingReview.id.toString().startsWith('rev-')) {
        await api.put(`/reviews/${editingReview.id}`, {
          rating: editRating,
          comment: editText.trim(),
          isVisible: !editIsHidden
        });
      }
    } catch (err) {
      console.log('Backend sync skipped or local mock:', err.message);
    }

    setReviews(reviews.map(r => r.id === editingReview.id ? {
      ...r,
      rating: editRating,
      text: editText.trim(),
      isHidden: editIsHidden
    } : r));

    dispatch(addToast({ message: 'Review updated successfully!', type: 'success' }));
    setIsSaving(false);
    setIsEditModalOpen(false);
    setEditingReview(null);
  };

  const handleToggleHide = (id, isHidden) => {
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

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-2 border border-line hover:border-forest text-charcoal hover:text-forest rounded-lg hover:bg-cream/20 transition-colors"
                          title="Edit review"
                        >
                          <Edit size={14} />
                        </button>
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

      {/* Edit Review Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingReview(null);
        }}
        title="Edit Guest Review"
      >
        {editingReview && (
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-5">
            {/* Review Meta summary */}
            <div className="bg-cream/20 p-3.5 rounded-xl border border-line flex flex-col gap-1">
              <div className="text-[12.5px] font-bold text-forest-dark flex items-center justify-between">
                <span>{editingReview.userName}</span>
                <span className="text-[11.5px] font-normal text-charcoal-soft">{editingReview.date}</span>
              </div>
              <span className="text-[11.5px] text-charcoal-soft">
                Stay: <span className="font-semibold text-charcoal">{getPropertyName(editingReview.propertyId)}</span>
              </span>
            </div>

            {/* Rating selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                Star Rating
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-cream/30 border border-line rounded-xl px-3 py-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                      title={`${star} Stars`}
                    >
                      <Star 
                        size={18} 
                        className={star <= Math.round(editRating) ? "fill-gold text-gold" : "text-gray-300"} 
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[14px] font-bold text-forest-dark">
                  {editRating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            {/* Feedback comment textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                Feedback Comment
              </label>
              <textarea
                rows={4}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-cream/30 border border-line rounded-xl p-3.5 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest"
                placeholder="Enter review feedback..."
                required
              />
            </div>

            {/* Visibility toggle */}
            <div className="flex items-center justify-between p-3.5 bg-cream/20 border border-line rounded-xl">
              <div>
                <span className="text-[12.5px] font-bold text-forest-dark block">Review Visibility</span>
                <span className="text-[11.5px] text-charcoal-soft">
                  {editIsHidden ? 'Hidden from guest property pages' : 'Publicly visible to all users'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditIsHidden(!editIsHidden)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors border ${
                  editIsHidden 
                    ? 'bg-rose-100 text-rose-800 border-rose-200' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}
              >
                {editIsHidden ? 'Hidden' : 'Visible'}
              </button>
            </div>

            {/* CTA buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingReview(null);
                }}
                className="px-4 py-2 border border-line rounded-xl text-[13px] font-semibold text-charcoal hover:bg-cream/40 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-forest hover:bg-forest-light text-white rounded-xl text-[13px] font-semibold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
