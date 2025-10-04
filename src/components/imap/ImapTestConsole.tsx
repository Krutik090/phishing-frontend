import { useState } from "react";
import { Send, RefreshCw, X } from "lucide-react";
import type { ImapProfile } from '../../pages/ImapPage'; // UPDATED IMPORT

interface ImapTestConsoleProps {
  profile: ImapProfile;
  onClose: () => void;
}

export function ImapTestConsole({ profile, onClose }: ImapTestConsoleProps) {
   const [logs, setLogs] = useState([`Ready to test ${profile.name}...`]);
  const [isLoading, setLoading] = useState(false);

  const runTest = async (action: 'test' | 'fetch') => {
    setLoading(true);
    const actionText = action === 'test' ? 'Connecting to' : 'Polling';
    setLogs(old => [...old, `▶️ ${actionText} ${profile.host}...`]);
    
    // Simulate API call
    setTimeout(() => {
      setLogs(old => [...old, `✅ ${action === 'test' ? 'Connection successful' : 'Fetch complete'}.`]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card text-foreground max-w-2xl w-full rounded-lg shadow-2xl border border-border">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="font-semibold">IMAP Test Console</h2>
          <button onClick={onClose} className="text-foreground/60 hover:text-destructive"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => runTest('test')} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-bold flex items-center gap-2" disabled={isLoading}><Send className="w-4 h-4" /> Connection Test</button>
            <button onClick={() => runTest('fetch')} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-bold flex items-center gap-2" disabled={isLoading}><RefreshCw className="w-4 h-4" /> Fetch Now</button>
          </div>
          <pre className="bg-black p-3 rounded-md text-green-400 font-mono text-xs h-48 overflow-y-auto">{logs.map((log, i) => `[${i}]: ${log}`).join("\n")}</pre>
        </div>
      </div>
    </div>
  );
}