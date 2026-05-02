type ControlAction = 'hide' | 'show' | 'text' | 'replace' | 'html' | 'opacity' | 'display' | 'class' | 'style';
type BannerTone = 'neutral' | 'success' | 'warning' | 'critical';
type BannerPosition = 'top' | 'bottom';
type RuntimeEventType = 'load' | 'apply' | 'error';

export interface RuntimeOptions {
  projectId: string;
  apiUrl?: string;
  pollInterval?: number;
  debug?: boolean;
}

export interface RuntimeControl {
  id: string;
  name: string;
  selector: string;
  pathPattern?: string;
  action: ControlAction;
  value?: unknown;
  priority?: number;
}

export interface RuntimeBanner {
  id: string;
  message: string;
  tone?: BannerTone;
  position?: BannerPosition;
  pathPattern?: string;
}

interface RuntimeConfigResponse {
  ok: boolean;
  data?: {
    project: {
      id: string;
      projectKey: string;
      status: string;
    };
    controls: RuntimeControl[];
    banners: RuntimeBanner[];
    fetchedAt: string;
  };
  error?: {
    message: string;
  };
}

type RuntimeProject = NonNullable<RuntimeConfigResponse['data']>['project'];

interface ElementSnapshot {
  display: string;
  visibility: string;
  opacity: string;
  text: string | null;
  html: string;
  className: string;
}

type ControlledElement = HTMLElement & {
  __vcOriginal?: ElementSnapshot;
};

declare global {
  interface Window {
    ViewControl?: {
      init: typeof init;
      Runtime: typeof Runtime;
    };
    __VIEWCONTROL_RUNTIME__?: Runtime;
  }
}

const DEFAULT_API_URL = 'http://localhost:4000';
const STYLE_ID = 'viewcontrol-runtime-styles';

const normalizeApiUrl = (apiUrl: string) => apiUrl.replace(/\/$/, '');

const getCurrentScriptOptions = (): Partial<RuntimeOptions> => {
  const script =
    (document.currentScript instanceof HTMLScriptElement ? document.currentScript : null) ||
    document.querySelector<HTMLScriptElement>('script[data-project-id]');

  if (!script) {
    return {};
  }

  const pollInterval = Number(script.getAttribute('data-poll-interval') || 0);
  const apiUrl = script.getAttribute('data-api-url') || inferApiUrlFromScript(script);

  return {
    projectId: script.getAttribute('data-project-id') || '',
    apiUrl,
    pollInterval: Number.isFinite(pollInterval) ? pollInterval : undefined,
    debug: script.getAttribute('data-debug') === 'true',
  };
};

const inferApiUrlFromScript = (script: HTMLScriptElement) => {
  if (!script.src) {
    return undefined;
  }

  try {
    return new URL(script.src, window.location.href).origin;
  } catch {
    return undefined;
  }
};

const pathMatches = (pattern = '*', pathname = window.location.pathname) => {
  if (!pattern || pattern === '*') {
    return true;
  }

  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');

  return new RegExp(`^${escaped}$`).test(pathname || '/');
};

const ensureStyles = () => {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = [
    '.vc-banner{position:fixed;left:0;right:0;z-index:2147483000;padding:12px 18px;font:500 14px/1.4 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:center;color:#fff;background:#111;box-shadow:0 8px 30px rgba(0,0,0,.18)}',
    '.vc-banner[data-position="top"]{top:0}',
    '.vc-banner[data-position="bottom"]{bottom:0}',
    '.vc-banner[data-tone="success"]{background:#15803d}',
    '.vc-banner[data-tone="warning"]{background:#b45309}',
    '.vc-banner[data-tone="critical"]{background:#b91c1c}',
  ].join('');
  document.head.appendChild(style);
};

const rememberOriginal = (element: ControlledElement) => {
  if (element.__vcOriginal) {
    return;
  }

  element.__vcOriginal = {
    display: element.style.display,
    visibility: element.style.visibility,
    opacity: element.style.opacity,
    text: element.textContent,
    html: element.innerHTML,
    className: element.className,
  };
};

const applyStyle = (element: HTMLElement, value: unknown) => {
  if (!value || typeof value !== 'object') {
    return;
  }

  Object.entries(value as Record<string, string>).forEach(([name, cssValue]) => {
    element.style.setProperty(name, cssValue);
  });
};

const applyClassChange = (element: HTMLElement, value: unknown) => {
  if (!value || typeof value !== 'object') {
    return;
  }

  const classValue = value as { add?: string; remove?: string };

  classValue.add?.split(/\s+/).forEach((name) => {
    if (name) element.classList.add(name);
  });

  classValue.remove?.split(/\s+/).forEach((name) => {
    if (name) element.classList.remove(name);
  });
};

