import { Router } from 'express';
import { authRateLimiter } from '../middleware/rateLimit.middleware';
import {
  register,
  login,
  refresh,
  logout,
  googleAuth,
  childLogin,
  childLookup,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', verifyToken, logout);
router.post('/google', googleAuth);
router.post('/child/login', authRateLimiter, childLogin);
router.post('/child/lookup', authRateLimiter, childLookup);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);
router.get('/me', verifyToken, getMe);

export default router;
