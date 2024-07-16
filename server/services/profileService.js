const databaseHelper = require('../helpers/database');

async function getUserProfile(userId) {
  const sql = `
      SELECT p.user_id,
             u.name,
             u.email,
             p.profile_picture_url,
      FROM profiles p
               LEFT JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
  `;

  const result = await databaseHelper.query(sql, [userId]);

  return result.length > 0 ? result[0] : null;
}

async function updateProfilePicture(userId, profilePictureUrl) {
  const sql = `
      UPDATE profiles
      SET profile_picture_url = ?
      WHERE user_id = ?
  `;

  const params = [profilePictureUrl, userId];

  await databaseHelper.query(sql, params);

  return await getUserProfile(userId);
}

module.exports = {
  updateProfilePicture
};
