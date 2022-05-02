import mongoose from "mongoose";
import { Schema } from "mongoose";
import { hash, compare } from "bcryptjs";
//create user schema
const User = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  usernames: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 255,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dateOfBirth: {
    type: Date,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
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
  frontID: {
    data: Buffer,
    contentType: String,
    default: null,
    select: false,
  },
  backID: {
    data: Buffer,
    contentType: String,
    default: null,
    select: false,
  },
});
module.exports = mongoose.model("User", User);
