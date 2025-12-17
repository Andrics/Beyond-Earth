const express = require('express');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { flightDate, additionalActivities, totalPrice } = req.body;

    const booking = new Booking({
      user: req.user._id,
      flightDate: new Date(flightDate),
      additionalActivities: additionalActivities || [],
      totalPrice,
      spaceshipLocation: {
        latitude: 0,
        longitude: 0,
        altitude: 0,
        lastUpdated: new Date()
      }
    });

    await booking.save();
    await booking.populate('user', 'name email');

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking (add activities, update status)
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.body.additionalActivities) {
      booking.additionalActivities = req.body.additionalActivities;
    }
    if (req.body.status) {
      booking.status = req.body.status;
    }
    if (req.body.paymentStatus) {
      booking.paymentStatus = req.body.paymentStatus;
    }
    if (req.body.totalPrice) {
      booking.totalPrice = req.body.totalPrice;
    }
    if (req.body.spaceshipLocation) {
      booking.spaceshipLocation = {
        ...req.body.spaceshipLocation,
        lastUpdated: new Date()
      };
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get next flight countdown based on user's upcoming bookings
router.get('/next-flight/countdown', auth, async (req, res) => {
  try {
    const now = new Date();

    // Find the user's next upcoming booking (excluding cancelled)
    const nextBooking = await Booking.findOne({
      user: req.user._id,
      status: { $ne: 'cancelled' },
      flightDate: { $gte: now }
    }).sort({ flightDate: 1 });

    if (!nextBooking) {
      return res.json({
        nextFlightDate: null,
        countdown: null
      });
    }

    const nextFlight = nextBooking.flightDate;
    const timeLeft = nextFlight - now;

    const countdown = {
      days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((timeLeft % (1000 * 60)) / 1000)
    };

    res.json({
      nextFlightDate: nextFlight,
      countdown
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