const applyControl = (control: RuntimeControl) => {
  if (!pathMatches(control.pathPattern)) {
    return 0;
  }

  let elements: ControlledElement[] = [];

  try {
    elements = Array.from(document.querySelectorAll<ControlledElement>(control.selector));
  } catch {
    return 0;
  }

  elements.forEach((element) => {
    rememberOriginal(element);
    element.setAttribute('data-vc-control', control.id);

    switch (control.action) {
      case 'hide':
        element.style.display = 'none';
        break;
      case 'show':
        element.style.display = element.__vcOriginal?.display || '';
        element.style.visibility = 'visible';
        break;
      case 'text':
      case 'replace':
        element.textContent = control.value == null ? '' : String(control.value);
        break;
      case 'html':
        element.innerHTML = control.value == null ? '' : String(control.value);
        break;
      case 'opacity':
        element.style.opacity = String(control.value ?? 1);
        break;
      case 'display':
        element.style.display = String(control.value || '');
        break;
      case 'class':
        applyClassChange(element, control.value);
        break;
      case 'style':
        applyStyle(element, control.value);
        break;
    }
  });

  return elements.length;
};

const applyBanner = (banner: RuntimeBanner) => {
  if (!pathMatches(banner.pathPattern)) {
    return 0;
  }

  ensureStyles();

  const id = `vc-banner-${banner.id}`;
  let element = document.getElementById(id);

  if (!element) {
    element = document.createElement('div');
    element.id = id;
    element.className = 'vc-banner';
    document.body.appendChild(element);
  }

  element.textContent = banner.message;
  element.setAttribute('data-tone', banner.tone || 'neutral');
  element.setAttribute('data-position', banner.position || 'top');

  return 1;
};

export class Runtime {
  private readonly options: Required<RuntimeOptions>;
  private controls: RuntimeControl[] = [];
  private banners: RuntimeBanner[] = [];
  private project: RuntimeProject | null = null;
  private timer: number | null = null;
  private observer: MutationObserver | null = null;
  private isApplying = false;

  constructor(options: RuntimeOptions) {
    this.options = {
      apiUrl: DEFAULT_API_URL,
      pollInterval: 30000,
      debug: false,
      ...options,
    };
  }

  private log(message: string, payload?: unknown) {
    if (this.options.debug) {
      console.log('[ViewControl]', message, payload ?? '');
    }
  }

  private report(type: RuntimeEventType, payload: Record<string, unknown>) {
    const body = {
      projectId: this.project?.id,
      projectKey: this.options.projectId,
      type,
      url: window.location.href,
      payload,
    };

    fetch(`${normalizeApiUrl(this.options.apiUrl)}/api/runtime/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => undefined);
  }

  async fetchConfig() {
    const params = new URLSearchParams({
      projectId: this.options.projectId,
      url: window.location.href,
      ts: String(Date.now()),
    });

    const response = await fetch(`${normalizeApiUrl(this.options.apiUrl)}/api/runtime/config?${params.toString()}`, {
      method: 'GET',
      credentials: 'omit',
      cache: 'no-store',
    });
    const payload = (await response.json().catch(() => ({}))) as RuntimeConfigResponse;

    if (!response.ok || !payload.ok || !payload.data) {
      throw new Error(payload.error?.message || 'Unable to load ViewControl config.');
    }

    this.project = payload.data.project;
    this.controls = payload.data.controls || [];
    this.banners = payload.data.banners || [];
    this.report('load', { controls: this.controls.length, banners: this.banners.length });
    this.log('config loaded', { controls: this.controls.length, banners: this.banners.length });

    return payload.data;
  }

  apply() {
    if (this.isApplying) {
      return;
    }

    this.isApplying = true;

    try {
      const controlCount = this.controls.reduce((count, control) => count + applyControl(control), 0);
      const bannerCount = this.banners.reduce((count, banner) => count + applyBanner(banner), 0);
      this.report('apply', { applied: controlCount + bannerCount });
      this.log('rules applied', { controls: controlCount, banners: bannerCount });
    } finally {
      this.isApplying = false;
    }
  }

  observe() {
    if (this.observer || !window.MutationObserver) {
      return;
    }

    let pending = false;
    this.observer = new MutationObserver(() => {
      if (pending) {
        return;
      }

      pending = true;
      window.setTimeout(() => {
        pending = false;
        this.apply();
      }, 80);
    });
    this.observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  startPolling() {
    if (!this.options.pollInterval || this.options.pollInterval < 5000 || this.timer) {
      return;
    }

    this.timer = window.setInterval(() => {
      this.fetchConfig()
        .then(() => this.apply())
        .catch((error: Error) => this.report('error', { message: error.message }));
    }, this.options.pollInterval);
  }

  async start() {
    if (!this.options.projectId) {
      throw new Error('ViewControl projectId is required.');
    }

    try {
      await this.fetchConfig();
      this.apply();
      this.observe();
      this.startPolling();
      return this;
    } catch (error) {
      this.report('error', { message: error instanceof Error ? error.message : 'Runtime failed to start.' });
      throw error;
    }
  }

  stop() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

export const init = (options: RuntimeOptions) => {
  const runtime = new Runtime(options);
  window.__VIEWCONTROL_RUNTIME__ = runtime;
  runtime.start().catch(() => undefined);
  return runtime;
};

if (typeof window !== 'undefined') {
  window.ViewControl = { init, Runtime };

  const scriptOptions = typeof document !== 'undefined' ? getCurrentScriptOptions() : {};

  if (scriptOptions.projectId && !window.__VIEWCONTROL_RUNTIME__) {
    const start = () => init(scriptOptions as RuntimeOptions);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
      start();
    }
  }
}