import { useForm, useFieldArray, Controller } from "react-hook-form";
import { ArrowLeft, Save, Plus, Trash2, ChevronDown, ChevronUp, Eye } from "lucide-react";
import type { Quiz } from "../../pages/QuizAdminPage";

function nanoid() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface QuizEditorProps {
  quiz: Quiz;
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
  onPreview: (quiz: Quiz) => void;
}

export function QuizEditor({ quiz, onSave, onCancel, onPreview }: QuizEditorProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Quiz>({
    defaultValues: quiz,
    mode: "onChange",
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
  });

  const questionType = (idx: number) => watch(`questions.${idx}.type`);

  const addNewQuestion = () => {
    append({
      id: nanoid(),
      type: "single",
      prompt: "",
      options: [
        { id: nanoid(), text: "", isCorrect: false },
        { id: nanoid(), text: "", isCorrect: false },
        { id: nanoid(), text: "", isCorrect: false },
        { id: nanoid(), text: "", isCorrect: false },
      ],
      points: 1,
      required: true,
      explanation: "",
    });
  };

  // Get correct number of options based on question type
  const getOptionsForType = (type: string) => {
    if (type === "truefalse") {
      return [
        { id: nanoid(), text: "True", isCorrect: false },
        { id: nanoid(), text: "False", isCorrect: false },
      ];
    }
    return [
      { id: nanoid(), text: "", isCorrect: false },
      { id: nanoid(), text: "", isCorrect: false },
      { id: nanoid(), text: "", isCorrect: false },
      { id: nanoid(), text: "", isCorrect: false },
    ];
  };

  // Action Buttons Component (reused at top and bottom)
  const ActionButtons = () => (
    <div className="flex gap-2">
      <button
        onClick={handleSubmit(onSave)}
        className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded shadow hover:shadow-lg flex items-center gap-2"
      >
        <Save className="w-5 h-5" />
        Save Quiz
      </button>
    </div>
  );

  return (
    <div className="w-full px-6 py-8">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-foreground hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-foreground">Back to Quizzes</span>
        </button>
        <ActionButtons />
      </div>

      <form className="space-y-8">
        {/* Quiz Settings */}
        <div className="bg-card border border-border rounded-xl p-6 shadow">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Quiz Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-medium mb-1 text-foreground">
                Quiz Title <span className="text-destructive">*</span>
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Phishing Awareness Quiz"
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1 text-foreground">Description</label>
              <textarea
                {...register("description")}
                className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Brief description of the quiz"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-foreground">Slug (URL)</label>
              <input
                {...register("slug")}
                className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="phishing-quiz-2025"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-foreground">Language</label>
              <select
                {...register("language")}
                className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1 text-foreground">Time Limit (seconds)</label>
              <input
                type="number"
                {...register("timeLimitSeconds", { valueAsNumber: true })}
                className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Leave empty for no limit"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-foreground">Passing Score (%)</label>
              <input
                type="number"
                {...register("passingScore", { valueAsNumber: true })}
                className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 80"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-foreground">Status</label>
              <select
                {...register("state")}
                className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-6">
              <label className="inline-flex items-center gap-2 text-foreground">
                <input
                  type="checkbox"
                  {...register("shuffleQuestions")}
                  className="accent-primary w-4 h-4"
                />
                <span>Shuffle Questions</span>
              </label>
              <label className="inline-flex items-center gap-2 text-foreground">
                <input
                  type="checkbox"
                  {...register("shuffleOptions")}
                  className="accent-primary w-4 h-4"
                />
                <span>Shuffle Options</span>
              </label>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-card border border-border rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Questions</h2>
          </div>
          {fields.length === 0 && (
            <div className="text-center p-8 text-foreground/60">
              No questions yet. Click "Add Question" button below to start.
            </div>
          )}
          {fields.map((field, idx) => {
            const currentType = questionType(idx);
            const optionsCount = currentType === "truefalse" ? 2 : 4;
            
            return (
              <div
                key={field.id}
                className="mb-6 bg-background border border-border rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-foreground">Q{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => idx > 0 && move(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1 text-foreground/50 hover:text-blue-400 disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => idx < fields.length - 1 && move(idx, idx + 1)}
                      disabled={idx === fields.length - 1}
                      className="p-1 text-foreground/50 hover:text-blue-400 disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="p-1 text-destructive/70 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1 text-foreground">Question Type</label>
                    <select
                      {...register(`questions.${idx}.type`)}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setValue(`questions.${idx}.type`, newType as any);
                        // Update options when type changes
                        if (newType === "truefalse") {
                          setValue(`questions.${idx}.options`, [
                            { id: nanoid(), text: "True", isCorrect: false },
                            { id: nanoid(), text: "False", isCorrect: false },
                          ]);
                        } else if (newType === "single" || newType === "multiple") {
                          setValue(`questions.${idx}.options`, [
                            { id: nanoid(), text: "", isCorrect: false },
                            { id: nanoid(), text: "", isCorrect: false },
                            { id: nanoid(), text: "", isCorrect: false },
                            { id: nanoid(), text: "", isCorrect: false },
                          ]);
                        }
                      }}
                      className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="single">Single Choice</option>
                      <option value="multiple">Multiple Choice</option>
                      <option value="truefalse">True/False</option>
                      <option value="short">Short Answer</option>
                      <option value="long">Long Answer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-foreground">Points</label>
                    <input
                      type="number"
                      {...register(`questions.${idx}.points`, { valueAsNumber: true })}
                      className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      min="1"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1 text-foreground">
                    Question <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    {...register(`questions.${idx}.prompt`, {
                      required: "Question text is required",
                    })}
                    className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your question here"
                  />
                </div>
                {/* Options (only for single/multiple/truefalse) */}
                {(currentType === "single" ||
                  currentType === "multiple" ||
                  currentType === "truefalse") && (
                  <div className="space-y-3 mb-4">
                    <label className="block font-medium text-foreground">Answer Options</label>
                    {field.options?.slice(0, optionsCount).map((opt, optIdx) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <Controller
                          control={control}
                          name={`questions.${idx}.options.${optIdx}.isCorrect`}
                          render={({ field }) => (
                            <input
                              type={currentType === "multiple" ? "checkbox" : "radio"}
                              checked={field.value}
                              onChange={(e) => {
                                if (currentType === "single" || currentType === "truefalse") {
                                  for (let i = 0; i < optionsCount; i++) {
                                    setValue(
                                      `questions.${idx}.options.${i}.isCorrect`,
                                      i === optIdx,
                                      { shouldValidate: true }
                                    );
                                  }
                                } else {
                                  field.onChange(e.target.checked);
                                }
                              }}
                              name={`question-${idx}-correct-${optIdx}`}
                              className="accent-primary w-4 h-4"
                            />
                          )}
                        />
                        <input
                          {...register(`questions.${idx}.options.${optIdx}.text`, {
                            required: "Option text required",
                          })}
                          className="flex-1 bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder={
                            currentType === "truefalse"
                              ? optIdx === 0
                                ? "True"
                                : "False"
                              : `Option ${String.fromCharCode(65 + optIdx)}`
                          }
                          disabled={currentType === "truefalse"}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <label className="block font-medium mb-1 text-foreground">Explanation (optional)</label>
                  <textarea
                    {...register(`questions.${idx}.explanation`)}
                    className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Explain why this is the correct answer"
                  />
                </div>
                <label className="inline-flex items-center gap-2 mt-3 text-foreground">
                  <input
                    type="checkbox"
                    {...register(`questions.${idx}.required`)}
                    className="accent-primary w-4 h-4"
                  />
                  <span>Required Question</span>
                </label>
              </div>
            );
          })}

          {/* ADD QUESTION BUTTON AT BOTTOM */}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={addNewQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold shadow"
            >
              <Plus className="w-5 h-5" /> Add Question
            </button>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
          <ActionButtons />
        </div>
      </form>
    </div>
  );
}
