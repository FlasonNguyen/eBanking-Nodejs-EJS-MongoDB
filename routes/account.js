const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { upload } = require("../middleware/uploader");
const sendMail = require("../utils/mailer");
const fs = require("fs");
const path = require("path");

const Image = require("../models/Image");
const User = require("../models/User");

//FUNCTION ZONE
function refreshOtp() {
  const otp = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  return otp;
}
let otp = refreshOtp();

function moneyFormatted(money) {
  const formatter = Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(money);
}

//ROUTING ZONE

router.get("/", (req, res) => {
  return res.render("signin");
});
router.get("/signup", (req, res) => {
  return res.render("signup");
});
//upload.array("IDimg", 2)
router.get("/logout", (req, res) => {
  req.session.destroy();
  return res.redirect("/account");
});
router.post("/signup", async (req, res, err) => {
  if (err) {
    console.log(err);
  }
  const { email, phone, address, dateOfBirth, fullname } = req.body;
  const username =
    Math.floor(Math.random() * (999999999 - 100000000)) + 1000000000;
  const password = (Math.random() + 1).toString(36).substring(6);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = new User({
    email,
    phone,
    address,
    dateOfBirth,
    fullname,
    username,
    password: hash,
    role: "user",
    status: "pending",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  user
    .save()
    .then((user) => {
      sendMail(
        user.email,
        "Account Created",
        `<h1>Account Created</h1><div>Username: ${user.username}</div><div>Password: ${password}</div>`
      );
      console.log(username, password);
      return res.redirect("/profile");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).send({
      status: "error",
      message: "User not found",
    });
  }
  if (user.firstLogin) {
    return res.render("account", { user: user });
  }
  if (user.status == "blocked") {
    return res.status(404).send({
      status: "error",
      message: "User has been blocked",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch == false) {
    if (user.role == "user") {
      user.warnings += 1;
      await user.save();
      if (user.warnings == 3) {
        user.status = "blocked";
        await user.save();
        return res.status(400).send({
          status: "error",
          message:
            "User has been blocked because of too many failed login attempts, please contact the administrator for more information",
        });
      }
    }
    return res.status(400).send({
      status: "error",
      message: "Incorrect password",
    });
  }
  user.warnings = 0;
  await user.save();
  req.session.user = user;
  return res.redirect("/profile");
});
//write nodejs changepassword function
router.post("/changePassword", async (req, res) => {
  const { username, newPassword, confirmPassword } = req.body;
  console.log(username, newPassword, confirmPassword);
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).send({
      status: "error",
      message: "User not found",
    });
  } else {
    if (user.firstLogin) {
      if (newPassword !== confirmPassword) {
        return res.status(400).send({
          status: "error",
          message: "Passwords do not match",
        });
      }
    } else {
      let { oldPassword } = req.body;
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).send({
          status: "error",
          message: "Incorrect password",
        });
      } else {
        if (newPassword !== confirmPassword) {
          return res.status(400).send({
            status: "error",
            message: "Passwords do not match",
          });
        }
      }
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    user.firstLogin = false;
    await user
      .save()
      .then((user) => {
        return res.redirect("/profile");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
//Working with Images Upload
router.post("/uploadID", upload.array("IDimg", 2), async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).send({
      status: "error",
      message: "User not found",
    });
  }
  const frontID = req.files[0];
  const backID = req.files[1];
  let idImg = new Image({
    user: user._id,
    frontID: {
      data: fs.readFileSync(
        path.join(__dirname, "../public/uploads/" + frontID.filename)
      ),
    },
    backID: {
      data: fs.readFileSync(
        path.join(__dirname, "../public/uploads/" + backID.filename)
      ),
    },
  });
  idImg
    .save()
    .then((idImg) => {
      console.log("Saved");
    })
    .catch((err) => {
      console.log(err);
    });
  return res.send(idImg);
});
router.post("/updateID", upload.array("IDimg", 2), async (req, res) => {
  const { username } = req.body;
  await User.findOne({ username })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({
          status: "error",
          message: "User not found",
        });
      } else {
        let update = {
          frontID: {
            data: fs.readFileSync(
              path.join(__dirname, "../public/uploads/" + req.files[0].filename)
            ),
          },
          backID: {
            data: fs.readFileSync(
              path.join(__dirname, "../public/uploads/" + req.files[1].filename)
            ),
          },
        };
        await Image.findOneAndUpdate({ user: user._id }, update, {
          new: true,
        });
      }
      user.status = "pending";
      await user.save();
      return res.redirect("/profile");
    })
    .catch((err) => {
      console.log(err);
    });
});
//Render User's Informations
router.get("/detail", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ _id: username });
  if (!user) {
    return res.status(404).send({
      status: "error",
      message: "User not found",
    });
  }
  return res.json({ status: 200, user });
});
//Send OTP first then change Password
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  await sendMail(
    email,
    "OTP",
    `<h1>OTP</h1>
    <p>${otp}</p>`
  );
  return res.send("OTP sent successfully");
});
router.post("/forgetPassword", async (req, res) => {
  const { username, inpOtp, newPassword, confirmPassword } = req.body;
  if (inpOtp != otp) {
    return res.status(400).send({
      status: "error",
      message: "Incorrect OTP",
    });
  } else {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "User not found",
      });
    }
    if (newPassword != confirmPassword) {
      return res.status(400).send({
        status: "error",
        message: "Passwords do not match",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user
      .save()
      .then((user) => {
        return res.send(user);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;
