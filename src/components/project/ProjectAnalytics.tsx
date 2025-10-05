import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProjectAnalyticsProps {
  project: any;
}

export function ProjectAnalytics({ project }: ProjectAnalyticsProps) {
  // Prepare data for campaign comparison
  const campaignComparison = project.campaigns.map((c: any) => ({
    name: c.name.substring(0, 15) + '...',
    sent: c.sent,
    opened: c.opened,
    clicked: c.clicked,
  }));

  // Prepare pie chart data
  const totalSent = project.campaigns.reduce((acc: number, c: any) => acc + c.sent, 0);
  const totalOpened = project.campaigns.reduce((acc: number, c: any) => acc + c.opened, 0);
  const totalClicked = project.campaigns.reduce((acc: number, c: any) => acc + c.clicked, 0);
  const notOpened = totalSent - totalOpened;

  const outcomeData = [
    { name: 'Opened', value: totalOpened, color: '#c78554' },
    { name: 'Clicked', value: totalClicked, color: '#da4d3a' },
    { name: 'Not Opened', value: notOpened, color: '#9ca3af' },
  ];

  // Engagement trend over time
  const engagementTrend = project.campaigns.map((c: any) => ({
    date: new Date(c.launchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    openRate: c.sent > 0 ? ((c.opened / c.sent) * 100).toFixed(1) : 0,
    clickRate: c.sent > 0 ? ((c.clicked / c.sent) * 100).toFixed(1) : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Campaign Performance Comparison */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Performance Comparison</h3>
        {campaignComparison.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#424544" opacity={0.1} />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Bar dataKey="sent" fill="#424544" name="Sent" />
              <Bar dataKey="opened" fill="#c78554" name="Opened" />
              <Bar dataKey="clicked" fill="#da4d3a" name="Clicked" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-foreground/60">No data available</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Email Outcomes */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Overall Email Outcomes</h3>
          {totalSent > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${((entry.value / totalSent) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-foreground/60">No data available</div>
          )}
        </div>

        {/* Engagement Trend */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Trend</h3>
          {engagementTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#424544" opacity={0.1} />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="openRate" stroke="#c78554" strokeWidth={2} name="Open Rate %" />
                <Line type="monotone" dataKey="clickRate" stroke="#da4d3a" strokeWidth={2} name="Click Rate %" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-foreground/60">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
