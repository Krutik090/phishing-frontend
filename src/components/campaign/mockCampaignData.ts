export interface CampaignResult {
  id: string;
  name: string;
  launchDate: string;
  status: 'Active' | 'Completed' | 'Scheduled';
  totalTargets: number;
  sent: number;
  opened: number;
  clicked: number;
  submitted: number;
  trained: number;
  trainingCompleted: number;
}

export interface Target {
  id: string;
  name: string;
  email: string;
  status: 'Sent' | 'Opened' | 'Clicked' | 'Submitted' | 'Trained';
  eventCount: number;
  lastInteraction: string;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  type: 'sent' | 'opened' | 'clicked' | 'submitted' | 'training_started' | 'training_completed';
  timestamp: string;
  details?: string;
}

export const mockCampaigns: CampaignResult[] = [
  {
    id: '1',
    name: 'Q4 Security Awareness Campaign',
    launchDate: '2025-10-01T09:00:00',
    status: 'Active',
    totalTargets: 250,
    sent: 250,
    opened: 187,
    clicked: 92,
    submitted: 34,
    trained: 156,
    trainingCompleted: 142,
  },
  {
    id: '2',
    name: 'Executive Phishing Test',
    launchDate: '2025-09-15T10:30:00',
    status: 'Completed',
    totalTargets: 45,
    sent: 45,
    opened: 41,
    clicked: 18,
    submitted: 7,
    trained: 38,
    trainingCompleted: 35,
  },
  {
    id: '3',
    name: 'Holiday Season Security Training',
    launchDate: '2025-10-15T08:00:00',
    status: 'Scheduled',
    totalTargets: 500,
    sent: 0,
    opened: 0,
    clicked: 0,
    submitted: 0,
    trained: 0,
    trainingCompleted: 0,
  },
];

export const mockTargets: Target[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    status: 'Trained',
    eventCount: 6,
    lastInteraction: '2025-10-05T10:50:00',
    events: [
      { type: 'sent', timestamp: '2025-10-05T10:32:00' },
      { type: 'opened', timestamp: '2025-10-05T10:35:00' },
      { type: 'clicked', timestamp: '2025-10-05T10:36:00', details: 'Clicked malicious link' },
      { type: 'submitted', timestamp: '2025-10-05T10:37:00', details: 'Entered credentials' },
      { type: 'training_started', timestamp: '2025-10-05T10:40:00' },
      { type: 'training_completed', timestamp: '2025-10-05T10:50:00' },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    status: 'Opened',
    eventCount: 2,
    lastInteraction: '2025-10-05T11:20:00',
    events: [
      { type: 'sent', timestamp: '2025-10-05T10:32:00' },
      { type: 'opened', timestamp: '2025-10-05T11:20:00' },
    ],
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    status: 'Clicked',
    eventCount: 3,
    lastInteraction: '2025-10-05T12:15:00',
    events: [
      { type: 'sent', timestamp: '2025-10-05T10:32:00' },
      { type: 'opened', timestamp: '2025-10-05T12:10:00' },
      { type: 'clicked', timestamp: '2025-10-05T12:15:00', details: 'Clicked malicious link' },
    ],
  },
];

export const mockChartData = [
  { name: 'Sent', value: 250, color: '#424544' },
  { name: 'Opened', value: 187, color: '#c78554' },
  { name: 'Clicked', value: 92, color: '#da4d3a' },
  { name: 'Submitted', value: 34, color: '#dc2626' },
];

export const mockTimelineData = [
  { date: 'Oct 1', sent: 250, opened: 45, clicked: 12, submitted: 3 },
  { date: 'Oct 2', sent: 0, opened: 89, clicked: 28, submitted: 8 },
  { date: 'Oct 3', sent: 0, opened: 53, clicked: 35, submitted: 12 },
  { date: 'Oct 4', sent: 0, opened: 0, clicked: 17, submitted: 11 },
];
