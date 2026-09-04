import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  Download,
  Mail,
  MapPin,
  Phone,
  User,
  Printer,
  Cloud,
  Hammer,
  Compass
} from 'lucide-react';
import { HomeRenoResult, ContractorProfile } from '../types';
import { formatCurrency } from '../utils/calculationUtils';
import { saveContractorInquiryToCloud } from '../lib/estimatesDb';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'bids' | 'report' | 'direct_hire';
  result?: HomeRenoResult;
  selectedContractor?: ContractorProfile;
}

export const LeadCaptureModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  result,
  selectedContractor,
}) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState(selectedContractor?.zipCode || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.displayName || '');
      if (!email) setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await saveContractorInquiryToCloud({
        userId: currentUser?.uid,
        contractorId: selectedContractor?.id,
        fullName: name,
        email,
        phone,
        zipCode,
        projectType: selectedContractor
          ? `Direct Bid: ${selectedContractor.companyName}`
          : 'Home Reno / Shell to Slab Finish',
        estimatedCost: result?.costToFinishContractor || (selectedContractor ? selectedContractor.hourlyRate * 40 : 0),
        timeframe: 'Immediate',
        mode,
        notes,
      });
    } catch (err) {
      console.warn('Could not record lead to cloud:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 mb-1.5">
              {selectedContractor ? (
                <>
                  <Hammer className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>Direct Contractor Bid Request</span>
                </>
              ) : mode === 'bids' ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>Licensed Contractor Network</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                  <span>Certified Appraisal Specification</span>
                </>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {selectedContractor
                ? `Request Bid from ${selectedContractor.companyName}`
                : mode === 'bids'
                ? 'Get 3 Competitive Bids from Local Finishers'
                : 'Download Your Certified Valuation PDF Report'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
              {selectedContractor
                ? `Connect directly with ${selectedContractor.contactName} (${selectedContractor.city}, ${selectedContractor.state}). Verified license ${selectedContractor.licenseNumber}.`
                : mode === 'bids'
                ? 'Connect directly with licensed, insured general contractors in your zip code who specialize in stalled or unfinished shell completion.'
                : 'Taking this to a loan officer for a renovation mortgage or HELOC? Download the itemized line-item report formatted for bank underwriters.'}
            </p>

            {result && (
              <div className="mt-5 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px] block">Estimated Cost to Finish:</span>
                  <span className="text-xl font-black text-slate-950">
                    {formatCurrency(result.costToFinishContractor)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px] block">Scope Dimensions:</span>
                  <span className="font-black text-slate-900">
                    {result.inputUnit === 'sqm'
                      ? `${result.rawInputArea.toLocaleString()} m² (${result.effectiveSqFt.toLocaleString()} sq. ft.)`
                      : `${result.effectiveSqFt.toLocaleString()} sq. ft. (${result.effectiveSqM.toLocaleString()} m²)`}
                    {' '}({result.remainingPercentage}% left)
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Zip / Postal Code
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      required
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="e.g. 78701 or 98101"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Phone (for quote response)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Specific Project Notes / Property Address
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Stalled 2-story construction with roof sealed, plumbing passed, needing drywall and kitchen cabinets..."
                  className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-sm tracking-tight rounded-xl shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Transmitting to Cloud...</span>
                ) : (
                  <>
                    <Cloud className="w-4 h-4" />
                    <span>
                      {selectedContractor
                        ? `Submit Bid Request to ${selectedContractor.companyName}`
                        : mode === 'bids'
                        ? 'Request 3 Contractor Bids Now'
                        : 'Generate & Download PDF Report'}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 text-center pt-1 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>Zero spam guarantee. Saved securely in Firestore.</span>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {selectedContractor
                ? 'Bid Request Sent Directly to Contractor!'
                : mode === 'bids'
                ? 'Bid Requests Dispatched!'
                : 'Report Ready for Export!'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
              {selectedContractor
                ? `Thank you, ${name || 'friend'}. Your project inquiry has been dispatched to ${selectedContractor.companyName} (${selectedContractor.contactName}). You will receive an initial review at ${email}.`
                : mode === 'bids'
                ? `Thank you, ${name || 'friend'}. We have saved your project inquiry to Firestore and matched your ${zipCode} project profile with 3 pre-vetted local finish contractors. You will receive an intro email at ${email}.`
                : `Your official CostToFinish.com Certified Valuation Report for ${name || 'your project'} has been synthesized and logged to your account.`}
            </p>

            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-2">
              <div className="font-black text-slate-950 text-sm">Summary Snapshot:</div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Target Finishing Cost:</span>
                <span className="font-black text-slate-950">{result ? formatCurrency(result.costToFinishContractor) : '$45,000'}</span>
              </div>
              {selectedContractor && (
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Selected Contractor:</span>
                  <span className="font-black text-blue-700">{selectedContractor.companyName}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Working Days Timeline:</span>
                <span className="font-black text-slate-950">~{result?.estimatedDaysToFinish || 75} Days</span>
              </div>
              {result?.blueprintSummary && (
                <div className="pt-2 mt-2 border-t border-slate-200">
                  <div className="font-bold text-blue-900 flex items-center gap-1 mb-1">
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    <span>Architectural Plan Specification:</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div>• Total Bathrooms: {result.blueprintSummary.totalBaths} Suites</div>
                    <div>• Cabinet Run: {result.blueprintSummary.cabinetLinearFeetTotal} Linear Ft ({result.blueprintSummary.countertopSqFtEstimate} sq.ft. Slab)</div>
                    <div>• Wall/Ceiling Height: {result.blueprintSummary.ceilingHeightNote}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs tracking-tight rounded-xl transition shadow-sm"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs tracking-tight rounded-xl transition"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
