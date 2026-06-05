import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createAccount} from '../controllers/account.controllers.js';

const accountRouter = express.Router();

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected route (valid token is needed)
 */

accountRouter.post('/', authMiddleware, createAccount)
// 

export default accountRouter;