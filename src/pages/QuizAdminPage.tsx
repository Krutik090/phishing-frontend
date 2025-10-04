import { useState } from "react";
import { Eye, FileCog, Trash2, Edit2, Plus } from "lucide-react";
import { QuizEditor } from "../components/quiz/QuizEditor";
import { QuizPreviewModal } from "../components/quiz/QuizPreviewModal";

// ===== TYPES =====
export type QuizQuestionOption = {
  id: string;
  text: string;
  isCorrect?: boolean;
};

export type QuizQuestion = {
  id?: string;
  type: 'single' | 'multiple' | 'truefalse' | 'short' | 'long' | 'matching';
  prompt: string;
  options?: QuizQuestionOption[];
  media?: { url: string; alt?: string }[];
  points?: number;
  explanation?: string;
  required?: boolean;
  order?: number;
};

export type Quiz = {
  id?: string;
  title: string;
  description?: string;
  slug?: string;
  language?: string;
  timeLimitSeconds?: number | null;
  passingScore?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  publicLink?: string;
  state?: 'draft' | 'published' | 'archived';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  questions: QuizQuestion[];
};

// ===== MAIN COMPONENT =====
export function QuizAdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [showPreview, setShowPreview] = useState<Quiz | null>(null);

  // If editing, show full-page editor
  if (editing) {
    return (
      <QuizEditor
        quiz={editing}
        onSave={(quiz) => {
          setQuizzes((qs) =>
            quiz.id
              ? qs.map((q) => (q.id === quiz.id ? quiz : q))
              : [...qs, { ...quiz, id: `${Date.now()}` }]
          );
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
        onPreview={setShowPreview}
      />
    );
  }

  // Otherwise show quiz list - FULL WIDTH
  return (
    <div className="w-full px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded shadow hover:shadow-lg transition-all"
          onClick={() =>
            setEditing({
              title: "",
              description: "",
              language: "en",
              state: "draft",
              shuffleQuestions: false,
              shuffleOptions: false,
              questions: [],
            })
          }
        >
          <Plus className="w-5 h-5" /> New Quiz
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 font-semibold text-foreground">Title</th>
              <th className="p-3 font-semibold text-foreground">Questions</th>
              <th className="p-3 font-semibold text-foreground">Status</th>
              <th className="p-3 font-semibold text-foreground">Language</th>
              <th className="p-3 font-semibold text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, idx) => (
              <tr key={idx} className="border-b border-border last:border-0 hover:bg-accent/20">
                <td className="p-3 text-foreground">{quiz.title}</td>
                <td className="p-3 text-foreground">{quiz.questions?.length ?? 0}</td>
                <td className="p-3 text-foreground capitalize">{quiz.state}</td>
                <td className="p-3 text-foreground uppercase">{quiz.language}</td>
                <td className="p-3 text-right">
                  <button
                    className="mx-1 p-1 text-blue-600 hover:text-blue-800"
                    onClick={() => setShowPreview(quiz)}
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="mx-1 p-1 text-primary hover:text-primary/80"
                    onClick={() => setEditing(quiz)}
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    className="mx-1 p-1 text-orange-500 hover:text-orange-700"
                    onClick={() =>
                      setEditing({
                        ...quiz,
                        id: undefined,
                        title: quiz.title + " (Copy)",
                      })
                    }
                    title="Duplicate"
                  >
                    <FileCog className="w-4 h-4" />
                  </button>
                  <button
                    className="mx-1 p-1 text-destructive hover:text-red-700"
                    onClick={() => setQuizzes((qs) => qs.filter((q) => q !== quiz))}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {quizzes.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-foreground/60 py-12">
                  No quizzes found. Click "New Quiz" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPreview && (
        <QuizPreviewModal quiz={showPreview} onClose={() => setShowPreview(null)} />
      )}
    </div>
  );
}
