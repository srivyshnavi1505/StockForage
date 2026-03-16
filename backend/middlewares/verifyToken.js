import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export const verifyToken = () => {
  return (req, res, next) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({ message: "Access denied. Please log in." });
      }

      // Verify and decode
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = decodedToken;
      next();
    } catch (err) {
      const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
      return res.status(401).json({ message });
    }
  };
};