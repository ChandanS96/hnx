import { useState, useEffect } from 'react';
import { useStore } from '../store/Store';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Activity, ShieldAlert, Users, Radio, Navigation } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function CommandCenter() {
  const { state } = useStore();
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9141, 74.8560]);
  const [locationStatus, setLocationStatus] = useState<string>('SIMULATION LOCATION');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setLocationStatus('LIVE DEVICE LOCATION');
        },
        (error) => {
          console.error("Geolocation failed:", error);
          setLocationStatus('LOCATION UNAVAILABLE - USING DEMO');
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);
  
  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden h-full">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <KpiCard icon={<AlertTriangle className="text-red-400"/>} title="ACTIVE ALERTS" value={state.alerts.length.toString()} />
        <KpiCard icon={<Activity className="text-amber-400"/>} title="HIGH-RISK ZONES" value={state.floodLevelCm > 10 ? "2" : "0"} />
        <KpiCard icon={<Radio className="text-purple-400"/>} title="BLIND SPOTS" value="1" />
        <KpiCard icon={<ShieldAlert className="text-red-500"/>} title="SAFETY BLOCKS" value={state.recommendations.filter(r => r.safetyStatus === 'BLOCKED').length.toString()} />
        <KpiCard icon={<Users className="text-cyan-400"/>} title="ACTIVE CASES" value="5" />
        <KpiCard icon={<Navigation className="text-green-400"/>} title="RESPONDERS" value="4" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        
        {/* Left: Map */}
        <div className="flex-[2] bg-[#0c1533] border border-slate-800 rounded flex flex-col relative overflow-hidden h-[400px] lg:h-auto">
          <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 p-2 rounded border border-slate-700 backdrop-blur">
            <h3 className="font-semibold text-sm text-cyan-400">LIVE DISASTER MAP</h3>
          </div>
          
          <MapContainer center={mapCenter} zoom={13} className="w-full h-full z-0">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {state.alerts.map(a => (
              <Circle key={a.id} center={[a.lat, a.lng]} radius={1500} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}>
                <Popup>
                  <div className="text-slate-900 font-bold">{a.type}</div>
                  <div className="text-sm">Severity: {a.severity}</div>
                </Popup>
              </Circle>
            ))}
            {/* User Location Marker */}
            <Marker position={mapCenter}>
              <Popup><div className="text-slate-900 font-bold">{locationStatus}</div></Popup>
            </Marker>

            {/* Mock Responder Marker */}
            <Marker position={[12.9150, 74.8580]}>
              <Popup><div className="text-slate-900">Field Team A</div></Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Right: Intelligence */}
        <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">
          <div className="bg-[#0c1533] border border-slate-800 rounded p-4 flex flex-col flex-1">
            <h3 className="font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <Activity size={18}/> LIVE ALERT INTELLIGENCE
            </h3>
            <div className="space-y-4">
              {state.alerts.map(alert => (
                <div key={alert.id} className="bg-slate-900 p-3 rounded border border-red-500/30">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-red-400 font-bold">{alert.type}</span>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">ACTIVE</span>
                  </div>
                  <div className="text-sm text-slate-300">Location: {alert.location}</div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="text-xs text-slate-400 mb-2">IMPACT ANALYSIS</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-cyan-200">4 families affected</div>
                      <div className="text-cyan-200">2 routes affected</div>
                      <div className="text-cyan-200">1 shelter affected</div>
                      <div className="text-cyan-200">1 safety block triggered</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0c1533] border border-slate-800 rounded p-4 flex flex-col flex-1">
            <h3 className="font-semibold text-cyan-400 mb-4">RESPONSE INTELLIGENCE</h3>
            <div className="space-y-3">
              {state.recommendations.map(rec => (
                <div key={rec.id} className={`p-3 rounded border ${rec.safetyStatus === 'SAFE' ? 'border-green-500/50 bg-green-950/20' : rec.safetyStatus === 'CAUTION' ? 'border-amber-500/50 bg-amber-950/20' : 'border-red-500/50 bg-red-950/20'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm">{rec.action} → {rec.target}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${rec.safetyStatus === 'SAFE' ? 'bg-green-500/20 text-green-400' : rec.safetyStatus === 'CAUTION' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                      {rec.safetyStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{rec.reason}</p>
                  
                  {rec.safetyStatus === 'BLOCKED' && (
                    <div className="mt-2 text-xs text-red-300 bg-red-950/50 p-2 rounded">
                      <strong>BLOCKED:</strong> {rec.blockReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function KpiCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="bg-[#0c1533] border border-slate-800 p-4 rounded flex items-center gap-4">
      <div className="p-2 bg-slate-900 rounded">
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-slate-400 tracking-wider font-semibold">{title}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
      </div>
    </div>
  );
}
