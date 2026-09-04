import React, { useState } from 'react';
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
  Printer
} from 'lucide-react';
import { HomeRenoResult } from '../types';
import { formatCurrency } from '../utils/calculationUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'bids' | 'report';
  result?: HomeRenoResult;
}

export const LeadCaptureModal: React.FC<Props> = ({ isOpen, onClose, mode, result }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
              {mode === 'bids' ? (
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
              {mode === 'bids'
                ? 'Get 3 Competitive Bids from Local Finishers'
                : 'Download Your Certified Valuation PDF Report'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
              {mode === 'bids'
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
                  <span className="font-black text-slate-900">{result.effectiveSqFt} sq. ft. ({result.remainingPercentage}% left)</span>
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
                      placeholder="e.g. 78701 or M5V 2T6"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Phone (Optional for SMS Quote)
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
                className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-sm tracking-tight rounded-xl shadow-md transition"
              >
                {mode === 'bids' ? 'Request 3 Contractor Bids Now' : 'Generate & Download PDF Report'}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 text-center pt-1 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>Zero spam guarantee. Your details are solely used for this specific estimate.</span>
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
              {mode === 'bids' ? 'Bid Requests Dispatched!' : 'Report Ready for Export!'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
              {mode === 'bids'
                ? `Thank you, ${name || 'friend'}. We have matched your ${zipCode} project profile with 3 pre-vetted local finish contractors. You will receive an intro email at ${email}.`
                : `Your official CostToFinish.com Certified Valuation Report for ${name || 'your project'} has been synthesized.`}
            </p>

            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-2">
              <div className="font-black text-slate-950 text-sm">Summary Snapshot:</div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Total Cost to Finish:</span>
                <span className="font-black text-slate-950">{result ? formatCurrency(result.costToFinishContractor) : '$45,000'}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>DIY Potential Savings:</span>
                <span className="font-black text-emerald-600">{result ? formatCurrency(result.diySavings) : '$13,500'}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Working Days Timeline:</span>
                <span className="font-black text-slate-950">~{result?.estimatedDaysToFinish || 75} Days</span>
              </div>
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
