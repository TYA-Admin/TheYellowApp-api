const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger');
const commentController = require('../controllers/commentController')
const authMiddleware = require('../helpers/middleware/authMiddleware');

router.post('/:userId/comments', authMiddleware, commentController.addComment);
router.get('/intermission/:intermissionId', authMiddleware, commentController.getCommentsByIntermission);
router.post('/:commentId/like', authMiddleware, commentController.addLike);

module.exports = router;
