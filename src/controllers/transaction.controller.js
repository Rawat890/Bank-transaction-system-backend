
import mongoose from "mongoose";
import accountModel from "../models/account.model.js";
import transactionModel from "../models/transaction.model.js";
import { sendTransactionEmail } from "../services/email.service.js";

/**
 * - Create a new transaction
 * The 10 step tranasaction process
   * 1. Validate request
   * 2. Validate idempotency key
   * 3. Check account status
   * 4. Derive sender balance from ledger
   * 5. Create transaction (PENDING)
   * 6. Create DEBIT ledger entry
   * 7. Create CREDIT ledger entry
   * 8. Mark transaction completed
   * 9. Commit MongoDb session
   * 10. Send email notification
   * 5,6,7,8 steps must be completed all or nothing that means revert back
 */

export function createTransactionController(req, res) {

  /**
   * 1. Vaidate request
   */

  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "All fields are required"
    })
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount
  })

  const toUserAccount = await accountModel.findOne({
    _id: toAccount
  })

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid account id"
    })
  }

  /**
   * 2. Validate Idempotency key
   */

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey
  })

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === 'COMPLETED') {
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: isTransactionAlreadyExists
      })
    }
  }

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === 'PENDING') {
      return res.status(200).json({
        message: "Transaction is still processing",
      })
    }
  }

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === 'FAILED') {
      return res.status(500).json({
        message: "Transaction request failed, please try again",
      })
    }
  }

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === 'REVERSED') {
      return res.status(500).json({
        message: "Transaction request reversed, please try again",
      })
    }
  }

  /**
   * 3. Check account status
   */

  if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
    return res.status(500).json({
      message: "Both fromAccount and toAccount must be ACTIVE to process transaction",
    })
  }

  /**
   * 4. Derive sender balance from ledger
   */
  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance - ${balance}, Requested amount - ${amount}`
    })
  }

  let transaction;
  try {
    /**
     * 5. Create transaction (PENDING)
     */
    const session = mongoose.startSession();
    session.startSession(); // this line is used so that the transaction can be rolled back if any error occurs

    transaction = (await transactionModel.create([{
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: 'PENDING'
    }], { session }))[0]

    /**
    * 6. Create DEBIT LEDGER entry
    */

    const debitLedgerEntry = await ledgerModel.create([{
      account: fromAccount,
      amount: amount,
      transaction: transaction._id,
      type: "DEBIT"
    }], { session })

    /**
    * 7. Create CREDIT ledger entry
    */

    await(() => {
      return new Promise((resolve) => setTimeout(resolve, 100 * 1000));
    })()

    const creditLedgerEntry = await ledgerModel.create([{
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "CREDIT"
    }], { session })

    /**
     * 8. Mark transaction completed
     */
    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session }
    )

    await transaction.save({ session }); // the transaction is saved

    /**
    * 9. Commit MongoDb session
    */
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    return res.status(400).json({
      message: "Transaction is pending due to some issue, please try again",
    })
  }

  /**
  * 10. Send email 
  */
  await sendTransactionEmail(req.user.email, req.user.name, amount, toAmount);

  return res.status(201).json({
    message: "Transaction completed successfully",
    transaction
  })
}

export function createInitialFundsTransactionController(req, res) {

  const { toAccount, amount, idempotencyKey } = req.body;
  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "All fields are required"
    })
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount
  })

  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid account id"
    })
  }

  const fromUserAccount = await accountModel.findOne({
    systemUser: true,
    user: req.user._id
  })

  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System user account not found"
    })
  }

  const session = mongoose.startSession();
  session.startSession(); // this line is used so that the transaction can be rolled back if any error occurs

  const transaction = new transactionModel.create({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: 'PENDING'
  });

  const debitLedgerEntry = await ledgerModel.create([{
    account: fromUserAccount,
    amount: amount,
    transaction: transaction._id,
    type: "DEBIT"
  }], { session })

  const creditLedgerEntry = await ledgerModel.create([{
    account: toAccount,
    amount: amount,
    transaction: transaction._id,
    type: "CREDIT"
  }], { session })

  transaction.status = "COMPLETED";

  await transaction.save({ session }); // the transaction is saved

  await session.commitTransaction();
  session.endSession();

  await sendTransactionEmail(req.user.email, req.user.name, amount, toAmount);

  return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction
  })
}