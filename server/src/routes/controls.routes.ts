import { Router } from 'express';
import { Control } from '../models/Control.js';
import { Project } from '../models/Project.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

router.use(requireAuth);

interface ControlDocumentLike {
  _id: unknown;
  projectId: unknown;
  name: string;
  selector: string;
  pathPattern: string;
  action: string;
  value?: unknown;
  priority: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const serialize = (control: ControlDocumentLike) => ({
  id: String(control._id),
  projectId: String(control.projectId),
  name: control.name,
  selector: control.selector,
  pathPattern: control.pathPattern,
  action: control.action,
  value: control.value,
  priority: control.priority,
  isActive: control.isActive,
  createdAt: control.createdAt,
  updatedAt: control.updatedAt,
});

const ensureProjectAccess = async (ownerId: unknown, projectId: unknown) => {
  const project = await Project.findOne({ _id: projectId, ownerId });

  if (!project) {
    throw httpError(404, 'Project not found.', 'PROJECT_NOT_FOUND');
  }

  return project;
};

router.get('/', asyncHandler(async (req, res) => {
  const user = req.user!;
  const query: Record<string, unknown> = { ownerId: user._id };

  if (req.query.projectId) {
    query.projectId = req.query.projectId;
  }

  const controls = await Control.find(query).sort({ priority: 1, createdAt: -1 });

  res.json({ ok: true, data: { controls: controls.map(serialize) } });
}));

router.post('/', asyncHandler(async (req, res) => {
  const user = req.user!;
  const { projectId, name, selector, action, value = null, pathPattern = '*', priority = 100, isActive = true } = req.body || {};

  if (!projectId || !name || !selector || !action) {
    throw httpError(400, 'Project, name, selector, and action are required.', 'INVALID_CONTROL_INPUT');
  }

  await ensureProjectAccess(user._id, projectId);

  const control = await Control.create({
    ownerId: user._id,
    projectId,
    name,
    selector,
    action,
    value,
    pathPattern,
    priority,
    isActive,
  });

  res.status(201).json({ ok: true, data: { control: serialize(control) } });
}));

router.patch('/:controlId', asyncHandler(async (req, res) => {
  const user = req.user!;
  const control = await Control.findOneAndUpdate(
    { _id: req.params.controlId, ownerId: user._id },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!control) {
    throw httpError(404, 'Control not found.', 'CONTROL_NOT_FOUND');
  }

  res.json({ ok: true, data: { control: serialize(control) } });
}));

router.delete('/:controlId', asyncHandler(async (req, res) => {
  const user = req.user!;
  const control = await Control.findOneAndDelete({ _id: req.params.controlId, ownerId: user._id });

  if (!control) {
    throw httpError(404, 'Control not found.', 'CONTROL_NOT_FOUND');
  }

  res.json({ ok: true, data: { deleted: true } });
}));

export default router;