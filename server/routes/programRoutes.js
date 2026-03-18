import express from 'express';
import {
  getPrograms,
  getProgramByIdOrSlug,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPrograms).post(protect, createProgram);
router.route('/:idOrSlug').get(getProgramByIdOrSlug);
// for PUT and DELETE we strictly use ID
router.route('/:id').put(protect, updateProgram).delete(protect, deleteProgram);

export default router;
