import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import {
  getBadges,
  checkBadges,
  markBadgeSeen,
} from '../controllers/badge.controller';

const router = Router();

router.get('/', verifyToken, getBadges);
router.post('/check', verifyToken, checkBadges);
router.put('/:slug/seen', verifyToken, markBadgeSeen);

export default router;
