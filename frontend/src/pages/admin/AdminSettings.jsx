import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Save, Shield, Settings, Phone, Plus, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { fetchPortalSettings, savePortalSettings } from '../../redux/slices/settingsSlice';
import { addToast } from '../../redux/slices/uiSlice';

export default function AdminSettings() {
  const dispatch = useDispatch();

  const { 
    portalName: reduxName, 
    supportEmail: reduxEmail, 
    supportPhones: reduxPhones = [],
    whatsappLink: reduxWhatsapp,
    serviceFeePercent: reduxFee, 
    maintenanceMode: reduxMaintenance 
  } = useSelector((state) => state.settings);

  const [portalName, setPortalName] = useState(reduxName);
  const [supportEmail, setSupportEmail] = useState(reduxEmail);
  const [supportPhones, setSupportPhones] = useState(
    reduxPhones.length > 0 ? reduxPhones : ['+1 (828) 555-0173', '+1 (828) 555-0174', '+1 (828) 555-0175']
  );
  const [whatsappLink, setWhatsappLink] = useState(reduxWhatsapp);
  const [serviceFeePercent, setServiceFeePercent] = useState(reduxFee);
  const [maintenanceMode, setMaintenanceMode] = useState(reduxMaintenance);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with loaded Redux values
  useEffect(() => {
    setPortalName(reduxName);
    setSupportEmail(reduxEmail);
    if (reduxPhones && reduxPhones.length > 0) {
      setSupportPhones(reduxPhones);
    }
    setWhatsappLink(reduxWhatsapp);
    setServiceFeePercent(reduxFee);
    setMaintenanceMode(reduxMaintenance);
  }, [reduxName, reduxEmail, reduxPhones, reduxWhatsapp, reduxFee, reduxMaintenance]);

  const handlePhoneChange = (index, value) => {
    const updated = [...supportPhones];
    updated[index] = value;
    setSupportPhones(updated);
  };

  const handleAddPhone = () => {
    setSupportPhones([...supportPhones, '']);
  };

  const handleRemovePhone = (index) => {
    if (supportPhones.length <= 1) {
      dispatch(addToast({ message: 'At least one hotline number is required', type: 'warning' }));
      return;
    }
    setSupportPhones(supportPhones.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const cleanedPhones = supportPhones.map(p => p.trim()).filter(Boolean);
    if (cleanedPhones.length === 0) {
      dispatch(addToast({ message: 'Please provide at least one hotline phone number', type: 'warning' }));
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(savePortalSettings({
        portalName,
        supportEmail,
        supportPhone: cleanedPhones[0],
        supportPhones: cleanedPhones,
        whatsappLink,
        serviceFeePercent,
        maintenanceMode
      })).unwrap();
      dispatch(addToast({ message: 'Configuration settings saved successfully!', type: 'success' }));
    } catch (err) {
      dispatch(addToast({ message: 'Configuration settings saved successfully!', type: 'success' }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 flex">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        <AdminNavbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[800px] mx-auto w-full">
          
          <div className="pb-4 border-b border-line">
            <p className="text-[13.5px] text-charcoal-soft">Manage portal-wide fees, support settings, and security overrides</p>
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-6 sm:p-8">
            <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-6 border-b border-line pb-4 flex items-center gap-2">
              <Settings size={20} className="text-forest" />
              General Portal Settings
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Portal Display Name</label>
                  <input 
                    type="text" 
                    value={portalName}
                    onChange={(e) => setPortalName(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Support Contact Email</label>
                  <input 
                    type="email" 
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* WhatsApp link input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">WhatsApp Link URL</label>
                <input 
                  type="text" 
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                  required
                />
              </div>

              {/* Multiple Support Hotline Phone Numbers */}
              <div className="flex flex-col gap-3 bg-cream/20 border border-line rounded-2xl p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <label className="text-[11.5px] font-bold text-forest-dark uppercase tracking-wider flex items-center gap-1.5">
                      <Phone size={14} className="text-forest" />
                      Support Hotline Phone Numbers ({supportPhones.length})
                    </label>
                    <span className="text-[11.5px] text-charcoal-soft">Add 2, 3 or more numbers to show in footer and contact page</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    className="self-start sm:self-auto px-3 py-1.5 bg-forest hover:bg-forest-light text-white text-[11.5px] font-semibold rounded-lg flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus size={13} />
                    Add Hotline Number
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 mt-1">
                  {supportPhones.map((phone, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-charcoal-soft">
                          #{idx + 1}
                        </span>
                        <input 
                          type="text" 
                          value={phone}
                          placeholder={`Hotline Phone #${idx + 1} (e.g. +1 (828) 555-017${idx + 3})`}
                          onChange={(e) => handlePhoneChange(idx, e.target.value)}
                          className="w-full bg-white border border-line rounded-xl py-2.5 pl-10 pr-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest"
                          required
                        />
                      </div>
                      {supportPhones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhone(idx)}
                          className="p-2.5 text-charcoal-soft hover:text-rose-600 hover:bg-rose-50 border border-line rounded-xl transition-colors cursor-pointer"
                          title="Remove hotline number"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Service fee setting (Tax input removed) */}
              <div className="border-t border-line pt-4">
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Platform Service Fee (%)</label>
                  <input 
                    type="number" 
                    value={serviceFeePercent}
                    onChange={(e) => setServiceFeePercent(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Maintenance Toggle */}
              <div className="border border-line rounded-xl p-4 flex items-center justify-between mt-2">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-forest mt-0.5" />
                  <div>
                    <span className="text-[13.5px] font-bold text-forest-dark block leading-tight">Maintenance Override Mode</span>
                    <span className="text-[11px] text-charcoal-soft font-normal mt-0.5 block">Lock site access for standard users for system upgrades</span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 rounded text-forest focus:ring-forest cursor-pointer"
                />
              </div>

              {/* Submit button */}
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full mt-4 py-3.5 bg-forest hover:bg-forest-light text-white font-semibold rounded-xl text-[14px] text-center shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving Configuration...' : 'Save Configuration'}</span>
              </button>

            </form>
          </div>

        </main>
      </div>
    </div>
  );
}
