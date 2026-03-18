import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      default: 'The Day News Global',
    },
    logoUrl: {
      type: String,
    },
    footerText: {
      type: String,
      default: '© 2026 The Day News Global. All rights reserved.',
    },
    contactEmail: {
      type: String,
      default: 'contact@thedaynewsglobal.com',
    },
    contactPhone: {
      type: String,
    },
    contactAddress: {
      type: String,
    },
    socialLinks: {
      facebook: String,
      linkedin: String,
      instagram: String,
      youtube: String,
    },
    // Allows admin to choose what is featured on the homepage hero area
    featuredHeroType: {
      type: String,
      enum: ['program', 'episode', 'article', 'custom'],
      default: 'custom',
    },
    featuredHeroId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'featuredHeroModel', // Dynamic reference based on featuredHeroType
    },
    featuredHeroModel: {
      type: String,
      enum: ['Program', 'Episode', 'Article', 'ContactMessage'], // ContactMessage is filler, usually not used
    },
    featuredHeroTitle: {
      type: String,
    },
    featuredHeroDescription: {
      type: String,
    },
    featuredHeroImage: {
      type: String,
    },
    featuredHeroLink: {
      type: String,
    },
    aboutUsText: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// We should only ever have one settings document
const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);

export default SiteSetting;
