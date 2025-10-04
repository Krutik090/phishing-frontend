import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { Plus, Trash, X, Save, Search } from 'lucide-react';

function validateUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

interface PhishingPage {
  id: number;
  name: string;
  description: string;
  body: string;
  redirectUrl: string;
  captureCredentials: boolean;
  capturePassword: boolean;
  createdAt: string;
}

type FormData = Omit<PhishingPage, 'id' | 'createdAt'>;

export function PhishingPages() {
  const [pages, setPages] = useState<PhishingPage[]>([
    {
      id: 1,
      name: 'Fake O365 Login',
      description: 'Simulates an Office 365 login portal.',
      body: '<form action="/submit" method="post">\n  <input placeholder="Username">\n  <input type="password" placeholder="Password">\n  <button>Sign in</button>\n</form>',
      redirectUrl: 'https://support.microsoft.com/',
      captureCredentials: true,
      capturePassword: true,
      createdAt: '2025-10-04',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PhishingPage | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const filteredPages = useMemo(
    () =>
      pages.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [pages, searchTerm]
  );

  const openNewModal = () => {
    setEditingPage(null);
    reset({
      name: '',
      description: '',
      body: '',
      redirectUrl: '',
      captureCredentials: true,
      capturePassword: false,
    });
    setActiveTab('editor');
    setModalOpen(true);
  };

  const openEditModal = (page: PhishingPage) => {
    setEditingPage(page);
    reset(page);
    setActiveTab('editor');
    setModalOpen(true);
  };

  const handleSave = (data: FormData) => {
    if (editingPage) {
      setPages((pgs) =>
        pgs.map((pg) =>
          pg.id === editingPage.id ? { ...editingPage, ...data } : pg
        )
      );
    } else {
      const newPage: PhishingPage = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPages((pgs) => [...pgs, newPage]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this page? This action cannot be undone."
      )
    ) {
      setPages((pgs) => pgs.filter((pg) => pg.id !== id));
      if (editingPage?.id === id) {
        setModalOpen(false);
      }
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Phishing Pages</h1>
        <button
          onClick={openNewModal}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="inline w-5 h-5 mr-1" /> New Page
        </button>
      </div>

      {/* Page List */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-4">
        <div className="mb-4 relative">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pages..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-foreground/40" />
        </div>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="p-3 rounded-lg border border-border bg-background dark:bg-card hover:border-primary cursor-pointer transition-all group"
              onClick={() => openEditModal(page)}
            >
              <div className="flex justify-between items-start">
                <p className="font-semibold text-foreground dark:text-card-foreground truncate">
                  {page.name}
                </p>
                <button
                  className="text-destructive/70 hover:text-destructive transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(page.id);
                  }}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-foreground/60 dark:text-card-foreground/75 block truncate">
                {page.description}
              </p>
            </div>
          ))}
          {filteredPages.length === 0 && (
            <p className="text-center text-foreground/50 dark:text-card-foreground/60 py-8">
              No pages found.
            </p>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card text-foreground max-w-4xl w-full rounded-lg shadow-2xl border border-border max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-xl font-semibold">
                {editingPage ? "Edit Phishing Page" : "Create Phishing Page"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-foreground/60 hover:text-destructive"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(handleSave)}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className={`w-full px-3 py-2 bg-input dark:bg-card border ${errors.name ? "border-destructive" : "border-border"} rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground dark:text-card-foreground`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <input
                    {...register("description")}
                    className="w-full px-3 py-2 bg-input dark:bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground dark:text-card-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Redirect URL</label>
                <input
                  {...register("redirectUrl", {
                    validate: (value) =>
                      !value || validateUrl(value) || "Must be a valid https:// URL",
                  })}
                  className={`w-full px-3 py-2 bg-input dark:bg-card border ${errors.redirectUrl ? "border-destructive" : "border-border"} rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground dark:text-card-foreground`}
                  placeholder="https://your-awareness-training.com"
                />
                {errors.redirectUrl && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.redirectUrl.message}
                  </p>
                )}
              </div>
              <div className="flex gap-6 pt-2">
                <label className="inline-flex items-center font-medium">
                  <input
                    type="checkbox"
                    {...register("captureCredentials")}
                    className="accent-primary w-4 h-4 mr-2"
                  />
                  Capture Credentials
                </label>
                <label className="inline-flex items-center font-medium">
                  <input
                    type="checkbox"
                    {...register("capturePassword")}
                    className="accent-primary w-4 h-4 mr-2"
                  />
                  Capture Password
                </label>
              </div>

              {/* Editor/Preview Tabs */}
              <div className="flex border-b border-border">
                <button
                  type="button"
                  className={`px-4 py-2 font-medium ${
                    activeTab === "editor"
                      ? "border-b-2 border-primary text-primary"
                      : "text-foreground/60 dark:text-card-foreground/60"
                  }`}
                  onClick={() => setActiveTab("editor")}
                >
                  Editor
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 font-medium ${
                    activeTab === "preview"
                      ? "border-b-2 border-primary text-primary"
                      : "text-foreground/60 dark:text-card-foreground/60"
                  }`}
                  onClick={() => setActiveTab("preview")}
                >
                  Preview
                </button>
              </div>

              {activeTab === "editor" && (
                <div className="mt-2">
                  <Controller
                    name="body"
                    control={control}
                    rules={{ required: "HTML body cannot be empty" }}
                    render={({ field }) => (
                      <div className="h-80 border border-border rounded-lg overflow-hidden">
                        <Editor
                          height="100%"
                          language="html"
                          value={field.value}
                          onChange={field.onChange}
                          theme="vs-dark"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: "on",
                          }}
                        />
                      </div>
                    )}
                  />
                  {errors.body && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.body.message}
                    </p>
                  )}
                </div>
              )}

              {activeTab === "preview" && (
                <Controller
                  name="body"
                  control={control}
                  render={({ field }) => (
                    <div className="mt-2 border border-border bg-white dark:bg-zinc-800 rounded-lg p-4 min-h-[320px]">
                      <iframe
                        srcDoc={field.value || ""}
                        title="preview"
                        className="w-full h-full min-h-[300px] border-0"
                        sandbox="allow-scripts allow-forms"
                      />
                    </div>
                  )}
                />
              )}

              <div className="flex justify-end pt-4 gap-3 border-t border-border">
                <button
                  type="button"
                  className="px-5 py-2 border border-border rounded-lg hover:bg-accent bg-input dark:bg-card text-foreground dark:text-card-foreground"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90 flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingPage ? "Update" : "Create"} Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
