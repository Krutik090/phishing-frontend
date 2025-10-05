import { useState } from 'react';
import { Clock, Filter, Download } from 'lucide-react';
import { mockTargets } from './mockCampaignData';

export function CampaignTimeline() {
  const [filterType, setFilterType] = useState<string>('All');

  // Flatten all events from all targets with user info
  const allEvents = mockTargets.flatMap((target) =>
    target.events.map((event) => ({
      ...event,
      userName: target.name,
      userEmail: target.email,
    }))
  );

  // Sort by timestamp descending (most recent first)
  const sortedEvents = allEvents.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Filter events
  const filteredEvents = sortedEvents.filter((event) => {
    if (filterType === 'All') return true;
    return event.type === filterType;
  });

  const getEventColor = (type: string) => {
    switch (type) {
      case 'sent':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
      case 'opened':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'clicked':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'submitted':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'training_started':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'training_completed':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      sent: 'Email Sent',
      opened: 'Email Opened',
      clicked: 'Link Clicked',
      submitted: 'Data Submitted',
      training_started: 'Training Started',
      training_completed: 'Training Completed',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-foreground/60" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="All">All Events</option>
              <option value="sent">Sent</option>
              <option value="opened">Opened</option>
              <option value="clicked">Clicked</option>
              <option value="submitted">Submitted</option>
              <option value="training_started">Training Started</option>
              <option value="training_completed">Training Completed</option>
            </select>
          </div>
          <div className="text-sm text-foreground/60">
            Showing {filteredEvents.length} events
          </div>
        </div>

        <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Timeline
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 p-4 rounded-lg border ${getEventColor(event.type)}`}
            >
              <div className="flex-shrink-0 w-32 text-sm text-foreground/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-xs text-foreground/50 mt-1">
                  {new Date(event.timestamp).toLocaleDateString()}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">
                    {getEventLabel(event.type)}
                  </span>
                  <span className="text-sm text-foreground/60">•</span>
                  <span className="text-sm text-foreground/60">
                    {event.userName}
                  </span>
                </div>
                <div className="text-sm text-foreground/70">{event.userEmail}</div>
                {event.details && (
                  <div className="mt-2 text-sm text-foreground/60 italic">
                    {event.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/60">No events found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
