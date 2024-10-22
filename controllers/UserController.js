const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken'); // Import JWT library

// Define a secret key for JWT verification (replace with your own secret)
const jwtSecret = 'your_secret_key';

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach decoded user information to the request object
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const getUsers = async (req, res) => {
  try {
    // Call verifyJWT middleware before accessing data
    verifyJWT(req, res, async () => {
      const users = await UserModel.findAll();
      res.status(200).json(users);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserByID = async (req, res) => {
  try {
    // Call verifyJWT middleware before accessing data
    verifyJWT(req, res, async () => {
      const userId = req.params.id;
      const response = await UserModel.findOne({ where: { id: userId } });
      res.status(200).json(response);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ... other functions (createUser, updateUser, deleteUser) with verifyJWT middleware

module.exports = { getUsers, getUserByID, createUser, updateUser, deleteUser };