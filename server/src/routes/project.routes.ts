import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  publishProject,
  getPublicProject,
  uploadThumbnail,
} from '../controllers/project.controller';

const router = Router();

router.get('/', verifyToken, getProjects);
router.post('/', verifyToken, createProject);
router.get('/public/:slug', getPublicProject);
router.get('/:id', verifyToken, getProject);
router.put('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);
router.post('/:id/publish', verifyToken, publishProject);
router.post('/:id/thumbnail', verifyToken, uploadThumbnail);

export default router;
