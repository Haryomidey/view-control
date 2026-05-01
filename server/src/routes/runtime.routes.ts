import { Router } from 'express';
import { Project } from '../models/Project.js';
import { Control } from '../models/Control.js';
import { Banner } from '../models/Banner.js';
import { RuntimeEvent } from '../models/RuntimeEvent.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { rateLimit } from '../middleware/rateLimiter.js';
import { httpError } from '../utils/httpError.js';
import { isDomainAllowed, serializeBanner, serializeControl } from '../utils/runtime.js';

const router = Router();

router.get('/config', rateLimit({ max: 600 }), asyncHandler(async (req, res) => {
  const projectKey = req.query.projectId || req.query.projectKey;
  const pageUrl = req.query.url || req.headers.origin || '';

  if (!projectKey) {
    throw httpError(400, 'projectId is required.', 'MISSING_PROJECT_ID');
  }

  const project = await Project.findOne({ projectKey, status: { $ne: 'disabled' } });

  if (!project) {
    throw httpError(404, 'Project not found.', 'PROJECT_NOT_FOUND');
  }

  if (!isDomainAllowed(project, pageUrl)) {
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

  if (!type) {
    throw httpError(400, 'Event type is required.', 'INVALID_RUNTIME_EVENT');
  }

  await RuntimeEvent.create({
    projectId: projectId || undefined,
    projectKey,
    type,
    url,
    payload,
    userAgent: req.headers['user-agent'],
  });

  res.status(202).json({ ok: true, data: { accepted: true } });
}));

export default router;
