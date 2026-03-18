import Hero from '../models/Hero.js';

// @desc    Fetch active hero slides
// @route   GET /api/heroes
// @access  Public
const getHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find({ isActive: true }).sort('order');
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch all hero slides (admin)
// @route   GET /api/heroes/admin
// @access  Private
const getHeroesAdmin = async (req, res) => {
  try {
    const heroes = await Hero.find({}).sort('order');
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a hero slide
// @route   POST /api/heroes
// @access  Private (Admin)
const createHero = async (req, res) => {
  try {
    const { title, subtitle, imageUrl, linkUrl, order, isActive } = req.body;

    const hero = new Hero({
      title,
      subtitle,
      imageUrl,
      linkUrl,
      order: order || 0,
      isActive,
    });

    const createdHero = await hero.save();
    res.status(201).json(createdHero);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a hero slide
// @route   PUT /api/heroes/:id
// @access  Private (Admin)
const updateHero = async (req, res) => {
  try {
    const { title, subtitle, imageUrl, linkUrl, order, isActive } = req.body;

    const hero = await Hero.findById(req.params.id);

    if (hero) {
      hero.title = title || hero.title;
      hero.subtitle = subtitle !== undefined ? subtitle : hero.subtitle;
      hero.imageUrl = imageUrl || hero.imageUrl;
      hero.linkUrl = linkUrl !== undefined ? linkUrl : hero.linkUrl;
      hero.order = order !== undefined ? order : hero.order;
      hero.isActive = isActive !== undefined ? isActive : hero.isActive;

      const updatedHero = await hero.save();
      res.json(updatedHero);
    } else {
      res.status(404).json({ message: 'Hero not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a hero slide
// @route   DELETE /api/heroes/:id
// @access  Private (Admin)
const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);

    if (hero) {
      await hero.deleteOne();
      res.json({ message: 'Hero removed' });
    } else {
      res.status(404).json({ message: 'Hero not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getHeroes, getHeroesAdmin, createHero, updateHero, deleteHero };
