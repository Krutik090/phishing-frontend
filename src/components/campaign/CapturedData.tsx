import { useState } from 'react';
import { Search, Download, Eye, AlertTriangle, ShieldAlert } from 'lucide-react';

interface CapturedDataEntry {
  id: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  dataType: string;
  capturedFields: Record<string, string>;
  ipAddress: string;
  userAgent: string;
}

// Mock captured data
const mockCapturedData: CapturedDataEntry[] = [
  {
    id: '1',
    userName: 'John Doe',
    userEmail: 'john.doe@company.com',
    timestamp: '2025-10-05T10:37:00',
    dataType: 'Credentials',
    capturedFields: {
      username: 'john.doe',
      password: '********',
      email: 'john.doe@company.com',
    },
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
  },
  {
    id: '2',
    userName: 'Mike Johnson',
    userEmail: 'mike.johnson@company.com',
    timestamp: '2025-10-05T12:15:00',
    dataType: 'Credentials',
    capturedFields: {
      username: 'mike.j',
      password: '********',
    },
    ipAddress: '192.168.1.112',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
  },
];

export function CapturedData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<CapturedDataEntry | null>(null);

  const filteredData = mockCapturedData.filter(
    (entry) =>
      entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">
            Sensitive Data
          </h3>
          <p className="text-sm text-foreground/70">
            This data contains sensitive information submitted by users who fell for the phishing
            simulation. Handle with extreme care and ensure SOC 2 compliance.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
        </div>

        <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Data Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((entry) => (
                <tr key={entry.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{entry.userName}</div>
                    <div className="text-sm text-foreground/60">{entry.userEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400">
                      {entry.dataType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground/70 font-mono">
                      {entry.ipAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/60">No captured data found.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Captured Data Details</h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground/70">User</label>
                <div className="text-foreground font-medium">{selectedEntry.userName}</div>
                <div className="text-sm text-foreground/60">{selectedEntry.userEmail}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/70">Timestamp</label>
                <div className="text-foreground">
                  {new Date(selectedEntry.timestamp).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/70">IP Address</label>
                <div className="text-foreground font-mono">{selectedEntry.ipAddress}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/70">User Agent</label>
                <div className="text-sm text-foreground/60 break-all">
                  {selectedEntry.userAgent}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/70 mb-2 block">
                  Captured Fields
                </label>
                <div className="bg-background border border-border rounded-lg p-4 space-y-2">
                  {Object.entries(selectedEntry.capturedFields).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-foreground/70 capitalize">{key}:</span>
                      <span className="text-sm text-foreground font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
