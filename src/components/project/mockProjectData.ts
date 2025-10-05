export interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  assignedUsers: AssignedUser[];
  campaigns: ProjectCampaign[];
  status: 'Active' | 'Completed' | 'Archived';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface AssignedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface ProjectCampaign {
  id: string;
  name: string;
  launchDate: string;
  status: 'Active' | 'Completed' | 'Scheduled';
  sent: number;
  opened: number;
  clicked: number;
  quizTaken: number;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Phishing 2026 Q1',
    description: 'Comprehensive phishing awareness campaign for Q1 2026',
    createdBy: 'John Admin',
    assignedUsers: [
      { id: '1', name: 'Alice Johnson', email: 'alice@company.com', role: 'Manager' },
      { id: '2', name: 'Bob Smith', email: 'bob@company.com', role: 'Analyst' },
      { id: '3', name: 'Carol Davis', email: 'carol@company.com', role: 'Viewer' },
    ],
    campaigns: [
      {
        id: '1',
        name: 'Executive Phishing Test',
        launchDate: '2026-01-15',
        status: 'Completed',
        sent: 45,
        opened: 41,
        clicked: 18,
        quizTaken: 38,
      },
      {
        id: '2',
        name: 'IT Department Security Drill',
        launchDate: '2026-02-01',
        status: 'Active',
        sent: 120,
        opened: 95,
        clicked: 42,
        quizTaken: 67,
      },
    ],
    status: 'Active',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    createdAt: '2025-12-15',
  },
  {
    id: '2',
    name: 'Annual Security Training 2025',
    description: 'Year-end security awareness program',
    createdBy: 'Sarah Admin',
    assignedUsers: [
      { id: '4', name: 'David Lee', email: 'david@company.com', role: 'Manager' },
      { id: '5', name: 'Emma Wilson', email: 'emma@company.com', role: 'Analyst' },
    ],
    campaigns: [
      {
        id: '3',
        name: 'Holiday Scam Awareness',
        launchDate: '2025-12-01',
        status: 'Completed',
        sent: 300,
        opened: 267,
        clicked: 89,
        quizTaken: 245,
      },
    ],
    status: 'Completed',
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    createdAt: '2025-10-20',
  },
  {
    id: '3',
    name: 'Q2 2026 Penetration Testing',
    description: 'Advanced phishing simulation for Q2',
    createdBy: 'Mike Security',
    assignedUsers: [
      { id: '6', name: 'Frank Thomas', email: 'frank@company.com', role: 'Manager' },
    ],
    campaigns: [],
    status: 'Archived',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    createdAt: '2025-12-01',
  },
];

export const mockUsers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@company.com', role: 'Manager' },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com', role: 'Analyst' },
  { id: '3', name: 'Carol Davis', email: 'carol@company.com', role: 'Viewer' },
  { id: '4', name: 'David Lee', email: 'david@company.com', role: 'Manager' },
  { id: '5', name: 'Emma Wilson', email: 'emma@company.com', role: 'Analyst' },
  { id: '6', name: 'Frank Thomas', email: 'frank@company.com', role: 'Manager' },
  { id: '7', name: 'Grace Martinez', email: 'grace@company.com', role: 'Viewer' },
  { id: '8', name: 'Henry Brown', email: 'henry@company.com', role: 'Analyst' },
];
