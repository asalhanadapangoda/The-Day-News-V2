import express from 'express';
import {
  getHeroes,
  getHeroesAdmin,
  createHero,
  updateHero,
  deleteHero,
} from '../controllers/heroController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getHeroes).post(protect, createHero);
router.route('/admin').get(protect, getHeroesAdmin);
router.route('/:id').put(protect, updateHero).delete(protect, deleteHero);

export default router;
