const databaseHelper = require('../helpers/database');

const getBookById = async (bookId) => {
  const sql = 'SELECT * FROM books WHERE id = ?';
  return databaseHelper.getItem(sql, [bookId]);
};

const getChapterById = async (bookId, chapterId) => {
  const sql = 'SELECT * FROM chapters WHERE book_id = ? AND id = ?';
  return databaseHelper.getItem(sql, [bookId, chapterId]);
};

const getIntermissionById = async (bookId, intermissionId) => {
  const sql = 'SELECT * FROM intermissions WHERE book_id = ? AND id = ?';
  return databaseHelper.getItem(sql, [bookId, intermissionId]);
};

const getStickersByChapterId = async (chapterId) => {
  const sql = 'SELECT * FROM stickers WHERE chapter_id = ?';
  return databaseHelper.query(sql, [chapterId]);
};

const getVideoByChapterId = async (chapterId) => {
  const sql = 'SELECT * FROM videos WHERE chapter_id = ?';
  return databaseHelper.getItem(sql, [chapterId]);
};

module.exports = {
  getBookById,
  getChapterById,
  getIntermissionById,
  getStickersByChapterId,
  getVideoByChapterId
};
