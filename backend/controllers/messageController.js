import Message from '../models/Message.js';

// @desc    Send a message
// @route   POST /api/v1/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, imageUrl } = req.body;

    if (!receiverId || (!text && !imageUrl)) {
      return res.status(400).json({ message: 'Receiver ID and either text or image are required.' });
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      text: text || '',
      imageUrl: imageUrl || null
    });

    const io = req.app.get('io');
    if (io) {
      // Emit to receiver
      io.to(receiverId.toString()).emit('receiveMessage', message);
      // Optional: Emit to sender for confirmation
      io.to(req.user._id.toString()).emit('receiveMessage', message);
    }

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Server error sending message.' });
  }
};

// @desc    Get conversation history between logged-in user and another user
// @route   GET /api/v1/messages/:otherUserId
// @access  Private
export const getConversation = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 }); // Oldest to newest for chat UI

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving conversation.' });
  }
};
