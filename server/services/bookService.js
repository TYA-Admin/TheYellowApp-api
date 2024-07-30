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

module.exports = {
  getBookById,
  getChapterById,
  getIntermissionById,
  getStickersById,
  getVideoById
};
