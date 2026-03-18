import express from 'express';
import {
  getArticles,
  getArticleByIdOrSlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getArticles).post(protect, createArticle);
router.route('/:idOrSlug').get(getArticleByIdOrSlug);
router.route('/:id').put(protect, updateArticle).delete(protect, deleteArticle);

export default router;
