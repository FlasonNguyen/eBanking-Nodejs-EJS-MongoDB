const express = require("express");
const router = express.Router();

const sendMail = require("../utils/mailer");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

router.get("/", async (req, res) => {
  const users = await User.find({}).catch((err) => {
    return res.json({ status: 500, message: err.message });
  });

  return res.render("admin", { users, user: req.session.user });
});
router.get("/transactions", async (req, res) => {
  const transactions = await Transaction.find({}).catch((err) => {
    return res.json({ status: 500, message: err.message });
  });
  return res.render("transaction", { transactions, user: req.session.user });
});
router.post("/setUserStatus", async (req, res) => {
  const { username, status } = req.body;
  console.log(username, status);
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).send({
      status: "error",
      message: "User not found",
    });
  }
  if (
    status != "blocked" &&
    status != "pending" &&
    status != "inactive" &&
    status != "active"
  ) {
    return res.status(400).send({
      status: "error",
      message: "Invalid status",
    });
  }
  user.status = status;
  user.warnings = 0;
  await user.save().then((data) => {
    return res.send({
      status: "success",
      message: "User status updated",
      data,
    });
  });
});
router.post("/setTransactionStatus", async (req, res) => {
  const { id, status, reason } = req.body;
  const transaction = await Transaction.findOne({ _id: id });

  if (!transaction) {
    return res.status(404).json({
      status: "error",
      message: "Transaction not found",
    });
  }
  const user = await User.findOne({ _id: transaction.user });
  if (status != "pending" && status != "approved" && status != "rejected") {
    return res.status(400).send({
      status: "error",
      message: "Invalid status",
    });
  } else if (status == "approved") {
    if (user.balance < transaction.amount) {
      transaction.status = "rejected";
      await transaction.save();
      return res.status(400).json({
        status: "error",
        message: "User does not have enough balance",
      });
    }
    if (transaction.type == "withdraw") {
      transaction.status = "approved";
      user.balance += transaction.amount;
      await user.save();
      await transaction.save();
      return res.json({
        status: "success",
        message: "Transaction status updated",
      });
    } else {
      const targetUser = await User.findOne({ _id: transaction.receiver });
      if (transaction.userpaid == true) {
        targetUser.balance += transaction.amount;
        user.balance -= transaction.amount * 1.05;
      } else {
        targetUser.balance += transaction.amount * 0.95;
        user.balance -= transaction.amount;
      }
      transaction.status = "approved";
      await targetUser.save();
      await user.save();
      await transaction.save();
      console.log(status, transaction.status);
      await sendMail(
        user.email,
        "Transfer Success",
        `You have transfer ${transaction.amount} to ${targetUser.fullname}`
      );
      await sendMail(
        targetUser.email,
        "Transfer Success",
        `You have received ${transaction.amount} from ${user.fullname}`
      );
      return res.json({
        status: "success",
        message: "Transaction status updated",
      });
    }
  } else {
    transaction.status = status;
    transaction.reasons = reason;
    await transaction.save();
    return res.json({
      status: "success",
      message: "Transaction status updated",
    });
  }
});
module.exports = router;
