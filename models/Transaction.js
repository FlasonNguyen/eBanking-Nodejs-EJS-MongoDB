//create transaction model for transactions
const Transaction = new Schema({
  user: {
    type: Schema.Types.ObjectId,
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
    max: 5000000,
    validate(value) {
      if (value.match(/^[0-9]{1,7}(\.?[0-9]{0,2})?$/)) {
        return true;
      }
      throw new Error("Amount must be a number");
    },
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
  reason: {
    type: String,
    required: true,
    trim: true,
    default: "",
    maxlength: 255,
    validate(value) {
      if (value.match(/^[a-zA-Z0-9 ]+$/)) {
        return true;
      }
      throw new Error("Reason must be a string");
    },
  },
  //write function set status to pending if amount > 5000000
  setStatus: function () {
    if (this.amount > 5000000) {
      this.status = "pending";
    }
  },
  //write function set status to approved if amount < 5000000
  setStatus: function () {
    if (this.amount < 5000000) {
      this.status = "approved";
    }
  },
});
