import { useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { mockLogs } from '../data/mockLogData.ts';
import { LogFilters } from '../components/logs/LogFilters.tsx';
import { LogsTable } from '../components/logs/LogsTable.tsx';
import type { LogEntry } from '../data/mockLogData.ts';

export function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate current user role (replace with actual auth context)
//   const currentUserRole = 'Superadmin'; // or 'Admin' or 'User'
//   const currentUserEmail = 'john.doe@company.com';

  useEffect(() => {
    // Role-based filtering would happen here
    // For now, Superadmin sees all logs
    setFilteredLogs(mockLogs);
  }, [logs]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLogs([...mockLogs]); // Simulate data refresh
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExport = (format: 'CSV' | 'PDF') => {
    alert(`Exporting logs as ${format}...`);
    // Implement export logic
  };

  const handleFilterChange = (filtered: LogEntry[]) => {
    setFilteredLogs(filtered);
  };

  return (
    <div className="w-full px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Application Logs</h1>
            <p className="text-foreground/60 mt-2">
              Monitor and track all system activities and user actions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">{logs.length}</div>
            <div className="text-sm text-foreground/60">Total Logs</div>
          </div>
          <div className="bg-card border border-blue-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {logs.filter(l => l.category === 'Login').length}
            </div>
            <div className="text-sm text-foreground/60">Login Events</div>
          </div>
          <div className="bg-card border border-orange-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {logs.filter(l => l.category === 'Campaign').length}
            </div>
            <div className="text-sm text-foreground/60">Campaign Activities</div>
          </div>
          <div className="bg-card border border-green-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {logs.filter(l => l.category === 'Quiz').length}
            </div>
            <div className="text-sm text-foreground/60">Quiz Activities</div>
          </div>
          <div className="bg-card border border-red-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {logs.filter(l => l.status === 'Failed').length}
            </div>
            <div className="text-sm text-foreground/60">Failed Events</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <LogFilters logs={logs} onFilterChange={handleFilterChange} />

      {/* Logs Table */}
      <LogsTable logs={filteredLogs} />
    </div>
  );
}
