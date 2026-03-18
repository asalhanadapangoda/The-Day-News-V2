import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
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
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ArticleCategory',
    },
    tags: [
      {
        type: String,
      },
    ],
    author: {
      type: String,
      required: true,
      default: 'The Day News Global',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    viewCount: {
      type: Number,
      default: 0,
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

const Article = mongoose.model('Article', articleSchema);

export default Article;
