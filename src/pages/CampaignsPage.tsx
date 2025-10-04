import { useState } from "react";
import { Plus, Eye, Copy, Trash2, FileEdit } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { DeleteModal } from "../components/ui/DeleteModal";

// ===== TYPES =====
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'failed';

export type Campaign = {
  id: string;
  name: string;
  description?: string;
  emailTemplateId: string;
  phishingPageId: string;
  sendingProfileId: string;
  targetGroupId: string;
  projectId?: string;
  launchDateTime: string;
  autoLaunch: boolean;
  redirectUrl?: string;
  emailIntervalSeconds: number;
  status: CampaignStatus;
  emailsSent: number;
  emailsFailed: number;
  createdAt: string;
};

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  const getStatusBadge = (status: CampaignStatus) => {
    const variants: Record<CampaignStatus, 'default' | 'primary' | 'secondary' | 'destructive'> = {
      draft: 'default',
      scheduled: 'primary',
      active: 'secondary',
      completed: 'primary',
      failed: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="w-full px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Phishing Campaigns</h1>
        <a
          href="/campaigns/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded shadow hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> Launch New Campaign
        </a>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 font-semibold text-foreground">Name</th>
              <th className="p-3 font-semibold text-foreground">Launch Date</th>
              <th className="p-3 font-semibold text-foreground">Status</th>
              <th className="p-3 font-semibold text-foreground">Emails Sent</th>
              <th className="p-3 font-semibold text-foreground">Email Failed</th>
              <th className="p-3 font-semibold text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b border-border last:border-0 hover:bg-accent/20">
                <td className="p-3 text-foreground font-medium">{campaign.name}</td>
                <td className="p-3 text-foreground">{new Date(campaign.launchDateTime).toLocaleString()}</td>
                <td className="p-3">{getStatusBadge(campaign.status)}</td>
                <td className="p-3 text-foreground">{campaign.emailsSent}</td>
                <td className="p-3 text-foreground">{campaign.emailsFailed}</td>
                <td className="p-3 text-right">
                  <button className="mx-1 p-1 text-blue-600 hover:text-blue-800" title="View Results">
                    <Eye className="w-4 h-4" />
                  </button>
                  {campaign.status === 'draft' && (
                    <a href={`/campaigns/edit/${campaign.id}`} className="mx-1 p-1 text-primary hover:text-primary/80" title="Edit">
                      <FileEdit className="w-4 h-4" />
                    </a>
                  )}
                  <button className="mx-1 p-1 text-orange-500 hover:text-orange-700" title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(campaign)} className="mx-1 p-1 text-destructive hover:text-red-700" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-foreground/60 py-12">
                  No campaigns found. Click "Launch New Campaign" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteModal
        isOpen={!!deleteTarget}
        item={deleteTarget?.name || ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          setCampaigns(campaigns.filter(c => c.id !== deleteTarget?.id));
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
