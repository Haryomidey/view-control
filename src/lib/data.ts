import { Project, ControlRule, Banner } from '../types';

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Main Application',
    domain: 'app.viewcontrol.dev',
    status: 'connected',
    lastUpdated: '2024-03-20T14:30:00Z',
  },
  {
    id: 'p2',
    name: 'Marketing Site',
    domain: 'viewcontrol.dev',
    status: 'connected',
    lastUpdated: '2024-03-19T10:15:00Z',
  },
  {
    id: 'p3',
    name: 'Documentation',
    domain: 'docs.viewcontrol.dev',
    status: 'disconnected',
    lastUpdated: '2024-03-15T08:00:00Z',
  },
];

export const rules: ControlRule[] = [
  {
    id: 'r1',
    name: 'Hide Beta Tag',
    projectId: 'p1',
    projectName: 'Main Application',
    path: '/dashboard',
    selector: '.beta-badge',
    action: 'hide',
    enabled: true,
    lastUpdated: '2 hours ago',
  },
  {
    id: 'r2',
    name: 'Update Hero Title',
    projectId: 'p2',
    projectName: 'Marketing Site',
    path: '/',
    selector: '#hero-title',
    action: 'replace_text',
    value: 'Control your web presence instantly.',
    enabled: true,
    lastUpdated: '5 hours ago',
  },
  {
    id: 'r3',
    name: 'Dim Secondary CTA',
    projectId: 'p2',
    projectName: 'Marketing Site',
    path: '/pricing',
    selector: '.secondary-cta',
    action: 'opacity',
    value: '0.5',
    enabled: false,
    lastUpdated: '1 day ago',
  },
];

export const banners: Banner[] = [
  {
    id: 'b1',
    name: 'Maintenance Notice',
    message: 'We will be undergoing maintenance on Sunday at 2 AM UTC.',
    position: 'top',
    targetPage: '*',
    enabled: true,
    projectId: 'p1',
  },
  {
    id: 'b2',
    name: 'Spring Sale',
    message: 'Get 20% off all annual plans with code SPRING20',
    position: 'bottom',
    targetPage: '/pricing',
    enabled: false,
    projectId: 'p2',
  },
];
