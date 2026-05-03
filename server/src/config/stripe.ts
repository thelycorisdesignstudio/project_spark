import Stripe from 'stripe';

let stripeInstance: InstanceType<typeof Stripe> | null = null;

export const getStripe = (): InstanceType<typeof Stripe> => {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
};
