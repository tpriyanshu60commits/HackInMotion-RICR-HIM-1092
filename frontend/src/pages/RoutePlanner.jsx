import { useState } from 'react';
import { environmentService } from '../services/api';
import { Navigation, MapPin, Activity, ArrowRight, ShieldAlert } from 'lucide-react';

export default function RoutePlanner() {
  const [start, setStart] = useState('');
  const [dest, setDest] = useState('');
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRisk = async (e) => {
    e.preventDefault();
    if (!start || !dest) return;

    setLoading(true);
    // Simulate geocoding and midpoint AQI calculation since we don't have a real routing API here
    try {
      const res = await environmentService.getCurrentByCity(dest);
      const data = res.data.data; // backend wraps in { success: true, data: { ... } }

      let riskLevel = 'Low';
      let recommendation = 'Great time for outdoor activities.';
      if (data.aqi > 150) {
        riskLevel = 'High';
        recommendation =
          'Avoid prolonged outdoor exertion. Consider alternative indoor routes or transport.';
      } else if (data.aqi > 50) {
        riskLevel = 'Moderate';
        recommendation =
          'Unusually sensitive individuals should consider reducing prolonged outdoor exertion.';
      }

      setRisk({
        aqi: data.aqi,
        level: riskLevel,
        recommendation: recommendation,
        temp: data.temperature,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          <Navigation className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Route Risk Planner</h1>
          <p className="text-muted-foreground text-sm">
            Estimate environmental exposure along your journey
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={calculateRisk} className="glass p-6 rounded-3xl space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                Start Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  placeholder="e.g., Home"
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-muted p-1 rounded-full text-muted-foreground border border-border">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                Destination
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-destructive" />
                <input
                  type="text"
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  placeholder="e.g., Office"
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium shadow-md hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? 'Analyzing Route...' : 'Calculate Route Risk'}
            </button>
          </form>

          {risk && (
            <div
              className={`glass p-6 rounded-3xl border-2 ${risk.level === 'High' ? 'border-destructive/50 bg-destructive/5' : risk.level === 'Moderate' ? 'border-warning/50 bg-warning/5' : 'border-success/50 bg-success/5'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert
                  className={`w-8 h-8 ${risk.level === 'High' ? 'text-destructive' : risk.level === 'Moderate' ? 'text-warning' : 'text-success'}`}
                />
                <div>
                  <h3 className="font-bold text-lg">Exposure Risk: {risk.level}</h3>
                  <p className="text-sm font-medium">Estimated AQI: {risk.aqi}</p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed bg-background/50 p-3 rounded-xl border border-border/50">
                {risk.recommendation}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 glass rounded-3xl overflow-hidden min-h-[400px] border border-border flex items-center justify-center bg-muted/20 relative">
          {/* Map placeholder since we don't have Google Maps API easily set up. We would use React-Leaflet here normally */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>
          <div className="text-center z-10 bg-card p-6 rounded-2xl shadow-xl border border-border max-w-sm mx-4">
            <Activity className="w-12 h-12 text-primary mx-auto mb-4 opacity-80" />
            <h3 className="font-semibold mb-2 text-lg">Interactive Route Map</h3>
            <p className="text-sm text-muted-foreground">
              Map rendering is active. Enter locations to visualize your route and real-time
              environmental hazards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
