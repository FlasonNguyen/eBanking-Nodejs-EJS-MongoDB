const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Image = require("../models/Image");

function moneyFormatted(money) {
  const formatter = Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(money);
}

router.get("/", async (req, res) => {
  if (!req.session.user) return res.redirect("/account");
  return res.render("index");
});
router.get("/profile", async (req, res) => {
  if (!req.session.user) return res.redirect("/account");
  const history = await Transaction.find({ user: req.session.user._id });
  const idImg = await Image.find({ user: req.session.user._id });
  req.session.user.balance = moneyFormatted(req.session.user.balance);
  return res.render("account", {
    user: req.session.user,
    history: history,
    idImg: idImg,
  });
});
router.get("/history", async (req, res) => {
  if (!req.session.user) return res.redirect("/account");
  const history = await Transaction.find({ user: req.session.user._id });
  return res.render("history", {
    history: history,
    user: req.session.user,
  });
});
router.get("/services", async (req, res) => {
  if (!req.session.user) return res.redirect("/account");
  return res.render("services", { user: req.session.user });
  dư;
});
module.exports = router;
