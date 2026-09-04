import React from 'react';
import { X, Trash2, Calendar, ArrowRight, Bookmark, Cloud, CloudOff, LogIn } from 'lucide-react';
import { SavedProjectEstimate } from '../types';
import { formatCurrency } from '../utils/calculationUtils';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedEstimates: SavedProjectEstimate[];
  onDeleteEstimate: (id: string) => void;
  onLoadEstimate: (estimate: SavedProjectEstimate) => void;
  onOpenAuthModal: () => void;
}

export const SavedEstimatesDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  savedEstimates,
  onDeleteEstimate,
  onLoadEstimate,
  onOpenAuthModal,
}) => {
  const { currentUser, userProfile } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l-2 border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-blue-600 stroke-[2.5]" />
            <h3 className="font-black text-slate-950 text-xl tracking-tight">Saved Estimates</h3>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              {savedEstimates.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Cloud Sync Status Banner */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          {currentUser ? (
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <Cloud className="w-4 h-4 text-emerald-600" />
              <span>Synced with Cloud ({currentUser.email})</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <CloudOff className="w-4 h-4 text-slate-400" />
                <span>Storing locally</span>
              </div>
              <button
                onClick={onOpenAuthModal}
                className="text-blue-600 hover:text-blue-800 font-black inline-flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in to sync</span>
              </button>
            </div>
          )}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedEstimates.length === 0 ? (
            <div className="text-center py-20 text-slate-400 space-y-3">
              <Bookmark className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <div className="text-base font-black text-slate-800 tracking-tight">No saved estimates yet</div>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                Click "Save Estimate" inside the calculator to keep track of multiple properties, milestones, or revisions.
              </p>
            </div>
          ) : (
            savedEstimates.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 bg-slate-50/70 hover:bg-white transition space-y-3 group shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-black text-base text-slate-950 tracking-tight">{item.title}</h4>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteEstimate(item.id)}
                    className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                    title="Delete saved estimate"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-[11px] uppercase font-black tracking-wider text-slate-500 block">
                      Cost to Finish
                    </span>
                    <span className="text-2xl font-black text-slate-950 tracking-tight">
                      {formatCurrency(item.result.costToFinishContractor)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase font-black tracking-wider text-slate-500 block">
                      DIY Option
                    </span>
                    <span className="text-sm font-black text-emerald-600">
                      {formatCurrency(item.result.costToFinishDIY)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold">
                    {item.result.inputUnit === 'sqm'
                      ? `${item.result.rawInputArea.toLocaleString()} m² (${item.result.effectiveSqFt.toLocaleString()} sq. ft.)`
                      : `${item.result.effectiveSqFt.toLocaleString()} sq. ft.`} • {item.result.remainingPercentage}% left
                  </span>
                  <button
                    onClick={() => {
                      onLoadEstimate(item);
                      onClose();
                    }}
                    className="font-black text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition"
                  >
                    <span>Load Details</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 text-center">
          {currentUser
            ? `Protected in your Firestore account (${currentUser.email})`
            : 'Saved locally in your browser. Sign in to access from any computer or phone.'}
        </div>
      </div>
    </div>
  );
};
