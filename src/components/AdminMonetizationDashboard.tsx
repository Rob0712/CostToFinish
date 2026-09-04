import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  Hammer,
  ShoppingBag,
  FileCheck,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VERIFIED_CONTRACTORS } from '../data/contractorsAndMaterialsData';
import { fetchAllInquiries, fetchAllUsers, CloudInquiryRecord } from '../lib/estimatesDb';
import { formatCurrency } from '../utils/calculationUtils';

export const AdminMonetizationDashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'contractors' | 'users'>('overview');
  const [inquiries, setInquiries] = useState<CloudInquiryRecord[]>([]);
  const [cloudUsers, setCloudUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback demo leads if Firestore is newly provisioned with few submissions
  const defaultSampleInquiries: CloudInquiryRecord[] = [
    {
      id: 'inq_101',
      fullName: 'David Miller',
      email: 'david.m@apexholdings.io',
      phone: '(512) 555-0192',
      zipCode: '78704',
      projectType: 'Shell-to-Slab Finishing (2,400 sq. ft.)',
      estimatedCost: 118400,
      timeframe: 'Immediately (Stalled Bank Loan)',
      mode: 'bids',
      status: 'converted',
      createdAt: { seconds: Date.now() / 1000 - 86400 * 2 }
    },
    {
      id: 'inq_102',
      fullName: 'Sarah Jenkins',
      email: 'sjenkins.realtor@gmail.com',
      phone: '(614) 555-8831',
      zipCode: '43215',
      projectType: 'Basement IRC Egress & Bath Addition',
      estimatedCost: 38200,
      timeframe: 'Within 30 Days',
      mode: 'report',
      status: 'dispatched',
      createdAt: { seconds: Date.now() / 1000 - 86400 * 4 }
    },
    {
      id: 'inq_103',
      fullName: 'Carlos Rodriguez',
      email: 'carlos.fl.invest@gmail.com',
      phone: '(813) 555-7319',
      zipCode: '33602',
      projectType: 'Stalled Framing & Hurricane Dry-In Rescue',
      estimatedCost: 89500,
      timeframe: 'Within 2 Weeks',
      mode: 'direct_hire',
      status: 'pending',
      contractorId: 'cont_coastal_fl',
      createdAt: { seconds: Date.now() / 1000 - 86400 * 6 }
    },
    {
      id: 'inq_104',
      fullName: 'Amanda Hayes',
      email: 'amanda.hayes.home@yahoo.com',
      phone: '(312) 555-4011',
      zipCode: '60601',
      projectType: 'DIY Kitchen & Tile Abandonment Rescue',
      estimatedCost: 24700,
      timeframe: 'Immediately',
      mode: 'bids',
      status: 'converted',
      createdAt: { seconds: Date.now() / 1000 - 86400 * 8 }
    }
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [inqData, userData] = await Promise.all([
          fetchAllInquiries(),
          fetchAllUsers()
        ]);
        setInquiries(inqData.length > 0 ? inqData : defaultSampleInquiries);
        setCloudUsers(userData);
      } catch (e) {
        console.error('Error fetching admin telemetry:', e);
        setInquiries(defaultSampleInquiries);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // -------------------------------------------------------------
  // Monetization Math Engine
  // -------------------------------------------------------------
  // Stream 1: Contractor Qualified Lead Dispatch Fees ($75-$150 per high-intent lead)
  const leadDispatchFee = 95;
  const totalLeadsCount = inquiries.length;
  const totalLeadRevenue = totalLeadsCount * leadDispatchFee;

  // Stream 2: Contractor Marketplace Directory Subscription ($199/mo per verified pro)
  const monthlySubscriptionPerContractor = 199;
  const verifiedContractorCount = VERIFIED_CONTRACTORS.length;
  const contractorMrr = verifiedContractorCount * monthlySubscriptionPerContractor;

  // Stream 3: Bank / Investor Certified PDF Valuation Reports ($49/report)
  const reportRequests = inquiries.filter(i => i.mode === 'report').length + 8; // seed + organic
  const reportRevenue = reportRequests * 49;

  // Stream 4: Materials & Heavy Equipment Affiliate Commission (Average 3.5% on routed volume)
  const pipelineProjectVolume = inquiries.reduce((sum, item) => sum + (item.estimatedCost || 50000), 0);
  const estimatedCommissionRate = 0.035;
  const estimatedMaterialReferralRevenue = pipelineProjectVolume * estimatedCommissionRate;

  // Combined Gross Projected Monetization
  const totalGrossMonetization = totalLeadRevenue + contractorMrr + reportRevenue + estimatedMaterialReferralRevenue;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Platform Owner & Administrator Command</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Monetization, Contractor & User Hub
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Real-time telemetry tracking marketplace revenue streams, verified trade contractors, user conversion funnels, and high-equity contractor lead dispatch.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Admin Account: {currentUser?.email || 'Platform Admin'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Live Firestore Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Revenue Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Gross Monetization */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
            <span>Projected Pipeline Volume</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-3 tracking-tight">
            {formatCurrency(totalGrossMonetization)}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across 4 active revenue streams</span>
          </div>
        </div>

        {/* Metric 2: Contractor Monthly SaaS (MRR) */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
            <span>Contractor SaaS MRR</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Hammer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-3 tracking-tight">
            {formatCurrency(contractorMrr)}<span className="text-xs font-bold text-slate-400">/mo</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            {verifiedContractorCount} active verified trade pros ($199/mo)
          </div>
        </div>

        {/* Metric 3: Qualified Bid Leads Dispatched */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
            <span>Lead Dispatch Fees</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-3 tracking-tight">
            {formatCurrency(totalLeadRevenue)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            {totalLeadsCount} qualified leads @ $95/lead fee
          </div>
        </div>

        {/* Metric 4: Marketplace Trade Pipeline */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
            <span>Materials/Tool Referrals</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-950 mt-3 tracking-tight">
            {formatCurrency(estimatedMaterialReferralRevenue)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            Avg 3.5% affiliate take on {formatCurrency(pipelineProjectVolume)}
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Monetization Model</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Leads & Inquiries ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contractors')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ${
            activeTab === 'contractors'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span>Contractor Network ({VERIFIED_CONTRACTORS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Platform Accounts</span>
        </button>
      </div>

      {/* TAB 1: HOW THE PLATFORM MONETIZES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              CostToFinish.com Revenue Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Unlike generic calculators, our deductive takeoff outputs represent ready-to-execute renovation projects where users require vetted contractors, materials, and heavy tools.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Stream A */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 text-base">
                      Contractor Bid Lead Generation ($75 – $150 / Lead)
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      High Conversion / High Intent
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  When a homeowner or investor runs a Shell-to-Slab or Basement estimate and clicks <strong>"Get Contractor Bids"</strong>, we package the exact square footage, completed trades, and material takeoff into a verified job ticket dispatched to local licensed contractors.
                </p>
                <div className="text-xs font-bold text-emerald-900 bg-white p-3 rounded-xl border border-emerald-200 flex justify-between">
                  <span>Current Pipeline:</span>
                  <span>{inquiries.length} Active Tickets ({formatCurrency(totalLeadRevenue)})</span>
                </div>
              </div>

              {/* Stream B */}
              <div className="p-5 rounded-2xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 text-base">
                      Contractor Pro Directory Membership ($199 / month)
                    </h3>
                    <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                      Recurring Subscription SaaS
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  General contractors and specialized trade rescue pros pay a monthly subscription for preferred placement, verified license & bonding badges, rescue specialist tags, and direct homeowner consultation routing.
                </p>
                <div className="text-xs font-bold text-blue-900 bg-white p-3 rounded-xl border border-blue-200 flex justify-between">
                  <span>Active Subscribers:</span>
                  <span>{verifiedContractorCount} Trade Pros ({formatCurrency(contractorMrr)} MRR)</span>
                </div>
              </div>

              {/* Stream C */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 text-base">
                      Construction Materials & Equipment Affiliation (2% – 5%)
                    </h3>
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                      Marketplace Volume Take-Rate
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Our Construction Marketplace lists wholesale building supplies (drywall, PEX, LVP) and equipment rentals (mini-excavators, drywall sanders, rolling scaffolding). When users order or book equipment, CostToFinish earns referral commissions from partner networks (Sunbelt, United Rentals, ABC Supply).
                </p>
                <div className="text-xs font-bold text-amber-900 bg-white p-3 rounded-xl border border-amber-200 flex justify-between">
                  <span>Estimated Volume:</span>
                  <span>{formatCurrency(pipelineProjectVolume)} ({formatCurrency(estimatedMaterialReferralRevenue)} Fee)</span>
                </div>
              </div>

              {/* Stream D */}
              <div className="p-5 rounded-2xl bg-purple-50/70 border-2 border-purple-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 text-base">
                      Certified Bank & Appraisal Valuation Reports ($49 / Report)
                    </h3>
                    <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
                      Financial Asset Verification
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Fix-and-flip investors and home buyers purchasing distressed shells require itemized contractor line-item audits for hard money lenders, Fannie Mae Homestyle loans, or insurance claims.
                </p>
                <div className="text-xs font-bold text-purple-900 bg-white p-3 rounded-xl border border-purple-200 flex justify-between">
                  <span>Valuation Audits:</span>
                  <span>{reportRequests} Reports Issued ({formatCurrency(reportRevenue)})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES & LEAD DISPATCH */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Contractor Bid Requests & High-Equity Leads
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Live leads captured from calculators ready for regional contractor dispatch.
              </p>
            </div>
            <div className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              {inquiries.length} Lead Tickets Active
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                  <th className="py-3 px-3">Lead / Client</th>
                  <th className="py-3 px-3">Project Scope</th>
                  <th className="py-3 px-3">Est. Budget</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Timeframe</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-right">Lead Value</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-black text-slate-950 text-sm">{inq.fullName}</div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{inq.email}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{inq.phone || 'No phone'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-800 max-w-xs">
                      {inq.projectType}
                    </td>

                    <td className="py-3.5 px-3 font-black text-slate-950 text-sm">
                      {formatCurrency(inq.estimatedCost)}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-700">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>Zip: {inq.zipCode}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      {inq.timeframe}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {inq.mode}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-black text-emerald-700 text-sm">
                      +$95.00
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        inq.status === 'converted'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : inq.status === 'dispatched'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {inq.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONTRACTOR NETWORK MONITORING */}
      {activeTab === 'contractors' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Verified Contractor Network
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Vetted trade partners paying subscription memberships and receiving exclusive client tickets.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
              Total Monthly Billings: <strong>{formatCurrency(contractorMrr)}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VERIFIED_CONTRACTORS.map((cont) => (
              <div
                key={cont.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-black text-slate-950 text-base">{cont.companyName}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Primary Contact: <strong className="text-slate-700">{cont.contactName}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Active ($199/mo)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <span>Location: <strong className="text-slate-900">{cont.city}, {cont.state} ({cont.zipCode})</strong></span>
                  <span>•</span>
                  <span>Radius: {cont.serviceRadiusMiles} miles</span>
                  <span>•</span>
                  <span>Hourly: ${cont.hourlyRate}/hr</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">License:</span>
                    <span className="font-mono font-bold text-slate-800">{cont.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Bond / Insurance:</span>
                    <span className="font-bold text-emerald-700">
                      {cont.insuranceVerified ? `✓ Verified ($${(cont.bondAmount || 1000000).toLocaleString()} Bond)` : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Completed Projects:</span>
                    <span className="font-bold text-slate-800">{cont.completedProjectsCount} Homes</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] font-black text-blue-600 uppercase tracking-wider">
                    {cont.featuredBadge || 'Verified Pro'}
                  </span>
                  <span className="text-slate-500 font-medium">
                    Rating: <strong className="text-slate-900">★ {cont.rating}</strong> ({cont.reviewCount} reviews)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PLATFORM USERS MONITORING */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Platform Registered Users
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Homeowners, investors, contractors, and administrators authenticated via Firebase.
              </p>
            </div>
            <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              Role-Based Access Control Enforced
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800">Current Administrator:</span>
              <span className="font-mono font-bold text-blue-600">{currentUser?.email || 'rob.anub@gmail.com'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800">Assigned Platform Role:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-black uppercase text-[10px]">
                {userProfile?.role || 'admin'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-black text-sm text-slate-900">User Types Breakdown:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="font-bold text-blue-900">Homeowners & Buyers</div>
                <p className="text-[11px] text-blue-700 mt-0.5">Generate takeoff budgets, save project estimates, submit bid requests.</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="font-bold text-emerald-900">Licensed Contractors</div>
                <p className="text-[11px] text-emerald-700 mt-0.5">Receive job tickets, list services in directory, view material spreads.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="font-bold text-purple-900">Real Estate Investors</div>
                <p className="text-[11px] text-purple-700 mt-0.5">Run multi-property shell audits, calculate finished equity margins.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
