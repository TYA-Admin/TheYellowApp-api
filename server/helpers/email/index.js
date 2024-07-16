const mailgun = require('mailgun-js');
const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: apiKey, domain: domain });

const sendOTPEmail = async (recipientEmail, otp) => {
  const data = {
    from: 'GreatNight - Tech Support <tech@greatnight.us>',
    to: recipientEmail,
    subject: 'Reset Your Password',
    html: `<html>Your OTP to reset your password is: <strong>${otp}</strong><p>Valid for 3 minutes.</p></html>`
  };

  try {
    const body = await mg.messages().send(data);
    console.log('Email sent:', body);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

module.exports = {
  sendOTPEmail
};
