import {
  LayoutDashboard,
  Rocket,
  FolderKanban,
  Mail,
  Globe,
  Users,
  Send,
  Inbox,
  BookOpen,
  GraduationCap,
  Settings,
  UserCog,
} from 'lucide-react';

export interface NavItem {
  title: string;
  icon: any;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// Main navigation items (for sidebar and header)
export const navGroups: NavGroup[] = [
  // Standalone items (no dropdown)
  {
    title: '',
    items: [
      { title: 'Dashboard', icon: LayoutDashboard, href: '/' },
      { title: 'Campaigns', icon: Rocket, href: '/campaigns' },
      { title: 'Projects', icon: FolderKanban, href: '/projects' },

    ],
  },
  // Phishing Operations dropdown
  {
    title: 'Operations',
    items: [
      { title: 'Email Templates', icon: Mail, href: '/templates' },
      { title: 'Phishing Pages', icon: Globe, href: '/phishing-pages' },
      { title: 'Target Groups', icon: Users, href: '/user-groups' },
      { title: 'Sending Profiles', icon: Send, href: '/profiles' },
      { title: 'IMAP', icon: Inbox, href: '/imap' },
    ],
  },
  // Training dropdown
  {
    title: 'Learning',
    items: [
      { title: 'Training Modules', icon: BookOpen, href: '/training' },
      { title: 'Quiz', icon: GraduationCap, href: '/quiz' },
    ],
  },
];

// Flat list for sidebar (backwards compatibility)
export const navItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { title: 'Campaigns', icon: Rocket, href: '/campaigns' },
  { title: 'Projects', icon: FolderKanban, href: '/projects' },
  { title: 'Email Templates', icon: Mail, href: '/templates' },
  { title: 'Phishing Pages', icon: Globe, href: '/phishing-pages' },
  { title: 'Target Groups', icon: Users, href: '/user-groups' },
  { title: 'Sending Profiles', icon: Send, href: '/profiles' },
  { title: 'IMAP', icon: Inbox, href: '/imap' },
  { title: 'Training', icon: BookOpen, href: '/training' },
  { title: 'Quiz', icon: GraduationCap, href: '/quiz' },
  { title: 'User Management', icon: UserCog, href: '/user-management' },
  { title: 'Settings', icon: Settings, href: '/settings' },
];
