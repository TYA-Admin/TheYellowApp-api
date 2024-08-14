const databaseHelper = require('../helpers/database');

const getBookById = async (bookId) => {
  const sql = 'SELECT * FROM books WHERE book_id = ?';
  return databaseHelper.getItem(sql, [bookId]);
};

const getChapterById = async (bookId, chapterId) => {
  const sql = 'SELECT * FROM chapters WHERE book_id = ? AND id = ?';
  return databaseHelper.getItem(sql, [bookId, chapterId]);
};

const getIntermissionById = async (bookId, intermissionId) => {
  const sql = 'SELECT * FROM qrcodes WHERE book_id = ? AND qrcode_id = ? AND content_type = "intermission"';
  return databaseHelper.getItem(sql, [bookId, intermissionId]);
};

const getStickersById = async (stickerId) => {
  const sql = 'SELECT * FROM qrcodes WHERE qrcode_id = ? AND content_type = "sticker"';
  return databaseHelper.query(sql, [stickerId]);
};

const getVideoById = async (chapterId) => {
  const sql = 'SELECT * FROM videos WHERE qrcode_id = ? AND content_type = "video"';
  return databaseHelper.getItem(sql, [chapterId]);
};

const insertLock = async (bookID, deviceID) => {
  const sql = `INSERT INTO open_books (book_id, device_id, created_by, updated_by) VALUES (?, ?, 'api', 'api')`
  const params = [
    bookID,
    deviceID
  ]
  return databaseHelper.query(sql, params)
}

const getLockId = async (bookId, deviceId) => {
  const sql = 'SELECT open_book_id, user_id FROM open_books WHERE book_id = ? AND device_id = ?'
  const params = [
    bookId,
    deviceId
  ]
  return databaseHelper.query(sql, params)
}

const addKey = async (bookId, deviceId, userId) => {
  const sql = 'UPDATE open_books SET user_id = ? WHERE book_id = ? AND device_id = ?'
  const params = [
    userId,
    bookId,
    deviceId
  ]
  return databaseHelper.query(sql, params)
}

const getVideos = async (bookId) => {
  const sql = `SELECT * FROM videos WHERE book_id = ?`
  return databaseHelper.query(sql, [bookId])
}

const getStickers = async (bookId) => {
  const sql = `SELECT * FROM stickers WHERE book_id = ?`
  return databaseHelper.query(sql, [bookId])
}

const getComments = async (bookId) => {
  const sql = `SELECT * FROM comments WHERE book_id = ?`
  return databaseHelper.query(sql, [bookId])
}

const contentAccess = async (qrCodeId, deviceId, userId) => {
  const sql = `SELECT * FROM open_qrcodes WHERE qrcode_id = ? AND device_id = ? AND user_id = ?`
  const params = [
    qrCodeId,
    deviceId,
    userId
  ]
  return databaseHelper.query(sql, params)
}

module.exports = {
  getBookById,
  getChapterById,
  getIntermissionById,
  getStickersById,
  getVideoById,
  insertLock,
  getLockId,
  addKey,
  getVideos,
  getStickers,
  getComments,
  contentAccess
};
