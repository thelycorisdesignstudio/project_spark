import { Router } from 'express';
import { verifyToken, requireParent } from '../middleware/auth.middleware';
import {
  getOverview,
  getChildStats,
  getChildActivity,
  getChildProjects,
  generateReport,
} from '../controllers/parent.controller';

const router = Router();

router.get('/overview', verifyToken, requireParent, getOverview);
router.get('/child/:childId/stats', verifyToken, requireParent, getChildStats);
router.get('/child/:childId/activity', verifyToken, requireParent, getChildActivity);
router.get('/child/:childId/projects', verifyToken, requireParent, getChildProjects);
router.post('/report/:childId', verifyToken, requireParent, generateReport);

export default router;
