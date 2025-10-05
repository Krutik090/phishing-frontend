import { useState } from 'react';
import { Search, Eye, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCampaignsProps {
  campaigns: any[];
}

export function ProjectCampaigns({ campaigns }: ProjectCampaignsProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        />
      </div>

      {/* Campaigns Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Campaign Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Launch Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Opened
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Clicked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Quiz Taken
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Calendar className="w-4 h-4" />
                      {new Date(campaign.launchDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">{campaign.sent}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">{campaign.opened}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">{campaign.clicked}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">{campaign.quizTaken}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/campaigns/results/${campaign.id}`)}
                      className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">No campaigns found in this project.</p>
          </div>
        )}
      </div>
    </div>
  );
}
