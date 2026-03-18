import SiteSetting from '../models/SiteSetting.js';

// @desc    Fetch site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne({});
    if (!settings) {
      // Return defaults if none found (fallback)
      settings = new SiteSetting({});
    }
    
    // Attempt to populate featuredHeroId based on the model if dynamic
    if (settings.featuredHeroId && settings.featuredHeroModel) {
      await settings.populate('featuredHeroId', 'title slug excerpt description coverImage featuredImage videoUrl');
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res) => {
  try {
    const { 
      siteName, 
      logoUrl, 
      footerText, 
      contactEmail, 
      contactPhone, 
      contactAddress,
      socialLinks,
      featuredHeroType,
      featuredHeroId,
      featuredHeroModel,
      featuredHeroTitle,
      featuredHeroDescription,
      featuredHeroImage,
      featuredHeroLink,
      aboutUsText
    } = req.body;

    let settings = await SiteSetting.findOne({});
    if (!settings) {
      settings = new SiteSetting({});
    }

    settings.siteName = siteName || settings.siteName;
    settings.logoUrl = logoUrl || settings.logoUrl;
    settings.footerText = footerText || settings.footerText;
    settings.contactEmail = contactEmail || settings.contactEmail;
    settings.contactPhone = contactPhone !== undefined ? contactPhone : settings.contactPhone;
    settings.contactAddress = contactAddress !== undefined ? contactAddress : settings.contactAddress;
    settings.socialLinks = socialLinks || settings.socialLinks;
    
    settings.featuredHeroType = featuredHeroType || settings.featuredHeroType;
    settings.featuredHeroId = featuredHeroId !== undefined ? featuredHeroId : settings.featuredHeroId;
    settings.featuredHeroModel = featuredHeroModel !== undefined ? featuredHeroModel : settings.featuredHeroModel;
    settings.featuredHeroTitle = featuredHeroTitle !== undefined ? featuredHeroTitle : settings.featuredHeroTitle;
    settings.featuredHeroDescription = featuredHeroDescription !== undefined ? featuredHeroDescription : settings.featuredHeroDescription;
    settings.featuredHeroImage = featuredHeroImage !== undefined ? featuredHeroImage : settings.featuredHeroImage;
    settings.featuredHeroLink = featuredHeroLink !== undefined ? featuredHeroLink : settings.featuredHeroLink;
    
    settings.aboutUsText = aboutUsText !== undefined ? aboutUsText : settings.aboutUsText;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getSettings, updateSettings };
