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

episodeSchema.index({ program: 1, status: 1, publishDate: -1 });

const Episode = mongoose.model('Episode', episodeSchema);

export default Episode;
