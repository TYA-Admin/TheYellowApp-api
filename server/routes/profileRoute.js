const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../helpers/middleware/authMiddleware');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// Profile routes
router.post('/:userId/upload-profile-picture', authMiddleware, upload.single('profilePicture'), profileController.uploadProfilePicture);

module.exports = router;
