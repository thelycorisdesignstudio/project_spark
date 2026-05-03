import { Response } from 'express';
import { z } from 'zod';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateShareSlug } from '../utils/slug.utils';
import { uploadThumbnail as uploadThumbnailToBlob } from '../services/blob.service';

const createProjectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  language: z.enum(['html', 'python']).default('html'),
  files: z.object({
    html: z.string().optional(),
    css: z.string().optional(),
    js: z.string().optional(),
    python: z.string().optional(),
  }).optional(),
  missionRef: z.object({
    worldId: z.number(),
    missionId: z.number(),
  }).optional(),
});

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const childId = req.user?.profileId || req.user?.userId;
    const projects = await Project.find({ childId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments({ childId });

    res.json({ projects, total, page, pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createProjectSchema.parse(req.body);
    const childId = req.user?.profileId || req.user?.userId;

    const project = await Project.create({ ...data, childId });
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.issues });
      return;
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch {
    res.status(500).json({ error: 'Failed to get project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId || req.user?.userId;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, childId },
      { $set: req.body },
      { new: true }
    );
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId || req.user?.userId;
    const project = await Project.findOneAndDelete({ _id: req.params.id, childId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ message: 'Project deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const publishProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId || req.user?.userId;
    const project = await Project.findOne({ _id: req.params.id, childId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const isPublic = !project.isPublic;
    const shareSlug = isPublic && !project.shareSlug ? generateShareSlug() : project.shareSlug;

    project.isPublic = isPublic;
    project.shareSlug = shareSlug;
    await project.save();

    res.json({ isPublic, shareSlug });
  } catch {
    res.status(500).json({ error: 'Failed to publish project' });
  }
};

export const getPublicProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ shareSlug: req.params.slug, isPublic: true });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch {
    res.status(500).json({ error: 'Failed to get project' });
  }
};

export const uploadThumbnail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Expect raw buffer from multipart upload
    if (!req.body || !Buffer.isBuffer(req.body)) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }
    const url = await uploadThumbnailToBlob(req.body, req.headers['content-type'] || 'image/png');
    await Project.findByIdAndUpdate(req.params.id, { thumbnailUrl: url });
    res.json({ thumbnailUrl: url });
  } catch {
    res.status(500).json({ error: 'Failed to upload thumbnail' });
  }
};
