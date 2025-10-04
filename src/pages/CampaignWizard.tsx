import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Save, Rocket, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type CampaignFormData = {
  name: string;
  description?: string;
  emailTemplateId: string;
  phishingPageId: string;
  sendingProfileId: string;
  targetGroupId: string;
  projectId?: string;
  launchDateTime: string;
  autoLaunch: boolean;
  redirectUrl?: string;
  emailIntervalSeconds: number;
};

const steps = [
  { id: 1, title: "Campaign Info" },
  { id: 2, title: "Email & Page" },
  { id: 3, title: "Target Group" },
  { id: 4, title: "Schedule & Launch" },
];

export function CampaignWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CampaignFormData>({
    defaultValues: {
      autoLaunch: true,
      emailIntervalSeconds: 2,
    },
  });

  const formData = watch();

  const onSubmit = (data: CampaignFormData) => {
    setShowConfirmModal(true);
  };

  const handleLaunch = () => {
    // TODO: API call to create campaign
    console.log("Launching campaign:", formData);
    navigate("/campaigns");
  };

  const handleSaveDraft = () => {
    // TODO: API call to save draft
    console.log("Saving draft:", formData);
    navigate("/campaigns");
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate("/campaigns")} className="flex items-center gap-2 text-foreground hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Campaigns</span>
        </button>
        <h1 className="text-2xl font-bold text-foreground">Launch New Campaign</h1>
        <div className="w-32"></div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step.id
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.id}
                </div>
                <span className={`text-sm mt-2 ${currentStep >= step.id ? "text-foreground font-medium" : "text-foreground/60"}`}>
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-gray-200"}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          {/* Step 1: Campaign Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Campaign Information</h2>
              <div>
                <label className="block font-medium mb-1 text-foreground">
                  Campaign Name <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("name", { required: "Campaign name is required" })}
                  className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Q4 Security Awareness Test"
                />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1 text-foreground">Description</label>
                <textarea
                  {...register("description")}
                  className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Optional notes about this campaign"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-foreground">
                  Project <span className="text-foreground/60">(optional)</span>
                </label>
                <select
                  {...register("projectId")}
                  className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Project --</option>
                  <option value="proj1">Security Awareness 2025</option>
                  <option value="proj2">HR Phishing Test</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Email & Page */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Email & Phishing Page</h2>
              <div>
                <label className="block font-medium mb-1 text-foreground">
                  Email Template <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("emailTemplateId", { required: "Email template is required" })}
                  className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Template --</option>
                  <option value="tpl1">Password Reset Request</option>
                  <option value="tpl2">IT Security Alert</option>
                  <option value="tpl3">Invoice Payment Due</option>
                </select>
                {errors.emailTemplateId && <p className="text-destructive text-sm mt-1">{errors.emailTemplateId.message}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1 text-foreground">
                  Phishing Page <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("phishingPageId", { required: "Phishing page is required" })}
                  className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Page --</option>
                  <option value="page1">Microsoft Login Clone</option>
                  <option value="page2">Google Drive Fake Share</option>
                  <option value="page3">Generic Login Page</option>
                </select>
                {errors.phishingPageId && <p className="text-destructive text-sm mt-1">{errors.phishingPageId.message}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1 text-foreground">
                  Sending Profile <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("sendingProfileId", { required: "Sending profile is required" })}
                  className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Profile --</option>
                  <option value="smtp1">SMTP Profile 1</option>
                  <option value="smtp2">SMTP Profile 2</option>
                </select>
                {errors.sendingProfileId && <p className="text-destructive text-sm mt-1">{errors.sendingProfileId.message}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Target Group */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Select Target Group</h2>
              <div>
                <label className="block font-medium mb-1 text-foreground">
                  Group / Target List <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("targetGroupId", { required: "Target group is required" })}
                  className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Group --</option>
                  <option value="grp1">All Employees</option>
                  <option value="grp2">IT Department</option>
                  <option value="grp3">Finance Team</option>
                </select>
                {errors.targetGroupId && <p className="text-destructive text-sm mt-1">{errors.targetGroupId.message}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Schedule & Launch */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Schedule & Launch</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-1 text-foreground">
                    Launch Date & Time <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    {...register("launchDateTime", { required: "Launch date is required" })}
                    className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.launchDateTime && <p className="text-destructive text-sm mt-1">{errors.launchDateTime.message}</p>}
                </div>
                <div>
                  <label className="block font-medium mb-1 text-foreground">
                    Email Interval (seconds) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("emailIntervalSeconds", { required: true, min: 1 })}
                    className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                  />
                  <p className="text-sm text-foreground/60 mt-1">Time gap between each email sent</p>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1 text-foreground">
                  Redirect URL <span className="text-foreground/60">(optional)</span>
                </label>
                <input
                  type="url"
                  {...register("redirectUrl")}
                  className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://training.example.com/quiz"
                />
                <p className="text-sm text-foreground/60 mt-1">Where users land after clicking the phishing link</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("autoLaunch")}
                  className="accent-primary w-4 h-4"
                />
                <label className="text-foreground">Auto-launch at scheduled time</label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${
              currentStep === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            <ArrowLeft className="w-5 h-5" /> Previous
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-border rounded-lg font-semibold text-foreground hover:bg-accent"
            >
              <Save className="w-5 h-5 inline mr-1" /> Save as Draft
            </button>
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-2 bg-gradient-to-r from-[#da4d3a] to-[#c78554] text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg"
              >
                <Rocket className="w-5 h-5" /> Launch Campaign
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 max-w-md w-full shadow-2xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Confirm Launch</h3>
            </div>
            <div className="space-y-2 mb-6 text-foreground">
              <p><strong>Campaign:</strong> {formData.name}</p>
              <p><strong>Launch:</strong> {new Date(formData.launchDateTime).toLocaleString()}</p>
              <p><strong>Email Interval:</strong> {formData.emailIntervalSeconds}s</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunch}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold"
              >
                Confirm & Launch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
