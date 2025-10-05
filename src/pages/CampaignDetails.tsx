import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MailOpen, MousePointerClick, FileText, GraduationCap, CheckCircle2, Download } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockCampaigns, mockTargets, mockChartData, mockTimelineData } from '../components/campaign/mockCampaignData';
import { CampaignTargetsTable } from '../components/campaign/CampaignTargetsTable';
import { CampaignTimeline } from '../components/campaign/CampaignTimeline';
import { CapturedData } from '../components/campaign/CapturedData';
import { TrainingProgress } from '../components/campaign/TrainingProgress';

export function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const campaign = mockCampaigns.find((c) => c.id === id);

  if (!campaign) {
    return <div className="p-6">Campaign not found</div>;
  }

  const stats = [
    { label: 'Emails Sent', value: campaign.sent, icon: Mail, color: '#424544' },
    { label: 'Emails Opened', value: campaign.opened, icon: MailOpen, color: '#c78554' },
    { label: 'Links Clicked', value: campaign.clicked, icon: MousePointerClick, color: '#da4d3a' },
    { label: 'Data Submitted', value: campaign.submitted, icon: FileText, color: '#dc2626' },
    { label: 'Training Started', value: campaign.trained, icon: GraduationCap, color: '#3b82f6' },
    { label: 'Training Completed', value: campaign.trainingCompleted, icon: CheckCircle2, color: '#10b981' },
  ];

  return (
    <div className="w-full px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/campaigns/results')}
          className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{campaign.name}</h1>
            <p className="text-foreground/60">
              Launched on {new Date(campaign.launchDate).toLocaleDateString()} • {campaign.totalTargets} targets
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-6">
          {['overview', 'targets', 'timeline', 'captured', 'training'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium capitalize transition-colors ${activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground/60 hover:text-foreground'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                </div>
                <p className="text-sm text-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Events Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#424544" opacity={0.1} />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="opened" stroke="#c78554" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicked" stroke="#da4d3a" strokeWidth={2} />
                  <Line type="monotone" dataKey="submitted" stroke="#dc2626" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'targets' && <CampaignTargetsTable targets={mockTargets} />}

      {activeTab === 'timeline' && <CampaignTimeline />}

      {activeTab === 'captured' && <CapturedData />}

      {activeTab === 'training' && <TrainingProgress />}
    </div>
  );
}
