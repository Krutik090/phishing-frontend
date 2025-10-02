import {
  Shield, BarChart2, Mail, FileText, Users, Send, Wifi, UserCheck, BookOpen, PenSquare, Settings
} from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: BarChart2,
  },
  {
    title: 'Campaigns',
    href: '/campaigns',
    icon: Shield,
  },
  {
    title: 'Email Templates',
    href: '/templates',
    icon: Mail,
  },
  {
    title: 'Landing Pages',
    href: '/pages',
    icon: FileText,
  },
  {
    title: 'Users & Groups',
    href: '/user-groups',
    icon: Users,
  },
  {
    title: 'Sending Profiles',
    href: '/profiles',
    icon: Send,
  },
  {
    title: 'IMAP',
    href: '/imap',
    icon: Wifi,
  },
  {
    title: 'User Management',
    href: '/management',
    icon: UserCheck,
  },
  {
    title: 'Training',
    href: '/training',
    icon: BookOpen,
  },
  {
    title: 'Quiz',
    href: '/quiz',
    icon: PenSquare,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];