export type ProjectStatus = 'connected' | 'pending' | 'disabled' | 'disconnected';

export interface Project {
  id: string;
  name: string;
  domain: string;
  status: ProjectStatus;
  lastUpdated: string;
  projectKey?: string;
}

export type ActionType = 'hide' | 'show' | 'opacity' | 'display' | 'add_text' | 'replace_text' | 'text' | 'replace' | 'html' | 'class' | 'style';

export interface ControlRule {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  path: string;
  selector: string;
  action: ActionType;
  value?: string;
  enabled: boolean;
  lastUpdated: string;
}

export type BannerPosition = 'top' | 'bottom' | 'modal' | 'inline';

export interface Banner {
  id: string;
  name: string;
  message: string;
  position: BannerPosition | 'top' | 'bottom';
  targetPage: string;
  enabled: boolean;
  projectId: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'rule' | 'banner' | 'system';
}
