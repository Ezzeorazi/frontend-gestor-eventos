import rateLimit from 'express-rate-limit';

export const limitByIp = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Too many requests from this IP',
});

export const limitByTenant = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  keyGenerator: (req) => req.empresaId || req.ip,
  message: 'Too many requests for this tenant',
});

export default { limitByIp, limitByTenant };
