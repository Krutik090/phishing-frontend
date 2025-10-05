import { Mail, MailOpen, MousePointerClick, GraduationCap, Rocket } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProjectOverviewProps {
  project: any;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  // Calculate aggregated stats
  const totalCampaigns = project.campaigns.length;
  const totalSent = project.campaigns.reduce((acc: number, c: any) => acc + c.sent, 0);
  const totalOpened = project.campaigns.reduce((acc: number, c: any) => acc + c.opened, 0);
  const totalClicked = project.campaigns.reduce((acc: number, c: any) => acc + c.clicked, 0);
  const totalQuizTaken = project.campaigns.reduce((acc: number, c: any) => acc + c.quizTaken, 0);

  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0;
  const clickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : 0;
  const quizRate = totalSent > 0 ? ((totalQuizTaken / totalSent) * 100).toFixed(1) : 0;

  const stats = [
    { label: 'Total Campaigns', value: totalCampaigns, icon: Rocket, color: '#3b82f6' },
    { label: 'Emails Sent', value: totalSent, icon: Mail, color: '#424544' },
    { label: 'Open Rate', value: `${openRate}%`, icon: MailOpen, color: '#c78554' },
    { label: 'Click Rate', value: `${clickRate}%`, icon: MousePointerClick, color: '#da4d3a' },
    { label: 'Quiz Participation', value: `${quizRate}%`, icon: GraduationCap, color: '#10b981' },
  ];

  // Mock timeline data
  const timelineData = project.campaigns.map((c: any) => ({
    date: new Date(c.launchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sent: c.sent,
    opened: c.opened,
    clicked: c.clicked,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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

      {/* Timeline Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Campaigns Timeline</h3>
        {timelineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#424544" opacity={0.1} />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sent" stroke="#424544" strokeWidth={2} name="Sent" />
              <Line type="monotone" dataKey="opened" stroke="#c78554" strokeWidth={2} name="Opened" />
              <Line type="monotone" dataKey="clicked" stroke="#da4d3a" strokeWidth={2} name="Clicked" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-foreground/60">
            No campaign data available yet
          </div>
        )}
      </div>
    </div>
  );
}
