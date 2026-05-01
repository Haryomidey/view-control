import crypto from 'crypto';

export const createProjectKey = () => `vc_${crypto.randomBytes(12).toString('hex')}`;