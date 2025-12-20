# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe Checkout for testing payments on the subscription page.

## 🎯 What is Stripe?

Stripe is a payment processing platform that allows you to accept payments online. For testing purposes, Stripe provides **test mode** where you can use test card numbers that don't charge real money.

## 📋 Prerequisites

1. A Stripe account (free to sign up at https://stripe.com)
2. Access to Stripe Dashboard

## 🔑 Step 1: Get Your Stripe Test Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`) - used on frontend (optional for this setup)
   - **Secret key** (starts with `sk_test_...`) - used on backend (required)

3. Copy your **Secret key** - you'll need this for the backend

## ⚙️ Step 2: Add Stripe Keys to Backend

1. Navigate to the `backend` folder
2. Create a `.env` file if it doesn't exist (or add to existing one)
3. Add your Stripe secret key:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- Use `sk_test_...` for test mode (doesn't charge real money)
- Never commit your `.env` file to git
- The `.env` file should be in `.gitignore`

## 🧪 Step 3: Test the Integration

### Test Card Numbers (No Real Charges)

Stripe provides test card numbers that work in test mode:

**Success Cards:**
- `4242 4242 4242 4242` - Visa (most common for testing)
- `5555 5555 5555 4444` - Mastercard
- `3782 822463 10005` - American Express

**Use any:**
- Future expiration date (e.g., 12/25)
- Any 3-digit CVC
- Any ZIP code

**Decline Cards (to test error handling):**
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

### Testing Flow

1. Start your backend server: `npm start` (in backend folder)
2. Start your frontend: `npm start` (in frontend folder)
3. Log in to your application
4. Navigate to the Subscription page
5. Click "Subscribe" on any plan
6. You'll be redirected to Stripe Checkout
7. Use a test card number (e.g., `4242 4242 4242 4242`)
8. Complete the payment
9. You'll be redirected back to the success page
10. Your subscription will be activated!

## 🔍 Verifying Payments in Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/payments
2. You'll see all test payments listed
3. Click on any payment to see details
4. These are test payments - no real money is charged

## 🚨 Troubleshooting

### Error: "Stripe is not configured"
- Make sure you've added `STRIPE_SECRET_KEY` to your `.env` file
- Restart your backend server after adding the key
- Check that the key starts with `sk_test_`

### Error: "Failed to create checkout session"
- Verify your Stripe secret key is correct
- Check backend console for detailed error messages
- Make sure you're using test keys, not live keys

### Payment succeeds but subscription not activated
- Check backend console for errors
- Verify the success callback is being called
- Check MongoDB to see if subscription was updated

## 📚 Additional Resources

- [Stripe Test Cards Documentation](https://stripe.com/docs/testing)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)

## 🔒 Security Notes

- **Never** use live keys (`sk_live_...`) for testing
- Always keep your secret keys secure
- Never expose secret keys in frontend code
- Use environment variables for all sensitive keys
- Test mode is completely free - no charges will occur

## ✅ Summary

1. Sign up for Stripe account (free)
2. Get test secret key from Stripe Dashboard
3. Add `STRIPE_SECRET_KEY=sk_test_...` to `backend/.env`
4. Restart backend server
5. Test with card number `4242 4242 4242 4242`
6. Enjoy testing payments without real charges! 🎉

