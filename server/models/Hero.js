import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Hero = mongoose.model('Hero', heroSchema);

export default Hero;
