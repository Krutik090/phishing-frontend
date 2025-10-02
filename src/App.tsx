import { ThemeToggleButton } from './components/ThemeToggleButton';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <header className="p-4 border-b border-border flex justify-between items-center">
        <h1 className="text-xl font-bold">Phishing Simulation Platform</h1>
        <ThemeToggleButton />
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <div className="p-8 bg-card text-card-foreground rounded-lg mb-8 border border-border shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
          <p>Welcome! Your campaign analytics will be displayed here.</p>
        </div>

        <div className="flex flex-wrap items-start gap-6">
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md 
                               transition-all duration-200 ease-in-out
                               hover:bg-primary/90 hover:-translate-y-0.5
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              Create Campaign
            </button>

            <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold shadow-md
                               transition-all duration-200 ease-in-out
                               hover:bg-secondary/90 hover:-translate-y-0.5
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              Export Data
            </button>
          </div>

          {/* Analytics Card */}
          <div className="p-6 bg-card text-card-foreground rounded-xl border border-border shadow-lg flex-grow">
            <h2 className="text-lg font-semibold">Analytics</h2>
            <p className="mt-2">Your phishing campaign stats will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;