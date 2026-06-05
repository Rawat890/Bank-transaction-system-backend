import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
 fromAccount: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "account",
  required: [true, "Transaction must be associated with a FROM account"],
  index: true
 },
 toAccount: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "account",
  required: [true, "Transaction must be associated with a TO account"],
  index: true
 },
 status: {
  type: String,
  enum: {
   values: ["COMPLETE", "FAILED", "PENDING", "REVERSED"],
   message: "Status can be either PENDING, FAILED, COMPLETE or REVERSED"
  },
  default: "PENDING"
 },
 amount: {
  type: Number,
  required: [true, "Amount is required for creating a transaction"],
  min: [0, "Transaction amount cannot be negative"]
 },

 // a transaction has only one key, it prevents duplicate transactions
 idempotencyKey: {
  type: String,
  required: [true, "Idempotency key is required ofr creating a transaction"],
  index: true,
  unique: true
 }
}, {
 timestamps: true
})

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;