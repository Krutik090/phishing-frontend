import { Download, FileText, Calendar } from 'lucide-react';

interface ProjectReportsProps {
  project: any;
}

export function ProjectReports({ project }: ProjectReportsProps) {
  const totalSent = project.campaigns.reduce((acc: number, c: any) => acc + c.sent, 0);
  const totalOpened = project.campaigns.reduce((acc: number, c: any) => acc + c.opened, 0);
  const totalClicked = project.campaigns.reduce((acc: number, c: any) => acc + c.clicked, 0);
  const totalQuizTaken = project.campaigns.reduce((acc: number, c: any) => acc + c.quizTaken, 0);

  const handleDownloadMerged = (format: string) => {
    alert(`Downloading merged report as ${format}`);
    // Implement download logic
  };

  const handleDownloadIndividual = (campaignId: string, format: string) => {
    alert(`Downloading campaign ${campaignId} report as ${format}`);
    // Implement download logic
  };

  return (
    <div className="space-y-6">
      {/* Merged Report Summary */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Report Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">{totalSent}</div>
            <div className="text-sm text-foreground/60">Total Sent</div>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-[#c78554] mb-1">{totalOpened}</div>
            <div className="text-sm text-foreground/60">Total Opened</div>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-[#da4d3a] mb-1">{totalClicked}</div>
            <div className="text-sm text-foreground/60">Total Clicked</div>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{totalQuizTaken}</div>
            <div className="text-sm text-foreground/60">Quiz Taken</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleDownloadMerged('PDF')}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Merged Report (PDF)
          </button>
          <button
            onClick={() => handleDownloadMerged('CSV')}
            className="flex-1 px-4 py-3 bg-card border border-border rounded-lg font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Merged Report (CSV)
          </button>
        </div>
      </div>

      {/* Individual Campaign Reports */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Individual Campaign Reports</h3>
        
        <div className="space-y-3">
          {project.campaigns.map((campaign: any) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium text-foreground">{campaign.name}</div>
                  <div className="flex items-center gap-2 text-sm text-foreground/60 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(campaign.launchDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadIndividual(campaign.id, 'PDF')}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => handleDownloadIndividual(campaign.id, 'CSV')}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>
          ))}

          {project.campaigns.length === 0 && (
            <div className="text-center py-12 text-foreground/60">
              No campaigns available for download
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
