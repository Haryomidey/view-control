import axios, { AxiosError } from 'axios';
import { VIEWCONTROL_API_URL } from './viewcontrol';

export const AUTH_TOKEN_KEY = 'viewcontrol_auth_token';
export const AUTH_USER_KEY = 'viewcontrol_auth_user';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiProject {
  id: string;
  name: string;
  domain: string;
  allowedDomains: string[];
  projectKey: string;
  status: 'connected' | 'pending' | 'disabled';
  lastSeenAt?: string;
  install?: {
    cdn: string;
    npm: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiControl {
  id: string;
  projectId: string;
  name: string;
  selector: string;
  pathPattern: string;
  action: 'hide' | 'show' | 'text' | 'replace' | 'html' | 'opacity' | 'display' | 'class' | 'style';
  value?: unknown;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiBanner {
  id: string;
  projectId: string;
  message: string;
  tone: 'neutral' | 'success' | 'warning' | 'critical';
  position: 'top' | 'bottom';
  pathPattern: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type ApiEnvelope<T> = {
  ok: boolean;
  data: T;
};

export const api = axios.create({
  baseURL: `${VIEWCONTROL_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: { message?: string } }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }

    return Promise.reject(error);
  },
);

const unwrap = <T>(response: { data: ApiEnvelope<T> }) => response.data.data;

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong.') => {
  if (axios.isAxiosError<{ error?: { message?: string } }>(error)) {
    return error.response?.data?.error?.message || error.message || fallback;
  }

  return fallback;
};

export const authApi = {
  async me() {
    const data = unwrap(await api.get<ApiEnvelope<{ user: ApiUser }>>('/auth/me'));
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  async login(input: { email: string; password: string }) {
    const data = unwrap(await api.post<ApiEnvelope<{ token: string; user: ApiUser }>>('/auth/login', input));
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async signup(input: { name: string; email: string; password: string }) {
    const data = unwrap(await api.post<ApiEnvelope<{ token: string; user: ApiUser }>>('/auth/signup', input));
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
};

export const projectsApi = {
  async list() {
    return unwrap(await api.get<ApiEnvelope<{ projects: ApiProject[] }>>('/projects')).projects;
  },

  async create(input: { name: string; domain: string; allowedDomains?: string[] }) {
    return unwrap(await api.post<ApiEnvelope<{ project: ApiProject }>>('/projects', input)).project;
  },

  async remove(projectId: string) {
    return unwrap(await api.delete<ApiEnvelope<{ deleted: boolean }>>(`/projects/${projectId}`));
  },
};

export const controlsApi = {
  async list(projectId?: string) {
    return unwrap(await api.get<ApiEnvelope<{ controls: ApiControl[] }>>('/controls', { params: { projectId } })).controls;
  },

  async create(input: {
    projectId: string;
    name: string;
    selector: string;
    action: ApiControl['action'];
    value?: unknown;
    pathPattern?: string;
    priority?: number;
    isActive?: boolean;
  }) {
    return unwrap(await api.post<ApiEnvelope<{ control: ApiControl }>>('/controls', input)).control;
  },

  async update(controlId: string, input: Partial<ApiControl>) {
    return unwrap(await api.patch<ApiEnvelope<{ control: ApiControl }>>(`/controls/${controlId}`, input)).control;
  },

  async remove(controlId: string) {
    return unwrap(await api.delete<ApiEnvelope<{ deleted: boolean }>>(`/controls/${controlId}`));
  },
};

export const bannersApi = {
  async list(projectId?: string) {
    return unwrap(await api.get<ApiEnvelope<{ banners: ApiBanner[] }>>('/banners', { params: { projectId } })).banners;
  },

  async create(input: {
    projectId: string;
    message: string;
    tone?: ApiBanner['tone'];
    position?: ApiBanner['position'];
    pathPattern?: string;
    isActive?: boolean;
  }) {
    return unwrap(await api.post<ApiEnvelope<{ banner: ApiBanner }>>('/banners', input)).banner;
  },

  async update(bannerId: string, input: Partial<ApiBanner>) {
    return unwrap(await api.patch<ApiEnvelope<{ banner: ApiBanner }>>(`/banners/${bannerId}`, input)).banner;
  },
};