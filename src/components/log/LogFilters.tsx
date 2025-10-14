import { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { LogEntry } from '../../data/mockLogData';

interface LogFiltersProps {
  logs: LogEntry[];
  onFilterChange: (filtered: LogEntry[]) => void;
}

export function LogFilters({ logs, onFilterChange }: LogFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const applyFilters = () => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        log =>
          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    // Role filter
    if (roleFilter !== 'All') {
      filtered = filtered.filter(log => log.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(dateTo));
    }

    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setRoleFilter('All');
    setStatusFilter('All');
    setDateFrom('');
    setDateTo('');
    onFilterChange(logs);
  };

  // Apply filters whenever any filter changes
  useState(() => {
    applyFilters();
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Filters & Search</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="xl:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                applyFilters();
              }}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              applyFilters();
            }}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
          >
            <option>All</option>
            <option>Login</option>
            <option>Campaign</option>
            <option>Quiz</option>
            <option>Project</option>
            <option>System</option>
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Role</label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              applyFilters();
            }}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
          >
            <option>All</option>
            <option>User</option>
            <option>Admin</option>
            <option>Superadmin</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              applyFilters();
            }}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
          >
            <option>All</option>
            <option>Success</option>
            <option>Failed</option>
            <option>Warning</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">From Date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              applyFilters();
            }}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">To Date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              applyFilters();
            }}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
          />
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4">
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-accent text-foreground rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2 text-sm"
        >
          <X className="w-4 h-4" />
          Reset Filters
        </button>
      </div>
    </div>
  );
}
