import { Router } from 'express';
import type { Request } from 'express';
import { Project } from '../models/Project.js';
import { Control } from '../models/Control.js';
import { Banner } from '../models/Banner.js';
import { RuntimeEvent } from '../models/RuntimeEvent.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { rateLimit } from '../middleware/rateLimiter.js';
import { httpError } from '../utils/httpError.js';
import { isDomainAllowed, serializeBanner, serializeControl } from '../utils/runtime.js';
import { env } from '../config/env.js';

const router = Router();
const runtimeEventTypes = new Set(['load', 'apply', 'error']);

const getRequestSource = (req: Request, fallbackUrl = '') => {
  return req.headers.origin || req.headers.referer || (env.nodeEnv === 'production' ? '' : fallbackUrl) || '';
};

router.get('/config', rateLimit({ max: 600 }), asyncHandler(async (req, res) => {
  const projectKey = req.query.projectId || req.query.projectKey;
  const pageUrl = String(req.query.url || '');

  if (!projectKey) {
    throw httpError(400, 'projectId is required.', 'MISSING_PROJECT_ID');
  }

  const project = await Project.findOne({ projectKey, status: { $ne: 'disabled' } });

  if (!project) {
    throw httpError(404, 'Project not found.', 'PROJECT_NOT_FOUND');
  }

  if (!isDomainAllowed(project, getRequestSource(req, pageUrl))) {
    throw httpError(403, 'This domain is not allowed for the project.', 'DOMAIN_NOT_ALLOWED');
  }

  if (project.status !== 'connected') {
    project.status = 'connected';
  }

  project.lastSeenAt = new Date();
  await project.save();

  const [controls, banners] = await Promise.all([
    Control.find({ projectId: project._id, isActive: true }).sort({ priority: 1, createdAt: 1 }).lean(),
    Banner.find({ projectId: project._id, isActive: true }).sort({ createdAt: -1 }).lean(),
  ]);

  res.set('Cache-Control', 'no-store');
  res.json({
    ok: true,
    data: {
      project: {
        id: String(project._id),
        projectKey: project.projectKey,
        status: project.status,
      },
      controls: controls.map(serializeControl),
      banners: banners.map(serializeBanner),
      fetchedAt: new Date().toISOString(),
    },
  });
}));

router.post('/events', rateLimit({ max: 1000 }), asyncHandler(async (req, res) => {
  const { projectId, projectKey, type, url, payload } = req.body || {};

  if (!runtimeEventTypes.has(type)) {
    throw httpError(400, 'Event type is required.', 'INVALID_RUNTIME_EVENT');
  }

  if (!projectKey && !projectId) {
    throw httpError(400, 'Project key is required.', 'MISSING_PROJECT_ID');
  }

  const project = projectKey
    ? await Project.findOne({ projectKey, status: { $ne: 'disabled' } })
    : await Project.findOne({ _id: projectId, status: { $ne: 'disabled' } });

  if (!project) {
    throw httpError(404, 'Project not found.', 'PROJECT_NOT_FOUND');
  }

  if (!isDomainAllowed(project, getRequestSource(req, url))) {
    throw httpError(403, 'This domain is not allowed for the project.', 'DOMAIN_NOT_ALLOWED');
  }

  await RuntimeEvent.create({
    projectId: project._id,
    projectKey: project.projectKey,
    type,
    url,
    payload,
    userAgent: req.headers['user-agent'],
  });

  res.status(202).json({ ok: true, data: { accepted: true } });
}));

export default router;