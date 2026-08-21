import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, MapPin, Star } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { deleteProperty, togglePropertyStatus, fetchProperties } from '../../redux/slices/propertySlice';
import { addToast } from '../../redux/slices/uiSlice';

export default function AdminProperties() {
  const dispatch = useDispatch();
  const { properties } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const handleToggleStatus = (id, name) => {
    dispatch(togglePropertyStatus(id));
    dispatch(addToast({ message: `Updated active status for ${name}`, type: 'success' }));
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(deleteProperty(id));
      dispatch(addToast({ message: `${name} has been deleted successfully.`, type: 'info' }));
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 flex">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <AdminNavbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1240px] mx-auto w-full">
          
          {/* Header Actions */}
          <div className="flex justify-between items-center pb-4 border-b border-line gap-4">
            <div>
              <p className="text-[13.5px] text-charcoal-soft">Manage CozyCave property listings and details</p>
            </div>
            <Link 
              to="/admin/properties/add"
              className="px-5 py-3 bg-forest hover:bg-forest-light text-white font-semibold rounded-xl text-[13.5px] shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus size={16} />
              Add Property
            </Link>
          </div>

          {/* Properties list table/grid */}
          <div className="bg-white border border-line rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-charcoal-soft bg-cream/15">
                  <th className="p-4">Property Stay</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price / Night</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40 text-[13.5px] text-charcoal">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-cream/10 transition-colors">
                    {/* Stay details */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-14 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                        {p.images && p.images.length > 0 ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="photo" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-forest-dark block leading-snug">{p.name}</span>
                        <span className="text-[10px] text-charcoal-soft font-bold tracking-wider uppercase bg-cream-deep/60 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          {p.tag || 'Standard'}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-charcoal-soft" />
                        <span>{p.city}, {p.state}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-bold text-forest-dark">${p.price}</td>

                    {/* Capacity details */}
                    <td className="p-4 text-charcoal-soft">
                      {p.capacity} guests · {p.bedrooms} BR
                    </td>

                    {/* Rating */}
                    <td className="p-4 font-bold text-forest-dark">
                      <div className="flex items-center gap-1">
                        <Star size={13} className="fill-gold text-gold" />
                        <span>{p.rating.toFixed(2)}</span>
                      </div>
                    </td>

                    {/* Status Toggle Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.name)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors border ${
                          p.isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title={p.isActive ? "Deactivate stay" : "Activate stay"}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions buttons */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link 
                          to={`/admin/properties/edit/${p.id}`}
                          className="p-2 border border-line hover:border-forest text-charcoal hover:text-forest rounded-lg hover:bg-cream/25 transition-colors"
                          title="Edit Details"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 border border-line hover:border-red-200 text-charcoal hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Stay"
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
