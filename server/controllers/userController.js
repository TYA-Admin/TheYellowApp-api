const userService = require('../services/userService');
const authService = require('../services/authService');
const otpService = require('../services/otpService');

async function register(req, res) {
  try {
    const result = await userService.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function forgotPassword(req, res) {
  try {
    await otpService.sendOTP(req.body.email);
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
}

async function resetPassword(req, res) {
  try {
    await authService.resetPassword(req.body);
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
}

async function changePassword(req, res) {
  try {
    await authService.changePassword(req.body);
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Failed to change password' });
  }
}

async function validateUserWithToken(req, res) {
  try {
    const result = await authService.validateUserWithToken(req.headers.authorization);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error validating user with token:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  validateUserWithToken
};