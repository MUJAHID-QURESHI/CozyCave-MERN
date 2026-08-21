import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Save, Shield, Settings } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { fetchPortalSettings, savePortalSettings } from '../../redux/slices/settingsSlice';
import { addToast } from '../../redux/slices/uiSlice';

export default function AdminSettings() {
  const dispatch = useDispatch();

  const { 
    portalName: reduxName, 
    supportEmail: reduxEmail, 
    supportPhone: reduxPhone, 
    supportAddress: reduxAddress,
    whatsappLink: reduxWhatsapp,
    taxPercent: reduxTax, 
    serviceFeePercent: reduxFee, 
    maintenanceMode: reduxMaintenance 
  } = useSelector((state) => state.settings);

  const [portalName, setPortalName] = useState(reduxName);
  const [supportEmail, setSupportEmail] = useState(reduxEmail);
  const [supportPhone, setSupportPhone] = useState(reduxPhone);
  const [supportAddress, setSupportAddress] = useState(reduxAddress);
  const [whatsappLink, setWhatsappLink] = useState(reduxWhatsapp);
  const [taxPercent, setTaxPercent] = useState(reduxTax);
  const [serviceFeePercent, setServiceFeePercent] = useState(reduxFee);
  const [maintenanceMode, setMaintenanceMode] = useState(reduxMaintenance);

  // Sync state with loaded Redux values
  useEffect(() => {
    setPortalName(reduxName);
    setSupportEmail(reduxEmail);
    setSupportPhone(reduxPhone);
    setSupportAddress(reduxAddress);
    setWhatsappLink(reduxWhatsapp);
    setTaxPercent(reduxTax);
    setServiceFeePercent(reduxFee);
    setMaintenanceMode(reduxMaintenance);
  }, [reduxName, reduxEmail, reduxPhone, reduxAddress, reduxWhatsapp, reduxTax, reduxFee, reduxMaintenance]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(savePortalSettings({
        portalName,
        supportEmail,
        supportPhone,
        supportAddress,
        whatsappLink,
        taxPercent,
        serviceFeePercent,
        maintenanceMode
      })).unwrap();
      dispatch(addToast({ message: 'Configuration settings saved successfully!', type: 'success' }));
    } catch (err) {
      dispatch(addToast({ message: err || 'Failed to save configuration settings', type: 'error' }));
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 flex">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
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

              {/* Added support phone and WhatsApp link inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Support Hotline Phone</label>
                  <input 
                    type="text" 
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>

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
              </div>

              {/* Added headquarters address support input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Headquarters Support Address</label>
                <input 
                  type="text" 
                  value={supportAddress}
                  onChange={(e) => setSupportAddress(e.target.value)}
                  className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-line pt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Standard Tax Multiplier (%)</label>
                  <input 
                    type="number" 
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
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
                className="w-full mt-4 py-3.5 bg-forest hover:bg-forest-light text-white font-semibold rounded-xl text-[14px] text-center shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save size={16} />
                <span>Save Configuration</span>
              </button>

            </form>
          </div>

        </main>
      </div>
    </div>
  );
}
