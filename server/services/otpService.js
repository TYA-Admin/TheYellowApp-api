const crypto = require('crypto');
const databaseHelper = require('../helpers/database');
const { sendOTPEmail } = require('../helpers/email');

const OTP_LENGTH = 6;
const OTP_EXPIRY_TIME_MS = 3 * 60 * 1000; // 3 minutes

const generateOTP = () => {
  return new Promise((resolve, reject) => {
    crypto.randomInt(Math.pow(10, OTP_LENGTH - 1), Math.pow(10, OTP_LENGTH) - 1, (err, otp) => {
      if (err) {
        reject(err);
      } else {
        resolve(otp.toString());
      }
    });
  });
};

const saveOTPInDatabase = async (email, otp) => {
  const existingOTP = await getOTPByEmail(email);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_TIME_MS);

  if (existingOTP) {
    const sqlUpdate = 'UPDATE otp_tokens SET otp = ?, expires_at = ? WHERE email = ?';
    await databaseHelper.query(sqlUpdate, [otp, expiresAt, email]);
  } else {
    const sqlInsert = 'INSERT INTO otp_tokens (email, otp, expires_at) VALUES (?, ?, ?)';
    await databaseHelper.query(sqlInsert, [email, otp, expiresAt]);
  }
};

const getOTPByEmail = async (email) => {
  const sql = 'SELECT * FROM otp_tokens WHERE email = ?';
  const result = await databaseHelper.query(sql, [email]);
  return result.length > 0 ? result[0] : null;
};

const deleteOTPFromDatabase = async (email) => {
  const sql = 'DELETE FROM otp_tokens WHERE email = ?';
  await databaseHelper.query(sql, [email]);
};

const verifyOTP = async (email, otp) => {
  const sql = 'SELECT * FROM otp_tokens WHERE email = ? AND otp = ? AND expires_at > NOW()';
  const result = await databaseHelper.query(sql, [email, otp]);
  return result.length > 0;
};

const sendOTP = async (email) => {
  const otp = await generateOTP();
  await saveOTPInDatabase(email, otp);
  await sendOTPEmail(email, otp);
};

module.exports = {
  sendOTP,
  verifyOTP,
  deleteOTPFromDatabase
};
