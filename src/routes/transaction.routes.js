import express from 'express';
import { authMiddleWare } from '../middleware/auth.middleware.js';
import { createTransactionController } from '../controllers/transaction.controller.js';

/**
 * - POST /api/transactions/
 * - Create a transaction
 */
const transactionRouter = express.Router(); 

transactionRouter.post("/", authMiddleWare, createTransactionController)
export default transactionRouter;