const mongoose = require("mongoose");
const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 10,
    unique: true,
    validate(value) {
      if (value.match(/^[0-9]{10}$/)) {
        return true;
      }
      throw new Error("Phone number must be 10 digits");
    },
  },
  role: {
    type: String,
    required: true,
    trim: true,
    default: "user",
    enum: ["user", "admin"],
  },
  status: {
    type: String,
    required: true,
    trim: true,
    default: "pending",
    enum: ["active", "inactive", "pending", "blocked"],
  },
  IDs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  warnings: {
    type: Number,
    default: 0,
  },
  firstLogin: {
    type: Boolean,
    default: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
    validate(value) {
      if (value.toString().match(/^[0-9]{1,7}(\.?[0-9]{0,2})?$/)) {
        return true;
      }
      throw new Error("Balance must be a number");
    },
  },
});
//write function in model that if warning = 3, set status to blocked
User.pre("save", function (next) {
  if (this.warnings === 3) {
    this.status = "blocked";
  }
  next();
});
module.exports = mongoose.model("User", User);
