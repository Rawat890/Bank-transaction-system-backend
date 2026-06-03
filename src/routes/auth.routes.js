import express from "express";
import { userLoginController, userRegisterController } from "../controllers/auth.controller.js";

const authRouter = express.Router();

//api creation
authRouter.post("/register", userRegisterController);
authRouter.post("/login", userLoginController);

export default authRouter;