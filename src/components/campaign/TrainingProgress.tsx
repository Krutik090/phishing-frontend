import { useState } from 'react';
import { Search, Download, GraduationCap, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface TrainingEntry {
  id: string;
  userName: string;
  userEmail: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  startedAt: string | null;
  completedAt: string | null;
  score: number | null;
  duration: string | null;
}

// Mock training data
const mockTrainingData: TrainingEntry[] = [
  {
    id: '1',
    userName: 'John Doe',
    userEmail: 'john.doe@company.com',
    status: 'Completed',
    startedAt: '2025-10-05T10:40:00',
    completedAt: '2025-10-05T10:50:00',
    score: 95,
    duration: '10 min',
  },
  {
    id: '2',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@company.com',
    status: 'Not Started',
    startedAt: null,
    completedAt: null,
    score: null,
    duration: null,
  },
  {
    id: '3',
    userName: 'Mike Johnson',
    userEmail: 'mike.johnson@company.com',
    status: 'In Progress',
    startedAt: '2025-10-05T12:20:00',
    completedAt: null,
    score: null,
    duration: null,
  },
];

export function TrainingProgress() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredData = mockTrainingData.filter((entry) => {
    const matchesSearch =
      entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'Not Started':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'In Progress':
        return <Clock className="w-4 h-4" />;
      case 'Not Started':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const stats = {
    completed: mockTrainingData.filter((e) => e.status === 'Completed').length,
    inProgress: mockTrainingData.filter((e) => e.status === 'In Progress').length,
    notStarted: mockTrainingData.filter((e) => e.status === 'Not Started').length,
    averageScore:
      mockTrainingData
        .filter((e) => e.score !== null)
        .reduce((acc, e) => acc + (e.score || 0), 0) /
        mockTrainingData.filter((e) => e.score !== null).length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="text-3xl font-bold text-foreground">{stats.completed}</span>
          </div>
          <p className="text-sm text-foreground/70">Completed</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-3xl font-bold text-foreground">{stats.inProgress}</span>
          </div>
          <p className="text-sm text-foreground/70">In Progress</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            <span className="text-3xl font-bold text-foreground">{stats.notStarted}</span>
          </div>
          <p className="text-sm text-foreground/70">Not Started</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-3xl font-bold text-foreground">
              {stats.averageScore.toFixed(0)}%
            </span>
          </div>
          <p className="text-sm text-foreground/70">Average Score</p>
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        >
          <option>All</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Not Started</option>
        </select>

        <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Training Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Started At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Completed At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Score
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
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusBadge(
                        entry.status
                      )}`}
                    >
                      {getStatusIcon(entry.status)}
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground/70">
                      {entry.startedAt
                        ? new Date(entry.startedAt).toLocaleString()
                        : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground/70">
                      {entry.completedAt
                        ? new Date(entry.completedAt).toLocaleString()
                        : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground/70">
                      {entry.duration || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-foreground">
                      {entry.score !== null ? `${entry.score}%` : '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/60">No training data found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
