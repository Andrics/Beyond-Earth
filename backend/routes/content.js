const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get premium content (requires active subscription)
router.get('/premium', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if subscription is active
    if (!user.subscription.isActive || new Date() > user.subscription.endDate) {
      return res.status(403).json({ 
        message: 'Active subscription required to access premium content' 
      });
    }

    // Premium content
    const premiumContent = {
      videos: [
        {
          id: 1,
          title: 'Journey Through the Milky Way',
          description: 'High-quality 4K video of our galaxy',
          thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
          url: 'https://example.com/videos/milky-way.mp4'
        },
        {
          id: 2,
          title: 'Mars Surface Exploration',
          description: 'Exclusive footage from Mars surface',
          thumbnail: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800',
          url: 'https://example.com/videos/mars-surface.mp4'
        },
        {
          id: 3,
          title: 'Saturn\'s Rings Up Close',
          description: 'Stunning views of Saturn\'s rings',
          thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800',
          url: 'https://example.com/videos/saturn-rings.mp4'
        }
      ],
      images: [
        {
          id: 1,
          title: 'Nebula NGC 6302',
          description: 'Rare high-resolution image of the Butterfly Nebula',
          url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200'
        },
        {
          id: 2,
          title: 'Jupiter\'s Great Red Spot',
          description: 'Detailed view of Jupiter\'s famous storm',
          url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200'
        },
        {
          id: 3,
          title: 'Andromeda Galaxy',
          description: 'Our nearest galactic neighbor in stunning detail',
          url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200'
        }
      ],
      facts: [
        {
          id: 1,
          title: 'Black Holes',
          content: 'A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon.'
        },
        {
          id: 2,
          title: 'Mars Distance',
          content: 'Mars is approximately 225 million kilometers away from Earth at its closest approach, which occurs every 26 months.'
        },
        {
          id: 3,
          title: 'The Speed of Light',
          content: 'Light travels at 299,792,458 meters per second in a vacuum. It takes about 8 minutes and 20 seconds for light from the Sun to reach Earth.'
        }
      ],
      documentaries: [
        {
          id: 1,
          title: 'The Search for Life Beyond Earth',
          description: 'Exploring the possibility of life on other planets',
          duration: '45 minutes',
          thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800'
        },
        {
          id: 2,
          title: 'Colonizing Mars: The Future',
          description: 'A deep dive into Mars colonization plans',
          duration: '60 minutes',
          thumbnail: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800'
        }
      ]
    };

    res.json(premiumContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public content (no subscription required)
router.get('/public', async (req, res) => {
  try {
    const publicContent = {
      images: [
        {
          id: 1,
          title: 'Earth from Space',
          url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800'
        },
        {
          id: 2,
          title: 'The Moon',
          url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800'
        }
      ],
      facts: [
        {
          id: 1,
          title: 'Our Solar System',
          content: 'The solar system consists of the Sun and eight planets, along with numerous moons, asteroids, and comets.'
        }
      ]
    };

    res.json(publicContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

