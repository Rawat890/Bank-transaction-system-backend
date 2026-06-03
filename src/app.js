import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';

const app = express();
app.use(express.json());
// Middle ware to parse JSON request bodies. example- POST /api/endpoint with JSON body { "key": "value" } will be parsed and available as req.body.key

app.use(cors());
// Enable cors for all routes. This allows cross-origin requests from any domain, which is useful for frontend-backend communication during development.


app.use("/api/auth", authRouter);
//mount authRouter on /app/auth path. All routes defined in authRouter will be prefixed with /api/auth. For example, if authRouter has a route defined as POST /register, it will be accessible at /api/auth/register

export default app;