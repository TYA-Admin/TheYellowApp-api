const { getUserByID } = require('../controllers/userController');
const profileService = require('../services/profileService');
const { uploadFileToS3 } = require('../helpers/uploader');

async function uploadProfilePicture(req, res) {
  const userId = req.params.userId;

  try {
    const user = await getUserByID(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadResponse = await uploadFileToS3(file, 'profiles', `profile-${userId}`);

    const profilePictureUrl = uploadResponse.location;

    const updatedProfile = await profileService.updateProfilePicture(userId, profilePictureUrl);

    return res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  uploadProfilePicture
};
