import express from 'express';
import { authMiddleware, authMiddleWare, authSystemUserMiddleware } from '../middleware/auth.middleware.js';
import { createInitialFundsTransactionController, createTransactionController } from '../controllers/transaction.controller.js';

/**
 * - POST /api/transactions/
 * - Create a transaction
 */
const transactionRouter = express.Router();

transactionRouter.post("/", authMiddleware, createTransactionController);

transactionRouter.post("/system/initial-funds", authSystemUserMiddleware, createInitialFundsTransactionController)
export default transactionRouter;