import { useState } from 'react';
import { Search, Download, RefreshCw, Eye, Calendar, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockCampaigns } from '../../src/components/campaign/mockCampaignData';

export function CampaignResults() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'Scheduled':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="w-full px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Campaign Results</h1>
        <p className="text-foreground/60">View and analyze your phishing campaign performance</p>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        >
          <option>All</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Scheduled</option>
        </select>

        {/* Actions */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Sync
        </button>

        <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{campaign.name}</h3>
                <div className="flex items-center gap-3 text-sm text-foreground/60">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(campaign.launchDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {campaign.totalTargets} targets
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{campaign.sent}</div>
                <div className="text-xs text-foreground/60">Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#c78554]">{campaign.opened}</div>
                <div className="text-xs text-foreground/60">Opened</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#da4d3a]">{campaign.clicked}</div>
                <div className="text-xs text-foreground/60">Clicked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{campaign.submitted}</div>
                <div className="text-xs text-foreground/60">Submitted</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-foreground/60 mb-1">
                <span>Campaign Progress</span>
                <span>{Math.round((campaign.opened / campaign.sent) * 100)}% opened</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c78554] to-[#da4d3a]"
                  style={{ width: `${(campaign.opened / campaign.sent) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => navigate(`/campaigns/results/${campaign.id}`)}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
          <p className="text-foreground/60">No campaigns found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
