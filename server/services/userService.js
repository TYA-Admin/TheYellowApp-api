const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwtHelper = require('../helpers/jwt');
const databaseHelper = require('../helpers/database');

// Helper function to extract data from registration request
const getReqDataRegister = (data) => {
  if (data.pretty) {
    const firstName = data.pretty.split('First Name:')[1].split(',')[0];
    const lastName = data.pretty.split('Last Name:')[1].split(',')[0];
    const name = `${firstName} ${lastName}`;
    const email = data.pretty.split('Email:')[1].split(',')[0];

    return { name: name, email: email, password: data.password };
  } else {
    return { name: data.name, email: data.email, password: data.password };
  }
};

const register = async (data) => {
  const { name, email, password } = getReqDataRegister(data);

  if (!name || !email || !password) {
    throw new Error('Missing required fields');
  }

  // Check if user exists
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  // Create user
  await createUser({ name, email, password: hashedPassword });

  // Retrieve created user details
  const user = await getUserByEmail(email);

  // Generate JWT token
  const token = jwtHelper.signJwt({ id: user.user_id, email: email });

  return {
    message: 'User registered successfully',
    email: user.email,
    userId: user.user_id,
    name: user.name,
    token: token
  };
};

const getUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const result = await databaseHelper.query(sql, [email]);
  return result.length > 0 ? result[0] : null;
};

const createUser = async (data) => {
  const sql = 'INSERT INTO users (uuid, name, email, password, created_by) VALUES (?, ?, ?, ?, ?)';
  const params = [
    uuidv4(),
    data.name,
    data.email,
    data.password,
    'api'
  ];
  return databaseHelper.query(sql, params);
};

const getUserByID = (id) => {
  const sql = 'SELECT * FROM users WHERE user_id = ?';
  return databaseHelper.query(sql, [id]);
};

const updateUserPassword = async (email, newPasswordHash) => {
  const sql = 'UPDATE users SET password = ? WHERE email = ?';
  await databaseHelper.query(sql, [newPasswordHash, email]);
};

const updateProfilePicture = async (userId, profilePictureUrl) => {
  const sql = 'UPDATE users SET profile_pic = ? WHERE user_id = ?';
  await databaseHelper.query(sql, [profilePictureUrl, userId]);

  return getUserByID(userId);
};

module.exports = {
  register,
  getUserByID,
  getUserByEmail,
  updateUserPassword,
  updateProfilePicture
};
