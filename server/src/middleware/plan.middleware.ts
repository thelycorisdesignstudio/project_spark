import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import Subscription from '../models/Subscription';

export const requirePlan = (...plans: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Find subscription for the user or their parent
      const subscription = await Subscription.findOne({
        $or: [
          { parentId: userId },
        ],
      });

      const currentPlan = subscription?.plan || 'free';

      if (!plans.includes(currentPlan) && !plans.includes('free')) {
        res.status(403).json({
          error: 'Upgrade required',
          currentPlan,
          requiredPlans: plans,
        });
        return;
      }

      next();
    } catch {
      res.status(500).json({ error: 'Failed to verify subscription' });
    }
  };
};
