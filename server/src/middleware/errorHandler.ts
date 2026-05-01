import type { HttpError } from '../utils/httpError.js';

export const notFound = (req, res) => {
  res.status(404).json({
    ok: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
};

export const errorHandler = (err: HttpError, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || err.status || 500;
  const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');

  if (status >= 500) {
    console.error('[api] request failed', err);
  }

  res.status(status).json({
    ok: false,
    error: {
      code,
      message: status >= 500 ? 'Something went wrong.' : err.message,
    },
  });
};
