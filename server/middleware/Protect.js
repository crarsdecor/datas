import jwt from 'jsonwebtoken';
import { User } from '../model/userModel.js';

const SECRET_KEY = process.env.JWT_SECRET || 'saumic';

// Protect middleware
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(404).json({ message: 'User not found' });
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token invalid or expired' });
  }
};

// Admin-only middleware
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
