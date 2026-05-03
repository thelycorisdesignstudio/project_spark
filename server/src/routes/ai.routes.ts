import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimit.middleware';
import { contentFilterMiddleware } from '../middleware/contentFilter.middleware';
import {
  chat,
  getHint,
  getChatHistory,
  clearChatHistory,
} from '../controllers/ai.controller';

const router = Router();

router.post('/chat', verifyToken, aiRateLimiter, contentFilterMiddleware, chat);
router.post('/hint', verifyToken, aiRateLimiter, getHint);
router.get('/history/:sessionId', verifyToken, getChatHistory);
router.delete('/history/:sessionId', verifyToken, clearChatHistory);

export default router;
