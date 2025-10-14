export interface LogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  role: 'User' | 'Admin' | 'Superadmin';
  category: 'Login' | 'Campaign' | 'Quiz' | 'Project' | 'System';
  action: string;
  description: string;
  status: 'Success' | 'Failed' | 'Warning';
  relatedEntity?: {
    type: 'Campaign' | 'Project' | 'Quiz';
    id: string;
    name: string;
  };
  ipAddress?: string;
  userAgent?: string;
}

export const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2025-10-14T10:30:00',
    userName: 'John Doe',
    userEmail: 'john.doe@company.com',
    role: 'User',
    category: 'Login',
    action: 'User Login',
    description: 'User logged in successfully from Chrome browser',
    status: 'Success',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
  },
  {
    id: '2',
    timestamp: '2025-10-14T11:15:00',
    userName: 'Sarah Admin',
    userEmail: 'sarah.admin@company.com',
    role: 'Admin',
    category: 'Campaign',
    action: 'Campaign Created',
    description: 'Created new phishing campaign "Q4 Security Test"',
    status: 'Success',
    relatedEntity: {
      type: 'Campaign',
      id: 'c1',
      name: 'Q4 Security Test',
    },
  },
  {
    id: '3',
    timestamp: '2025-10-14T11:45:00',
    userName: 'Mike Johnson',
    userEmail: 'mike.j@company.com',
    role: 'User',
    category: 'Quiz',
    action: 'Quiz Completed',
    description: 'Completed security awareness quiz with score 85%',
    status: 'Success',
    relatedEntity: {
      type: 'Quiz',
      id: 'q1',
      name: 'Phishing Awareness Quiz',
    },
  },
  {
    id: '4',
    timestamp: '2025-10-14T12:00:00',
    userName: 'Alice Wilson',
    userEmail: 'alice.w@company.com',
    role: 'Admin',
    category: 'Project',
    action: 'Project Updated',
    description: 'Updated project "2026 Q1 Training" - Added 5 new users',
    status: 'Success',
    relatedEntity: {
      type: 'Project',
      id: 'p1',
      name: '2026 Q1 Training',
    },
  },
  {
    id: '5',
    timestamp: '2025-10-14T12:30:00',
    userName: 'Bob Smith',
    userEmail: 'bob.smith@company.com',
    role: 'User',
    category: 'Login',
    action: 'Failed Login Attempt',
    description: 'Login failed - Invalid password (3rd attempt)',
    status: 'Failed',
    ipAddress: '192.168.1.212',
  },
  {
    id: '6',
    timestamp: '2025-10-14T13:00:00',
    userName: 'System',
    userEmail: 'system@company.com',
    role: 'Superadmin',
    category: 'System',
    action: 'Database Backup',
    description: 'Automated database backup completed successfully',
    status: 'Success',
  },
  {
    id: '7',
    timestamp: '2025-10-14T13:30:00',
    userName: 'Emma Davis',
    userEmail: 'emma.d@company.com',
    role: 'Admin',
    category: 'Campaign',
    action: 'Campaign Launched',
    description: 'Launched campaign targeting IT department (120 recipients)',
    status: 'Success',
    relatedEntity: {
      type: 'Campaign',
      id: 'c2',
      name: 'IT Security Drill',
    },
  },
  {
    id: '8',
    timestamp: '2025-10-14T14:00:00',
    userName: 'System',
    userEmail: 'system@company.com',
    role: 'Superadmin',
    category: 'System',
    action: 'Email Service Error',
    description: 'SMTP connection timeout - Email service temporarily unavailable',
    status: 'Failed',
  },
  {
    id: '9',
    timestamp: '2025-10-14T14:15:00',
    userName: 'Frank Thomas',
    userEmail: 'frank.t@company.com',
    role: 'User',
    category: 'Quiz',
    action: 'Quiz Started',
    description: 'Started "Advanced Phishing Recognition" quiz',
    status: 'Success',
    relatedEntity: {
      type: 'Quiz',
      id: 'q2',
      name: 'Advanced Phishing Recognition',
    },
  },
  {
    id: '10',
    timestamp: '2025-10-14T14:45:00',
    userName: 'Grace Martinez',
    userEmail: 'grace.m@company.com',
    role: 'Admin',
    category: 'Project',
    action: 'Project Archived',
    description: 'Archived completed project "Q3 2025 Training"',
    status: 'Success',
    relatedEntity: {
      type: 'Project',
      id: 'p2',
      name: 'Q3 2025 Training',
    },
  },
];

// Simulate role-based filtering
export const getLogsForRole = (role: 'User' | 'Admin' | 'Superadmin', userEmail?: string): LogEntry[] => {
  switch (role) {
    case 'User':
      return mockLogs.filter(log => log.userEmail === userEmail);
    case 'Admin':
      return mockLogs.filter(log => log.role === 'User' || log.role === 'Admin');
    case 'Superadmin':
      return mockLogs;
    default:
      return [];
  }
};
