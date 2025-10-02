import {
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Shield,
  MousePointer,
} from 'lucide-react';

export function Dashboard() {
  // Dummy data for dashboard metrics
  const stats = [
    {
      title: 'Total Campaigns',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Users Trained',
      value: '1,847',
      change: '+18%',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Emails Sent',
      value: '12,450',
      change: '+24%',
      trend: 'up',
      icon: Mail,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Click Rate',
      value: '8.2%',
      change: '-4.5%',
      trend: 'down',
      icon: MousePointer,
      color: 'from-primary to-secondary',
    },
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: 'Q4 HR Benefits Phishing Test',
      status: 'completed',
      sent: 450,
      opened: 380,
      clicked: 42,
      reported: 28,
      date: '2025-09-28',
    },
    {
      id: 2,
      name: 'IT Security Update Simulation',
      status: 'active',
      sent: 520,
      opened: 410,
      clicked: 38,
      reported: 35,
      date: '2025-10-01',
    },
    {
      id: 3,
      name: 'Finance Invoice Scam Test',
      status: 'completed',
      sent: 380,
      opened: 290,
      clicked: 25,
      reported: 42,
      date: '2025-09-20',
    },
    {
      id: 4,
      name: 'CEO Impersonation Campaign',
      status: 'completed',
      sent: 620,
      opened: 510,
      clicked: 68,
      reported: 18,
      date: '2025-09-15',
    },
    {
      id: 5,
      name: 'LinkedIn Connection Request',
      status: 'scheduled',
      sent: 0,
      opened: 0,
      clicked: 0,
      reported: 0,
      date: '2025-10-10',
    },
  ];

  const departmentPerformance = [
    { name: 'Engineering', score: 92, clickRate: 5.2, reportRate: 78, risk: 'low' },
    { name: 'HR', score: 88, clickRate: 7.8, reportRate: 65, risk: 'low' },
    { name: 'Finance', score: 85, clickRate: 8.5, reportRate: 62, risk: 'medium' },
    { name: 'Sales', score: 78, clickRate: 12.4, reportRate: 48, risk: 'medium' },
    { name: 'Marketing', score: 72, clickRate: 15.8, reportRate: 35, risk: 'high' },
    { name: 'Operations', score: 81, clickRate: 10.2, reportRate: 55, risk: 'medium' },
  ];

  const riskTrend = [
    { month: 'Apr', clickRate: 18.5, reportRate: 22 },
    { month: 'May', clickRate: 16.2, reportRate: 28 },
    { month: 'Jun', clickRate: 14.8, reportRate: 35 },
    { month: 'Jul', clickRate: 12.5, reportRate: 42 },
    { month: 'Aug', clickRate: 10.2, reportRate: 48 },
    { month: 'Sep', clickRate: 8.2, reportRate: 55 },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      completed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: 'Completed' },
      active: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', label: 'Active' },
      scheduled: { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', label: 'Scheduled' },
    };
    const badge = badges[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getRiskBadge = (risk: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      low: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400' },
      medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400' },
      high: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400' },
    };
    const badge = badges[risk];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text} uppercase`}>
        {risk}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">
            Monitor your phishing simulation campaigns and security awareness training performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === 'down' && stat.title === 'Click Rate'
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Risk Trend Analysis</h3>
              <p className="text-sm text-gray-500 mt-1">Click rate vs Report rate over time</p>
            </div>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          {/* Simple Bar Chart Visualization */}
          <div className="space-y-4">
            {riskTrend.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground w-12">{data.month}</span>
                  <div className="flex-1 flex gap-2 ml-4">
                    {/* Click Rate Bar */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${(data.clickRate / 20) * 100}%` }}
                          >
                            <span className="text-xs font-medium text-white">{data.clickRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Report Rate Bar */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${(data.reportRate / 100) * 100}%` }}
                          >
                            <span className="text-xs font-medium text-white">{data.reportRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
              <span className="text-sm text-gray-600">Click Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <span className="text-sm text-gray-600">Report Rate</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Security Score */}
          <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Security Score</h3>
                <p className="text-2xl font-bold text-foreground">84/100</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full" style={{ width: '84%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Good - Above industry average (76%)</p>
          </div>

          {/* Active Threats */}
          <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">High-Risk Users</h3>
                <p className="text-2xl font-bold text-foreground">127</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Users who clicked 3+ phishing emails
            </p>
            <button className="mt-3 text-sm font-medium text-primary hover:text-secondary transition-colors">
              View details →
            </button>
          </div>

          {/* Training Compliance */}
          <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Training Compliance</h3>
                <p className="text-2xl font-bold text-foreground">94%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: '94%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">1,738 of 1,847 users completed</p>
          </div>
        </div>
      </div>

      {/* Department Performance Table */}
      <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Department Performance</h3>
            <p className="text-sm text-gray-500 mt-1">Risk assessment by department</p>
          </div>
          <button className="text-sm font-medium text-primary hover:text-secondary transition-colors">
            View All →
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Department</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Security Score</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Click Rate</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Report Rate</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {departmentPerformance.map((dept, index) => (
                <tr key={index} className="border-b border-border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-medium text-foreground">{dept.name}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                          style={{ width: `${dept.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-foreground">{dept.score}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-foreground">{dept.clickRate}%</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-green-600 font-medium">{dept.reportRate}%</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {getRiskBadge(dept.risk)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Campaigns</h3>
            <p className="text-sm text-gray-500 mt-1">Latest phishing simulation activities</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
            Create Campaign
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Campaign Name</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Sent</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Opened</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Clicked</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Reported</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-medium text-foreground">{campaign.name}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {getStatusBadge(campaign.status)}
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-foreground">{campaign.sent}</td>
                  <td className="py-4 px-4 text-center text-sm text-foreground">
                    {campaign.opened > 0 ? `${campaign.opened} (${Math.round((campaign.opened / campaign.sent) * 100)}%)` : '-'}
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-red-600 font-medium">
                    {campaign.clicked > 0 ? `${campaign.clicked} (${Math.round((campaign.clicked / campaign.sent) * 100)}%)` : '-'}
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-green-600 font-medium">
                    {campaign.reported > 0 ? `${campaign.reported} (${Math.round((campaign.reported / campaign.sent) * 100)}%)` : '-'}
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-500">{campaign.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
