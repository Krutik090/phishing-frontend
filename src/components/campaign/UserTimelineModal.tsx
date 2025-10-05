import { X, Mail, MailOpen, MousePointerClick, FileText, GraduationCap, CheckCircle2, Clock } from 'lucide-react';
import type { Target } from '../campaign/mockCampaignData';

interface UserTimelineModalProps {
  target: Target;
  onClose: () => void;
}

export function UserTimelineModal({ target, onClose }: UserTimelineModalProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sent':
        return Mail;
      case 'opened':
        return MailOpen;
      case 'clicked':
        return MousePointerClick;
      case 'submitted':
        return FileText;
      case 'training_started':
        return GraduationCap;
      case 'training_completed':
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'sent':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
      case 'opened':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'clicked':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      case 'submitted':
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      case 'training_started':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'training_completed':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'sent':
        return 'Email Sent';
      case 'opened':
        return 'Email Opened';
      case 'clicked':
        return 'Link Clicked';
      case 'submitted':
        return 'Data Submitted';
      case 'training_started':
        return 'Training Started';
      case 'training_completed':
        return 'Training Completed';
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{target.name}</h2>
            <p className="text-sm text-foreground/60 mt-1">{target.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {target.events.map((event, index) => {
              const Icon = getEventIcon(event.type);
              const isLast = index === target.events.length - 1;

              return (
                <div key={index} className="flex gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-full bg-border min-h-[40px] mt-2"></div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-background border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">
                          {getEventLabel(event.type)}
                        </h3>
                        <span className="text-xs text-foreground/60">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {event.details && (
                        <p className="text-sm text-foreground/70">{event.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="text-sm text-foreground/60">
              Total Events: <span className="font-semibold text-foreground">{target.eventCount}</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
