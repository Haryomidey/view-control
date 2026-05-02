import { Router } from 'express';
import { Banner } from '../models/Banner.js';
import { Project } from '../models/Project.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

router.use(requireAuth);

interface BannerDocumentLike {
  _id: unknown;
  projectId: unknown;
  message: string;
  tone: string;
  position: string;
  pathPattern: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const serialize = (banner: BannerDocumentLike) => ({
  id: String(banner._id),
  projectId: String(banner.projectId),
  message: banner.message,
  tone: banner.tone,
  position: banner.position,
  pathPattern: banner.pathPattern,
  isActive: banner.isActive,
  createdAt: banner.createdAt,
  updatedAt: banner.updatedAt,
});

router.get('/', asyncHandler(async (req, res) => {
  const user = req.user!;
  const query: Record<string, unknown> = { ownerId: user._id };

  if (req.query.projectId) {
    query.projectId = req.query.projectId;
  }

  const banners = await Banner.find(query).sort({ createdAt: -1 });

  res.json({ ok: true, data: { banners: banners.map(serialize) } });
}));

router.post('/', asyncHandler(async (req, res) => {
  const user = req.user!;
  const { projectId, message, tone = 'neutral', position = 'top', pathPattern = '*', isActive = true } = req.body || {};

  if (!projectId || !message) {
    throw httpError(400, 'Project and message are required.', 'INVALID_BANNER_INPUT');
  }

  const project = await Project.findOne({ _id: projectId, ownerId: user._id });

  if (!project) {
    throw httpError(404, 'Project not found.', 'PROJECT_NOT_FOUND');
  }

  const banner = await Banner.create({
    ownerId: user._id,
    projectId,
    message,
    tone,
    position,
    pathPattern,
    isActive,
  });

  res.status(201).json({ ok: true, data: { banner: serialize(banner) } });
}));

router.patch('/:bannerId', asyncHandler(async (req, res) => {
  const user = req.user!;
  const banner = await Banner.findOneAndUpdate(
    { _id: req.params.bannerId, ownerId: user._id },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!banner) {
    throw httpError(404, 'Banner not found.', 'BANNER_NOT_FOUND');
  }

  res.json({ ok: true, data: { banner: serialize(banner) } });
}));

router.delete('/:bannerId', asyncHandler(async (req, res) => {
  const user = req.user!;
  const banner = await Banner.findOneAndDelete({ _id: req.params.bannerId, ownerId: user._id });

  if (!banner) {
    throw httpError(404, 'Banner not found.', 'BANNER_NOT_FOUND');
  }

  res.json({ ok: true, data: { deleted: true } });
}));

export default router;