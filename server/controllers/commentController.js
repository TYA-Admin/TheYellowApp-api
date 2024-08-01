const userService = require('../services/userService');
const commentService = require('../services/commentService');

const addComment = async (req, res) => {
  const { userId } = req.params;
  const { intermissionId, value, parentId } = req.body;

  try {
    if (!intermissionId || !value) {
      return res.status(400).json({ message: 'Intermission ID and Value are required' });
    }

    const user = await userService.getUserByID(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = await commentService.addComment({
      userId,
      intermissionId,
      value,
      parentId
    });

    return res.status(201).json({ comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCommentsByIntermission = async (req, res) => {
  const { intermissionId } = req.params;

  try {
    const comments = await commentService.getCommentsByIntermission(intermissionId);
    return res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const addLike = async (req, res) => {
  const { commentId } = req.params;

  try {
    const like = await commentService.addLike(commentId);
    if (!like) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    return res.status(200).json({ like });
  } catch (error) {
    console.error('Error adding like:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addComment,
  getCommentsByIntermission,
  addLike
};
