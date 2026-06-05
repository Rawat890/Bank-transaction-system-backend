import { JWT_SECRET } from '../config/config.js';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import tokenBlackListModel from '../models/tokenblacklist.model.js';

export async function authMiddleware(req, res, next) {
 // extracting token from cookies or request headers
 const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
 if (!token) {
  return res.status(401).json({
   message: "Unauthorized access, token is missing"
  })
 }

 const isBlackListed = await tokenBlackListModel.findOne({ token })

 if (isBlackListed) {
  return res.status(401).json({
   message: "Unauthorized access, token is invalid"
  })
 }

 try {
  const decoded = jwt.verify(token, JWT_SECRET);  // decodes the token and verifies
  const user = await userModel.findById(decoded.userId); // retrieves user from database
  req.user = user; //attaches user object to request

  return next();
 } catch (error) {
  console.error("Error in auth middleware: ", error);
  return res.status(401).json({
   message: "Unauthorized access, token is invalid"
  })
 }
}

export async function authSystemUserMiddleware(req, res, next) {
 // extracting token from cookies or request headers
 const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
 if (!token) {
  return res.status(401).json({
   message: "Unauthorized access, token is missing"
  })
 }

 const isBlackListed = await tokenBlackListModel.findOne({ token })

 if (isBlackListed) {
  return res.status(401).json({
   message: "Unauthorized access, token is invalid"
  })
 }

 try {
  const decoded = jwt.verify(token, JWT_SECRET);  // decodes the token and verifies
  const user = await userModel.findById(decoded.userId).select("+systemUser"); // retrieves user from database

  if (!user.systemUser) {
   return res.status(403).json({
    message: "Forbidden access, not a system user"
   })
  }
  req.user = user; //attaches user object to request

  return next();
 } catch (error) {
  console.error("Error in auth middleware: ", error);
  return res.status(401).json({
   message: "Unauthorized access, token is invalid"
  })
 }
}
