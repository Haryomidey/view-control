import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Invalid session.' } });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Invalid session.' } });
  }
};
