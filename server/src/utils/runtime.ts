type ProjectLike = {
  domain: string;
  allowedDomains?: string[];
};

type ControlLike = {
  _id: unknown;
  name: string;
  selector: string;
  pathPattern?: string;
  action: string;
  value?: unknown;
  priority?: number;
};

type BannerLike = {
  _id: unknown;
  message: string;
  tone?: string;
  position?: string;
  pathPattern?: string;
};

export const normalizeDomain = (value = '') => {
  return String(value)
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .split(':')[0]
    .toLowerCase()
    .trim();
};

export const uniqueDomains = (values: string[] = []) => {
  return Array.from(new Set(values.map(normalizeDomain).filter(Boolean)));
};

export const isDomainAllowed = (project: ProjectLike, originOrUrl = '') => {
  if (!originOrUrl) {
    return false;
  }

  let hostname = '';

  try {
    hostname = new URL(originOrUrl).hostname;
  } catch {
    hostname = normalizeDomain(originOrUrl);
  }

  const normalized = normalizeDomain(hostname);
  const allowed = new Set([project.domain, ...(project.allowedDomains || [])].map(normalizeDomain).filter(Boolean));

  return allowed.has(normalized);
};

export const serializeControl = (control: ControlLike) => ({
  id: String(control._id),
  name: control.name,
  selector: control.selector,
  pathPattern: control.pathPattern,
  action: control.action,
  value: control.value,
  priority: control.priority,
});

export const serializeBanner = (banner: BannerLike) => ({
  id: String(banner._id),
  message: banner.message,
  tone: banner.tone,
  position: banner.position,
  pathPattern: banner.pathPattern,
});