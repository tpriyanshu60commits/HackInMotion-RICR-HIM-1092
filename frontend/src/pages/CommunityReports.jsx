import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, MapPin, Plus, Flame, Wind, Factory, Droplets, Info } from 'lucide-react';

const TYPE_ICONS = {
  'Smoke': Flame,
  'Waste burning': Flame,
  'Dust': Wind,
  'Industrial emissions': Factory,
  'Other': Info
};

const SEVERITY_COLORS = {
  'Low': 'text-success bg-success/10 border-success/20',
  'Moderate': 'text-warning bg-warning/10 border-warning/20',
  'High': 'text-destructive bg-destructive/10 border-destructive/20'
};

export default function CommunityReports() {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [type, setType] = useState('Smoke');
  const [severity, setSeverity] = useState('Moderate');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports');
      setReports(res.data);
    } catch (err) {
      console.error('Failed to load reports');
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      // Mock coordinates near central city
      const lat = 28.6139 + (Math.random() - 0.5) * 0.1;
      const lng = 77.2090 + (Math.random() - 0.5) * 0.1;
      
      await axios.post('http://localhost:5000/api/reports', {
        type, severity, description, lat, lng
      });
      
      setShowForm(false);
      setDescription('');
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Community Reports</h1>
            <p className="text-muted-foreground text-sm">Local environmental hazards reported by the community</p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all font-medium shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Report Hazard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => {
              const Icon = TYPE_ICONS[report.type] || Info;
              return (
                <div key={report._id} className="glass p-5 rounded-2xl border border-border hover:border-primary/50 transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-muted rounded-lg text-foreground">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">{report.type}</span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${SEVERITY_COLORS[report.severity]}`}>
                      {report.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                    {report.description || 'No description provided.'}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground/70 border-t border-border pt-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{Math.abs(report.lat).toFixed(2)}°, {Math.abs(report.lng).toFixed(2)}°</span>
                    </div>
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
            
            {reports.length === 0 && (
              <div className="col-span-full text-center py-20 border-2 border-dashed border-border rounded-2xl text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No community reports found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 order-1 lg:order-2">
          {showForm ? (
            <form onSubmit={submitReport} className="glass p-6 rounded-3xl space-y-4 border border-primary/20 sticky top-24">
              <h3 className="font-bold text-lg mb-2">New Report</h3>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Hazard Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option>Smoke</option>
                  <option>Waste burning</option>
                  <option>Dust</option>
                  <option>Industrial emissions</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Severity</label>
                <select 
                  value={severity} 
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more details..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 h-24 resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium shadow-md hover:bg-primary/90 transition-all"
              >
                Submit to Community
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="w-full bg-transparent text-muted-foreground py-2.5 rounded-xl font-medium hover:bg-muted transition-all"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="glass rounded-3xl overflow-hidden h-[400px] border border-border flex items-center justify-center bg-muted/20 relative sticky top-24">
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
              <div className="text-center z-10 bg-card p-6 rounded-2xl shadow-xl border border-border mx-4">
                <MapPin className="w-10 h-10 text-primary mx-auto mb-3 opacity-80" />
                <h3 className="font-semibold mb-1">Live Map View</h3>
                <p className="text-sm text-muted-foreground">Reports are visualized here when map services are active.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
