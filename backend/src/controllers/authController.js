import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { JWT_SECRET } from '../middleware/auth.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: true,
        message: 'Missing required fields: email, password, or fullName'
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: true,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
      [email, passwordHash, fullName]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url || null
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({
      error: true,
      message: 'Internal server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Missing email or password'
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, avatar_url FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url || null
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error during login'
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT id, email, full_name, avatar_url FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      avatarUrl: user.avatar_url || null
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
};

