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
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    default: "",
    maxlength: 255,
  },
});
Transaction.pre("save", function (next) {
  if (this.amount >= 5000000 && this.transactionType != "deposit") {
    this.status = "pending";
  } else if (this.amount < 5000000 || this.transactionType == "deposit") {
    this.status = "approved";
  }
  next();
});
module.exports = mongoose.model("Transaction", Transaction);
