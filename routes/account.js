const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

router.get("/", (req, res) => {
  return res.render("login");
});
router.post("/signup", (req, res) => {
  const { email, phone, address, fullname, dateOfBirth} = req.body;
});

