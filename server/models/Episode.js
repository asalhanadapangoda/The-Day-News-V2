import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Program',
    },
    thumbnailImage: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true, // This can be an external embed link like YouTube
    },
    duration: {
      type: String, // e.g., '24:00'
    },
    episodeNumber: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Episode = mongoose.model('Episode', episodeSchema);

export default Episode;
