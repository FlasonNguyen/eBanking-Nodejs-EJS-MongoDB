//create transaction model for transactions
const mongoose = require("mongoose");
const Transaction = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    trim: true,
    lowercase: true,
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
    min: 0,
    validate(value) {
      if (value.toString().match(/^[0-9]{1,7}(\.?[0-9]{0,2})?$/)) {
        return true;
      }
      throw new Error("Amount must be a number");
    },
  },
  transactionType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    trim: true,
    enum: ["pending", "approved", "rejected"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    default: "",
    maxlength: 255,
  },
  userpaid: {
    type: Boolean,
    default: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reasons: {
    type: String,
    default: "Invalid Transaction",
  },
});

module.exports = mongoose.model("Transaction", Transaction);
