import accountModel from '../models/account.model.js';

export async function createAccountController(req, res) {
 const user = req.user; //user is added to req object by authMiddleware
 const account = await accountModel.create({ user: user._id }); //when we create an account we need to pass the used id to account collection to establish the relationship between user and account collection
 res.status(201).json({
  account
 })
}
export async function getUserAccountsController(req, res) {

 const accounts = await accountModel.create({ user: user._id });
 res.status(201).json({
  accounts
 })
}

export async function getAccountBalanceController(req, res) {
 const { accountId } = req.params;

 const account = await accountModel.findOne({
  _id: accountId,
  user: req.user._id
 })

 if (!account) {
  return res.status(400).json({
   message: "Account not found"
  })
 }

 const balance = await account.getBalance();
 return res.status(200).json({
  accountId: account._id,
  balance: balance,
 })
}