const bcrypt = require('bcrypt');
const jwtHelper = require('../helpers/jwt');
const userService = require('./userService');
const otpService = require('./otpService');

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwtHelper.signJwt({ user_id: user.user_id, email: email, role: user.role });

  return {
    message: 'Login successful',
    email: email,
    name: user.name,
    userId: user.user_id,
    profilePictureUrl: user.profile_pic,
    token: token
  };
};

const resetPassword = async ({ email, otp, newPassword }) => {
  const isValidOTP = await otpService.verifyOTP(email, otp);

  if (!isValidOTP) {
    throw new Error('Invalid OTP or OTP expired');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userService.updateUserPassword(email, hashedPassword);
  await otpService.deleteOTPFromDatabase(email);
};

const changePassword = async ({ email, currentPassword, newPassword }) => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatch) {
    throw new Error('Incorrect old password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userService.updateUserPassword(email, hashedPassword);
};

const validateUserWithToken = async (token) => {
  const decoded = jwtHelper.verifyJwt(token);

  if (!decoded) {
    throw new Error('Invalid or expired token');
  }

  const userEmail = decoded.email;
  const user = await userService.getUserByEmail(userEmail);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    message: 'User validated successfully',
    email: userEmail,
    userId: user.user_id,
    name: user.name,
    role: user.role,
    token: token
  };
};

module.exports = {
  login,
  resetPassword,
  changePassword,
  validateUserWithToken
};
