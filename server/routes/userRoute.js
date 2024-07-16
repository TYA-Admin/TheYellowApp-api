const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger');
const userController = require('../controllers/userController')
const multer = require('multer');
const authMiddleware = require('../helpers/middleware/authMiddleware');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/register', upload.any(), userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/change-password', authMiddleware, userController.changePassword);
router.post('/validate-user', authMiddleware, userController.validateUserWithToken);

module.exports = router;
