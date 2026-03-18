import express from 'express';
import {
  getCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCategories).post(protect, createCategory);
router.route('/:idOrSlug').get(getCategoryByIdOrSlug);
router.route('/:id').put(protect, updateCategory).delete(protect, deleteCategory);

export default router;
