import { useStore } from '../store/Store';
import { Settings2, Play, RefreshCw, AlertTriangle, ShieldAlert, Droplets, Clock } from 'lucide-react';

export default function JudgeMode() {
  const { state, setFloodLevel, addEvidence, triggerConflict, resetDemo, runFullDemo } = useStore();

  return (
    <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
      <div className="max-w-3xl w-full">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <Settings2 className="text-cyan-400 w-8 h-8" />
            JUDGE MODE (DEMO CONTROLS)
          </h2>
          <p className="text-slate-400 mt-2">
            Use these controls to simulate disaster cascade effects and observe how the AI Safety Critic blocks unsafe recommendations in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <ControlCard 
            icon={<Droplets className="text-blue-400"/>} 
            title="SIMULATE FLOOD LEVEL" 
            desc="Increase flood level to trigger cascade effects."
          >
            <div className="flex items-center gap-4 mt-4">
              <input 
                type="range" 
                min="0" max="30" step="5"
                value={state.floodLevelCm}
                onChange={(e) => setFloodLevel(parseInt(e.target.value))}
                className="flex-1 accent-cyan-500"
              />
              <span className="text-cyan-400 font-bold w-12">{state.floodLevelCm} cm</span>
            </div>
          </ControlCard>

          <ControlCard 
            icon={<AlertTriangle className="text-red-400"/>} 
            title="CREATE EVIDENCE CONFLICT" 
            desc="Inject conflicting reports about a route."
          >
            <button 
              onClick={triggerConflict}
              disabled={state.evidences.some(e => e.isConflict)}
              className="mt-4 w-full py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/50 rounded font-semibold transition-colors disabled:opacity-50"
            >
              INJECT CONFLICTING EVIDENCE
            </button>
          </ControlCard>

          <ControlCard 
            icon={<Clock className="text-amber-400"/>} 
            title="MAKE EVIDENCE STALE" 
            desc="Simulate time passing to reduce evidence freshness."
          >
            <button 
              onClick={() => {
                addEvidence({
                  id: Date.now().toString(),
                  source: 'System Time',
                  claim: 'Evidence aging simulation triggered',
                  ageMins: 60,
                  reliability: 100,
                  isConflict: false
                });
              }}
              className="mt-4 w-full py-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-500/50 rounded font-semibold transition-colors"
            >
              AGE EVIDENCE BY 60 MINS
            </button>
          </ControlCard>

          <ControlCard 
            icon={<ShieldAlert className="text-purple-400"/>} 
            title="CREATE BLIND SPOT" 
            desc="Simulate communication loss in Zone 7."
          >
            <button 
              className="mt-4 w-full py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 border border-purple-500/50 rounded font-semibold transition-colors"
            >
              SEVER CONNECTIVITY (ZONE 7)
            </button>
          </ControlCard>

        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <button 
            onClick={runFullDemo}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Play size={18} />
            RUN FULL DEMO SCENARIO
          </button>
          
          <button 
            onClick={resetDemo}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded font-semibold transition-colors"
          >
            <RefreshCw size={18} />
            RESET DEMO
          </button>
        </div>

      </div>
    </div>
  );
}

function ControlCard({ icon, title, desc, children }: { icon: React.ReactNode, title: string, desc: string, children: React.ReactNode }) {
  return (
    <div className="bg-[#0c1533] border border-slate-800 p-6 rounded flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-slate-900 rounded">
          {icon}
        </div>
        <h3 className="font-bold text-slate-200">{title}</h3>
      </div>
      <p className="text-sm text-slate-400 flex-1">{desc}</p>
      {children}
    </div>
  );
}
