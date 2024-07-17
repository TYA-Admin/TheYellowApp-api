const databaseHelper = require('../helpers/database');

const addComment = async ({ userId, intermissionId, value, parentId }) => {
  const sql = `
      INSERT INTO comments (user_id, intermission_id, value, parent_id, created_by)
      VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    userId,
    intermissionId,
    value,
    parentId || null,
    'api'
  ];

  try {
    const result = await databaseHelper.query(sql, params);
    const commentId = result.insertId;

    return await getCommentById(commentId);
  } catch (error) {
    console.error('Error in addComment service:', error);
    throw new Error('Error adding comment');
  }
};

const getCommentsByIntermission = async (intermissionId) => {
  const sql = 'SELECT * FROM comments WHERE intermission_id = ?';

  try {
    return await databaseHelper.query(sql, [intermissionId]);
  } catch (error) {
    console.error('Error in getCommentsByIntermission service:', error);
    throw new Error('Error fetching comments');
  }
};

const addLike = async (commentId) => {
  const sql = 'UPDATE comments SET likes = likes + 1 WHERE id = ?';

  try {
    const result = await databaseHelper.query(sql, [commentId]);

    if (result.affectedRows > 0) {
      return await getLikeByCommentId(commentId);
    }

    return null;
  } catch (error) {
    console.error('Error in addLike service:', error);
    throw new Error('Error adding like');
  }
};

const getCommentById = async (commentId) => {
  const sql = 'SELECT * FROM comments WHERE id = ?';

  try {
    const result = await databaseHelper.query(sql, [commentId]);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error in getCommentById service:', error);
    throw new Error('Error fetching comment by ID');
  }
};

const getLikeByCommentId = async (commentId) => {
  const sql = 'SELECT likes FROM comments WHERE id = ?';

  try {
    const result = await databaseHelper.query(sql, [commentId]);

    return result.length > 0 ? result[0].likes : null;
  } catch (error) {
    console.error('Error in getLikeByCommentId service:', error);
    throw new Error('Error fetching like by comment ID');
  }
};

module.exports = {
  addComment,
  getCommentsByIntermission,
  addLike
};
