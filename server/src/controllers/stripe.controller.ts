import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getStripe } from '../config/stripe';
import Subscription from '../models/Subscription';

export const createCheckout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stripe = getStripe();
    const { plan } = req.body;

    const priceId = plan === 'pro'
      ? process.env.STRIPE_PRO_PRICE_ID
      : process.env.STRIPE_FAMILY_PRICE_ID;

    if (!priceId) {
      res.status(400).json({ error: 'Invalid plan' });
      return;
    }

    const sub = await Subscription.findOne({ parentId: req.user?.userId });
    if (!sub) {
      res.status(404).json({ error: 'No subscription record found' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      customer: sub.stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/settings?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/settings?cancelled=true`,
      subscription_data: {
        trial_period_days: 7,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const createPortal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stripe = getStripe();
    const sub = await Subscription.findOne({ parentId: req.user?.userId });
    if (!sub) {
      res.status(404).json({ error: 'No subscription found' });
      return;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/settings`,
    });

    res.json({ url: session.url });
  } catch {
    res.status(500).json({ error: 'Failed to create portal session' });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'] as string;
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      res.status(500).json({ error: 'Webhook secret not configured' });
      return;
    }

    const event = stripe.webhooks.constructEvent(req.body, sig, secret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const plan = subscription.items?.data?.[0]?.price?.id === process.env.STRIPE_FAMILY_PRICE_ID
          ? 'family' : 'pro';

        await Subscription.findOneAndUpdate(
          { stripeCustomerId: subscription.customer },
          {
            stripeSubscriptionId: subscription.id,
            plan,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            childSlots: plan === 'family' ? 3 : 1,
          }
        );
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await Subscription.findOneAndUpdate(
          { stripeCustomerId: subscription.customer },
          { plan: 'free', status: 'cancelled', childSlots: 1 }
        );
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        await Subscription.findOneAndUpdate(
          { stripeCustomerId: invoice.customer },
          { status: 'past_due' }
        );
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
};

export const getSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sub = await Subscription.findOne({ parentId: req.user?.userId });
    res.json(sub || { plan: 'free', status: 'active', childSlots: 1 });
  } catch {
    res.status(500).json({ error: 'Failed to get subscription' });
  }
};
