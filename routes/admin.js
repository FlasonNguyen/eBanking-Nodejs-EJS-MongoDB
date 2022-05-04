const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.get("/", (req, res) => {
  return res.render("admin");
});
router.post("/verifyAccount", async (req, res) => {
  const { username, status } = req.body;
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
  await user.save();
  return res.send({
    status: "success",
    message: "User status updated",
  });
});
router.post("/setStatus", async (req, res) => {
  const { username, status } = req.body;
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
  await user.save();
  return res.send({
    status: "success",
    message: "User status updated",
  });
});
router.post('/unblockUser', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).send({
            status: "error",
            message: "User not found",
        });
    }
    user.status = "active";
    await user.save();
    return res.send({
        status: "success",
        message: "User status updated",
    });
})
module.exports = router;
