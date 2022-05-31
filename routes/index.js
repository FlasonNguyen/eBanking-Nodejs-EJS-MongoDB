const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Image = require("../models/Image");

router.get("/", async (req, res) => {
  if (!req.session.user) return res.redirect("/account");
  return res.render("index");
});
router.get("/profile", async (req, res) => {
  if (!req.session.user) return res.redirect("/account");
  const history = await Transaction.find({ user: req.session.user._id });
  const idImg = await Image.find({ user: req.session.user._id });
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
});
module.exports = router;
