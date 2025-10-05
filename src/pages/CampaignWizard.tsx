import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight, Save, Rocket, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCampaigns } from "./CampaignsPage";
import { DateTimePicker } from "../components/ui/DateTimePicker";

type CampaignFormData = {
  name: string;
  description?: string;
  emailTemplateId: string;
  phishingPageId: string;
  sendingProfileId: string;
  targetGroupIds: string[]; // Changed to array
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

const mockGroups = [
  { id: "grp1", name: "All Employees" },
  { id: "grp2", name: "IT Department" },
  { id: "grp3", name: "Finance Team" },
  { id: "grp4", name: "HR Department" },
  { id: "grp5", name: "Marketing Team" },
];

export function CampaignWizard() {
  const navigate = useNavigate();
  const { addCampaign } = useCampaigns();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CampaignFormData>({
    defaultValues: {
      autoLaunch: true,
      emailIntervalSeconds: 2,
      targetGroupIds: [],
    },
  });

  const formData = watch();

  const onSubmit = (data: CampaignFormData) => {
    setShowConfirmModal(true);
  };

  const handleLaunch = () => {
    const newCampaign = {
      id: `campaign-${Date.now()}`,
      ...formData,
      status: formData.autoLaunch ? 'scheduled' : 'draft',
      emailsSent: 0,
      emailsFailed: 0,
      createdAt: new Date().toISOString(),
    } as any;

    addCampaign(newCampaign);
    navigate("/campaigns");
  };

  const handleSaveDraft = () => {
    const draftCampaign = {
      id: `campaign-${Date.now()}`,
      ...formData,
      status: 'draft',
      emailsSent: 0,
      emailsFailed: 0,
      createdAt: new Date().toISOString(),
    } as any;

    addCampaign(draftCampaign);
    navigate("/campaigns");
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full px-6 py-8 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= step.id
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

          {/* Step 3: Target Group (Multi-select) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Select Target Groups</h2>
              <Controller
                name="targetGroupIds"
                control={control}
                rules={{ required: "At least one target group is required" }}
                render={({ field }) => (
                  <div>
                    <label className="block font-medium mb-2 text-foreground">
                      Groups / Target Lists <span className="text-destructive">*</span>
                    </label>
                    <div className="space-y-2 border border-border rounded-lg p-4 bg-input dark:bg-card max-h-64 overflow-y-auto">
                      {mockGroups.map((group) => (
                        <label key={group.id} className="flex items-center gap-3 p-2 hover:bg-accent/20 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.value?.includes(group.id)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), group.id]
                                : field.value?.filter((id) => id !== group.id);
                              field.onChange(newValue);
                            }}
                            className="accent-primary w-4 h-4"
                          />
                          <span className="text-foreground">{group.name}</span>
                        </label>
                      ))}
                    </div>
                    {errors.targetGroupIds && <p className="text-destructive text-sm mt-1">{errors.targetGroupIds.message}</p>}
                    {field.value && field.value.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {field.value.map((groupId) => {
                          const group = mockGroups.find((g) => g.id === groupId);
                          return (
                            <div key={groupId} className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                              {group?.name}
                              <button
                                type="button"
                                onClick={() => field.onChange(field.value?.filter((id) => id !== groupId))}
                                className="hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          )}

          {/* Step 4: Schedule & Launch */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Schedule & Launch</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* REPLACE THIS SECTION */}
                <Controller
                  name="launchDateTime"
                  control={control}
                  rules={{ required: "Launch date is required" }}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      label="Launch Date & Time"
                      required
                      error={errors.launchDateTime?.message}
                      minDateTime={new Date().toISOString()}
                    />
                  )}
                />

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
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${currentStep === 1
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
              <p><strong>Target Groups:</strong> {formData.targetGroupIds?.length || 0} selected</p>
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
