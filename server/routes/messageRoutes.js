import express from 'express';
import {
  getMessages,
  createMessage,
  markMessageAsRead,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMessages).post(createMessage);
router.route('/:id/read').put(protect, markMessageAsRead);
router.route('/:id').delete(protect, deleteMessage);

export default router;
