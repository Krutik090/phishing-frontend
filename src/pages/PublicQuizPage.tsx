import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import type { Quiz, QuizQuestion } from "./QuizAdminPage";

interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

interface PublicQuizPageProps {
  quizData?: Quiz; // For embedded preview in modal
  isPreview?: boolean; // Flag to indicate preview mode
}

export function PublicQuizPage({ quizData, isPreview = false }: PublicQuizPageProps) {
  const { id, slug } = useParams(); // For public routes
  const [quiz, setQuiz] = useState<Quiz | null>(quizData || null);
  const [loading, setLoading] = useState(!quizData);
  const [stage, setStage] = useState<"intro" | "quiz" | "results">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    // If quiz data not provided (new tab preview or public route)
    if (!quizData) {
      // First, try to load from sessionStorage (for preview in new tab)
      const previewData = sessionStorage.getItem('quiz-preview');
      if (previewData) {
        setQuiz(JSON.parse(previewData));
        setLoading(false);
        // Clear after loading
        sessionStorage.removeItem('quiz-preview');
        return;
      }

      // Otherwise, fetch from API (for actual public route)
      // TODO: Replace with actual API call
      // fetchQuiz(id || slug).then(setQuiz).catch(() => setQuiz(null));
      setLoading(false);
    }
  }, [id, slug, quizData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#424544] via-[#424544] to-[#424544] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Loading quiz...</h2>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#424544] via-[#424544] to-[#424544] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz not found</h2>
          <p className="text-gray-600">The quiz you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleStartQuiz = () => {
    setStage("quiz");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const isCorrect = currentQuestion.options?.find((o) => o.id === selectedOption)?.isCorrect || false;
    
    setUserAnswers([
      ...userAnswers,
      {
        questionId: currentQuestion.id!,
        selectedOptionId: selectedOption,
        isCorrect,
      },
    ]);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setStage("results");
    }
  };

  const score = userAnswers.filter((a) => a.isCorrect).length;
  const totalQuestions = quiz.questions.length;
  const scorePercentage = (score / totalQuestions) * 100;

  return (
    <div className={`${isPreview ? '' : 'min-h-screen'} bg-gradient-to-br from-[#424544] via-[#424544] to-[#424544] flex items-center justify-center p-4`}>
      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <IntroScreen quiz={quiz} onStart={handleStartQuiz} />
          )}
          {stage === "quiz" && (
            <QuizScreen
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              progress={progress}
              selectedOption={selectedOption}
              onSelectOption={handleSelectOption}
              onNext={handleNextQuestion}
            />
          )}
          {stage === "results" && (
            <ResultsScreen
              quiz={quiz}
              userAnswers={userAnswers}
              score={score}
              totalQuestions={totalQuestions}
              scorePercentage={scorePercentage}
              onRetake={handleStartQuiz}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ===== REST OF THE COMPONENTS (IntroScreen, QuizScreen, ResultsScreen) =====
// ... (keep the same as before)

function IntroScreen({ quiz, onStart }: { quiz: Quiz; onStart: () => void }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center"
    >
      <div className="mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-[#da4d3a] to-[#c78554] rounded-full mx-auto flex items-center justify-center">
          <span className="text-4xl">🎯</span>
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-[#424544]">{quiz.title}</h1>
      <p className="text-lg text-gray-600 mb-8">{quiz.description}</p>
      <div className="flex items-center justify-center gap-8 mb-8 text-sm text-gray-500">
        <div>📝 {quiz.questions.length} Questions</div>
        {quiz.timeLimitSeconds && <div>⏱️ {quiz.timeLimitSeconds / 60} mins</div>}
      </div>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-gradient-to-r from-[#da4d3a] to-[#c78554] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg flex items-center gap-2 mx-auto"
      >
        Start Quiz <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

function QuizScreen({
  question,
  questionNumber,
  totalQuestions,
  progress,
  selectedOption,
  onSelectOption,
  onNext,
}: any) {
  return (
    <motion.div
      key={`question-${questionNumber}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
    >
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-gradient-to-r from-[#da4d3a] to-[#c78554] h-2 rounded-full"
          />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[#424544]">
        {question.prompt}
      </h2>

      <div className="space-y-4 mb-8">
        {question.options?.map((option: any) => (
          <button
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedOption === option.id
                ? "border-[#da4d3a] bg-[#da4d3a]/10"
                : "border-gray-200 hover:border-[#c78554] hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === option.id
                    ? "border-[#da4d3a] bg-[#da4d3a]"
                    : "border-gray-300"
                }`}
              >
                {selectedOption === option.id && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
              <span className="text-lg text-[#424544]">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedOption}
        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
          selectedOption
            ? "bg-gradient-to-r from-[#da4d3a] to-[#c78554] text-white shadow-lg hover:shadow-xl"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {questionNumber === totalQuestions ? "Finish Quiz" : "Next Question"}{" "}
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

function ResultsScreen({
  quiz,
  userAnswers,
  score,
  totalQuestions,
  scorePercentage,
  onRetake,
}: any) {
  const isPassed = scorePercentage >= (quiz.passingScore || 70);

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
    >
      <div className="text-center mb-8">
        <div
          className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl font-bold ${
            isPassed
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {score}/{totalQuestions}
        </div>
        <h2 className="text-3xl font-bold mt-6 text-[#424544]">
          {isPassed ? "Well Done! 🎉" : "Keep Learning! 📚"}
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          You scored {scorePercentage.toFixed(0)}%
        </p>
      </div>

      <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
        {quiz.questions.map((q: QuizQuestion, idx: number) => {
          const userAnswer = userAnswers[idx];
          const correctOption = q.options?.find((o) => o.isCorrect);
          const selectedOption = q.options?.find((o) => o.id === userAnswer.selectedOptionId);

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border-2 ${
                userAnswer.isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {userAnswer.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-[#424544] mb-2">
                    Q{idx + 1}: {q.prompt}
                  </p>
                  <p className="text-sm text-gray-600">
                    Your answer: <span className="font-medium">{selectedOption?.text}</span>
                  </p>
                  {!userAnswer.isCorrect && (
                    <p className="text-sm text-green-600 mt-1">
                      Correct answer: <span className="font-medium">{correctOption?.text}</span>
                    </p>
                  )}
                  {q.explanation && (
                    <p className="text-sm text-gray-500 mt-2 italic">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRetake}
          className="flex-1 py-4 bg-gradient-to-r from-[#da4d3a] to-[#c78554] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Retake Quiz
        </button>
      </div>
    </motion.div>
  );
}
