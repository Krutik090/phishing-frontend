import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Archive, Trash2, Users, Calendar, Folder } from 'lucide-react';
import { mockProjects } from '../components/project/mockProjectData';
import { ProjectOverview } from '../components/project/ProjectOverview';
import { ProjectCampaigns } from '../components/project/ProjectCampaigns';
import { ProjectAnalytics } from '../components/project/ProjectAnalytics';
import { ProjectReports } from '../components/project/ProjectReports';
import { ManageUsersModal } from '../components/project/ManageUsersModal';

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showManageUsers, setShowManageUsers] = useState(false);

  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="p-6">
        <p className="text-foreground/60">Project not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'Archived':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="w-full px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <Folder className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
              <p className="text-foreground/60 mb-3">{project.description}</p>
              <div className="flex items-center gap-4 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString()} -{' '}
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{project.assignedUsers.length} users assigned</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <button
              onClick={() => navigate(`/projects/edit/${project.id}`)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-5 h-5 text-foreground/70" />
            </button>
            <button
              onClick={() => alert('Archive project')}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Archive"
            >
              <Archive className="w-5 h-5 text-foreground/70" />
            </button>
            <button
              onClick={() => alert('Delete project')}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-destructive" />
            </button>
          </div>
        </div>

        {/* Assigned Users Avatars */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground/70">Team:</span>
          <div className="flex items-center -space-x-2">
            {project.assignedUsers.slice(0, 5).map((user, idx) => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xs border-2 border-card"
                title={user.name}
              >
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
            ))}
            {project.assignedUsers.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-foreground font-semibold text-xs border-2 border-card">
                +{project.assignedUsers.length - 5}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowManageUsers(true)}
            className="text-sm text-primary hover:underline font-medium"
          >
            Manage Users
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-6">
          {['overview', 'campaigns', 'analytics', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <ProjectOverview project={project} />}
      {activeTab === 'campaigns' && <ProjectCampaigns campaigns={project.campaigns} />}
      {activeTab === 'analytics' && <ProjectAnalytics project={project} />}
      {activeTab === 'reports' && <ProjectReports project={project} />}

      {/* Manage Users Modal */}
      {showManageUsers && (
        <ManageUsersModal
          project={project}
          onClose={() => setShowManageUsers(false)}
        />
      )}
    </div>
  );
}
