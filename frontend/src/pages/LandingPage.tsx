import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Play, Server, Activity, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#060b19] to-[#060b19]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl text-center space-y-8"
      >
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
            <ShieldAlert className="text-cyan-400 w-12 h-12" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          SENTINEL-<span className="text-cyan-400">X</span>
        </h1>
        
        <p className="text-xl text-cyan-200 tracking-widest uppercase font-semibold">
          "From Alerts to Safer Decisions."
        </p>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Disasters generate thousands of fragmented signals. SENTINEL-X transforms those signals into evidence-aware, continuously validated response decisions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link to="/command-center" className="flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            ENTER COMMAND CENTER
            <ArrowRight size={20} />
          </Link>
          <Link to="/judge-mode" className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded font-semibold transition-all">
            <Play size={20} className="text-amber-400" />
            RUN LIVE DEMO
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 max-w-5xl w-full"
      >
        <FeatureCard icon={<Activity className="text-amber-400"/>} title="WHAT CHANGED?" />
        <FeatureCard icon={<Server className="text-red-400"/>} title="WHAT IS AFFECTED?" />
        <FeatureCard icon={<ShieldAlert className="text-purple-400"/>} title="WHAT IS UNKNOWN?" />
        <FeatureCard icon={<ShieldCheck className="text-green-400"/>} title="IS IT SAFE TO ACT?" />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="bg-[#0c1533] border border-slate-800 p-6 rounded flex flex-col items-center justify-center text-center gap-4 hover:border-cyan-500/30 transition-colors">
      <div className="p-3 bg-slate-900/50 rounded-full">
        {icon}
      </div>
      <span className="text-sm font-semibold tracking-wider text-slate-300">{title}</span>
    </div>
  );
}
