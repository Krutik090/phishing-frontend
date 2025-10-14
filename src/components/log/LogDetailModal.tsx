import { X, Copy, Clock, User, Tag, AlertCircle, CheckCircle, FileText, Link } from 'lucide-react';
import { useState } from 'react';
import type { LogEntry } from '../../data/mockLogData';

interface LogDetailModalProps {
  log: LogEntry;
  onClose: () => void;
}

export function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Login':
        return 'text-blue-600 dark:text-blue-400';
      case 'Campaign':
        return 'text-orange-600 dark:text-orange-400';
      case 'Quiz':
        return 'text-green-600 dark:text-green-400';
      case 'Project':
        return 'text-purple-600 dark:text-purple-400';
      case 'System':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'Failed':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'Warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  const handleCopy = () => {
    const logDetails = `
Timestamp: ${new Date(log.timestamp).toLocaleString()}
User: ${log.userName} (${log.userEmail})
Role: ${log.role}
Category: ${log.category}
Action: ${log.action}
Description: ${log.description}
Status: ${log.status}
${log.ipAddress ? `IP Address: ${log.ipAddress}` : ''}
${log.relatedEntity ? `Related: ${log.relatedEntity.type} - ${log.relatedEntity.name}` : ''}
    `.trim();

    navigator.clipboard.writeText(logDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(log.category)} bg-opacity-10`}>
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Log Details</h2>
              <p className="text-sm text-foreground/60">ID: {log.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {copied && (
          <div className="absolute top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            Copied to clipboard!
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Category */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(log.status)}
              <span className="font-semibold text-foreground">{log.status}</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className={`font-semibold ${getCategoryColor(log.category)}`}>
              {log.category}
            </div>
          </div>

          {/* Timestamp */}
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-foreground/70 mb-1">
              <Clock className="w-4 h-4" />
              Timestamp
            </div>
            <div className="text-lg font-semibold text-foreground">
              {new Date(log.timestamp).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          </div>

          {/* User Information */}
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-foreground/70 mb-3">
              <User className="w-4 h-4" />
              User Information
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-foreground/60 mb-1">Name</div>
                <div className="font-medium text-foreground">{log.userName}</div>
              </div>
              <div>
                <div className="text-xs text-foreground/60 mb-1">Email</div>
                <div className="font-medium text-foreground">{log.userEmail}</div>
              </div>
              <div>
                <div className="text-xs text-foreground/60 mb-1">Role</div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {log.role}
                </span>
              </div>
              {log.ipAddress && (
                <div>
                  <div className="text-xs text-foreground/60 mb-1">IP Address</div>
                  <div className="font-medium text-foreground font-mono text-sm">{log.ipAddress}</div>
                </div>
              )}
            </div>
          </div>

          {/* Action Details */}
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-foreground/70 mb-3">
              <FileText className="w-4 h-4" />
              Action Details
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-foreground/60 mb-1">Action</div>
                <div className="text-lg font-semibold text-foreground">{log.action}</div>
              </div>
              <div>
                <div className="text-xs text-foreground/60 mb-1">Description</div>
                <div className="text-foreground">{log.description}</div>
              </div>
            </div>
          </div>

          {/* Related Entity */}
          {log.relatedEntity && (
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-foreground/70 mb-3">
                <Link className="w-4 h-4" />
                Related {log.relatedEntity.type}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-foreground/60 mb-1">Name</div>
                  <div className="font-semibold text-foreground">{log.relatedEntity.name}</div>
                </div>
                <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
                  View {log.relatedEntity.type}
                </button>
              </div>
            </div>
          )}

          {/* User Agent (if available) */}
          {log.userAgent && (
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="text-xs text-foreground/60 mb-2">User Agent</div>
              <div className="text-sm text-foreground/80 font-mono break-all">
                {log.userAgent}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-background">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
