import { useState } from 'react';
import { useStore } from '../store/Store';
import { ShieldAlert, AlertTriangle, Clock, CheckCircle2, XCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function SafetyGate() {
  const { state, reassessSafety } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  const handleAuthorize = () => {
    setVerificationStatus('AUTHORIZED');
    setShowModal(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto relative">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="text-cyan-400" />
          RESPONSE SAFETY GATE
        </h2>
        <p className="text-slate-400 mt-2">Every high-impact recommendation passes through continuous evidence validation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: AI Planner vs Critic */}
        <div className="space-y-6">
          <div className="bg-[#0c1533] border border-slate-800 rounded p-6">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 tracking-wider">AI PLANNER RECOMMENDATIONS</h3>
            {state.recommendations.map(rec => (
              <div key={rec.id} className="bg-slate-900 p-4 rounded border border-slate-800 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-lg font-semibold text-white">{rec.action} → {rec.target}</div>
                  {verificationStatus === 'AUTHORIZED' && (
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold border border-green-500/30">HUMAN AUTHORIZED</span>
                  )}
                </div>
                <div className="text-sm text-slate-400 mb-4">Reason: {rec.reason}</div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-300 rounded">AI SAFETY CRITIC:</span>
                </div>
                
                {rec.safetyStatus === 'SAFE' && (
                  <div className="flex items-center gap-2 text-green-400 bg-green-950/30 p-3 rounded text-sm border border-green-900">
                    <CheckCircle2 size={18} /> Evidence supports action. No conflicts detected.
                  </div>
                )}
                {rec.safetyStatus === 'CAUTION' && (
                  <div className="flex items-center gap-2 text-amber-400 bg-amber-950/30 p-3 rounded text-sm border border-amber-900">
                    <AlertTriangle size={18} /> Proceed with caution. Environmental risks rising.
                  </div>
                )}
                {rec.safetyStatus === 'BLOCKED' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-red-400 bg-red-950/30 p-3 rounded text-sm border border-red-900">
                      <XCircle size={18} className="mt-0.5 shrink-0" />
                      <div>
                        <strong>ACTION BLOCKED</strong>
                        <div className="mt-1">{rec.blockReason}</div>
                      </div>
                    </div>
                    {rec.saferAlternative && (
                      <div className="flex items-start gap-2 text-cyan-400 bg-cyan-950/30 p-3 rounded text-sm border border-cyan-900">
                        <ArrowRight size={18} className="mt-0.5 shrink-0" />
                        <div>
                          <strong>SAFER ALTERNATIVE</strong>
                          <div className="mt-1">{rec.saferAlternative}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Evidence Engine */}
        <div className="bg-[#0c1533] border border-slate-800 rounded p-6">
          <h3 className="text-sm font-semibold text-cyan-400 mb-4 tracking-wider flex items-center justify-between">
            <span>EVIDENCE INTELLIGENCE</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded font-normal">
              {state.evidences.length} Records
            </span>
          </h3>
          
          <div className="space-y-4">
            {state.evidences.map(ev => (
              <div key={ev.id} className={`p-4 rounded border ${ev.isConflict ? 'border-red-500/50 bg-red-950/10' : 'border-slate-800 bg-slate-900'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{ev.source}</span>
                    {ev.isConflict && (
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded uppercase font-bold border border-red-500/30">Conflict</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} />
                    {ev.ageMins} mins ago
                  </div>
                </div>
                
                <p className="text-sm text-slate-300 mb-3">"{ev.claim}"</p>
                
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Reliability:</span>
                    <span className="text-cyan-400 font-semibold">{ev.reliability}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Freshness:</span>
                    <span className={`font-semibold ${ev.ageMins < 10 ? 'text-green-400' : ev.ageMins < 30 ? 'text-amber-400' : 'text-red-400'}`}>
                      {ev.ageMins < 10 ? 'FRESH' : ev.ageMins < 30 ? 'AGING' : 'STALE'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {state.evidences.some(e => e.isConflict) && verificationStatus !== 'AUTHORIZED' && (
            <div className="mt-6 p-4 border border-purple-500/50 bg-purple-950/20 rounded">
              <h4 className="text-purple-400 font-bold text-sm mb-2 flex items-center gap-2">
                <ShieldAlert size={16} /> EVIDENCE CONFLICT DETECTED
              </h4>
              <p className="text-xs text-slate-300 mb-3">
                Contradictory information received regarding Route B safety. Current evidence is insufficient for autonomous action.
              </p>
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded w-full transition-colors"
              >
                REQUEST HUMAN VERIFICATION
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a1128] border border-slate-700 rounded-lg max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-full border border-purple-500/50">
                <UserCheck className="text-purple-400 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">VERIFY ACTION</h2>
                <p className="text-xs text-slate-400">Reviewer: District Control Authority</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-[#060b19] p-3 rounded border border-slate-800 text-sm">
                <span className="text-slate-500">Action:</span> <strong className="text-white">Send Field Team A to Relief Camp B</strong>
              </div>
              <div className="bg-[#060b19] p-3 rounded border border-slate-800 text-sm">
                <span className="text-slate-500">AI Assessment:</span> <strong className="text-red-400">BLOCKED (Conflict Detected)</strong>
              </div>
              <div className="bg-[#060b19] p-3 rounded border border-slate-800 text-sm">
                <span className="text-slate-500">Timestamp:</span> <strong className="text-white">{new Date().toLocaleTimeString()}</strong>
              </div>
              
              <div className="mt-4">
                <label className="text-xs text-slate-400 mb-1 block">Reason for Override / Verification:</label>
                <textarea 
                  className="w-full bg-[#060b19] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500 h-24"
                  placeholder="Enter justification supporting evidence..."
                  defaultValue="District control room confirmed alternative route is secure."
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleAuthorize}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition-colors"
              >
                AUTHORIZE
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded transition-colors"
              >
                REJECT
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded transition-colors"
              >
                REQUEST MORE EVIDENCE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
