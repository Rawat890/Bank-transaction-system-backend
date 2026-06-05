import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createAccountController, getAccountBalanceController, getUserAccountsController } from '../controllers/account.controllers.js';

const accountRouter = express.Router();

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected route (valid token is needed)
 */

accountRouter.post('/', authMiddleware, createAccountController)

/**
 * - GET /api/accounts
 * Get all accounts of logged in user
 * protected route
 */
accountRouter.post('/', authMiddleware, getUserAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 */
accountRouter.post("/balance/:accountId", authMiddleware, getAccountBalanceController )

export default accountRouter;