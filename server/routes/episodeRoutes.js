import express from 'express';
import {
  getEpisodes,
  getEpisodeByIdOrSlug,
  createEpisode,
  updateEpisode,
  deleteEpisode,
} from '../controllers/episodeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getEpisodes).post(protect, createEpisode);
router.route('/:idOrSlug').get(getEpisodeByIdOrSlug);
router.route('/:id').put(protect, updateEpisode).delete(protect, deleteEpisode);

export default router;
