import Advertisement from '../models/Advertisement.js';

// @desc    Fetch active advertisements
// @route   GET /api/ads
// @access  Public
const getAds = async (req, res) => {
  try {
    const { placement } = req.query;
    let query = { isActive: true };
    const now = new Date();
    
    // Only fetch ads that haven't ended yet (or have no end date)
    query.$or = [{ endDate: { $gte: now } }, { endDate: { $exists: false } }];

    if (placement) {
      query.placement = placement;
    }

    const ads = await Advertisement.find(query);
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch all advertisements (admin)
// @route   GET /api/ads/admin
// @access  Private
const getAdsAdmin = async (req, res) => {
  try {
    const ads = await Advertisement.find({});
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an advertisement
// @route   POST /api/ads
// @access  Private (Admin)
const createAd = async (req, res) => {
  try {
    const { title, imageUrl, linkUrl, placement, isActive, startDate, endDate } = req.body;

    const ad = new Advertisement({
      title,
      imageUrl,
      linkUrl,
      placement,
      isActive,
      startDate,
      endDate,
    });

    const createdAd = await ad.save();
    res.status(201).json(createdAd);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an advertisement
// @route   PUT /api/ads/:id
// @access  Private (Admin)
const updateAd = async (req, res) => {
  try {
    const { title, imageUrl, linkUrl, placement, isActive, startDate, endDate } = req.body;

    const ad = await Advertisement.findById(req.params.id);

    if (ad) {
      ad.title = title || ad.title;
      ad.imageUrl = imageUrl || ad.imageUrl;
      ad.linkUrl = linkUrl !== undefined ? linkUrl : ad.linkUrl;
      ad.placement = placement || ad.placement;
      ad.isActive = isActive !== undefined ? isActive : ad.isActive;
      ad.startDate = startDate || ad.startDate;
      ad.endDate = endDate !== undefined ? endDate : ad.endDate;

      const updatedAd = await ad.save();
      res.json(updatedAd);
    } else {
      res.status(404).json({ message: 'Ad not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an advertisement
// @route   DELETE /api/ads/:id
// @access  Private (Admin)
const deleteAd = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);

    if (ad) {
      await ad.deleteOne();
      res.json({ message: 'Ad removed' });
    } else {
      res.status(404).json({ message: 'Ad not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getAds, getAdsAdmin, createAd, updateAd, deleteAd };
