import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Plus, Trash, Upload, Eye, X, Save, Search } from 'lucide-react';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  envelopeSender: string;
  description: string;
  html: string;
  text: string;
  attachments: File[];
  createdAt: string;
}

export function EmailTemplate() {
  // Templates state (local storage)
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to our platform!',
      envelopeSender: 'noreply@company.com',
      description: 'Standard welcome message',
      html: '<h1>Welcome!</h1><p>We are glad to have you on board.</p>',
      text: 'Welcome! We are glad to have you on board.',
      attachments: [],
      createdAt: '2025-10-04',
    },
  ]);

  // Form state
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      subject: '',
      envelopeSender: '',
      description: '',
      html: '<p>Start composing your HTML email here...</p>',
      text: '',
    },
  });

  // UI state
  const [tab, setTab] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [importOpen, setImportOpen] = useState(false);
  const [rawEmail, setRawEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Watch form values
  const html = watch('html');
  const text = watch('text');

  // Filtered templates for search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Drag & Drop for attachments
  const onDrop = (acceptedFiles: File[]) => {
    setAttachments(prev => [...prev, ...acceptedFiles]);
    alert(`${acceptedFiles.length} file(s) added!`);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
    alert('Attachment removed!');
  };

  // RFC-822 Import
  const handleImportRFC822 = () => {
    try {
      const from = /From:\s*(.+)/i.exec(rawEmail)?.[1]?.trim() ?? '';
      const subject = /Subject:\s*(.+)/i.exec(rawEmail)?.[1]?.trim() ?? '';
      const textBody = /Content-Type:\s*text\/plain[^]*?\n\n([\s\S]*?)(?=\n--|\nContent-Type:|$)/i.exec(rawEmail)?.[1]?.trim() ?? '';
      const htmlBody = /Content-Type:\s*text\/html[^]*?\n\n([\s\S]*?)(?=\n--|\nContent-Type:|$)/i.exec(rawEmail)?.[1]?.trim() ?? '';

      setValue('envelopeSender', from);
      setValue('subject', subject);
      setValue('text', textBody);
      setValue('html', htmlBody);
      setImportOpen(false);
      setRawEmail('');
      alert('Email imported successfully!');
    } catch {
      alert('Could not parse RFC-822 content. Please check the format.');
    }
  };

  // Preview handler: HTML > Text
  const handlePreview = () => {
    const htmlContent = (html || '').trim();
    const textContent = (text || '').trim();
    let emailHtml = '';
    
    if (htmlContent && htmlContent !== '<p>Start composing your HTML email here...</p>' && htmlContent !== '<p></p>') {
      emailHtml = htmlContent;
    } else if (textContent) {
      emailHtml = `<pre style="white-space:pre-line;font-family:inherit;">${textContent}</pre>`;
    } else {
      emailHtml = '<i>No email content to preview.</i>';
    }

    const preview = window.open('', '_blank', 'width=900,height=700');
    if (preview) {
      preview.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Email Preview</title>
            <style>
              body { font-family: Arial, sans-serif; background: #fff; padding: 40px; line-height: 1.6; }
            </style>
          </head>
          <body>${emailHtml}</body>
        </html>
      `);
      preview.document.close();
    }
  };

  // Edit template
  const editTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setValue('name', template.name);
    setValue('subject', template.subject);
    setValue('envelopeSender', template.envelopeSender);
    setValue('description', template.description);
    setValue('html', template.html);
    setValue('text', template.text);
    setAttachments(template.attachments);
    setTab(0);
  };

  // Delete template
  const deleteTemplate = (id: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      if (selectedTemplate?.id === id) {
        resetForm();
      }
      alert('Template deleted!');
    }
  };

  // Reset form
  const resetForm = () => {
    reset();
    setAttachments([]);
    setSelectedTemplate(null);
    setIsEditing(false);
    setImportOpen(false);
    setRawEmail('');
    setTab(0);
  };

  // Save template (local state only)
  const onSubmit = (data: any) => {
    if (isEditing && selectedTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, ...data, attachments, createdAt: new Date().toISOString().split('T')[0] }
          : t
      ));
      alert('Template updated successfully!');
    } else {
      // Create new template
      const newTemplate: EmailTemplate = {
        id: Date.now(),
        ...data,
        attachments,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTemplates(prev => [...prev, newTemplate]);
      alert('Template created successfully!');
    }
    resetForm();
  };

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Email Templates</h1>
        <button
          onClick={resetForm}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="inline w-5 h-5 mr-2" />
          New Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-1 bg-white dark:bg-card border border-border rounded-xl shadow-sm p-4">
          <div className="mb-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border dark:bg-card dark:border-border dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:border-primary dark:text-card-foreground text-foreground'
                }`}
                onClick={() => editTemplate(template)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold truncate ${
                    selectedTemplate?.id === template.id 
                      ? 'text-primary-foreground' 
                      : 'dark:text-white text-gray-900'
                  }`}>
                    {template.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template.id);
                    }}
                    className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
                <p className={`text-xs truncate ${
                  selectedTemplate?.id === template.id 
                    ? 'text-primary-foreground opacity-75' 
                    : 'dark:text-gray-300 text-gray-600'
                }`}>
                  {template.subject}
                </p>
                <p className={`text-xs mt-1 ${
                  selectedTemplate?.id === template.id 
                    ? 'text-primary-foreground opacity-50' 
                    : 'dark:text-gray-400 text-gray-500'
                }`}>
                  {template.createdAt}
                </p>
              </div>
            ))}
            {filteredTemplates.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No templates found</p>
            )}
          </div>
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2 bg-white dark:bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isEditing ? 'Edit Template' : 'Create Template'}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImportOpen(!importOpen)}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-card-foreground/10 transition-colors"
              >
                <Upload className="inline w-4 h-4 mr-2" />
                Import RFC-822
              </button>
              <button
                type="button"
                onClick={handlePreview}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-card-foreground/10 transition-colors"
              >
                <Eye className="inline w-4 h-4 mr-2" />
                Preview
              </button>
            </div>
          </div>

          {/* RFC-822 Import Modal */}
          {importOpen && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-foreground">Import Raw Email (RFC-822)</h3>
                <button onClick={() => setImportOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={rawEmail}
                onChange={(e) => setRawEmail(e.target.value)}
                rows={8}
                className="w-full border rounded-md px-3 py-2 dark:bg-card dark:border-border dark:text-card-foreground font-mono"
                placeholder="Paste RFC-822 email here..."
              />
              <button
                onClick={handleImportRFC822}
                className="mt-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-colors"
              >
                Import
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-foreground">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className={`w-full border rounded-md px-4 py-2 dark:bg-card dark:border-border dark:text-card-foreground ${
                    errors.name ? 'border-red-600' : 'border-border'
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Template name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium text-foreground">
                  Subject <span className="text-red-600">*</span>
                </label>
                <input
                  {...register('subject', { required: 'Subject is required' })}
                  className={`w-full border rounded-md px-4 py-2 dark:bg-card dark:border-border dark:text-card-foreground ${
                    errors.subject ? 'border-red-600' : 'border-border'
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Email subject"
                />
                {errors.subject && (
                  <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-foreground">
                  Envelope Sender
                </label>
                <input
                  {...register('envelopeSender')}
                  className="w-full border rounded-md px-4 py-2 dark:bg-card dark:border-border dark:text-card-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="from@example.com"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-foreground">
                  Description
                </label>
                <input
                  {...register('description')}
                  className="w-full border rounded-md px-4 py-2 dark:bg-card dark:border-border dark:text-card-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Brief description"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setTab(0)}
                className={`px-4 py-2 font-medium ${
                  tab === 0 ? 'border-b-2 border-primary text-primary' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                HTML Content
              </button>
              <button
                type="button"
                onClick={() => setTab(1)}
                className={`px-4 py-2 font-medium ${
                  tab === 1 ? 'border-b-2 border-primary text-primary' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Plain Text
              </button>
              <button
                type="button"
                onClick={() => setTab(2)}
                className={`px-4 py-2 font-medium ${
                  tab === 2 ? 'border-b-2 border-primary text-primary' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Attachments
              </button>
            </div>

            {/* Tab Content */}
            {tab === 0 && (
              <div>
                <label className="block mb-1 font-medium text-foreground">
                  HTML Email
                </label>
                <textarea
                  {...register('html')}
                  rows={12}
                  className="w-full border border-border rounded-lg p-3 resize-y font-mono dark:bg-card dark:border-border dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter HTML email content..."
                />
              </div>
            )}

            {tab === 1 && (
              <div>
                <label className="block mb-1 font-medium text-foreground">
                  Plain Text Email
                </label>
                <textarea
                  {...register('text')}
                  rows={10}
                  className="w-full border border-border rounded-lg p-3 resize-y dark:bg-card dark:border-border dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter plain text email content..."
                />
              </div>
            )}

            {tab === 2 && (
              <div>
                <label className="block mb-1 font-medium text-foreground">
                  Attachments (Max 10MB each)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                    isDragActive ? 'border-primary bg-primary/10' : 'border-border'
                  } transition-colors`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Drag & drop files or click to select
                  </p>
                </div>
                {attachments.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {attachments.map((file, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center p-2 bg-card rounded border border-border"
                      >
                        <span className="text-sm truncate text-foreground">
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-card-foreground/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Save className="inline w-5 h-5 mr-2" />
                {isEditing ? 'Update Template' : 'Create Template'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
