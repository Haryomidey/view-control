import { Router } from 'express';
import type { Request } from 'express';
import type { HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, type IUser } from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimiter.js';
import { httpError } from '../utils/httpError.js';
import { env } from '../config/env.js';

const router = Router();

const signToken = (user: HydratedDocument<IUser>) => {
  return jwt.sign({ sub: String(user._id), email: user.email }, env.jwtSecret, { expiresIn: '7d' });
};

const loginRateLimit = rateLimit({
  windowMs: 15 * 60_000,
  max: 5,
  keyGenerator: (req: Request) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    return `${req.ip}:login:${email || 'unknown'}`;
  },
  message: 'Too many login attempts. Please wait a few minutes and try again.',
});

router.post('/signup', rateLimit({ max: 20 }), asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password || password.length < 8) {
    throw httpError(400, 'Name, email, and a password of at least 8 characters are required.', 'INVALID_AUTH_INPUT');
  }

  const existingUser = await User.findOne({ email: String(email).toLowerCase() });

  if (existingUser) {
    throw httpError(409, 'An account already exists for this email.', 'EMAIL_EXISTS');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json({
    ok: true,
    data: {
      token: signToken(user),
      user: { id: String(user._id), name: user.name, email: user.email },
    },
  });
}));

router.post('/login', loginRateLimit, asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw httpError(400, 'Email and password are required.', 'INVALID_AUTH_INPUT');
  }

  const user = await User.findOne({ email: String(email).toLowerCase() });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw httpError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
  }

  res.json({
    ok: true,
    data: {
      token: signToken(user),
      user: { id: String(user._id), name: user.name, email: user.email },
    },
  });
}));

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = req.user!;

  res.json({
    ok: true,
    data: { user: { id: String(user._id), name: user.name, email: user.email } },
  });
}));

export default router;