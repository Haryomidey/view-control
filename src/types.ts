export type ProjectStatus = 'connected' | 'disconnected';

export interface Project {
  id: string;
  name: string;
  domain: string;
  status: ProjectStatus;
  lastUpdated: string;
}

export type ActionType = 'hide' | 'show' | 'opacity' | 'display' | 'add_text' | 'replace_text';

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
  position: BannerPosition;
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