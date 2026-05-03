import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import {
  createCheckout,
  createPortal,
  handleWebhook,
  getSubscription,
} from '../controllers/stripe.controller';

const router = Router();

router.post('/checkout', verifyToken, createCheckout);
router.post('/portal', verifyToken, createPortal);
router.post('/webhook', handleWebhook); // No auth — uses Stripe signature verification
router.get('/subscription', verifyToken, getSubscription);

export default router;
