import express from "express";
import mongoose from "mongoose";
import session from "express-session";
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

mongoose
  .connect(process.env.MONGOD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
