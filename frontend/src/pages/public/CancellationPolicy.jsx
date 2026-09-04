import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Calendar, 
  Clock, 
  HelpCircle, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function CancellationPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-light text-charcoal">
      <Navbar />

      <main className="flex-1 max-w-[960px] mx-auto w-full px-5 md:px-8 py-12 md:py-16">
        
        {/* Header Badge & Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-dark/5 border border-forest-dark/10 text-forest-dark text-[12px] font-medium tracking-wide uppercase mb-3">
            <ShieldCheck size={15} className="text-forest" />
            <span>CozyCave Guest Guarantee</span>
          </div>
          <h1 className="font-fraunces text-3xl md:text-5xl font-medium text-forest-dark mb-3 tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-charcoal-soft text-[14.5px] md:text-[15.5px] leading-relaxed">
            We understand that travel schedules can change unexpectedly. CozyCave provides a clear, fair, and transparent cancellation schedule to protect both our guests and hosts.
          </p>
          <div className="mt-3 text-xs text-charcoal-soft/80 font-medium">
            Effective Date: September 2026
          </div>
        </div>

        {/* 3-Tier Policy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Tier 1: 7+ Days Prior */}
          <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  Full Stay Refund
                </span>
                <span className="text-[12px] font-medium text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">Tier 1</span>
              </div>
              <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-2">
                7+ Days Before Check-in
              </h3>
              <p className="text-[13.5px] text-charcoal-soft leading-relaxed mb-5">
                Cancel at least 7 full days (168 hours) prior to your scheduled check-in time (3:00 PM on arrival date).
              </p>
            </div>

            <div className="pt-4 border-t border-line/60 space-y-2 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-soft">Room/Stay Charges:</span>
                <span className="font-semibold text-emerald-700">100% Refunded</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-soft">Service Fee:</span>
                <span className="font-medium text-amber-700">Retained (Non-refundable)</span>
              </div>
              <div className="mt-2.5 p-2 bg-emerald-50/60 rounded-lg text-[12px] text-emerald-900 leading-normal">
                <strong>Summary:</strong> Full refund of your stay booking amount. Only standard service charge is deducted.
              </div>
            </div>
          </div>

          {/* Tier 2: 7 Days to 48 Hours */}
          <div className="bg-white border-2 border-amber-500/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-600" />
                  50% Partial Refund
                </span>
                <span className="text-[12px] font-medium text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded">Tier 2</span>
              </div>
              <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-2">
                7 Days to 48 Hours Before
              </h3>
              <p className="text-[13.5px] text-charcoal-soft leading-relaxed mb-5">
                Cancel after 7 days but at least 48 hours (2 full days) before your scheduled check-in time.
              </p>
            </div>

            <div className="pt-4 border-t border-line/60 space-y-2 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-soft">Room/Stay Charges:</span>
                <span className="font-semibold text-amber-800">50% Refunded</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-soft">Service Fee:</span>
                <span className="font-medium text-amber-700">Retained (Non-refundable)</span>
              </div>
              <div className="mt-2.5 p-2 bg-amber-50/60 rounded-lg text-[12px] text-amber-950 leading-normal">
                <strong>Summary:</strong> 50% refund of stay charges. 50% stay charges + service charge are deducted.
              </div>
            </div>
          </div>

          {/* Tier 3: Less than 48 Hours */}
          <div className="bg-white border-2 border-rose-500/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <XCircle size={13} className="text-rose-600" />
                  Non-Refundable
                </span>
                <span className="text-[12px] font-medium text-rose-800 bg-rose-100/60 px-2 py-0.5 rounded">Tier 3</span>
              </div>
              <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-2">
                Within 48 Hours of Check-in
              </h3>
              <p className="text-[13.5px] text-charcoal-soft leading-relaxed mb-5">
                Cancellations requested less than 48 hours (2 days) prior to arrival or no-shows.
              </p>
            </div>

            <div className="pt-4 border-t border-line/60 space-y-2 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-soft">Room/Stay Charges:</span>
                <span className="font-semibold text-rose-700">No Refund (₹0)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-soft">Service Fee:</span>
                <span className="font-medium text-rose-700">Retained</span>
              </div>
              <div className="mt-2.5 p-2 bg-rose-50/60 rounded-lg text-[12px] text-rose-900 leading-normal">
                <strong>Summary:</strong> 100% non-refundable to compensate the property host for blocked dates.
              </div>
            </div>
          </div>

        </div>

        {/* Quick Reference Comparison Table */}
        <div className="bg-white border border-line rounded-2xl p-6 md:p-8 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-fraunces text-xl font-semibold text-forest-dark">
                At-a-Glance Summary Table
              </h3>
              <p className="text-[13px] text-charcoal-soft">
                How refund amounts are calculated based on your cancellation notice period
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px] border-collapse">
              <thead>
                <tr className="border-b border-line bg-cream-deep/40 text-forest-dark font-medium">
                  <th className="py-3.5 px-4 rounded-l-lg">Cancellation Timeline</th>
                  <th className="py-3.5 px-4">Deduction (Cut Amount)</th>
                  <th className="py-3.5 px-4">Refund to Guest</th>
                  <th className="py-3.5 px-4 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                <tr className="hover:bg-cream-light/40 transition-colors">
                  <td className="py-4 px-4 font-medium text-forest-dark">
                    7 or more days prior to check-in
                  </td>
                  <td className="py-4 px-4 text-charcoal-soft">
                    Service Charge Only (e.g. 2%)
                  </td>
                  <td className="py-4 px-4 font-semibold text-emerald-700">
                    100% Stay Amount
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                      Full Refund
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-cream-light/40 transition-colors">
                  <td className="py-4 px-4 font-medium text-forest-dark">
                    Between 7 days and 48 hours (2 days)
                  </td>
                  <td className="py-4 px-4 text-charcoal-soft">
                    50% Stay Cost + Service Charge
                  </td>
                  <td className="py-4 px-4 font-semibold text-amber-800">
                    50% Stay Amount
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full">
                      50% Refund
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-cream-light/40 transition-colors">
                  <td className="py-4 px-4 font-medium text-forest-dark">
                    Less than 48 hours (2 days) or No-Show
                  </td>
                  <td className="py-4 px-4 text-charcoal-soft">
                    100% Booking Total
                  </td>
                  <td className="py-4 px-4 font-semibold text-rose-600">
                    ₹0 (No Refund)
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full">
                      Non-refundable
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


        {/* Need Help / Support Helpline Card */}
        <div className="bg-white border border-line rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h4 className="font-fraunces text-xl font-semibold text-forest-dark">
              Have Questions or Need Help with Cancellation?
            </h4>
            <p className="text-[13.5px] text-charcoal-soft leading-relaxed">
              Our support team is available 24/7 to assist you with refunds, invoice queries, or date adjustments. Send us your Booking ID on WhatsApp for immediate support.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/917999851384?text=Hi%20CozyCave,%20I%20need%20help%20with%20my%20booking%20cancellation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-forest hover:bg-forest-light text-cream text-[13.5px] font-medium transition-all shadow-sm hover:shadow"
            >
              <MessageCircle size={16} />
              <span>WhatsApp: +91 79998 51384</span>
            </a>
            <Link
              to="/faq"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-cream-deep hover:bg-cream-deep/80 text-forest-dark text-[13.5px] font-medium transition-all"
            >
              <span>View FAQs</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
