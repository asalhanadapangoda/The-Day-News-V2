import ContactMessage from '../models/ContactMessage.js';

// @desc    Fetch all contact messages
// @route   GET /api/messages
// @access  Private (Admin)
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit a new contact message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    const createdMessage = await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', data: createdMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark a message as read
// @route   PUT /api/messages/:id/read
// @access  Private (Admin)
const markMessageAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (message) {
      message.isRead = true;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (message) {
      await message.deleteOne();
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getMessages, createMessage, markMessageAsRead, deleteMessage };
