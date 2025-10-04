import { X, ExternalLink } from "lucide-react";
import type { Quiz } from "../../pages/QuizAdminPage";
import { PublicQuizPage } from "../../pages/PublicQuizPage";

interface QuizPreviewModalProps {
  quiz: Quiz;
  onClose: () => void;
}

export function QuizPreviewModal({ quiz, onClose }: QuizPreviewModalProps) {
  // Store quiz in sessionStorage and open preview in new tab
  const handleOpenInNewTab = () => {
    // Store quiz data temporarily for preview
    sessionStorage.setItem('quiz-preview', JSON.stringify(quiz));
    // Open preview route
    window.open('/quiz-preview', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card text-foreground w-full h-full rounded-lg shadow-2xl border border-border flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-foreground">Quiz Preview</h2>
            <button
              onClick={handleOpenInNewTab}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm flex items-center gap-1 hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" /> Open in New Tab
            </button>
          </div>
          <button onClick={onClose} className="text-foreground/60 hover:text-destructive">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          {/* Embed the public quiz inside preview modal */}
          <PublicQuizPage quizData={quiz} isPreview={true} />
        </div>
      </div>
    </div>
  );
}
