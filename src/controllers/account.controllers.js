import accountModel from '../models/account.model.js';

export async function createAccount(req, res){
 const user = req.user; //user is added to req object by authMiddleware
 const account = await accountModel.create({user: user._id}); //when we create an account we need to pass the used id to account collection to establish the relationship between user and account collection
 res.status(201).json({
  account
 })
}