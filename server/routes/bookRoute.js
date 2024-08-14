const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger');
const bookController = require('../controllers/bookController')
const multer = require('multer');
const authMiddleware = require('../helpers/middleware/authMiddleware');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/createLock', bookController.createLock)
router.post('/getBook', authMiddleware, bookController.getBook);
router.get('/getChapter', authMiddleware, bookController.getChapter);
router.get('/getIntermission', authMiddleware, bookController.getIntermission);
router.get('/getStickers', authMiddleware, bookController.getStickers);
router.get('/getVideo', authMiddleware, bookController.getVideo);
router.get('/content/:type/:id')

module.exports = router;
