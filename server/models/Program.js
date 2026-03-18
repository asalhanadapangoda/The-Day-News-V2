import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    logoImage: {
      type: String,
    },
    posterImage: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Program = mongoose.model('Program', programSchema);

export default Program;
