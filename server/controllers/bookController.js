const userService = require('../services/userService');
const bookService = require('../services/bookService');
const jwtHelper = require('../helpers/jwt')

const createLock = async (req, res) => {
  const { bookId, deviceId} = req.body

  if (!bookId || !deviceId) {
    return res.status(400).json({ message: 'Invalid Request.' });
  }

  try {
    const doesLockExist = await bookService.getLockId(bookId, deviceId)

    if (doesLockExist.length !== 0) {
      return res.status(201).json({ 
        data: {
          lockId: doesLockExist[0].open_book_id
        }, 
        message: null
      })
    }

    const lock = await bookService.insertLock(bookId, deviceId)
    console.log(lock)
    return res.json(
      { 
        data: {
          lockId: lock.insertId
        }, 
        message: null
      })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

//Inside of getBook, we are creating and validating the Key
const getBook = async (req, res) => {
  const { bookId, deviceId } = req.body;
  const userToken = req.headers["authorization"].split(' ')[1]
  const userId = jwtHelper.decodeJwt(userToken)
  
  if (!bookId) {
    return res.status(400).json({ message: 'Book ID is required' });
  }

  try {
    const lock = await bookService.getLockId(bookId, deviceId)

    if (lock.length !== 1) {
      return res.status(404).send({ message: 'Invalid lock' })
    }

    const user = await userService.getUserByID(userId.user_id);
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (lock[0].user_id === null || lock[0].user_id !== userId.user_id) {
      await bookService.addKey(bookId, deviceId, userId.user_id)
    }

    const book = await bookService.getBookById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const response = {
      book_id: bookId,
      uuid: book.uuid,
      name: book.name,
      author: book.author,
      content: []
    }

    const videos = await bookService.getVideos(bookId)
    const stickers = await bookService.getStickers(bookId)
    const comments = await bookService.getComments(bookId)

    response.content = [...videos, ...stickers, ...comments];

    response.content.sort((a, b) => a.sequence - b.sequence);

    for (let i = 0; i < response.content.length; i++) {
      const access = await bookService.contentAccess(response.content[i].qrcode_id, deviceId, userId.user_id)

      if (access.length > 0) {
        response.content[i] = { ...response.content[i], access: true }
      } else {
        response.content[i] = { ...response.content[i], access: false }
      }
    }

    response.content = response.content.map(item => {
      const { created_at, created_by, updated_at, updated_by, ...rest } = item;
      return rest;
    });

    return res.status(200).json(response);
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

    const stickers = await bookService.getStickersById(chapterId);
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

    const video = await bookService.getVideoById(chapterId);
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
  getBook,
  getChapter,
  getIntermission,
  getStickers,
  getVideo,
  createLock
};
