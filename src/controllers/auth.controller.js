import userModel from "../models/user.model.js";
import { JWT_SECRET } from '../config/config.js';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";

/**
 * - user register controller
 * - POST /api/auth/register
 */

export async function userRegisterController(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const isUserExists = await userModel.findOne({
      email: email
    })

    if (isUserExists) {
      return res.status(422).json({
        message: "User already exists with the email",
        status: "failed"
      })
      // 422 
    }

    const user = userModel.create({
      email, password, name
    })

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie("token", token);
    res.status(201).json({
      messsage: "user created successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      },
      token
    })
  } catch (error) {
    console.log("\nUser registration error - ", error)
    res.status(500).json({
      message: 'Unable to fulfil the request at the moment, Please try again later'
    })
  }
}



/**
 * - user login controller
 * - POST /api/auth/login
 */

export async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    const user = userModel.findOne({ email });

    // it checks whether user exists with the email or not, if not then it will return 401
    if (!user) {
      //401 for unauthorized access 
      return res.status(401).json({
        message: "EMAIL or PASSWORD is INVALID"
      })
    }


    // it checks whether the password is correct or not, if not then it will return 401. `comparePassword` is a method defined in the user model to compare the hashed passwored with the plain text
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "EMAIL or PASSWORD is not coreect"
      })
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie("token", token);
    res.status(200).json({
      messsage: "user created successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      },
      token
    })
  } catch (error) {
    console.log("\nUser login error - ", error)
    res.status(500).json({
      message: 'Unable to fulfil the request at the moment, Please try again later'
    })
  }
}