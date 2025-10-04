import { useState } from 'react';
import { Send, Zap } from 'lucide-react';

interface TestConsoleProps {
  testRecipient?: string;
  onSendTest: () => Promise<boolean>;
}

export function TestConsole({ testRecipient, onSendTest }: TestConsoleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>(['Ready to test connection...']);

  const handleTest = async () => {
    if (!testRecipient) {
      setLogs(prev => [...prev, '❌ Error: Test recipient email is required.']);
      return;
    }
    setIsLoading(true);
    setLogs(prev => [...prev, `🧪 Initiating test to ${testRecipient}...`]);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const success = await onSendTest();
    if (success) {
      setLogs(prev => [...prev, '✅ Test email sent successfully!']);
    } else {
      setLogs(prev => [...prev, '🔥 Test failed. Check credentials and settings.']);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-foreground">Live Test Console</h3>
        <button
          onClick={handleTest}
          disabled={isLoading || !testRecipient}
          className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1.5"
        >
          {isLoading ? <Zap className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {isLoading ? 'Testing...' : 'Send Test'}
        </button>
      </div>
      <div className="bg-black text-green-400 p-3 rounded-md text-xs font-mono h-40 overflow-y-auto">
        {logs.map((log, i) => <pre key={i} className="mb-1 whitespace-pre-wrap">{`> ${log}`}</pre>)}
      </div>
    </div>
  );
}
