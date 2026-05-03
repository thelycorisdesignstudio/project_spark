import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import {
  getProgress,
  getWorldProgress,
  completeStage,
  completeMission,
  completeWorld,
} from '../controllers/progress.controller';

const router = Router();

router.get('/', verifyToken, getProgress);
router.get('/world/:worldId', verifyToken, getWorldProgress);
router.post('/stage/complete', verifyToken, completeStage);
router.post('/mission/complete', verifyToken, completeMission);
router.post('/world/complete', verifyToken, completeWorld);

export default router;
