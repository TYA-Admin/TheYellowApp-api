const userService = require('../services/userService');
const bookService = require('../services/bookService');

const getBookByQRCode = async (req, res) => {
  const { userId } = req.params;
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ message: 'Book ID is required' });
  }

  try {
    const user = await userService.getUserByID(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const book = await bookService.getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getChapter = async (req, res) => {
  const { userId } = req.params;
  const { bookId, chapterId } = req.body;

  if (!bookId || !chapterId) {
    return res.status(400).json({ message: 'Book ID and Chapter ID are required' });
  }

  try {
    const user = await userService.getUserByID(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const chapter = await bookService.getChapterById(bookId, chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    return res.status(200).json({ chapter });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getIntermission = async (req, res) => {
  const { userId } = req.params;
  const { bookId, intermissionId } = req.body;

  if (!bookId || !intermissionId) {
    return res.status(400).json({ message: 'Book ID and Intermission ID are required' });
  }

  try {
    const user = await userService.getUserByID(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const intermission = await bookService.getIntermissionById(bookId, intermissionId);
    if (!intermission) {
      return res.status(404).json({ message: 'Intermission not found' });
    }

    return res.status(200).json({ intermission });
  } catch (error) {
    console.error('Error fetching intermission:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getStickers = async (req, res) => {
  const { userId } = req.params;
  const { chapterId } = req.body;

  if (!chapterId) {
    return res.status(400).json({ message: 'Chapter ID is required' });
  }

  try {
    const user = await userService.getUserByID(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stickers = await bookService.getStickersByChapterId(chapterId);
    return res.status(200).json({ stickers });
  } catch (error) {
    console.error('Error fetching stickers:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getVideo = async (req, res) => {
  const { userId } = req.params;
  const { chapterId } = req.body;

  if (!chapterId) {
    return res.status(400).json({ message: 'Chapter ID is required' });
  }

  try {
    const user = await userService.getUserByID(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const video = await bookService.getVideoByChapterId(chapterId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(200).json({ video });
  } catch (error) {
    console.error('Error fetching video:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBookByQRCode,
  getChapter,
  getIntermission,
  getStickers,
  getVideo
};
