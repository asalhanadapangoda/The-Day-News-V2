import express from 'express';
import {
  getAds,
  getAdsAdmin,
  createAd,
  updateAd,
  deleteAd,
} from '../controllers/adController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAds).post(protect, createAd);
router.route('/admin').get(protect, getAdsAdmin);
router.route('/:id').put(protect, updateAd).delete(protect, deleteAd);

export default router;
