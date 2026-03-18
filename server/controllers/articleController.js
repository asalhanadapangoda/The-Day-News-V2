import Article from '../models/Article.js';
import ArticleCategory from '../models/ArticleCategory.js';

// @desc    Fetch all articles, optionally filtered by category
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      const categoryObj = await ArticleCategory.findOne({ slug: category });
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }

    const articles = await Article.find(query)
      .populate('category', 'name slug')
      .sort({ publishDate: -1 });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch single article by ID or Slug
// @route   GET /api/articles/:idOrSlug
// @access  Public
const getArticleByIdOrSlug = async (req, res) => {
  try {
    const isObjectId = req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.idOrSlug } : { slug: req.params.idOrSlug };
    
    // We increment view count
    const article = await Article.findOneAndUpdate(query, { $inc: { viewCount: 1 } }, { new: true })
      .populate('category', 'name slug');

    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an article
// @route   POST /api/articles
// @access  Private (Admin)
const createArticle = async (req, res) => {
  try {
    const { title, excerpt, content, featuredImage, category, tags, author, status, publishDate } = req.body;

    if (!title || !content || !featuredImage || !category) {
      return res.status(400).json({ message: 'Title, content, featured image, and category are required.' });
    }

    // Auto-generate unique slug from title
    const baseSlug = title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let slug = baseSlug;
    const existing = await Article.findOne({ slug });
    if (existing) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    // Auto-generate excerpt from content if not provided
    const finalExcerpt = excerpt || content.replace(/<[^>]+>/g, '').substring(0, 200).trim();

    const article = new Article({
      title,
      slug,
      excerpt: finalExcerpt,
      content,
      featuredImage,
      category,
      tags,
      author: author || 'The Day News Global',
      status: status || 'published',
      publishDate: publishDate || Date.now(),
    });

    const createdArticle = await article.save();
    res.status(201).json(createdArticle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an article
// @route   PUT /api/articles/:id
// @access  Private (Admin)
const updateArticle = async (req, res) => {
  try {
    const { title, excerpt, content, featuredImage, category, tags, author, status, publishDate } = req.body;

    const article = await Article.findById(req.params.id);

    if (article) {
      if (title && title !== article.title) {
        article.title = title;
        // Regenerate slug from new title
        const baseSlug = title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const existing = await Article.findOne({ slug: baseSlug, _id: { $ne: article._id } });
        article.slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;
      }
      if (excerpt) article.excerpt = excerpt;
      if (content) {
        article.content = content;
        if (!excerpt) article.excerpt = content.replace(/<[^>]+>/g, '').substring(0, 200).trim();
      }
      if (featuredImage) article.featuredImage = featuredImage;
      if (category) article.category = category;
      if (tags) article.tags = tags;
      if (author) article.author = author;
      if (status) article.status = status;
      if (publishDate) article.publishDate = publishDate;

      const updatedArticle = await article.save();
      res.json(updatedArticle);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an article
// @route   DELETE /api/articles/:id
// @access  Private (Admin)
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (article) {
      await article.deleteOne();
      res.json({ message: 'Article removed' });
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getArticles, getArticleByIdOrSlug, createArticle, updateArticle, deleteArticle };
