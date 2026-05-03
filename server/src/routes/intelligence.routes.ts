import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { requireChild } from '../middleware/auth.middleware';
import {
  getRecommendation,
  getDDAStatus,
  getSkillMap,
  getAnalyticsSummary,
  reportCodeRun,
  reportSessionEnd,
} from '../controllers/intelligence.controller';

const router = Router();

// All routes require child auth
router.use(verifyToken);

// Recommendation: what should the child do next?
router.get('/recommendation', requireChild, getRecommendation);

// DDA: current difficulty assessment
router.get('/dda', requireChild, getDDAStatus);

// Skill map: BKT knowledge state
router.get('/skills', requireChild, getSkillMap);

// Analytics summary for the child
router.get('/analytics/summary', requireChild, getAnalyticsSummary);

// Report a code run (success or error)
router.post('/code-run', requireChild, reportCodeRun);

// Report session end
router.post('/session-end', requireChild, reportSessionEnd);

export default router;
