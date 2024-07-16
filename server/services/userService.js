const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwtHelper = require('../helpers/jwt');
const databaseHelper = require('../helpers/database');
//
const DEFAULT_IS_ACTIVE = 1;

const getReqDataRegister = (data) => {
  if (data.pretty) {
    const firstName = data.pretty.split('First Name:')[1].split(',')[0];
    const lastName = data.pretty.split('Last Name:')[1].split(',')[0];
    const name = `${firstName} ${lastName}`;
    const email = data.pretty.split('Email:')[1].split(',')[0];

    return { name: name, email: email, password: data.password, role: '' };
  } else {
    return { name: data.name, email: data.email, password: data.password, role: data.role };
  }
};

const register = async (data) => {
  const { name, email, password, role } = getReqDataRegister(data);

  if (!name || !email || !role) {
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
  await createUser({ name, email, password: hashedPassword, role });

  // Retrieve created user details
  const user = await getUserByEmail(email);

  // Generate JWT token
  const token = jwtHelper.signJwt({ id: user.id, email: email, role: user.role });

  return {
    message: 'User registered successfully',
    email: user.email,
    userId: user.id,
    name: user.name,
    token: token
  };
};

const getUserByEmail = async (email) => {
  const sql = 'SELECT u.id, u.user_id, u.name AS username, u.password, u.isActive AS isActive, r.name AS role FROM users u JOIN roles r ON u.role = r.role_id WHERE u.email = ?';
  const result = await databaseHelper.query(sql, [email]);
  return result.length > 0 ? result[0] : null;
};

const createUser = async (data) => {
  const role = await getRole(data.role);

  const sql = 'INSERT INTO users (name, email, password, role, id, created_by, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const params = [
    data.name,
    data.email,
    data.password,
    role[0].role_id,
    uuidv4(),
    'api',
    DEFAULT_IS_ACTIVE
  ];
  return databaseHelper.query(sql, params);
};

const getRole = (role) => {
  const sql = 'SELECT role_id FROM roles WHERE name = ?';
  return databaseHelper.query(sql, [role]);
};

const getUserByID = (id) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  return databaseHelper.query(sql, [id]);
};

async function updateUserPassword(email, newPasswordHash) {
  const sql = 'UPDATE users SET password = ? WHERE email = ?';
  await databaseHelper.query(sql, [newPasswordHash, email]);
}

module.exports = {
  register,
  getUserByID,
  getUserByEmail,
  updateUserPassword
};
