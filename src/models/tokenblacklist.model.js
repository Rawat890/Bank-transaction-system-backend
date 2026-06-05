import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
 toke: {
  type: String,
  unique: [true, "Token is already blacklisted"],
  required: [true, "Toke is requiored to blacklist"]
 },
}, { timestamps: true });

tokenBlacklistSchema.index({ createdAt: 1 }, {
 expireAfterSeconds: 60 * 60 * 24 * 3 //3days
})

const tokenBlackListModel = mongoose.model("tokenBlackList", tokenBlacklistSchema);

export default tokenBlackListModel;