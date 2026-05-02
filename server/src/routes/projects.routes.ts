import { Router } from 'express';
import { Project } from '../models/Project.js';
import { Control } from '../models/Control.js';
import { Banner } from '../models/Banner.js';
import { RuntimeEvent } from '../models/RuntimeEvent.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { httpError } from '../utils/httpError.js';
import { createProjectKey } from '../utils/ids.js';
import { env } from '../config/env.js';
import { normalizeDomain, uniqueDomains } from '../utils/runtime.js';

const router = Router();

router.use(requireAuth);

const serializeProject = (project) => ({
  id: String(project._id),
  name: project.name,
  domain: project.domain,
  allowedDomains: project.allowedDomains,
  projectKey: project.projectKey,
  status: project.status,
  lastSeenAt: project.lastSeenAt,
  install: {
    cdn: `<script src="${env.runtimeCdnUrl}" data-project-id="${project.projectKey}" async></script>`,
    npm: `import { init } from '@viewcontrol/runtime';\n\ninit({ projectId: '${project.projectKey}', apiUrl: '${env.publicApiUrl}' });`,
  },
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

router.get('/', asyncHandler(async (req, res) => {
  const projects = await Project.find({ ownerId: req.user._id }).sort({ createdAt: -1 }).lean();

  res.json({ ok: true, data: { projects: projects.map(serializeProject) } });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name, domain, allowedDomains = [] } = req.body || {};

  if (!name || !domain) {
    throw httpError(400, 'Project name and domain are required.', 'INVALID_PROJECT_INPUT');
  }

  const normalizedDomain = normalizeDomain(domain);
  const normalizedAllowedDomains = uniqueDomains([normalizedDomain, ...allowedDomains]);

  const project = await Project.create({
    ownerId: req.user._id,
    name,
    domain: normalizedDomain,
    allowedDomains: normalizedAllowedDomains,
    projectKey: createProjectKey(),
  });

  res.status(201).json({ ok: true, data: { project: serializeProject(project) } });
}));

router.get('/:projectId', asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, ownerId: req.user._id });

  if (!project) {
    throw httpError(404, 'Project not found.', 'PROJECT_NOT_FOUND');
  }

  res.json({ ok: true, data: { project: serializeProject(project) } });
}));

router.delete('/:projectId', asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.projectId, ownerId: req.user._id });

  if (!project) {
    throw httpError(404, 'Project not found.', 'PROJECT_NOT_FOUND');
  }

  await Promise.all([
    Control.deleteMany({ projectId: project._id }),
    Banner.deleteMany({ projectId: project._id }),
    RuntimeEvent.deleteMany({ projectId: project._id }),
  ]);

  res.json({ ok: true, data: { deleted: true } });
}));

export default router;
