import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import accountRouter from './routes/account.routes.js';
import cookieParser from 'cookie-parser';
import transactionRouter from './routes/transaction.routes.js';

const app = express();
app.use(express.json());
// Middle ware to parse JSON request bodies. example- POST /api/endpoint with JSON body { "key": "value" } will be parsed and available as req.body.key

app.use(cors());
// Enable cors for all routes. This allows cross-origin requests from any domain, which is useful for frontend-backend communication during development.
app.use(cookieParser());

app.use("/api/auth", authRouter);
//mount authRouter on /api/auth path. All routes defined in authRouter will be prefixed with /api/auth. For example, if authRouter has a route defined as POST /register, it will be accessible at /api/auth/register

app.use("/api/accounts", accountRouter);
//mount accountRouter on /api/accounts path. All routes defined in accountRouter will be prefixed with /api/accounts

app.use("/api/transactions", transactionRouter);
//mount transactionRouter on /api/transactions path.
export default app;