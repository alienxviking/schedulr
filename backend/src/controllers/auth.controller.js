const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to generate a JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // This is the 'payload' of the token
    process.env.JWT_SECRET,
    { expiresIn: '30d' } // The token will expire in 30 days
  );
};

// --- Controller Functions ---

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation: Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Create new user
    // Our 'pre-save' hook in the model will automatically hash the password
    const user = await User.create({
      email,
      password,
    });

    // 4. Respond with user info and a new token
    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });

    // 3. Check if user exists AND if passwords match
    // We use bcrypt.compare to check the plain-text password against the hashed one
    if (user && (await bcrypt.compare(password, user.password))) {
      // 4. Respond with user info and a new token
      res.status(200).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // Use a generic message for security
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};