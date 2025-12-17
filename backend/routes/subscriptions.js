const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Subscribe
router.post('/', auth, async (req, res) => {
  try {
    const { plan } = req.body; // 'monthly', 'yearly', 'premium'

    if (!['monthly', 'yearly', 'premium'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    const user = await User.findById(req.user._id);
    const startDate = new Date();
    let endDate = new Date();

    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else if (plan === 'premium') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    user.subscription = {
      plan,
      startDate,
      endDate,
      isActive: true
    };

    await user.save();

    res.json({
      message: 'Subscription activated successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subscription status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if subscription is still active
    if (user.subscription.isActive && new Date() > user.subscription.endDate) {
      user.subscription.isActive = false;
      await user.save();
    }

    res.json(user.subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel subscription
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.subscription = {
      plan: 'none',
      isActive: false
    };
    await user.save();

    res.json({ message: 'Subscription cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

