import express from 'express';
import TeamMember from '../models/TeamMember.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all team members (public, ordered)
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team members' });
  }
});

// POST create a new team member (admin only)
router.post('/', protect, async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    const saved = await member.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a team member (admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Member not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a team member (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
