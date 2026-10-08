import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ShieldAlert, Map as MapIcon, Radio, Settings } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import CommandCenter from './pages/CommandCenter';
import SafetyGate from './pages/SafetyGate';
import JudgeMode from './pages/JudgeMode';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#060b19] text-slate-100 flex flex-col font-sans">
        <nav className="bg-[#0a1128] border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded flex items-center justify-center border border-cyan-500/50">
              <ShieldAlert className="text-cyan-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-slate-100">SENTINEL-X</h1>
              <p className="text-[10px] text-cyan-400 tracking-widest uppercase">Disaster Intelligence & Response</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" icon={<Radio size={16}/>} text="Landing" />
            <NavLink to="/command-center" icon={<MapIcon size={16}/>} text="Command Center" />
            <NavLink to="/safety-gate" icon={<ShieldAlert size={16}/>} text="Safety Gate" />
            <NavLink to="/judge-mode" icon={<Settings size={16}/>} text="Judge Mode" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col text-right">
              <span className="text-xs text-slate-400">Location</span>
              <span className="text-sm text-cyan-400 font-semibold">Mangaluru (Sim)</span>
            </div>
            <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-400 rounded text-xs animate-pulse">
              SIMULATION DATA
            </div>
          </div>
        </nav>
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/command-center" element={<CommandCenter />} />
            <Route path="/safety-gate" element={<SafetyGate />} />
            <Route path="/judge-mode" element={<JudgeMode />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function NavLink({ to, icon, text }: { to: string, icon: React.ReactNode, text: string }) {
  return (
    <Link to={to} className="flex items-center space-x-2 text-sm text-slate-300 hover:text-cyan-400 transition-colors">
      {icon}
      <span>{text}</span>
    </Link>
  );
}
