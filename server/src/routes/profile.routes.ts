import { Router } from 'express';
import { verifyToken, requireParent, requireChild } from '../middleware/auth.middleware';
import {
  getMyProfile,
  updateMyProfile,
  createChildProfile,
  getChildProfiles,
  getChildProfile,
  updateChildProfile,
  deleteChildProfile,
} from '../controllers/profile.controller';

const router = Router();

router.get('/me', verifyToken, getMyProfile);
router.put('/me', verifyToken, updateMyProfile);
router.post('/child', verifyToken, requireParent, createChildProfile);
router.get('/children', verifyToken, requireParent, getChildProfiles);
router.get('/child/:childId', verifyToken, requireParent, getChildProfile);
router.put('/child/:childId', verifyToken, requireParent, updateChildProfile);
router.delete('/child/:childId', verifyToken, requireParent, deleteChildProfile);

export default router;
