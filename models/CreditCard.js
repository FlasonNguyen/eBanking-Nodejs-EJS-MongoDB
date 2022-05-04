const mongoose = require("mongoose");
const CreditCard = new mongoose.Schema({
  cardNumber: {
    type: Number,
    required: true,
    trim: true,
    min: 100000,
    max: 999999,
    validate(value) {
      if (value.toString().match(/^[0-9]{6}$/)) {
        return true;
      }
      throw new Error("CVV must be 3 digits");
    },
  },
  expiredAt: {
    type: Date,
    required: true,
  },
  cvv: {
    type: Number,
    required: true,
    min: 100,
    max: 999,
    validate(value) {
      if (value.toString().match(/^[0-9]{3}$/)) {
        return true;
      }
      throw new Error("CVV must be 3 digits");
    },
  },
  description: {
    type: String,
  },
  balance: {
    type: Number,
    required: true,
    default: 10000000,
    min: -1000000000,
  },
  limited: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("CreditCard", CreditCard);
