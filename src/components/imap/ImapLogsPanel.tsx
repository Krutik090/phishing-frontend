import { X } from "lucide-react";
import type { ImapProfile } from '../../pages/ImapPage';

// Define a type for our log entries for better type safety
type LogEntry = {
  id: number;
  date: string;
  subject: string;
  action: 'Marked as Read' | 'Deleted' | 'Error';
  matchedCriteria: string;
};

interface ImapLogsPanelProps {
    profile: ImapProfile;
    onClose: () => void;
}

export function ImapLogsPanel({ profile, onClose }: ImapLogsPanelProps) {
  // IMPROVEMENT: Added mock log data
  const mockLogs: LogEntry[] = [
    { id: 1, date: '2025-10-04T18:30:15', subject: 'FW: Urgent: Unpaid Invoice #84321', action: 'Marked as Read', matchedCriteria: 'subject contains "invoice"' },
    { id: 2, date: '2025-10-04T17:55:42', subject: 'Security Alert: Suspicious Login Attempt', action: 'Marked as Read', matchedCriteria: 'body contains "login"' },
    { id: 3, date: '2025-10-03T11:20:05', subject: 'Your package is waiting for delivery', action: 'Deleted', matchedCriteria: 'from contains "delivery.com"' },
    { id: 4, date: '2025-10-03T09:15:22', subject: 'Action Required: Verify Your Account', action: 'Error', matchedCriteria: 'failed to parse' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card text-foreground max-w-4xl w-full rounded-lg shadow-2xl border border-border flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="font-semibold">IMAP Logs for {profile.name}</h2>
          <button onClick={onClose} className="text-foreground/60 hover:text-destructive"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-4 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="p-2 font-semibold">Date</th>
                <th className="p-2 font-semibold">Subject</th>
                <th className="p-2 font-semibold">Matched Criteria</th>
                <th className="p-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockLogs.length > 0 ? (
                mockLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-b-0 hover:bg-accent">
                    <td className="p-2 text-foreground/80 whitespace-nowrap">{new Date(log.date).toLocaleString()}</td>
                    <td className="p-2 font-medium">{log.subject}</td>
                    <td className="p-2 text-foreground/70">{log.matchedCriteria}</td>
                    <td className="p-2">{log.action}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-foreground/60">
                    No logs found for this profile.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}